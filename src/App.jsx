import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import Register from './components/Register';
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
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/Error Boundry';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/spare-parts" element={<SpareParts />} />
      <Route path="/vehicle-and-machines" element={<VehicleandMachines />} />
      <Route path="/local-purchasing" element={<LocalPurchasing />} />
      <Route path="/stationary" element={<StationaryPage />} />
      <Route path="/office-equipments" element={<OfficeEquipments />} />
      <Route path="/counterfoil-register" element={<CounterfoilRegisterPage />} />
      <Route path="/officers" element={<Officers />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="*" element={<ErrorBoundary />} /> {/* Catch-all route for errors */}
      <Route path="/" element={<LoginPage />} /> {/* Default route */}
    </Routes>
  </Router>
);

export default App;