import React /*, { useState, useEffect }*/ from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, MoreVertical, Settings, FileText, CreditCard, Calendar, DollarSign, Users, Package, BarChart2, Home } from 'lucide-react';

const Dashboard = () => {
  /*const [setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    recentTransactions: [],
    categoryDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch dashboard data');
        
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setStats]);

  // Chart data

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) return <div className="text-center py-8">Loading Dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;*/

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
              <div className="w-6 h-6 bg-cyan-300 rounded rotate-45"></div>
            </div>
            <span className="text-xl font-semibold">Neuro.</span>
          </div>
          
          <p className="text-sm text-gray-300 mb-2">Admin Tools</p>
          
          <div className="mb-2 bg-white text-blue-600 rounded-lg p-3 flex items-center">
            <Home className="w-5 h-5 mr-3" />
            <span className="font-medium">Overview</span>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-lg cursor-pointer">
              <Package className="w-5 h-5 mr-3" />
              <span>Products</span>
            </div>
            
            <div className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-lg cursor-pointer">
              <BarChart2 className="w-5 h-5 mr-3" />
              <span>Campaigns</span>
            </div>
            
            <div className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-lg cursor-pointer">
              <Calendar className="w-5 h-5 mr-3" />
              <span>Schedules</span>
            </div>
            
            <div className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-lg cursor-pointer">
              <DollarSign className="w-5 h-5 mr-3" />
              <span>Payouts</span>
            </div>
            
            <div className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-lg cursor-pointer">
              <FileText className="w-5 h-5 mr-3" />
              <span>Statements</span>
            </div>
            
            <div className="flex items-center p-3 text-gray-200 hover:bg-blue-700 rounded-lg cursor-pointer">
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-6">
          <div className="bg-blue-700 rounded-lg p-4 text-sm">
            <p className="text-gray-200 mb-2">Have any problems with manage your dashboard? Try to contact this Customer Support</p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-2">Contact Us</button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-500">Welcome Back,</p>
            <h1 className="text-2xl font-bold">Lucy Lure</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
              <span className="mr-2">Upload Product</span>
            </button>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 pl-4 pr-10 py-2 rounded-lg border border-gray-200"
              />
              <svg
                className="absolute right-3 top-2.5 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-500" />
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </div>
            </div>
          </div>
        </div>
        
        {/* Referral Banner */}
        <div className="bg-cyan-400 rounded-lg p-6 mb-8 flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl font-bold mb-1">Want some EXTRA Money?</h2>
            <p className="text-sm">Refer a friend and earn 10% commission on every referral.</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg mt-4 font-medium">
              Referral Program
            </button>
          </div>
          <div className="relative w-64 h-40">
            <div className="absolute top-0 right-0 bg-cyan-500 bg-opacity-60 backdrop-blur-md p-4 rounded-lg w-48 h-32 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="space-y-1">
                  <div className="w-16 h-2 bg-cyan-300 rounded-full"></div>
                  <div className="w-12 h-2 bg-cyan-200 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-12 flex justify-center">
              <div className="w-2/3 h-full bg-gray-700 rounded-lg grid grid-cols-10 gap-1 items-center px-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`h-6 rounded-sm ${i % 2 === 0 ? 'bg-gray-600' : 'bg-blue-400'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Total Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                <h3 className="text-gray-600 font-medium">Total Product</h3>
              </div>
              <MoreVertical className="text-gray-400 w-5 h-5" />
            </div>
            
            <div className="mb-4">
              <h2 className="text-3xl font-bold">1,134 <span className="text-gray-400 text-sm font-normal">Items</span></h2>
              <div className="text-green-500 text-sm mt-1">+10% this week</div>
            </div>
            
            <div className="h-10 mt-4">
              <div className="h-full w-full bg-green-100 rounded-lg relative">
                <div className="absolute inset-0 overflow-hidden">
                  <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d="M0,10 Q20,5 40,9 T60,10 T100,15"
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Total Earning */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                <h3 className="text-gray-600 font-medium">Total Earning</h3>
              </div>
              <MoreVertical className="text-gray-400 w-5 h-5" />
            </div>
            
            <div className="mb-4">
              <h2 className="text-3xl font-bold">$4,231</h2>
              <div className="text-red-500 text-sm mt-1">-22% this week</div>
            </div>
            
            <div className="h-10 mt-4">
              <div className="h-full w-full bg-red-100 rounded-lg relative">
                <div className="absolute inset-0 overflow-hidden">
                  <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d="M0,10 Q25,15 50,5 T75,10 T100,5"
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Latest Download */}
          <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                <h3 className="text-gray-600 font-medium">Lastest Download</h3>
              </div>
            </div>
            
            <div className="h-48 relative">
              <div className="absolute top-0 left-0 text-gray-400 text-xs flex flex-col justify-between h-full py-2">
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
              
              <div className="absolute bottom-0 left-8 right-0 h-36">
                <div className="h-full w-full relative">
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-full w-full">
                    <path
                      d="M0,15 L14,10 L28,25 L42,5 L56,15 L70,5 L84,15 L100,15"
                      fill="none"
                      stroke="rgb(37, 99, 235)"
                      strokeWidth="2"
                    />
                  </svg>
                  
                  <div className="absolute left-1/2 top-1/3 w-4 h-4 bg-white border-2 border-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-12">
                    <div className="bg-cyan-400 text-white px-2 py-1 rounded-lg text-xs">
                      359
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-400">
                <span>Mon</span>
                <span>Sun</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
            </div>
          </div>
          
          {/* Balances */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                <h3 className="text-gray-600 font-medium">Balances</h3>
              </div>
              <MoreVertical className="text-gray-400 w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold">$537</h2>
                <p className="text-green-500 text-sm">Available</p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold">$234</h2>
                <p className="text-red-400 text-sm">Pending</p>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
              Withdraw Money
            </button>
          </div>
        </div>
        
        {/* Top Products Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
            <h3 className="text-gray-600 font-medium">Top Products</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Niky - Icon 3D Pack', type: '3D Illustrations', icon: 'blue-sphere' },
              { name: 'Lika - 3D Abstract', type: '3D Illustrations', icon: 'orange-sphere' },
              { name: 'Cube 3D', type: '3D Illustrations', icon: 'green-cube' },
              { name: 'Heady - 3D Head', type: '3D Illustrations', icon: 'yellow-head' },
              { name: 'Astro Illustrations', type: 'Illustrations', icon: 'character' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                    {product.icon === 'blue-sphere' && <div className="w-6 h-6 rounded-full bg-blue-400"></div>}
                    {product.icon === 'orange-sphere' && <div className="w-6 h-6 rounded-full bg-orange-400"></div>}
                    {product.icon === 'green-cube' && <div className="w-6 h-6 bg-green-400 rounded"></div>}
                    {product.icon === 'yellow-head' && <div className="w-6 h-6 bg-yellow-400 rounded-t-lg"></div>}
                    {product.icon === 'character' && <div className="w-6 h-6 bg-gray-400 rounded-full"></div>}
                  </div>
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.type}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 w-5 h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;