import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './components/Login';
import CreateAccountPage from './components/Register';
import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LoginPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <CreateAccountPage />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      }
      
    ]
  }
]);

export default router;