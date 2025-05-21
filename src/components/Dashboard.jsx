import React, { useEffect, useState } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import CalendarImage from '../assets/Deduru Oya.jpg'
import { Search, Bell, Package, FileText, Users, Plus, LogOut, Grid, ArrowBigRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function IrrigationDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lowstockCount, setLowStockCount] = useState(0);
  const [totalRemaining, setTotalAdvances] = useState(0);

  // Check if user is authenticated (simple version without token verification)
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      navigate('/login');
      return;
    }
    try {
      // Verify the token structure (basic check)
      const user = JSON.parse(userData);
      setUser(user);
      fetchLowStockCount();
      fetchTotalRemainingBalances();
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  // Function to fetch low stock items count
  const fetchLowStockCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/low-stock-count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setLowStockCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching low stock count:', error);
    }
  };

   // function to fetch total advances
  const fetchTotalRemainingBalances = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/filling-stations/total-remaining-balances', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log("Total Remaining Balances API Response:", data);
    if (data.success) {
      setTotalAdvances(Number(data.totalRemaining) || 0);
    }
  } catch (error) {
    console.error('Error fetching total remaining balances:', error);
  }
};


  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-green-400">
      {/* Sidebar */}
      <div className="w-64 h-full flex flex-col bg-green-400">
        {/* Logo and Title */}
        <div className="flex items-center p-3">
          <div>
            <img src={logoImage} alt="Logo" className="w-12 h-12 mr-5"/>
          </div>
          <h1 className="text-xl font-bold">Irrigation DeptStore</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-2">
          <ul>
            <li className="mb-1">
              <div className="flex items-center px-4 py-3 bg-blue-400 text-black-900 rounded-lg mx-2">
                <Grid className="mr-3" size={20} />
                <span>Dashboard</span>
              </div>
            </li>
            <li className="mb-1">
              <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
              onClick={() => navigate('/reports')}>
                <FileText className="mr-3" size={20} />
                <span>Reports & Forms</span>
              </div>
            </li>
            <li className="mb-1">
              <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
              onClick={() => navigate('/suppliers')}>
                <Users className="mr-3" size={20} />
                <span>Suppliers</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className='flex items-center justify-center'>
          <button>
            <div className="bg-blue-600 flex items-center px-4 py-3 hover:bg-blue-400 text-black rounded-lg mx-2"
            onClick={() => navigate('/items')}>
              <Plus className="mr-3" size={20} />
              <span>Add New Item</span>
            </div>
          </button>
        </div>

        {/* Calendar Section */}
        <div className="mt-auto p-2">
          <div className="bg-yellow-400 rounded-t-lg p-2">
            <img src={CalendarImage} alt="Calendar Image" className="w-full h-24 object-cover rounded" />
            <div className="text-center font-bold text-green-800 py-2">
              {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 text-xs text-center">
              <div className="py-1">M</div>
              <div className="py-1">T</div>
              <div className="py-1">W</div>
              <div className="py-1">T</div>
              <div className="py-1">F</div>
              <div className="py-1">S</div>
              <div className="py-1">S</div>

              {/* Calendar dates */}
              {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
                return (
                  <div
                    key={i}
                    className={`py-1 ${i + 1 === new Date().getDate() ? 'bg-green-600 text-white rounded' : ''}`}
                    style={{ gridColumnStart: i === 0 ? firstDay + 1 : undefined }}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 w-full bg-green-600 hover:bg-gray-400 text-white rounded">
            <LogOut size={18} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="bg-green-400 p-4 flex items-center justify-between">
          <div className="flex-1 mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search for stock items and more"
                className="w-full bg-gray-200 py-2 pl-10 pr-4 rounded-lg"
              />
            </div>
          </div>
          <div className="flex items-center">
            <Bell size={24} className="mr-4" onClick={() => navigate('/notifications')}/>
            <span className="font-bold text-lg">Hello {user?.name || 'User'},</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Account Overview */}
          <div className="flex mb-6 gap-4">
            {/* Fuel Account */}
            <div className="w-1/2 p-6 bg-teal-700 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Fuel Account</h2>
              <div className="bg-teal-400 p-4 rounded-lg">
                <h3 className="text-black mb-2">Net Remaining Balance</h3>
                <div className="bg-blue-400 p-4 rounded flex justify-between items-center">
                  <span className="text-2xl font-bold">Rs. {totalRemaining.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="w-1/2 p-6 bg-teal-700 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-2">Low Stock Alerts</h2>
              <div className="bg-teal-400 p-4 rounded-lg">
                <h3 className="text-black mb-2">No. of alerts</h3>
                <div className="bg-blue-400 p-4 rounded flex justify-between items-center">
                  <span className="text-2xl font-bold">{lowstockCount}</span>
                  <button className="flex items-center px-4 py-2 bg-blue-400 text-black-900 rounded-full"
                  onClick={() => navigate('/stock-details')}>
                    <ArrowBigRightIcon className="mr-1 hover:bg-blue-600" size={28} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Row 1 */}
            <div className="bg-lime-900 rounded-full h-48 flex items-center justify-center cursor-pointer hover:bg-lime-700 transition-colors"
                onClick={() => navigate('/categories')}>
              <h2 className="text-4xl font-bold text-white">Item Categories</h2>
            </div>
            <div className="bg-emerald-900 rounded-full h-48 flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition-colors"
                onClick={() => navigate('/officer-details')}>
              <h2 className="text-4xl font-bold text-white">Officers' Details</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Row 2 */}
            <div className="bg-cyan-900 rounded-full h-48 flex items-center justify-center cursor-pointer hover:bg-cyan-700 transition-colors"
                onClick={() => navigate('/filling-stations')}>
              <h2 className="text-4xl font-bold text-white">Filling Stations</h2>
            </div>
            <div className="bg-green-700 rounded-full h-48 flex items-center justify-center cursor-pointer hover:bg-green-400 transition-colors"
                onClick={() => navigate('/transaction-details')}>
              <h2 className="text-4xl font-bold text-white">Transaction Details</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}