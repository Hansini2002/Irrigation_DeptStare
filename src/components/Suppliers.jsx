import React, { useEffect, useState } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { FileText, Users, Plus, LogOut, Grid, ChevronLeft, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [supplierToDelete, setSuppliersToDelete] = useState(null);
    const [newSuppliers, setNewSuppliers] = useState({
        sup_id: '',
        supplier_name: '',
        contact_no: '',
        city: ''
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchSuppliers();
    }, []);
    
    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/suppliers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Supplier fetch response:', response);
            
            if (!response.ok) {
                throw new Error('Failed to fetch Suppliers');
            }

            const data = await response.json();
            const suppliers = Array.isArray(data) ? data : data.suppliers || [];
            setSuppliers(suppliers);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data');
        }
    };

    const handleSupplierClick = (sup_id) => {
        navigate(`/suppliers/${sup_id}`);
    };

    const handleBackClick = () => {
        navigate(-1);
    };
  
    const handleAddsuppliers = () => {
        setShowAddModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSuppliers(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitnewSuppliers = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = ['sup_id', 'supplier_name',  'contact_no', 'city'];
        const missingFields = requiredFields.filter(field => !newSuppliers[field].trim());
        
        if (missingFields.length > 0) {
            alert(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newSuppliers)
            });

            const data = await response.json();

            if (!response.ok) {
            console.error('Server response:', data); 
            throw new Error(data.details || data.message || data.sqlMessage || 'Failed to add supplier');
            }

            await fetchSuppliers();
            setNewSuppliers({
            sup_id: '',
            supplier_name: '',
            contact_no: '',
            city: ''
            });
            setShowAddModal(false);
            alert('Supplier added successfully!');
        } catch (error) {
            console.error('Full error:', error);
            alert(`Error: ${error.message}\n\nPlease check the console for more details.`);
        }
        };

    const handleDeleteClick = (supplier, e) => {
        e.stopPropagation();
        setSuppliersToDelete(supplier);
        setShowDeleteModal(true);
    };

    const confirmDeleteSupplier = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/suppliers/${supplierToDelete.sup_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();
            console.log('Delete response:', data); 

            if (!response.ok) {
                throw new Error(data.message || `Failed to delete supplier (HTTP ${response.status})`);
            }

            await fetchSuppliers();
            setShowDeleteModal(false);
            setSuppliersToDelete(null);
        } catch (error) {
            console.error('Full delete error:', error);
            alert(`Error deleting supplier: ${error.message}\nSupplier ID: ${supplierToDelete?.sup_id}`);
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
                        <h1 className="text-2xl font-bold">Suppliers</h1>
                    </div>
                    
                    <button onClick={handleAddsuppliers}
                        className="bg-green-600 flex items-center px-4 py-3 hover:bg-green-500 text-white rounded-lg">
                        <Plus className='mr-3' size={24} />
                        <span>Add New Supplier</span>
                    </button>
                </div>
                    
                {/* Simplified suppliers list */}
                <div className="space-y-3">
                    {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                            <div key={supplier.sup_id}
                                onClick={() => handleSupplierClick(supplier.sup_id)}
                                className="flex justify-between items-center p-4 rounded-md cursor-pointer
                                           border border-gray-200 hover:bg-green-50 transition-colors">
                                <div>
                                    <span className="text-lg font-medium text-gray-800 block">
                                        {supplier.supplier_name}
                                    </span>
                                </div>
                                <button onClick={(e) => handleDeleteClick(supplier, e)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                    title="Delete supplier">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No suppliers found. Click "Add New Supplier" to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Add supplier Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Supplier</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitnewSuppliers}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label htmlFor="sup_id" className="block text-sm font-medium text-gray-700 mb-1">
                                        Supplier ID *
                                    </label>
                                    <input
                                        type="text"
                                        id="sup_id"
                                        name="sup_id"
                                        value={newSuppliers.sup_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter supplier ID"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="supplier_name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Supplier Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="supplier_name"
                                        name="supplier_name"
                                        value={newSuppliers.supplier_name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter supplier name"
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
                                        value={newSuppliers.contact_no}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter contact number"
                                        required />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={newSuppliers.city}
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
                                    Add supplier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete supplier Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Delete supplier</h2>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to permanently delete "{supplierToDelete?.supplier_name}"?
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
                                onClick={confirmDeleteSupplier}
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