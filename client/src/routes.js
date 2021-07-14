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
import { useAuthState } from './context/Context';
// ----------------------------------------------------------------------

export default function Router() {
  const user = useAuthState();
  console.log(user);
  return useRoutes([
    {
      path: '/dashboard',
      element:
        user.token && user.userDetails === 'admin' ? <DashboardLayout /> : <Navigate to="/login" />,
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
      element:
        user.token && user.userDetails !== 'admin' ? (
          <Navigate to="/login" />
        ) : (
          <DashboardLayout isUser />
        ),
      children: [
        { path: '/', element: <Navigate to="/user/dashboard" replace /> },
        { path: 'dashboard', element: <UserDashboard /> }
      ]
    },
    {
      path: '/',
      element: user.token ? <LogoOnlyLayout /> : <Navigate to="/user/dashboard" replace />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },

        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
