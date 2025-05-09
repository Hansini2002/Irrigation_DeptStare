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
import StationaryPage from './components/Stationary';
import OfficeEquipments from './components/Office Equipments';
import CounterfoilRegisterPage from './components/Counterfoil Register';
import Officers from './components/Officers';
import Suppliers from './components/Suppliers';
import ErrorPage from './components/ErrorPage';
import ErrorBoundary from './components/Error Boundry';

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
        element: 
          <ErrorBoundary>
            <ToolsPage />
          </ErrorBoundary>
      },
      {
        path: 'materials',
        element: 
        <ErrorBoundary>
          <Materials />
        </ErrorBoundary>
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
      },
      {
        path: 'stationary',
        element: <StationaryPage />
      },
      {
        path: 'office-equipments',
        element: <OfficeEquipments />
      },
      {
        path: 'counterfoil-register',
        element: <CounterfoilRegisterPage />
      },
      {
        path: 'officers',
        element: <Officers />
      },
      {
        path: 'suppliers',
        element: <Suppliers />
      }
      
    ]
  }
]);

export default router;