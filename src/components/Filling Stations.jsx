import React, { useEffect, useState } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { Package, FileText, Users, Plus, LogOut, Grid, ChevronLeft, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Fillingstations() {
    const [fillingStations, setFillingstations] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [fillingStationToDelete, setFillingstationToDelete] = useState(null);
    const [newFillingstationName, setNewFillingstationName] = useState('');
    const [newFillingstationID, setNewFillingstationID] = useState('');
    const [newFillingstationLocation, setNewFillingstationLocation] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchFillingstations();
    }, []);
    
    const fetchFillingstations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/filling-stations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch filling stations');
            }

            const data = await response.json();
            const fillingStations = Array.isArray(data) ? data : data.fillingStations || [];
            setFillingstations(fillingStations);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data');
        }
    };

    const handleStationClick = (fs_id) => {
        navigate(`/filling-stations/${fs_id}`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };
  
    const handleAddFillingstations = () => {
        setShowAddModal(true);
    };

    const handleSubmitNewFillingstations = async (e) => {
        e.preventDefault();
        
        if (!newFillingstationID.trim() || !newFillingstationName.trim() || !newFillingstationLocation.trim()) {
            alert('All fields are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/filling-stations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    fs_id: newFillingstationID,
                    station_name: newFillingstationName,
                    address: newFillingstationLocation
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Server response:', data); // Add this line
                throw new Error(data.message || 'Failed to add station');
            }

            await fetchFillingstations();
            setNewFillingstationID('');
            setNewFillingstationName('');
            setNewFillingstationLocation('');
            setShowAddModal(false);
        } catch (error) {
            console.error('Full error:', error, 'Response:', error.response); // Add this line
            alert(error.message);
        }
    };

    const handleDeleteClick = (station, e) => {
        e.stopPropagation();
        setFillingstationToDelete(station);
        setShowDeleteModal(true);
    };

    const confirmDeleteFillingstations = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/filling-stations/${fillingStationToDelete.fs_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            console.log('Delete response:', data); 

            if (!response.ok) {
                throw new Error(data.message || `Failed to delete station (HTTP ${response.status})`);
            }

            await fetchFillingstations();
            setShowDeleteModal(false);
            setFillingstationToDelete(null);
        } catch (error) {
            console.error('Full delete error:', error);
            alert(`Error deleting station: ${error.message}\nStation ID: ${fillingStationToDelete?.fs_id}`);
        }
    };

    const handleLogout = () => {
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
                            <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                             onClick={() => navigate('/dashboard')}>
                                <Grid className="mr-3" size={20} />
                                <span>Dashboard</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                             onClick={() => navigate('/stock-details')}>
                                <FileText className="mr-3" size={20} />
                                <span>Reports & Forms</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                             onClick={() => navigate('/inventory-book')}>
                                <Package className="mr-3" size={20} />
                                <span>Inventory Book</span>
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
                
                {/* Calendar Section */}
                <div className="mt-auto p-2">
                    <div className="bg-yellow-400 rounded-t-lg p-2">
                        <img src={CalendarImage} alt="Calendar" className="w-full h-24 object-cover rounded" />
                        <div className="text-center font-bold text-green-800 py-2">
                            {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                        </div>
                
                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 text-xs text-center">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                                <div key={day} className="py-1">{day}</div>
                            ))}
                
                            {/* Calendar dates */}
                            {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                                const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
                                return (
                                    <div key={i}
                                     className={`py-1 ${i + 1 === new Date().getDate() ? 'bg-green-600 text-white rounded' : ''}`}
                                     style={{ gridColumnStart: i === 0 ? firstDay + 1 : undefined }}>
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
            <div className="flex-1 flex flex-col bg-white p-8 overflow-auto">
                {/* Header with back button and title */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <div className="flex items-center">
                        <button 
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Filling Stations</h1>
                    </div>
                    
                    <button 
                        onClick={handleAddFillingstations}
                        className="bg-green-600 flex items-center px-4 py-3 hover:bg-green-500 text-white rounded-lg">
                        <Plus className='mr-3' size={24} />
                        <span>Add New Station</span>
                    </button>
                </div>
                    
                {/* Simplified Station list */}
                <div className="space-y-3">
                    {fillingStations.length > 0 ? (
                        fillingStations.map((station) => (
                            <div 
                                key={station.fs_id}
                                onClick={() => handleStationClick(station.fs_id)}
                                className="flex justify-between items-center p-4 rounded-md cursor-pointer
                                           border border-gray-200 hover:bg-green-50 transition-colors">
                                <span className="text-lg font-medium text-gray-800">
                                    {station.station_name}
                                </span>
                                <button 
                                    onClick={(e) => handleDeleteClick(station, e)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                    title="Delete Station">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No stations found. Click "Add New Station" to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Station Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Station</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitNewFillingstations}>
                            <div className="mb-4">
                                <label htmlFor="stationID" className="block text-sm font-medium text-gray-700 mb-1">
                                    Station ID
                                </label>
                                <input
                                    type="text"
                                    id="stationID"
                                    value={newFillingstationID}
                                    onChange={(e) => setNewFillingstationID(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter station ID"
                                    required
                                    autoFocus />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Station Name
                                </label>
                                <input
                                    type="text"
                                    id="stationName"
                                    value={newFillingstationName}
                                    onChange={(e) => setNewFillingstationName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter station name"
                                    required
                                    autoFocus />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="stationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                    Station Address
                                </label>
                                <input
                                    type="text"
                                    id="stationAddress"
                                    value={newFillingstationLocation}
                                    onChange={(e) => setNewFillingstationLocation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter station address"
                                    required
                                    autoFocus/>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    Add Station
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Station Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Delete Station</h2>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to permanently delete "{fillingStationToDelete?.station_name}"?
                            </p>
                            <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteFillingstations}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>      
    );
}