import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Edit, Trash} from 'react-feather';
import { Package, FileText, Users, Plus, LogOut, Grid, Shield, Contact } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function Suppliers() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        sup_id: '',
        sup_name: '',
        location: '',
        contact: ''
    });

    const fetchSuppliers = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
    
          const response = await fetch('http://localhost:5000/api/suppliers', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
    
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          if (response.ok) {
            setSuppliers(data);
        } else {
            throw new Error(data.message || 'Failed to fetch Suppliers');
        }
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
          }
    
          setSuppliers(data);
          setError(null);
        } catch (err) {
          console.error('Fetch Suppliers error:', err);
          setError(err.message);
          setSuppliers([]);
        } finally {
          setLoading(false);
        }
      };

    const handleAddSuppliers = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newSupplier.sup_id || !newSupplier.sup_name || !newSupplier.location || !newSupplier.contact) {
            alert('All fields are required!');
            return;
        }
    
        // Prepare the data to send
        const SuppliersData = {
            sup_id: newSupplier.sup_id,
            sup_name: newSupplier.sup_name,
            location: newSupplier.location,
            contact: newSupplier.contact
        };
    
        fetch('http://localhost:5000/api/suppliers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(SuppliersData)
        })
        .then(async (response) => {
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to add the Suppliers');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchSuppliers(); // Refresh the Suppliers list
                setIsAdding(false);
                setNewSupplier({
                    sup_id: '',
                    sup_name: '',
                    location: '',
                    contact: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the Suppliers:', error);
            alert(error.message || 'Error adding Suppliers');
        });
    };

    const handleEdit = (sup_id, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/suppliers/${sup_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedFields)
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update Supplier');
            }
            fetchSuppliers(); // Refresh the list
            return data;
        })
        .catch((error) => {
            console.error('Error updating Supplier:', error);
            alert(error.message || 'Error updating Supplier. Please try again later.');
        });
    };

    const handleDelete = (sup_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/suppliers/${sup_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete Supplier');
                setSuppliers(suppliers.filter((supplier) => supplier.sup_id !== sup_id));
            })
            .catch((error) => {
                console.error('Error deleting Supplier:', error);
                alert('Error deleting Supplier. Please try again later.');
            });
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const filteredSuppliers = suppliers.filter(supplier => 
        (supplier?.sup_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        supplier?.sup_id?.toString()?.includes(searchTerm)) ?? []
    );

    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>;
    }

    return (
        <div className="flex h-screen bg-green-400">
            {/* Sidebar */}
            <div className="w-64 h-full flex flex-col bg-green-400">
                {/* Logo and Title */}
                <div className="flex items-center p-3">
                    <div>
                        <img src={logoImage} alt="Logo" className="w-12 h-12 mr-5" />
                    </div>
                    <h1 className="text-xl font-bold">Irrigation DeptStore</h1>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 mt-2">
                    <ul>
                        <li className="mb-1">
                            <div
                                className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                                onClick={() => navigate('/dashboard')}>
                                <Grid className="mr-3" size={20} />
                                <span>Dashboard</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div
                                className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                                onClick={() => navigate('/stock-details')}>
                                <FileText className="mr-3" size={20} />
                                <span>Reports & Forms</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div
                                className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                                onClick={() => navigate('/inventory-book')}>
                                <Package className="mr-3" size={20} />
                                <span>Inventory Book</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                            onClick={() => navigate('/officers')}>
                                <Users className="mr-3" size={20} />
                                <span>Officers</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div className="flex items-center px-4 py-3 bg-blue-400 text-black-900 rounded-lg mx-2"
                            onClick={() => navigate('/suppliers')}>
                                <Shield className="mr-3" size={20} />
                                <span>Suppliers</span>
                            </div>
                        </li>
                    </ul>
                </nav>

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
            <div className="flex-1 flex flex-col bg-white rounded-l-lg p-4">
                <div className="Suppliers-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Suppliers</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add Supplier'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Supplier</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Supplier ID</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSupplier.sup_id}
                                        onChange={(e) => setNewSupplier({...newSupplier, sup_id: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Supplier Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSupplier.sup_name}
                                        onChange={(e) => setNewSupplier({...newSupplier, sup_name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSupplier.location}
                                        onChange={(e) => setNewSupplier({...newSupplier, location: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact No.</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSupplier.contact}
                                        onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddSuppliers}>
                                Save Supplier
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search Supplier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">Supplier ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Supplier Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Location</th>
                                    <th className="border border-gray-300 p-2 text-left">Contact No.</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((supplier) => (
                                        <SuppliersRow 
                                            key={supplier.sup_id} 
                                            supplier={supplier} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="border border-gray-300 p-2 text-center">
                                            {suppliers.length === 0 ? 'No Suppliers available' : 'No matching Supplier found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuppliersRow({ supplier, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSuppliers, setEditedSuppliers] = useState({
        location: supplier?.location,
        contact: supplier?.contact // Assuming Contact is not editable here
    });

    const handleSave = () => {
        // Prepare update data with proper null handling
        const updateData = {
            location: editedSuppliers.location,
            contact: supplier.contact // Assuming Contact is not editable here
        };
        
        onEdit(supplier.sup_id, updateData);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{supplier.sup_id}</td>
            <td className="border border-gray-300 p-2">{supplier.sup_name}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedSuppliers.location}
                        onChange={(e) => setEditedSuppliers({ ...editedSuppliers, location: e.target.value })}
                    />
                ) : (
                    supplier.location
                )}
            </td>
            
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedSuppliers.contact}
                        onChange={(e) => setEditedSuppliers({ ...editedSuppliers, contact: e.target.value })}
                    />
                ) : (
                    supplier.contact
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <div className="flex space-x-2">
                        <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit size={16} className="mr-1" />
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded flex items-center"
                            onClick={() => onDelete(supplier.sup_id)}
                        >
                            <Trash size={16} className="mr-1" />
                            Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
}