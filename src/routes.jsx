import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './components/Login';
import CreateAccountPage from './components/Register';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import AddNewItemsPage from './components/Add New Items';
import FillingStations from './components/Filling Stations';
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
        element: <FillingStations />
      }
      
    ]
  }
]);

export default router;