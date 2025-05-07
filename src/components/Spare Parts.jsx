import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Edit, Trash} from 'react-feather';
import { Package, FileText, Users, Plus, LogOut, Grid, Shield } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function SpareParts() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [SpareParts, setSpareParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newSpareParts, setNewSpareParts] = useState({
        sp_id: '',
        name: '',
        quantity: '',
        minimum_level: '',
        lastrecieveddate: ''
    });

    const fetchSpareParts = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
    
          const response = await fetch('http://localhost:5000/api/spare-parts', {
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
            setSpareParts(data);
        } else {
            throw new Error(data.message || 'Failed to fetch spare parts');
        }
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
          }
    
          setSpareParts(data);
          setError(null);
        } catch (err) {
          console.error('Fetch spare parts error:', err);
          setError(err.message);
          setSpareParts([]);
        } finally {
          setLoading(false);
        }
      };

    const handleAddSpareParts = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newSpareParts.sp_id || !newSpareParts.name || !newSpareParts.quantity) {
            alert('SP ID, Name, and Quantity are required fields');
            return;
        }
    
        // Prepare the data to send
        const SparePartsData = {
            sp_id: newSpareParts.sp_id,
            name: newSpareParts.name,
            quantity: parseInt(newSpareParts.quantity),
            minimum_level: parseInt(newSpareParts.minimum_level) || 1, // Default to 1 if not provided
            lastrecieveddate: newSpareParts.lastrecieveddate || null // Change from current date to null
        };
    
        fetch('http://localhost:5000/api/spare-parts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(SparePartsData)
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Failed to add the spare part') });
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchSpareParts(); // Refresh the spare parts list
                setIsAdding(false);
                setNewSpareParts({
                    sp_id: '',
                    name: '',
                    quantity:'',
                    minimum_level: '',
                    lastrecieveddate: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the spare part:', error);
            alert(error.message || 'Error adding spare part');
        });
    };

    const handleEdit = (sp_id, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/spare-parts/${sp_id}`, {
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
                throw new Error(data.message || 'Failed to update spare part');
            }
            fetchSpareParts(); // Refresh the list
            return data;
        })
        .catch((error) => {
            console.error('Error updating spare part:', error);
            alert(error.message || 'Error updating spare part. Please try again later.');
        });
    };

    const handleDelete = (sp_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/spare-parts/${sp_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete spare part');
                setSpareParts(SpareParts.filter((SparePart) => SparePart.sp_id !== sp_id));
            })
            .catch((error) => {
                console.error('Error deleting spare part:', error);
                alert('Error deleting spare part. Please try again later.');
            });
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      };

    useEffect(() => {
        fetchSpareParts();
    }, []);

    const filteredSpareParts = SpareParts.filter(SparePart => 
        (SparePart?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        SparePart?.sp_id?.toString()?.includes(searchTerm)) ?? []
    );

    if (loading) {
        return <div>Loading spare parts...</div>;
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
                <div className="SpareParts-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Spare Parts</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add Spare Part'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Spare Part</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">SP_ID</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSpareParts.sp_id}
                                        onChange={(e) => setNewSpareParts({...newSpareParts, sp_id: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Spare Part Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSpareParts.name}
                                        onChange={(e) => setNewSpareParts({...newSpareParts, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSpareParts.quantity}
                                        onChange={(e) => setNewSpareParts({...newSpareParts, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minimum Level</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSpareParts.minimum_level}
                                        onChange={(e) => setNewSpareParts({...newSpareParts, minimum_level: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newSpareParts.lastrecieveddate || ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            setNewSpareParts({...newSpareParts, lastrecieveddate: dateValue});
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddSpareParts}>
                                Save Spare Part
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search spare parts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">SP ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Spare Part Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left">Last Received Date</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredSpareParts.length > 0 ? (
                                    filteredSpareParts.map((SparePart) => (
                                        <SparePartsRow 
                                            key={SparePart.sp_id} 
                                            SparePart={SparePart} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 p-2 text-center">
                                            {SpareParts.length === 0 ? 'No spare part available' : 'No matching spare part found'}
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

function SparePartsRow({ SparePart, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSpareParts, setEditedSpareParts] = useState({
        quantity: SparePart?.quantity || 0,
        lastrecieveddate: SparePart?.lastrecieveddate || new Date().toISOString().split('T')[0]
    });

    const handleSave = () => {
        // Prepare update data with proper null handling
        const updateData = {
            quantity: editedSpareParts.quantity,
            lastrecieveddate: editedSpareParts.lastrecieveddate === '' ? null : editedSpareParts.lastrecieveddate
        };
        
        onEdit(SparePart.sp_id, updateData);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{SparePart.sp_id}</td>
            <td className="border border-gray-300 p-2">{SparePart.name}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedSpareParts.quantity}
                        onChange={(e) => setEditedSpareParts({ ...editedSpareParts, quantity: e.target.value })}
                    />
                ) : (
                    SparePart.quantity
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedSpareParts.lastrecieveddate}
                        onChange={(e) => setEditedSpareParts({ ...editedSpareParts, lastrecieveddate: e.target.value })}
                    />
                ) : (
                    SparePart.lastrecieveddate ? new Date(SparePart.lastrecieveddate).toLocaleDateString() : 'Never'
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
                            onClick={() => onDelete(SparePart.sp_id)}
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