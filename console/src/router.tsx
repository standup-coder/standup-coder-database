/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { LazyOutlet } from './components/layout/LazyOutlet';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Companies = lazy(() => import('./pages/Companies').then(m => ({ default: m.Companies })));
const Jobs = lazy(() => import('./pages/Jobs').then(m => ({ default: m.Jobs })));
const Rankings = lazy(() => import('./pages/Rankings').then(m => ({ default: m.Rankings })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <LazyOutlet />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'companies',
            element: <Companies />,
          },
          {
            path: 'jobs',
            element: <Jobs />,
          },
          {
            path: 'rankings',
            element: <Rankings />,
          },
          {
            path: 'analytics',
            element: <Analytics />,
          },
          {
            path: 'about',
            element: <About />,
          },
        ],
      },
    ],
  },
]);
