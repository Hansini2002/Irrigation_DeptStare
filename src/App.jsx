import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import Register from './components/Register';
import IrrigationDashboard from './components/Dashboard';
import Categories from './components/Categories';
import AddNewItemsPage from './components/Add New Items';
import FillingStations from './components/Filling Stations';
import FillingStationDetail from './components/Station Details';
import OfficersPage from './components/OfficersPage';
import OfficerDetails from './components/Officer details';
import ReportsAndForms from './components/Reports/Report and Forms';
import ReportForm from './components/Reports/Report Form';
import ReportDefinitionEditor from './components/Reports/Report definition Editor';
import ReportDefinitionForm from './components/Reports/Report Definition';
import Suppliers from './components/Suppliers';
import SupplierDetails from './components/Supplier Details';
import ErrorBoundary from './components/Error Boundry';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<IrrigationDashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/items" element={<AddNewItemsPage />} />
      <Route path="/filling-stations" element={<FillingStations />} />
      <Route path="/filling-stations/:fs_id" element={<FillingStationDetail />} />
      <Route path="/officer-details" element={<OfficersPage />} />
      <Route path="/officer-details/:id" element={<OfficerDetails />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/suppliers/:sup_id" element={<SupplierDetails />} />
      <Route path="/reports" element={<ReportsAndForms />} />
      <Route path="/reports/:id" element={<ReportForm />} />
      <Route path="/admin/report-categories/:id/fields" element={<ReportDefinitionEditor />} />
      <Route path="/admin/report-definitions/:id" element={<ReportDefinitionForm />} />
      <Route path='/error-boundary' element={<ErrorBoundary />} />
      <Route path="/" element={<LoginPage />} /> {/* Default route */}
    </Routes>
  </Router>
);

export default App;