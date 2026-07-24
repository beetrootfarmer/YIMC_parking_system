import { createBrowserRouter } from 'react-router-dom';
import { ModeSelectPage } from '../pages/ModeSelectPage';
import { TabletPage } from '../pages/TabletPage';
import { AdminLayout } from '../pages/admin/AdminLayout';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { RequireAuth } from './RequireAuth';

export const router = createBrowserRouter([
  { path: '/', element: <ModeSelectPage /> },
  {
    path: '/tablet',
    element: (
      <RequireAuth role="tablet">
        <TabletPage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin',
    element: (
      <RequireAuth role="admin">
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
