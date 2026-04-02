import { Card, Row, Col, Statistic, Button, List, Tag, Skeleton } from 'antd';
import { 
  BankOutlined, 
  FileTextOutlined, 
  TrophyOutlined,
  RiseOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStats, useCompanies } from '../../hooks/useCompanies';
import { Space } from 'antd';
import { Pie, Column } from '@ant-design/charts';

export function Home() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useStats() as { data: any, isLoading: boolean };
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  
  const isLoading = statsLoading || companiesLoading;
  
  // 行业分布图表配置
  const industryChartConfig = {
    data: stats?.industryDistribution?.slice(0, 8) || [],
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };
  
  // 城市分布图表配置
  const cityChartConfig = {
    data: stats?.cityDistribution?.slice(0, 10) || [],
    xField: 'name',
    yField: 'value',
    label: {
      position: 'top',
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };
  
  // 热门企业
  const hotCompanies = companies?.slice(0, 5) || [];
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Standup Coder Database
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          全面的企业清单和IT岗位信息数据库，涵盖权威榜单、行业清单、求职招聘等八大类别，
          为程序员、投资者、求职者提供有价值的参考资料。
        </p>
      </div>
      
      {/* Stats */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic
                title="企业总数"
                value={stats?.totalCompanies || 0}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#1677ff' }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic
                title="覆盖城市"
                value={stats?.cityDistribution?.length || 0}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Skeleton loading={isLoading} active paragraph={false}>
              <Statistic
                title="行业分类"
                value={stats?.industryDistribution?.length || 0}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>
      
      {/* Charts */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card 
            title="行业分布" 
            extra={<Button type="link" onClick={() => navigate('/analytics')}>更多</Button>}
          >
            <Skeleton loading={isLoading} active>
              <Pie {...industryChartConfig} height={300} />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
                  title="城市分布 Top 10" 
                  extra={<Button type="link" onClick={() => navigate('/analytics')}>更多</Button>}
                >
                  <Skeleton loading={isLoading} active>
                    {stats?.cityDistribution?.length > 0 ? (
                      <Column {...cityChartConfig} height={300} />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        暂无数据
                      </div>
                    )}
            </Skeleton>
          </Card>
        </Col>
      </Row>
      
      {/* Quick Access */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card
            title="热门企业"
            extra={<Button type="link" icon={<ArrowRightOutlined />} onClick={() => navigate('/companies')}>查看全部</Button>}
          >
            <Skeleton loading={companiesLoading} active paragraph={{ rows: 5 }}>
              <List
                dataSource={hotCompanies}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => navigate(`/companies?id=${item.id}`)}>详情</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={item.name || '-'}
                      description={
                        <Space>
                          <Tag>{item.city || '-'}</Tag>
                          <Tag>{item.industry || '-'}</Tag>
                          <Tag color="blue">{item.scale || '-'}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title="快速入口"
          >
            <div className="grid grid-cols-2 gap-4">
              <Button size="large" icon={<BankOutlined />} onClick={() => navigate('/companies')}>
                企业查询
              </Button>
              <Button size="large" icon={<FileTextOutlined />} onClick={() => navigate('/jobs')}>
                岗位查询
              </Button>
              <Button size="large" icon={<TrophyOutlined />} onClick={() => navigate('/rankings')}>
                榜单浏览
              </Button>
              <Button size="large" icon={<RiseOutlined />} onClick={() => navigate('/analytics')}>
                数据分析
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}


