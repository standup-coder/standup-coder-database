import { useMemo } from 'react';
import { Card, Row, Col, Statistic, Empty, Button, Progress, Tooltip, Badge } from 'antd';
import { 
  Pie, 
  Column, 
  Bar, 
  Line,
  Rose,
  Liquid
} from '@ant-design/charts';
import { useStats } from '../../hooks/useCompanies';
import { Skeleton, Divider, Tag } from 'antd';
import { 
  BankOutlined, 
  RiseOutlined, 
  TrophyOutlined,
  GlobalOutlined,
  AimOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  ApartmentOutlined,
  PieChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import type { StatsData } from '../../types/stats';

// 带 Empty 状态的图表包装器
function ChartWithEmpty({ 
  loading, 
  hasData, 
  children, 
  height = 300,
  emptyText = '暂无数据'
}: { 
  loading: boolean; 
  hasData: boolean; 
  children: React.ReactNode; 
  height?: number;
  emptyText?: string;
}) {
  if (loading) {
    return (
      <div style={{ height }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }
  
  if (!hasData) {
    return (
      <Empty 
        image={Empty.PRESENTED_IMAGE_SIMPLE} 
        description={emptyText}
        style={{ height, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      />
    );
  }
  
  return <>{children}</>;
}

// 导出数据功能
function exportData(stats: StatsData | undefined) {
  if (!stats) return;
  
  const data = {
    汇总统计: {
      企业总数: stats.totalCompanies,
      覆盖城市: stats.cityDistribution.length,
      行业分类: stats.industryDistribution.length,
    },
    行业分布: stats.industryDistribution,
    城市分布: stats.cityDistribution.slice(0, 20),
    规模分布: stats.scaleDistribution,
    上市情况: stats.listingDistribution,
    成立年份: stats.foundedYearDistribution,
    城市等级: stats.cityTierDistribution,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function Analytics() {
  const { data: stats, isLoading } = useStats() as { data: StatsData | undefined, isLoading: boolean };
  
  // 图表配置 - 使用 useMemo 优化性能
  const industryRoseConfig = useMemo(() => ({
    data: stats?.industryDistribution?.slice(0, 8) || [],
    xField: 'name',
    yField: 'value',
    seriesField: 'name',
    radius: 0.9,
    label: { offset: -15 },
    legend: { position: 'right' as const },
  }), [stats?.industryDistribution]);
  
  const cityBarConfig = useMemo(() => ({
    data: stats?.cityDistribution?.slice(0, 15) || [],
    xField: 'value',
    yField: 'name',
    seriesField: 'name',
    barStyle: { radius: [0, 4, 4, 0] },
    label: { position: 'right' as const },
    yAxis: { label: { autoHide: false } },
  }), [stats?.cityDistribution]);
  
  const scalePieConfig = useMemo(() => ({
    data: (stats?.scaleDistribution || []).slice(0, 8),
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.5,
    label: {
      type: 'inner',
      content: '{name}\n{percentage}',
      style: { fontSize: 12 },
    },
    legend: { position: 'bottom' as const, flipPage: true },
  }), [stats?.scaleDistribution]);
  
  const listingPieConfig = useMemo(() => ({
    data: stats?.listingDistribution || [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.4,
    label: {
      type: 'outer',
      content: '{name}\n{value}家',
    },
    legend: { position: 'right' as const, flipPage: true, maxRow: 2 },
  }), [stats?.listingDistribution]);
  
  const yearLineConfig = useMemo(() => ({
    data: stats?.foundedYearDistribution || [],
    xField: 'name',
    yField: 'value',
    point: { size: 5, shape: 'diamond' },
    label: { style: { fill: '#aaa' } },
    smooth: true,
    areaStyle: { fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' },
  }), [stats?.foundedYearDistribution]);
  
  const tierBarConfig = useMemo(() => ({
    data: stats?.cityTierDistribution || [],
    xField: 'name',
    yField: 'value',
    color: ({ name }: { name: string }) => {
      if (name === '一线城市') return '#ff4d4f';
      if (name === '新一线城市') return '#faad14';
      return '#52c41a';
    },
    label: { position: 'top' as const },
    columnStyle: { radius: [4, 4, 0, 0] },
  }), [stats?.cityTierDistribution]);

  // 上市率计算
  const listingRate = stats?.insights?.listingRate || 0;
  const tier1Rate = parseFloat(stats?.insights?.tier1Rate || '0');
  const newTier1Rate = parseFloat(stats?.insights?.newTier1Rate || '0');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <Card 
        title={<span className="text-lg font-medium"><BarChartOutlined className="mr-2" />数据分析看板</span>}
        extra={
          <Button 
            icon={<ExportOutlined />} 
            onClick={() => exportData(stats)}
            disabled={isLoading || !stats}
          >
            导出数据
          </Button>
        }
      >
        <p className="text-gray-600">
          基于 {stats?.totalCompanies?.toLocaleString() || '-'} 家企业数据的多维度深度分析，
          涵盖行业分布、城市布局、上市情况、成立趋势等核心指标。
        </p>
      </Card>
      
      {/* Overview Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card h-full">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic 
                title={<span className="text-gray-500"><BankOutlined className="mr-1" />企业总数</span>}
                value={stats?.totalCompanies || 0}
                valueStyle={{ color: '#1677ff', fontSize: 24 }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card h-full">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic 
                title={<span className="text-gray-500"><ApartmentOutlined className="mr-1" />覆盖城市</span>}
                value={stats?.cityDistribution?.length || 0}
                valueStyle={{ color: '#52c41a', fontSize: 24 }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card h-full">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic 
                title={<span className="text-gray-500"><PieChartOutlined className="mr-1" />行业分类</span>}
                value={stats?.industryDistribution?.length || 0}
                valueStyle={{ color: '#faad14', fontSize: 24 }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card h-full">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic 
                title={<span className="text-gray-500"><GlobalOutlined className="mr-1" />上市公司</span>}
                value={`${listingRate.toFixed(1)}%`}
                valueStyle={{ color: '#722ed1', fontSize: 24 }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card h-full">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic 
                title={<span className="text-gray-500"><AimOutlined className="mr-1" />一线城市</span>}
                value={`${tier1Rate}%`}
                valueStyle={{ color: '#eb2f96', fontSize: 24 }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card className="stat-card h-full">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic 
                title={<span className="text-gray-500"><RiseOutlined className="mr-1" />新一线</span>}
                value={`${newTier1Rate}%`}
                valueStyle={{ color: '#13c2c2', fontSize: 24 }}
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>
      
      {/* Charts Row 1: 核心分布 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card 
            title={<span><TrophyOutlined className="mr-1 text-yellow-500" />行业分布 Top 8</span>}
            className="h-full"
          >
            <ChartWithEmpty 
              loading={isLoading} 
              hasData={(stats?.industryDistribution?.length || 0) > 0}
              height={320}
            >
              <Rose {...industryRoseConfig} height={320} />
            </ChartWithEmpty>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span><BankOutlined className="mr-1 text-blue-500" />城市分布 Top 15</span>}
            className="h-full"
          >
            <ChartWithEmpty 
              loading={isLoading} 
              hasData={(stats?.cityDistribution?.length || 0) > 0}
              height={320}
            >
              <Bar {...cityBarConfig} height={320} />
            </ChartWithEmpty>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span><PieChartOutlined className="mr-1 text-green-500" />企业规模分布 Top 8</span>}
            className="h-full"
          >
            <ChartWithEmpty 
              loading={isLoading} 
              hasData={(stats?.scaleDistribution?.length || 0) > 0}
              height={320}
            >
              <Pie {...scalePieConfig} height={320} />
            </ChartWithEmpty>
          </Card>
        </Col>
      </Row>
      
      {/* Charts Row 2: 深度分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card 
            title={<span><GlobalOutlined className="mr-1 text-purple-500" />上市情况分析</span>}
            className="h-full"
          >
            <ChartWithEmpty 
              loading={isLoading} 
              hasData={(stats?.listingDistribution?.length || 0) > 0}
              height={320}
              emptyText="暂无上市数据"
            >
              <Pie {...listingPieConfig} height={320} />
            </ChartWithEmpty>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span><RiseOutlined className="mr-1 text-cyan-500" />成立年份趋势</span>}
            className="h-full"
          >
            <ChartWithEmpty 
              loading={isLoading} 
              hasData={(stats?.foundedYearDistribution?.length || 0) > 0}
              height={320}
              emptyText="暂无成立年份数据"
            >
              <Line {...yearLineConfig} height={320} />
            </ChartWithEmpty>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<span><AimOutlined className="mr-1 text-red-500" />城市等级分布</span>}
            className="h-full"
          >
            <ChartWithEmpty 
              loading={isLoading} 
              hasData={(stats?.cityTierDistribution?.length || 0) > 0}
              height={320}
            >
              <Column {...tierBarConfig} height={320} />
            </ChartWithEmpty>
            
            {/* 城市等级图例说明 */}
            {!isLoading && stats?.cityTierDistribution && (
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <span><Badge color="#ff4d4f" text="一线城市" /></span>
                <span><Badge color="#faad14" text="新一线城市" /></span>
                <span><Badge color="#52c41a" text="其他城市" /></span>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      {/* Insights Section */}
      <Card title={<span className="text-lg"><InfoCircleOutlined className="mr-2" />核心洞察</span>}>
        <Row gutter={[16, 16]}>
          {/* Top Industry */}
          <Col xs={24} md={8}>
            <Card type="inner" title="🏆 企业最多的行业" className="bg-gradient-to-r from-blue-50 to-white">
              <Skeleton loading={isLoading} active paragraph={false}>
                {stats?.insights?.topIndustry ? (
                  <>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {stats.insights.topIndustry.name}
                    </div>
                    <div className="text-gray-500 mb-3">
                      共 {stats.insights.topIndustry.value.toLocaleString()} 家企业
                    </div>
                    <Progress 
                      percent={Math.round((stats.insights.topIndustry.value / (stats?.totalCompanies || 1)) * 100)} 
                      strokeColor="#1677ff"
                      size="small"
                      format={p => `${p}%`}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      占全部企业的 {(stats.insights.topIndustry.value / (stats?.totalCompanies || 1) * 100).toFixed(1)}%
                    </div>
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                )}
              </Skeleton>
            </Card>
          </Col>
          
          {/* Top City */}
          <Col xs={24} md={8}>
            <Card type="inner" title="🏙️ 企业最多的城市" className="bg-gradient-to-r from-green-50 to-white">
              <Skeleton loading={isLoading} active paragraph={false}>
                {stats?.insights?.topCity ? (
                  <>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {stats.insights.topCity.name}
                    </div>
                    <div className="text-gray-500 mb-3">
                      共 {stats.insights.topCity.value.toLocaleString()} 家企业
                    </div>
                    <Progress 
                      percent={Math.round((stats.insights.topCity.value / (stats?.totalCompanies || 1)) * 100)} 
                      strokeColor="#52c41a"
                      size="small"
                      format={p => `${p}%`}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      占全部企业的 {(stats.insights.topCity.value / (stats?.totalCompanies || 1) * 100).toFixed(1)}%
                    </div>
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                )}
              </Skeleton>
            </Card>
          </Col>
          
          {/* Listing Rate */}
          <Col xs={24} md={8}>
            <Card type="inner" title="📈 上市率统计" className="bg-gradient-to-r from-purple-50 to-white">
              <Skeleton loading={isLoading} active paragraph={false}>
                <div className="flex items-center justify-center py-2">
                  <Liquid 
                    percent={listingRate / 100}
                    height={140}
                    width={140}
                  />
                </div>
                <div className="text-center text-gray-500 text-sm mt-2">
                  上市公司占比
                  <Tooltip title="包含上交所、深交所、港交所、纳斯达克、纽交所、科创板、新三板等">
                    <InfoCircleOutlined className="ml-1 text-gray-400" />
                  </Tooltip>
                </div>
              </Skeleton>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        {/* City Tier Stats */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card type="inner" title="📍 城市集中度分析">
              <Skeleton loading={isLoading} active paragraph={{ rows: 3 }}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">一线城市 (北上广深)</span>
                      <span className="font-medium">{tier1Rate}%</span>
                    </div>
                    <Progress percent={tier1Rate} strokeColor="#ff4d4f" size="small" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">新一线城市</span>
                      <span className="font-medium">{newTier1Rate}%</span>
                    </div>
                    <Progress percent={newTier1Rate} strokeColor="#faad14" size="small" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">其他城市</span>
                      <span className="font-medium">{(100 - tier1Rate - newTier1Rate).toFixed(1)}%</span>
                    </div>
                    <Progress percent={100 - tier1Rate - newTier1Rate} strokeColor="#52c41a" size="small" />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                  <Tag color="blue">洞察</Tag>
                  一线城市和新一线城市集中了 {(tier1Rate + newTier1Rate).toFixed(1)}% 的企业，
                  显示了科技企业明显的头部城市聚集效应。
                </div>
              </Skeleton>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card type="inner" title="📊 行业集中度分析">
              <Skeleton loading={isLoading} active paragraph={{ rows: 3 }}>
                <div className="space-y-3">
                  {stats?.industryDistribution?.slice(0, 5).map((industry, index) => {
                    const percent = (industry.value / (stats?.totalCompanies || 1)) * 100;
                    const colors = ['#ff4d4f', '#faad14', '#52c41a', '#1677ff', '#722ed1'];
                    return (
                      <div key={industry.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">
                            <span className="inline-block w-5 text-center mr-1 text-gray-400">{index + 1}</span>
                            {industry.name}
                          </span>
                          <span className="font-medium text-sm">{industry.value} 家 ({percent.toFixed(1)}%)</span>
                        </div>
                        <Progress 
                          percent={percent} 
                          strokeColor={colors[index]} 
                          size="small"
                          showInfo={false}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                  <Tag color="green">洞察</Tag>
                  前五大行业占全部企业的 {' '}
                  {((stats?.industryDistribution?.slice(0, 5) || []).reduce((sum, i) => sum + (i?.value || 0), 0) / (stats?.totalCompanies || 1) * 100).toFixed(1)}%，
                  {stats?.insights?.topIndustry?.name || '-'} 是占比最高的行业。
                </div>
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
