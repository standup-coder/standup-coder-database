import { Layout, Menu, Input, Button, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  DatabaseOutlined, 
  SearchOutlined,
  GithubOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { NAV_ITEMS, APP_NAME } from '../../utils/constants';

const { Header: AntHeader } = Layout;
const { Search } = Input;

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  
  const currentKey = NAV_ITEMS.find(item => item.path === location.pathname)?.key || 'home';
  
  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/companies?keyword=${encodeURIComponent(value)}`);
    }
  };
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    // 主题切换逻辑
  };
  
  return (
    <AntHeader className="sticky top-0 z-50 flex items-center justify-between px-6 bg-white shadow-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
        <DatabaseOutlined className="text-blue-600" />
        <span>{APP_NAME}</span>
      </Link>
      
      {/* Navigation */}
      <Menu
        mode="horizontal"
        selectedKeys={[currentKey]}
        className="flex-1 justify-center border-0 min-w-[400px]"
        items={NAV_ITEMS.map(item => ({
          key: item.key,
          label: <Link to={item.path}>{item.label}</Link>,
        }))}
      />
      
      {/* Right side */}
      <Space className="flex items-center">
        <Search
          placeholder="搜索企业..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          className="w-64"
        />
        
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />
        
        <a
          href="https://github.com/standup-coder/standup-coder-database"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="text" icon={<GithubOutlined />} />
        </a>
      </Space>
    </AntHeader>
  );
}
