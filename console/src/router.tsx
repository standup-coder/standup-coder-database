import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Companies } from './pages/Companies';
import { Jobs } from './pages/Jobs';
import { Rankings } from './pages/Rankings';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
]);
