import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Card, 
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Tag, 
  Drawer,
  Descriptions,
  Skeleton,
  Pagination,
  Empty,
  Tooltip,
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined,
  EyeOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useCompanies, useFilterOptions, useCompanySearch } from '../../hooks/useCompanies';
import { useSearchStore } from '../../stores/searchStore';
import { Company, CompanyQuery } from '../../types/company';
import { calculateCompanyAge, extractDomain } from '../../utils/formatter';

const { Option } = Select;

/** listingType 里代表「已经在某个交易所挂牌」的取值，用于绿色标签。 */
const LISTED_TYPE = /交所$|创业板$|科创板$|新三板$/;

export function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, setKeyword, query, setQuery, resetQuery } = useSearchStore();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const initializedRef = useRef(false);
  
  const { data: companies, isLoading: loadingCompanies } = useCompanies();
  const { data: filterOptions, isLoading: loadingOptions } = useFilterOptions();
  const { data: searchResult, isLoading: searching } = useCompanySearch(companies, query);
  
  // 从 URL 参数初始化搜索状态（使用 ref 避免同步 setState）
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    const urlKeyword = searchParams.get('keyword');
    if (urlKeyword) {
      setKeyword(urlKeyword);
      setQuery({ keyword: urlKeyword, page: 1 });
    }
  }, [searchParams, setKeyword, setQuery]);
  
  // 表格列定义
  const columns = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Company) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium text-blue-600">{text || '-'}</span>
          {record.alias && <span className="text-xs text-gray-400">{record.alias}</span>}
        </Space>
      ),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 100,
      render: (city: string) => city ? <Tag color="blue">{city}</Tag> : '-',
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
      render: (industry: string) => industry ? <Tag color="green">{industry}</Tag> : '-',
    },
    {
      title: '业务领域',
      dataIndex: 'businessArea',
      key: 'businessArea',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '规模',
      dataIndex: 'scaleBandValue',
      key: 'scale',
      width: 120,
      // 语料的 scale 是原文，分档值由 shared/pipeline 统一口径推出来
      render: (scale: string) => scale || '-',
    },
    {
      title: '成立时间',
      dataIndex: 'foundedYear',
      key: 'foundedYear',
      width: 100,
      render: (year: string) => {
        if (!year) return '-';
        return (
          <Tooltip title={`成立 ${calculateCompanyAge(year)} 年`}>
            <span>{year.replace('年', '')}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '上市情况',
      // 表格用 derive 出的 listingType，跟「上市状态」筛选项同一口径；
      // 带股票代码的原文（「纽交所：BABA」）留在详情抽屉里。
      dataIndex: 'listingType',
      key: 'listingType',
      width: 120,
      render: (type: string) => {
        if (!type) return '-';
        return <Tag color={LISTED_TYPE.test(type) ? 'success' : 'default'}>{type}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: string, record: Company) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />}
          onClick={() => showCompanyDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];
  
  const showCompanyDetail = (company: Company) => {
    setSelectedCompany(company);
    setDrawerVisible(true);
  };
  
  const handleSearch = () => {
    setQuery({ keyword, page: 1 });
    // 同步到 URL
    if (keyword) {
      setSearchParams({ keyword });
    } else {
      setSearchParams({});
    }
  };
  
  const handleFilterChange = <K extends keyof CompanyQuery>(key: K, value: CompanyQuery[K]) => {
    setQuery({ [key]: value, page: 1 } as Partial<CompanyQuery>);
  };
  
  const handlePageChange = (page: number, pageSize?: number) => {
    setQuery({ page, pageSize: pageSize || 20 });
  };
  
  const handleReset = () => {
    resetQuery();
    setKeyword('');
    setSearchParams({});
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filter Panel */}
      <Card title="企业查询" extra={<Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>}>
        <Space direction="vertical" className="w-full" size="middle">
          {/* Search Row */}
          <Space wrap>
            <Input.Search
              placeholder="搜索企业名称、业务领域..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Space>
          
          {/* Filter Row */}
          <Skeleton loading={loadingOptions} active paragraph={false}>
            <Space wrap>
              <Select
                mode="multiple"
                placeholder="选择城市"
                style={{ width: 200 }}
                value={query.cities}
                onChange={value => handleFilterChange('cities', value)}
                maxTagCount={1}
                allowClear
              >
                {filterOptions?.cities?.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
              
              <Select
                mode="multiple"
                placeholder="选择行业"
                style={{ width: 200 }}
                value={query.industries}
                onChange={value => handleFilterChange('industries', value)}
                maxTagCount={1}
                allowClear
              >
                {filterOptions?.industries?.map(industry => (
                  <Option key={industry.slug} value={industry.name}>{industry.name}</Option>
                ))}
              </Select>
              
              <Select
                mode="multiple"
                placeholder="选择规模"
                style={{ width: 200 }}
                value={query.scales}
                onChange={value => handleFilterChange('scales', value)}
                maxTagCount={1}
                allowClear
              >
                {filterOptions?.scales?.map(scale => (
                  <Option key={scale} value={scale}>{scale}</Option>
                ))}
              </Select>
              
              <Select
                mode="multiple"
                placeholder="上市状态"
                style={{ width: 150 }}
                value={query.listingStatus}
                onChange={value => handleFilterChange('listingStatus', value)}
                maxTagCount={1}
                allowClear
              >
                {filterOptions?.listingStatus?.map(status => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
            </Space>
          </Skeleton>
        </Space>
      </Card>
      
      {/* Results */}
      <Card>
        <Skeleton loading={loadingCompanies || searching} active paragraph={{ rows: 10 }}>
          {searchResult?.data?.length ? (
            <>
              <Table
                columns={columns}
                dataSource={searchResult.data}
                rowKey="id"
                pagination={false}
                size="middle"
                scroll={{ x: 1200 }}
              />
              <div className="flex justify-end mt-4">
                <Pagination
                  current={searchResult.page}
                  pageSize={searchResult.pageSize}
                  total={searchResult.total}
                  showSizeChanger
                  showQuickJumper
                  showTotal={total => `共 ${total} 条记录`}
                  onChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无数据，请调整筛选条件" />
          )}
        </Skeleton>
      </Card>
      
      {/* Detail Drawer */}
      <Drawer
        title={selectedCompany?.name || '企业详情'}
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedCompany && (
          <Descriptions column={1} bordered labelStyle={{ width: 100 }}>
            <Descriptions.Item label="企业名称">{selectedCompany.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="简称">{selectedCompany.alias || '-'}</Descriptions.Item>
            <Descriptions.Item label="城市">
              {selectedCompany.city ? <Tag color="blue">{selectedCompany.city}</Tag> : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="行业">
              {selectedCompany.industry ? <Tag color="green">{selectedCompany.industry}</Tag> : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="业务领域">{selectedCompany.businessArea || '-'}</Descriptions.Item>
            <Descriptions.Item label="代表产品">{selectedCompany.products || '-'}</Descriptions.Item>
            <Descriptions.Item label="核心产品">{selectedCompany.coreProduct || '-'}</Descriptions.Item>
            <Descriptions.Item label="公司规模">{selectedCompany.scale || '-'}</Descriptions.Item>
            <Descriptions.Item label="成立时间">{selectedCompany.foundedYear || '-'}</Descriptions.Item>
            <Descriptions.Item label="上市情况">
              {selectedCompany.listingStatus ? (
                <Tag color={LISTED_TYPE.test(selectedCompany.listingType || '') ? 'success' : 'default'}>
                  {selectedCompany.listingStatus}
                </Tag>
              ) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="融资情况">{selectedCompany.funding || '-'}</Descriptions.Item>
            <Descriptions.Item label="办公地址">{selectedCompany.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="企业官网">
              {selectedCompany.website ? (
                <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                  <GlobalOutlined /> {extractDomain(selectedCompany.website)}
                </a>
              ) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="开源仓库">{selectedCompany.openSource || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
