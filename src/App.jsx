import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import AddNewItemsPage from './components/Add New Items';
import FillingStations from './components/Filling Stations';
import FillingStationDetail from './components/Station Details';
import ErrorBoundary from './components/Error Boundry';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/items" element={<AddNewItemsPage />} />
      <Route path="/filling-stations" element={<FillingStations />} />
      <Route path="/filling-stations/:id" element={<FillingStationDetail />} />
      <Route path='/error-boundary' element={<ErrorBoundary />} />
      <Route path="/" element={<LoginPage />} /> {/* Default route */}
    </Routes>
  </Router>
);

export default App;