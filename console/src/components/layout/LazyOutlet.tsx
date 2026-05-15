import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spin size="large" tip="页面加载中..." />
    </div>
  );
}

export function LazyOutlet() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}
