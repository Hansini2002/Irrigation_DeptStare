import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Edit, Trash} from 'react-feather';
import { Package, FileText, Users, Plus, LogOut, Grid, Shield } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function LocalPurchasing() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [LocalPurchasing, setLocalPurchasing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newLocalPurchasing, setNewLocalPurchasing] = useState({
        lp_id: '',
        name: '',
        quantity: '',
        minimum_level: '',
        lastrecieveddate: ''
    });

    const fetchLocalPurchasing = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
    
          const response = await fetch('http://localhost:5000/api/local-purchasing', {
            headers: {'Authorization': `Bearer ${token}`}
        })
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
            setLocalPurchasing(data);
        } else {
            throw new Error(data.message || 'Failed to fetch local purchasing data');
        }
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
          }

          setLocalPurchasing(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching local purchasing:', err);
          setError(err.message);
          setLocalPurchasing([]);
        } finally {
          setLoading(false);
        }
    };

    const handleAddLocalPurchasing = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newLocalPurchasing.lp_id || !newLocalPurchasing.name || !newLocalPurchasing.quantity) {
            alert('LP ID, Name and Quantity are required fields');
            return;
        }
    
        // Prepare the data to send
        const LocalPurchasingData = {
            lp_id: newLocalPurchasing.lp_id,
            name: newLocalPurchasing.name,
            quantity: parseInt(newLocalPurchasing.quantity),
            minimum_level: parseInt(newLocalPurchasing.minimum_level) || 1, // Default to 1 if not provided
            lastrecieveddate: newLocalPurchasing.lastrecieveddate || null // Change from current date to null
        };
    
        fetch('http://localhost:5000/api/local-purchasing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(LocalPurchasingData)
        })
        .then(async (response) => {
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to add the local purchasing');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchLocalPurchasing(); // Refresh the local purchasing list
                setIsAdding(false);
                setNewLocalPurchasing({
                    lp_id: '',
                    name: '',
                    quantity: '',
                    minimum_level: '',
                    lastrecieveddate: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the local purchasing:', error);
            alert(error.message || 'Error adding local purchasing');
        });
    };

    const handleEdit = (lp_id, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/local-purchasing/${lp_id}`, {
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
                    throw new Error(data.message || 'Failed to update local purchasing');
                }
                fetchLocalPurchasing(); // Refresh the list
                return data;
            })
            .catch((error) => {
                console.error('Error updating local purchasing:', error);
                alert(error.message || 'Error updating local purchasing. Please try again later.');
            });
    };

    const handleDelete = (lp_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/local-purchasing/${lp_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete local purchasing');
                setLocalPurchasing(LocalPurchasing.filter((LocalPurchasing) => LocalPurchasing.lp_id !== lp_id));
            })
            .catch((error) => {
                console.error('Error deleting local purchasing:', error);
                alert('Error deleting local purchasing. Please try again later.');
            });
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      };

    useEffect(() => {
        fetchLocalPurchasing();
    }, []);

    const filteredLocalPurchasing = LocalPurchasing.filter(LocalPurchasing => 
        LocalPurchasing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        LocalPurchasing.lp_id.toString().includes(searchTerm)
    );

    if (loading) {
        return <div>Loading local purchasings...</div>;
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
                            <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
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
                <div className="local-purchasing-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Local Purchasing</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add local purchasing'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Local Purchasing</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">LP ID</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newLocalPurchasing.lp_id}
                                        onChange={(e) => setNewLocalPurchasing({...newLocalPurchasing, lp_id: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newLocalPurchasing.name}
                                        onChange={(e) => setNewLocalPurchasing({...newLocalPurchasing, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newLocalPurchasing.quantity}
                                        onChange={(e) => setNewLocalPurchasing({...newLocalPurchasing, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minimum Level</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newLocalPurchasing.minimum_level}
                                        onChange={(e) => setNewLocalPurchasing({...newLocalPurchasing, minimum_level: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newLocalPurchasing.lastrecieveddate || ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                             setNewLocalPurchasing({...newLocalPurchasing, lastrecieveddate: dateValue});
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddLocalPurchasing}>
                                Save
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search local purchasing..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">LP ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left">Last Received Date</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredLocalPurchasing.length > 0 ? (
                                    filteredLocalPurchasing.map((LocalPurchasing) => (
                                        <LocalPurchasingRow 
                                            key={LocalPurchasing.lp_id} 
                                            LocalPurchasing={LocalPurchasing} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 p-2 text-center">
                                            {LocalPurchasing.length === 0 ? 'No local purchasing available' : 'No matching local purchasing found'}
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

function LocalPurchasingRow({ LocalPurchasing, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocalPurchasing, setEditedSparePartsLocalPurchasing] = useState({
        quantity: LocalPurchasing?.quantity || 0,
        lastrecieveddate: LocalPurchasing?.lastrecieveddate || new Date().toISOString().split('T')[0]
    });

    const handleSave = () => {
        // Prepare update data with proper null handling
        const updateData = {
            quantity: editedLocalPurchasing.quantity,
            lastrecieveddate: editedLocalPurchasing.lastrecieveddate === '' ? null : editedLocalPurchasing.lastrecieveddate
        };
        onEdit(LocalPurchasing.lp_id, updateData);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{LocalPurchasing.lp_id}</td>
            <td className="border border-gray-300 p-2">{LocalPurchasing.name}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedLocalPurchasing.quantity}
                        onChange={(e) => setEditedSparePartsLocalPurchasing({...editedLocalPurchasing, quantity: e.target.value})}
                    />
                ) : (
                    LocalPurchasing.quantity
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedLocalPurchasing.lastrecieveddate}
                        onChange={(e) => setEditedSparePartsLocalPurchasing({...editedLocalPurchasing, lastrecieveddate: e.target.value})}
                    />
                ) : (
                    LocalPurchasing.lastrecieveddate ? new Date(LocalPurchasing.lastrecieveddate).toLocaleDateString() : 'N/A'
                )}
            </td>
            <td className="border border-gray-300 p-2 flex space-x-2">
                {isEditing ? (
                    <div className="flex space-x-2">
                        <button 
                            className="text-green-500 text-white px-2 py-1 rounded"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button 
                            className="text-gray-500 text-white px-2 py-1 rounded"
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
                        className="text-red-500 text-white px-2 py-1 rounded flex items-center"
                            onClick={() => onDelete(LocalPurchasing.lp_id)}
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