import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './components/Login';
import CreateAccountPage from './components/Register';
import Dashboard from './components/Dashboard';
import ToolsPage from './components/Tools';
import Materials from './components/Materials';
import ErrorPage from './components/ErrorPage';

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
      },
      {
        path: 'tools', 
        element: <ToolsPage />
      },
      {
        path: 'materials',
        element: <Materials />
      }
      
    ]
  }
]);

export default router;