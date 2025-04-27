import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Grid, FileText, Package, Users, Edit, Trash, Plus } from 'react-feather';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function OfficeEquipments() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [officeEquipments, setOfficeEquipments] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newOfficeEquipments, setNewOfficeEquipments] = useState({
        name: '',
        quantity: '',
        minimum_level: '',
        lastrecieveddate: ''
    });

    const fetchOfficeEquipments = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:5000/api/office-equipments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then((data) => setOfficeEquipments(data))
            .catch((error) => console.error('Error fetching office equipments:', error));
    };

    const handleAddOfficeEquipments = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newOfficeEquipments.name || !newOfficeEquipments.quantity) {
            alert('Name and Quantity are required fields');
            return;
        }
    
        // Prepare the data to send
        const OfficeEquipmentsData = {
            name: newOfficeEquipments.name,
            quantity: parseInt(newOfficeEquipments.quantity),
            minimum_level: parseInt(newOfficeEquipments.minimum_level) || 1, // Default to 1 if not provided
            lastrecieveddate: newOfficeEquipments.lastrecieveddate || new Date().toISOString().split('T')[0]
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
                return response.json().then(err => { throw new Error(err.message || 'Failed to add the office equipments') });
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchOfficeEquipments(); // Refresh the office equipments list
                setIsAdding(false);
                setNewOfficeEquipments({
                    name: '',
                    quantity: '',
                    minimum_level: '',
                    lastrecieveddate: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the office equipments:', error);
            alert(error.message || 'Error adding office equipments');
        });
    };

    const handleEdit = (OE_ID, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/office-equipments/${OE_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedFields)
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to update office equipment');
                fetchOfficeEquipments();
            })
            .catch((error) => console.error('Error updating office equipment:', error));
    };

    const handleDelete = (OE_ID) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/office-equipments/${OE_ID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete office equipments');
                setOfficeEquipments(officeEquipments.filter((officeEquipments) => officeEquipments.OE_ID !== OE_ID));
            })
            .catch((error) => console.error('Error deleting office equipments:', error));
    };

    useEffect(() => {
        fetchOfficeEquipments();
    }, []);

    const filteredOfficeEquipments = officeEquipments.filter(officeEquipments => 
        officeEquipments.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officeEquipments.OE_ID.toString().includes(searchTerm)
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
                <div className="office-equipments-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Office Equipments</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add Office Equipments'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Office Equipments</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
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
                                        value={newOfficeEquipments.lastrecieveddate}
                                        onChange={(e) => setNewOfficeEquipments({...newOfficeEquipments, lastrecieveddate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddOfficeEquipments}>
                                Save
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search office equipments..."
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
                                    filteredOfficeEquipments.map((officeEquipments) => (
                                        <OfficeEquipmentsRow 
                                            key={officeEquipments.OE_ID} 
                                            officeEquipments={officeEquipments} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 p-2 text-center">
                                            {officeEquipments.length === 0 ? 'No office equipments available' : 'No matching office equipments found'}
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

function OfficeEquipmentsRow({ officeEquipments, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedOfficeEquipments, setEditedOfficeEquipments] = useState({...officeEquipments});

    const handleSave = () => {
        onEdit(officeEquipments.OE_ID, editedOfficeEquipments);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{officeEquipments.OE_ID}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficeEquipments.name}
                        onChange={(e) => setEditedOfficeEquipments({...editedOfficeEquipments, name: e.target.value})}
                    />
                ) : (
                    officeEquipments.name
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficeEquipments.quantity}
                        onChange={(e) => setEditedOfficeEquipments({...editedOfficeEquipments, quantity: e.target.value})}
                    />
                ) : (
                    officeEquipments.quantity
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficeEquipments.minimum_level}
                        onChange={(e) => setEditedOfficeEquipments({...editedOfficeEquipments, minimum_level: e.target.value})}
                    />
                ) : (
                    officeEquipments.minimum_level                
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficeEquipments.lastrecieveddate ? editedOfficeEquipments.lastrecieveddate.split('T')[0] : ''}
                        onChange={(e) => setEditedOfficeEquipments({...editedOfficeEquipments, lastrecieveddate: e.target.value})}
                    />
                ) : (
                    officeEquipments.lastrecieveddate ? new Date(officeEquipments.lastrecieveddate).toLocaleDateString() : 'N/A'
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
                            onClick={() => onDelete(officeEquipments.OE_ID)}
                        />
                    </>
                )}
            </td>
        </tr>
    );
}