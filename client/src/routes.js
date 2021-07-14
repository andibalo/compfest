import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import CreateAppointment from './pages/CreateAppointment';
import EditAppointment from './pages/EditAppointment';
import AppointmentList from './pages/AppointmentList';
import AppointmentDetail from './pages/AppointmentDetail';
import UserDashboard from './pages/User';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'appointment', element: <AppointmentList /> },
        { path: 'appointment/:appointmentId', element: <AppointmentDetail /> },
        { path: 'appointment/create', element: <CreateAppointment /> },
        { path: 'appointment/edit/:appointmentId', element: <EditAppointment /> }
      ]
    },
    {
      path: '/user',
      element: <DashboardLayout isUser />,
      children: [
        { path: '/', element: <Navigate to="/user/dashboard" replace /> },
        { path: 'dashboard', element: <UserDashboard /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
