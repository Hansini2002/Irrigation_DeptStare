import React, { useEffect, useState } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { Package, FileText, Users, Plus, LogOut, Grid, ChevronLeft, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OfficersPage() {
    const [officers, setOfficers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [officerToDelete, setOfficerToDelete] = useState(null);
    const [newOfficer, setNewOfficer] = useState({
        id: '',
        officer_name: '',
        designation: '',
        gender: 'Male',
        started_date: '',
        end_date: '',
        nic: '',
        contact_no: '',
        email: '',
        city: ''
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchOfficers();
    }, []);
    
    const fetchOfficers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/officer-details', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch Officers');
            }

            const data = await response.json();
            const officers = Array.isArray(data) ? data : data.officers || [];
            setOfficers(officers);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data');
        }
    };

    const handleOfficerClick = (id) => {
        navigate(`/officer-details/${id}`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };
  
    const handleAddOfficers = () => {
        setShowAddModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOfficer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitNewOfficers = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['id', 'officer_name', 'designation', 'gender', 'started_date', 'nic', 'contact_no', 'city'];
        const missingFields = requiredFields.filter(field => !newOfficer[field].trim());
        
        if (missingFields.length > 0) {
            alert(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/officer-details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newOfficer)
            });

            const data = await response.json();

            if (!response.ok) {
            console.error('Server response:', data); 
            throw new Error(data.details || data.message || data.sqlMessage || 'Failed to add officer');
            }

            await fetchOfficers();
            setNewOfficer({
            id: '',
            officer_name: '',
            designation: '',
            gender: 'Male',
            started_date: '',
            end_date: '',
            nic: '',
            contact_no: '',
            email: '',
            city: ''
            });
            setShowAddModal(false);
            alert('Officer added successfully!');
        } catch (error) {
            console.error('Full error:', error);
            alert(`Error: ${error.message}\n\nPlease check the console for more details.`);
        }
        };

    const handleDeleteClick = (officer, e) => {
        e.stopPropagation();
        setOfficerToDelete(officer);
        setShowDeleteModal(true);
    };

    const confirmDeleteOfficer = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/officer-details/${officerToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            console.log('Delete response:', data); 

            if (!response.ok) {
                throw new Error(data.message || `Failed to delete officer (HTTP ${response.status})`);
            }

            await fetchOfficers();
            setShowDeleteModal(false);
            setOfficerToDelete(null);
        } catch (error) {
            console.error('Full delete error:', error);
            alert(`Error deleting officer: ${error.message}\nOfficer ID: ${officerToDelete?.id}`);
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
                    <button onClick={handleLogout}
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
                        <button onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Officers</h1>
                    </div>
                    
                    <button onClick={handleAddOfficers}
                        className="bg-green-600 flex items-center px-4 py-3 hover:bg-green-500 text-white rounded-lg">
                        <Plus className='mr-3' size={24} />
                        <span>Add New officer</span>
                    </button>
                </div>
                    
                {/* Simplified Officers list */}
                <div className="space-y-3">
                    {officers.length > 0 ? (
                        officers.map((officer) => (
                            <div key={officer.id}
                                onClick={() => handleOfficerClick(officer.id)}
                                className="flex justify-between items-center p-4 rounded-md cursor-pointer
                                           border border-gray-200 hover:bg-green-50 transition-colors">
                                <div>
                                    <span className="text-lg font-medium text-gray-800 block">
                                        {officer.officer_name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {officer.designation}
                                    </span>
                                </div>
                                <button onClick={(e) => handleDeleteClick(officer, e)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                    title="Delete officer">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No officers found. Click "Add New Officer" to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Add officer Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Officer</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitNewOfficers}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Officer ID *
                                    </label>
                                    <input
                                        type="text"
                                        id="id"
                                        name="id"
                                        value={newOfficer.id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter officer ID"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="officer_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Officer Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="officer_name"
                                        name="officer_name"
                                        value={newOfficer.officer_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter officer name"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                                        Designation *
                                    </label>
                                    <input
                                        type="text"
                                        id="designation"
                                        name="designation"
                                        value={newOfficer.designation}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter designation"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={newOfficer.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="started_date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Started Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="started_date"
                                        name="started_date"
                                        value={newOfficer.started_date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        name="end_date"
                                        value={newOfficer.end_date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">
                                        NIC *
                                    </label>
                                    <input
                                        type="text"
                                        id="nic"
                                        name="nic"
                                        value={newOfficer.nic}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter NIC number"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="contact_no" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact No *
                                    </label>
                                    <input
                                        type="text"
                                        id="contact_no"
                                        name="contact_no"
                                        value={newOfficer.contact_no}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter contact number"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={newOfficer.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter email address" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={newOfficer.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter city"
                                        required />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    Add officer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete officer Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Delete officer</h2>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to permanently delete "{officerToDelete?.officer_name}"?
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
                                onClick={confirmDeleteOfficer}
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