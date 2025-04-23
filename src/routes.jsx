import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './components/Login';
import CreateAccountPage from './components/Register';
import Dashboard from './components/Dashboard';
import ToolsPage from './components/Tools';
import Materials from './components/Materials';
import SpareParts from './components/Spare Parts';
import VehicleandMachines from './components/Vehicle and Machines';
import LocalPurchasing from './components/Local Purchasing';
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
      },
      {
        path: 'spare-parts',
        element: <SpareParts />
      },
      {
        path: 'vehicle-and-machines',
        element: <VehicleandMachines />
      },
      {
        path: 'local-purchasing',
        element: <LocalPurchasing />
      }
      
    ]
  }
]);

export default router;