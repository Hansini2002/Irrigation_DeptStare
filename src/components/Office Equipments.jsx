import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Edit, Trash} from 'react-feather';
import { Package, FileText, Users, Plus, LogOut, Grid, Shield } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function OfficeEquipments() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [OfficeEquipments, setOfficeEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newOfficeEquipments, setNewOfficeEquipments] = useState({
        oe_id: '',
        name: '',
        quantity: '',
        minimum_level: '',
        lastrecieveddate: ''
    });

    const fetchOfficeEquipments = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
    
          const response = await fetch('http://localhost:5000/api/office-equipments', {
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
            setOfficeEquipments(data);
        } else {
            throw new Error(data.message || 'Failed to fetch office equipments');
        }
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
          }
    
          setOfficeEquipments(data);
          setError(null);
        } catch (err) {
          console.error('Fetch office equipments error:', err);
          setError(err.message);
          setOfficeEquipments([]);
        } finally {
          setLoading(false);
        }
      };

    const handleAddOfficeEquipments = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newOfficeEquipments.tl_id || !newOfficeEquipments.name || !newOfficeEquipments.quantity) {
            alert('OE ID, Name, and Quantity are required fields');
            return;
        }
    
        // Prepare the data to send
        const OfficeEquipmentsData = {
            oe_id: newOfficeEquipments.oe_id,
            name: newOfficeEquipments.name,
            quantity: parseInt(newOfficeEquipments.quantity),
            minimum_level: parseInt(newOfficeEquipments.minimum_level) || 1, // Default to 1 if not provided
            lastrecieveddate: newOfficeEquipments.lastrecieveddate || null // Change from current date to null
        };
    
        fetch('http://localhost:5000/api/office-equipments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(OfficeEquipmentsData)
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Failed to add the office equipment') });
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchOfficeEquipments(); // Refresh the office equipments list
                setIsAdding(false);
                setNewOfficeEquipments({
                    oe_id: '',
                    name: '',
                    quantity:'',
                    minimum_level: '',
                    lastrecieveddate: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the office equipment:', error);
            alert(error.message || 'Error adding office equipment');
        });
    };

    const handleEdit = (oe_id, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/office-equipments/${oe_id}`, {
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
                throw new Error(data.message || 'Failed to update office equipment');
            }
            fetchOfficeEquipments(); // Refresh the list
            return data;
        })
        .catch((error) => {
            console.error('Error updating office equipment:', error);
            alert(error.message || 'Error updating office equipment. Please try again later.');
        });
    };

    const handleDelete = (oe_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/office-equipments/${oe_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete office equipment');
                setOfficeEquipments(OfficeEquipments.filter((officeEquipment) => officeEquipment.oe_id !== oe_id));
            })
            .catch((error) => {
                console.error('Error deleting office equipment:', error);
                alert('Error deleting office equipment. Please try again later.');
            });
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      };

    useEffect(() => {
        fetchOfficeEquipments();
    }, []);

    const filteredOfficeEquipments = OfficeEquipments.filter(officeEquipment => 
        (officeEquipment?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        officeEquipment?.oe_id?.toString()?.includes(searchTerm)) ?? []
    );

    if (loading) {
        return <div>Loading tools...</div>;
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
                <div className="Office-Equipments-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Office Equipments</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add Office Equipment'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Office Equipment</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">OE ID</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficeEquipments.oe_id}
                                        onChange={(e) => setNewOfficeEquipments({...newOfficeEquipments, oe_id: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Office Equipment Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficeEquipments.name}
                                        onChange={(e) => setNewOfficeEquipments({...newOfficeEquipments, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficeEquipments.quantity}
                                        onChange={(e) => setNewOfficeEquipments({...newOfficeEquipments, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minimum Level</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficeEquipments.minimum_level}
                                        onChange={(e) => setNewOfficeEquipments({...newOfficeEquipments, minimum_level: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficeEquipments.lastrecieveddate || ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            setNewOfficeEquipments({...newOfficeEquipments, lastrecieveddate: dateValue});
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddOfficeEquipments}>
                                Save Tool
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search Office Equipments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">OE ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left">Last Received Date</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredOfficeEquipments.length > 0 ? (
                                    filteredOfficeEquipments.map((officeEquipment) => (
                                        <OfficeEquipmentsRow 
                                            key={officeEquipment.oe_id} 
                                            officeEquipment={officeEquipment} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 p-2 text-center">
                                            {OfficeEquipments.length === 0 ? 'No office equipments available' : 'No matching office equipment found'}
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

function OfficeEquipmentsRow({ officeEquipment, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedOfficeEquipments, setEditedOfficeEquipments] = useState({
        quantity: officeEquipment?.quantity || 0,
        lastrecieveddate: officeEquipment?.lastrecieveddate || new Date().toISOString().split('T')[0]
    });

    const handleSave = () => {
        // Prepare update data with proper null handling
        const updateData = {
            quantity: editedOfficeEquipments.quantity,
            lastrecieveddate: editedOfficeEquipments.lastrecieveddate === '' ? null : editedOfficeEquipments.lastrecieveddate
        };
        
        onEdit(officeEquipment.oe_id, updateData);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{officeEquipment.oe_id}</td>
            <td className="border border-gray-300 p-2">{officeEquipment.name}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficeEquipments.quantity}
                        onChange={(e) => setEditedOfficeEquipments({ ...editedOfficeEquipments, quantity: e.target.value })}
                    />
                ) : (
                    officeEquipment.quantity
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficeEquipments.lastrecieveddate}
                        onChange={(e) => setEditedOfficeEquipments({ ...editedOfficeEquipments, lastrecieveddate: e.target.value })}
                    />
                ) : (
                    officeEquipment.lastrecieveddate ? new Date(officeEquipment.lastrecieveddate).toLocaleDateString() : 'Never'
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
                            onClick={() => onDelete(officeEquipment.oe_id)}
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