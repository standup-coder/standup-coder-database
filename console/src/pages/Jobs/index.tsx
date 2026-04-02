import { Card, List, Tag, Input, Select, Space, Empty, Skeleton, Row, Col, Statistic, Tabs } from 'antd';
import { SearchOutlined, DollarOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { useJobs } from '../../hooks/useJobs';

const { Option } = Select;

export function Jobs() {
  const { data: jobsData, isLoading } = useJobs();
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // 筛选岗位
  const filteredJobs = useMemo(() => {
    if (!jobsData?.jobs) return [];
    
    return jobsData.jobs.filter(job => {
      // 关键词搜索
      if (keyword) {
        const skillsStr = (job.skills || []).join(' ');
        const searchStr = `${job.title} ${job.category} ${skillsStr}`.toLowerCase();
        if (!searchStr.includes(keyword.toLowerCase())) {
          return false;
        }
      }
      
      // 类别筛选
      if (selectedCategory && selectedCategory !== '全部') {
        if (job.category !== selectedCategory) {
          return false;
        }
      }
      
      // 地点筛选
      if (selectedLocation) {
        const locations = job.locations || [];
        if (!locations.some(loc => loc.includes(selectedLocation))) {
          return false;
        }
      }
      
      return true;
    });
  }, [jobsData, keyword, selectedCategory, selectedLocation]);
  
  // 按类别分组
  const jobsByCategory = useMemo(() => {
    const groups: Record<string, typeof filteredJobs> = {};
    
    // 添加"全部"分组
    groups['全部'] = filteredJobs;
    
    // 按类别分组
    for (const job of filteredJobs) {
      if (!groups[job.category]) {
        groups[job.category] = [];
      }
      groups[job.category].push(job);
    }
    
    return groups;
  }, [filteredJobs]);
  
  // 类别列表（按岗位数量排序）
  const categories = useMemo(() => {
    if (!jobsData?.categories) return [];
    return [
      { name: '全部', count: jobsData.total },
      ...jobsData.categories.sort((a, b) => b.count - a.count),
    ];
  }, [jobsData]);
  
  // 计算覆盖城市数
  const coverCities = useMemo(() => {
    if (!jobsData?.jobs) return 0;
    const citySet = new Set<string>();
    jobsData.jobs.forEach(job => {
      (job.locations || []).forEach(loc => {
        // 提取城市名（去除"市"后缀）
        const city = loc.replace(/市$/, '');
        if (city && !city.includes('办公室') && !city.includes('远程')) {
          citySet.add(city);
        }
      });
    });
    return citySet.size;
  }, [jobsData]);
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">IT岗位查询</h2>
            <p className="text-gray-500">涵盖 {jobsData?.total || 0} 个互联网热门岗位</p>
          </div>
          <Space wrap>
            <Input.Search
              placeholder="搜索岗位、技能..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              style={{ width: 250 }}
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
            />
            <Select
              placeholder="工作地点"
              style={{ width: 120 }}
              value={selectedLocation}
              onChange={setSelectedLocation}
              allowClear
            >
              {['北京', '上海', '深圳', '杭州', '广州', '成都'].map(loc => (
                <Option key={loc} value={loc}>{loc}</Option>
              ))}
            </Select>
          </Space>
        </div>
      </Card>
      
      {/* Stats */}
      <Skeleton loading={isLoading} active paragraph={{ rows: 1 }}>
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="岗位总数"
                value={jobsData?.total || 0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="岗位类别"
                value={jobsData?.categories?.length || 0}
                prefix={<DollarOutlined className="text-green-500" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="覆盖城市"
                value={coverCities}
                prefix={<EnvironmentOutlined className="text-blue-500" />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="当前筛选"
                value={filteredJobs.length}
                suffix="个岗位"
              />
            </Card>
          </Col>
        </Row>
      </Skeleton>
      
      {/* Jobs List */}
      <Card>
        <Skeleton loading={isLoading} active paragraph={{ rows: 10 }}>
          {filteredJobs.length > 0 ? (
            <Tabs
              activeKey={selectedCategory}
              onChange={setSelectedCategory}
              type="card"
              items={categories.map(cat => ({
                key: cat.name,
                label: (
                  <span>
                    {cat.name}
                    <Tag className="ml-1" color={selectedCategory === cat.name ? 'blue' : 'default'}>
                      {jobsByCategory[cat.name]?.length || 0}
                    </Tag>
                  </span>
                ),
                children: (
                  <List
                    grid={{ 
                      gutter: 16, 
                      xs: 1, 
                      sm: 2, 
                      md: 2, 
                      lg: 3, 
                      xl: 3,
                      xxl: 4,
                    }}
                    dataSource={jobsByCategory[cat.name] || []}
                    renderItem={job => (
                      <List.Item>
                        <Card 
                          hoverable 
                          className="h-full"
                          title={
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{job.icon}</span>
                              <span className="font-medium">{job.title}</span>
                            </div>
                          }
                          extra={<Tag color="blue">{job.category}</Tag>}
                        >
                          <Space direction="vertical" className="w-full">
                            <div>
                              <DollarOutlined className="text-green-500 mr-2" />
                              <span className="font-medium text-green-600">
                                {job.salaryMin || 0}K - {job.salaryMax || 0}K
                              </span>
                              <span className="text-gray-400 text-xs ml-1">/月</span>
                            </div>
                            <div>
                              <EnvironmentOutlined className="text-blue-500 mr-2" />
                              {(job.locations || []).slice(0, 4).map(loc => (
                                <Tag key={loc}>{loc}</Tag>
                              ))}
                              {(job.locations || []).length > 4 && (
                                <Tag>+{(job.locations || []).length - 4}</Tag>
                              )}
                            </div>
                            <div className="pt-2">
                              {(job.skills || []).slice(0, 5).map(skill => (
                                <Tag key={skill} color="cyan" className="mb-1">
                                  {skill}
                                </Tag>
                              ))}
                            </div>
                            {(job.responsibilities || []).length > 0 && (
                              <div className="text-gray-500 text-sm mt-2">
                                <div className="truncate">
                                  {job.responsibilities[0]}
                                </div>
                              </div>
                            )}
                          </Space>
                        </Card>
                      </List.Item>
                    )}
                  />
                ),
              }))}
            />
          ) : (
            <Empty description="暂无匹配的岗位" />
          )}
        </Skeleton>
      </Card>
    </div>
  );
}
