import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './components/Login';
import CreateAccountPage from './components/Register';
import IrrigationDashboard from './components/Dashboard';
import Categories from './components/Categories';
import AddNewItemsPage from './components/Add New Items';
import FillingStations from './components/Filling Stations';
import FillingStationDetail from './components/Station Details';
import ErrorBoundary from './components/Error Boundry';
import OfficersPage from './components/OfficersPage';
import OfficerDetails from './components/Officer details';
import ReportsAndForms from './components/Reports/Report and Forms';
import ReportForm from './components/Reports/Report Form';

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
        element: 
        <ErrorBoundary>
          <IrrigationDashboard />
        </ErrorBoundary> 
      },
      {
        path: 'categories',
        element: 
        <ErrorBoundary>
          <Categories />
        </ErrorBoundary> 
      },
      {
        path: 'items',
        element: <AddNewItemsPage />
      },
      {
        path: 'filling-stations',
        element:
        <ErrorBoundary>
          <FillingStations />
        </ErrorBoundary> 
      },
      {
        path: 'filling-stations/:fs_id',
        element:<FillingStationDetail />
      },
      {
        path: 'officer-details',
        element: <OfficersPage/>
      },
      {
        path: 'officer-details/:officer_id',
        element: <OfficerDetails />
      },
      {
        path: 'reports',
        element: <ReportsAndForms />
      },
      {
        path: 'reports/:id',
        element: <ReportForm />
      }
      
    ]
  }
]);

export default router;