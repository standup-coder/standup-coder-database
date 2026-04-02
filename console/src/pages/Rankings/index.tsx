import { useState, useEffect } from 'react';
import { Card, Tabs, Table, Tag, Statistic, Row, Col, Select, Space, Skeleton, Typography, Empty } from 'antd';
import { TrophyOutlined, RiseOutlined, StarOutlined, GlobalOutlined, CrownOutlined } from '@ant-design/icons';
import { useRankings } from '../../hooks/useRankings';

const { Option } = Select;
const { Title, Text } = Typography;

export function Rankings() {
  const { data, isLoading } = useRankings();
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [activeTab, setActiveTab] = useState<string>('');
  
  // 获取当前年份的榜单
  const currentRankings = data?.byYear?.[selectedYear] || [];
  
  // 设置默认选中的榜单（使用 useEffect 避免渲染时直接调用 setState）
  useEffect(() => {
    if (currentRankings.length > 0 && !activeTab) {
      setActiveTab(currentRankings[0].id);
    }
  }, [currentRankings, activeTab]);
  
  // 表格列定义
  const getColumns = (rankingId: string) => {
    const baseColumns = [
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
        width: 80,
        render: (rank: number) => {
          if (rank <= 3 && rank > 0) {
            const colors = ['#FFD700', '#C0C0C0', '#CD7F32']; // 金银铜
            return (
              <span style={{ 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: colors[rank - 1]
              }}>
                <CrownOutlined /> {rank}
              </span>
            );
          }
          return <span className="text-gray-500">{rank > 0 ? rank : '-'}</span>;
        },
      },
      {
        title: '企业名称',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: any) => (
          <div>
            <div className="font-medium text-blue-600">{name}</div>
            {record.alias && (
              <div className="text-xs text-gray-400">{record.alias}</div>
            )}
          </div>
        ),
      },
      {
        title: '城市/地区',
        dataIndex: 'city',
        key: 'city',
        width: 120,
        render: (city: string, record: any) => {
          // 优先显示city，如果没有则显示country
          const location = city || record.country || '-';
          const color = city ? 'blue' : 'orange';
          return <Tag color={color}>{location}</Tag>;
        },
      },
      {
        title: '行业',
        dataIndex: 'industry',
        key: 'industry',
        width: 120,
        render: (industry: string) => industry ? <Tag color="green">{industry}</Tag> : '-',
      },
    ];
    
    // 财富500强特有的列
    if (rankingId.includes('fortune')) {
      return [
        ...baseColumns,
        {
          title: '国家/地区',
          dataIndex: 'country',
          key: 'country',
          width: 100,
          render: (country: string) => country ? <Tag color="orange">{country}</Tag> : '-',
        },
        {
          title: '营收(亿美元)',
          dataIndex: 'revenue',
          key: 'revenue',
          width: 120,
          render: (revenue: string) => (
            <span className="font-medium text-green-600">{revenue || '-'}</span>
          ),
        },
        {
          title: '利润(亿美元)',
          dataIndex: 'profit',
          key: 'profit',
          width: 120,
          render: (profit: string) => profit || '-',
        },
        {
          title: '员工人数',
          dataIndex: 'employees',
          key: 'employees',
          width: 120,
        },
      ];
    }
    
    // 独角兽/瞪羚特有的列
    if (rankingId.includes('unicorn') || rankingId.includes('gazelle')) {
      return [
        ...baseColumns,
        {
          title: '估值(亿美元)',
          dataIndex: 'valuation',
          key: 'valuation',
          width: 120,
          render: (valuation: number) => valuation ? (
            <span className="font-medium text-red-600">${valuation}亿</span>
          ) : '-',
        },
        {
          title: '成立时间',
          dataIndex: 'founded',
          key: 'founded',
          width: 100,
        },
        {
          title: '核心业务',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
        },
      ];
    }
    
    return baseColumns;
  };
  
  // 获取榜单图标
  const getRankingIcon = (category: string) => {
    switch (category) {
      case 'global':
        return <GlobalOutlined className="text-blue-500" />;
      case 'unicorn':
        return <CrownOutlined className="text-yellow-500" />;
      case 'gazelle':
        return <RiseOutlined className="text-green-500" />;
      default:
        return <TrophyOutlined className="text-purple-500" />;
    }
  };
  
  // 计算统计数据
  const totalCompanies = currentRankings.reduce((sum, r) => sum + r.count, 0);
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <Title level={4} className="mb-1">权威榜单</Title>
            <Text type="secondary">财富500强、独角兽、瞪羚企业等权威企业排行榜</Text>
          </div>
          <Space>
            <span className="text-gray-500">年份：</span>
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 100 }}
              disabled={isLoading}
            >
              {data?.years?.map(year => (
                <Option key={year} value={year}>{year}年</Option>
              ))}
            </Select>
          </Space>
        </div>
      </Card>
      
      {/* Overview Stats */}
      <Skeleton loading={isLoading} active paragraph={{ rows: 1 }}>
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="榜单数量"
                value={currentRankings.length}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="企业总数"
                value={totalCompanies}
                prefix={<StarOutlined className="text-yellow-500" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="财富500强"
                value={currentRankings.find(r => r.id.includes('fortune'))?.count || 0}
                prefix={<GlobalOutlined className="text-blue-500" />}
                suffix="家"
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="独角兽"
                value={currentRankings.find(r => r.id.includes('unicorn'))?.count || 0}
                prefix={<CrownOutlined className="text-purple-500" />}
                suffix="家"
              />
            </Card>
          </Col>
        </Row>
      </Skeleton>
      
      {/* Rankings Tabs */}
      <Card>
        <Skeleton loading={isLoading} active paragraph={{ rows: 10 }}>
          {currentRankings.length > 0 ? (
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              items={currentRankings.map(ranking => ({
                key: ranking.id,
                label: (
                  <span>
                    {getRankingIcon(ranking.category)}
                    <span className="ml-1">{ranking.name}</span>
                    <Tag className="ml-1">{ranking.count}家</Tag>
                  </span>
                ),
                children: (
                  <div>
                    <div className="mb-4 flex justify-between items-center">
                      <Text type="secondary">
                        共 <strong>{ranking.count}</strong> 家企业
                        </Text>
                      <Text type="secondary" className="text-xs">
                        * 当前显示前 {Math.min(ranking.items.length, 100)} 家企业
                      </Text>
                    </div>
                    <Table
                      columns={getColumns(ranking.id)}
                      dataSource={ranking.items.slice(0, 100)}
                      rowKey={(_, index) => `${ranking.id}-${index}`}
                      pagination={{
                        pageSize: 20,
                        showSizeChanger: false,
                        showTotal: (total) => `共 ${total} 条记录`,
                      }}
                      size="middle"
                      scroll={{ x: 1200 }}
                    />
                  </div>
                ),
              }))}
            />
          ) : (
            <Empty
              image={<TrophyOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
              description={`暂无 ${selectedYear} 年的榜单数据`}
              className="py-12"
            />
          )}
        </Skeleton>
      </Card>
    </div>
  );
}
