import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Grid, FileText, Package, Users, Edit, Trash, Plus } from 'react-feather';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function StationaryPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [stationary, setStationary] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newStationary, setNewStationary] = useState({
        name: '',
        quantity: '',
        minimum_level: '',
        lastrecieveddate: ''
    });

    const fetchStationary = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/stationary', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => setStationary(data))
            .catch((error) => console.error('Error fetching stationaries:', error));
    };

    const handleAddStationary = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newStationary.name || !newStationary.quantity) {
            alert('Name and Quantity are required fields');
            return;
        }
    
        // Prepare the data to send
        const StationaryData = {
            name: newStationary.name,
            quantity: parseInt(newStationary.quantity),
            minimum_level: parseInt(newStationary.minimum_level) || 1, // Default to 1 if not provided
            lastrecieveddate: newStationary.lastrecieveddate || new Date().toISOString().split('T')[0]
        };
    
        fetch('http://localhost:5000/api/stationary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(StationaryData)
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Failed to add the stationary') });
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchStationary(); // Refresh the stationary list
                setIsAdding(false);
                setNewStationary({
                    name: '',
                    quantity: '',
                    minimum_level: '',
                    lastrecieveddate: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the stationary:', error);
            alert(error.message || 'Error adding stationary');
        });
    };

    const handleEdit = (ST_ID, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/stationary/${ST_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedFields)
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to update stationary');
                fetchStationary();
            })
            .catch((error) => console.error('Error updating stationary:', error));
    };

    const handleDelete = (ST_ID) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/stationary/${ST_ID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete stationary');
                setStationary(stationary.filter((stationary) => stationary.ST_ID !== ST_ID));
            })
            .catch((error) => console.error('Error deleting stationary:', error));
    };

    useEffect(() => {
        fetchStationary();
    }, []);

    const filteredStationary = stationary.filter(stationary => 
        stationary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stationary.ST_ID.toString().includes(searchTerm)
    );

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
                                onClick={() => navigate('/dashboard')}
                            >
                                <Grid className="mr-3" size={20} />
                                <span>Dashboard</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div
                                className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                                onClick={() => navigate('/stock-details')}
                            >
                                <FileText className="mr-3" size={20} />
                                <span>Reports & Forms</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div
                                className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                                onClick={() => navigate('/inventory-book')}
                            >
                                <Package className="mr-3" size={20} />
                                <span>Inventory Book</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div
                                className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
                                onClick={() => navigate('/suppliers')}
                            >
                                <Users className="mr-3" size={20} />
                                <span>Suppliers</span>
                            </div>
                        </li>
                    </ul>
                </nav>

                {/* Calendar Section */}
                <div className="mt-auto p-2">
                    <div className="bg-yellow-400 rounded-t-lg p-2">
                        <img src={CalendarImage} alt="Calendar Image" className="w-full h-24 object-cover rounded" />
                        <div className="text-center font-bold text-green-800 py-2">January</div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 text-xs text-center">
                            <div className="py-1">M</div>
                            <div className="py-1">T</div>
                            <div className="py-1">W</div>
                            <div className="py-1">T</div>
                            <div className="py-1">F</div>
                            <div className="py-1">S</div>
                            <div className="py-1">S</div>

                            {/* Calendar dates - simplified representation */}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <div key={i} className={`py-1 ${i < 5 ? 'text-gray-500' : ''}`}>
                                    {i + 1 <= 31 ? i + 1 : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white rounded-l-lg p-4">
                <div className="stationary-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Stationary</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add Stationary'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Stationary</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newStationary.name}
                                        onChange={(e) => setNewStationary({...newStationary, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newStationary.quantity}
                                        onChange={(e) => setNewStationary({...newStationary, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minimum Level</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newStationary.minimum_level}
                                        onChange={(e) => setNewStationary({...newStationary, minimum_level: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newStationary.lastrecieveddate}
                                        onChange={(e) => setNewStationary({...newStationary, lastrecieveddate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddStationary}>
                                Save
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search stationary..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">ST ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left">Last Received Date</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredStationary.length > 0 ? (
                                    filteredStationary.map((stationary) => (
                                        <StationaryRow 
                                            key={stationary.ST_ID} 
                                            stationary={stationary} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 p-2 text-center">
                                            {stationary.length === 0 ? 'No stationary available' : 'No matching stationary found'}
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

function StationaryRow({ stationary, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStationary, setEditedStationary] = useState({...stationary});

    const handleSave = () => {
        onEdit(stationary.ST_ID, editedStationary);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{stationary.ST_ID}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedStationary.name}
                        onChange={(e) => setEditedStationary({...editedStationary, name: e.target.value})}
                    />
                ) : (
                    stationary.name
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedStationary.quantity}
                        onChange={(e) => setEditedStationary({...editedStationary, quantity: e.target.value})}
                    />
                ) : (
                    stationary.quantity
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedStationary.minimum_level}
                        onChange={(e) => setEditedStationary({...editedStationary, minimum_level: e.target.value})}
                    />
                ) : (
                    stationary.minimum_level                
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedStationary.lastrecieveddate ? editedStationary.lastrecieveddate.split('T')[0] : ''}
                        onChange={(e) => setEditedStationary({...editedStationary, lastrecieveddate: e.target.value})}
                    />
                ) : (
                    stationary.lastrecieveddate ? new Date(stationary.lastrecieveddate).toLocaleDateString() : 'N/A'
                )}
            </td>
            <td className="border border-gray-300 p-2 flex space-x-2">
                {isEditing ? (
                    <>
                        <button 
                            className="text-green-500 cursor-pointer"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button 
                            className="text-gray-500 cursor-pointer"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <Edit
                            className="text-blue-500 cursor-pointer"
                            size={16}
                            onClick={() => setIsEditing(true)}
                        />
                        <Trash
                            className="text-red-500 cursor-pointer"
                            size={16}
                            onClick={() => onDelete(stationary.ST_ID)}
                        />
                    </>
                )}
            </td>
        </tr>
    );
}