import { Layout } from 'antd';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export function MainLayout() {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}
