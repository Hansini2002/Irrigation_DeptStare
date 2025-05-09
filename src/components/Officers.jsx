import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Edit, Trash} from 'react-feather';
import { Package, FileText, Users, Plus, LogOut, Grid, Shield, Contact } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function Officers() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newOfficer, setNewOfficer] = useState({
        officer_id: '',
        officer_name: '',
        designation: '',
        gender: '',
        started_date: '',
        end_date: '',
        city: '',
        Contact: ''
    });

    const fetchOfficers = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
    
          const response = await fetch('http://localhost:5000/api/officers', {
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
            setOfficers(data);
        } else {
            throw new Error(data.message || 'Failed to fetch Officers');
        }
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
          }
    
          setOfficers(data);
          setError(null);
        } catch (err) {
          console.error('Fetch Officers error:', err);
          setError(err.message);
          setOfficers([]);
        } finally {
          setLoading(false);
        }
      };

    const handleAddOfficers = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newOfficer.officer_id || !newOfficer.officer_name || !newOfficer.designation || !newOfficer.gender || !newOfficer.started_date || !newOfficer.city) {
            alert('Officer Id, Name, Designation, Gender, Started Date and City are required fields');
            return;
        }
    
        // Prepare the data to send
        const OfficersData = {
            officer_id: newOfficer.officer_id,
            officer_name: newOfficer.officer_name,
            designation: newOfficer.designation,
            gender: newOfficer.gender,
            started_date: newOfficer.started_date || null, // Change from current date to null
            end_date: newOfficer.end_date || null, // Change from current date to null
            city: newOfficer.city,
            Contact: newOfficer.Contact
        };
    
        fetch('http://localhost:5000/api/officers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(OfficersData)
        })
        .then(async (response) => {
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to add the Officer');
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchOfficers(); // Refresh the Officers list
                setIsAdding(false);
                setNewOfficer({
                    officer_id: '',
                    officer_name: '',
                    designation: '',
                    gender: '',
                    started_date: '',
                    end_date: '',
                    city: '',
                    Contact: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the Officer:', error);
            alert(error.message || 'Error adding Officer');
        });
    };

    const handleEdit = (officer_id, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/officers/${officer_id}`, {
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
                throw new Error(data.message || 'Failed to update Officer');
            }
            fetchOfficers(); // Refresh the list
            return data;
        })
        .catch((error) => {
            console.error('Error updating Officer:', error);
            alert(error.message || 'Error updating Officer. Please try again later.');
        });
    };

    const handleDelete = (officer_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/officers/${officer_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete Officer');
                setOfficers(officers.filter((officer) => officer.officer_id !== officer_id));
            })
            .catch((error) => {
                console.error('Error deleting Officer:', error);
                alert('Error deleting Officer. Please try again later.');
            });
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      };

    useEffect(() => {
        fetchOfficers();
    }, []);

    const filteredOfficers = officers.filter(officer => 
        (officer?.officer_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        officer?.officer_id?.toString()?.includes(searchTerm)) ?? []
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
                            <div className="flex items-center px-4 py-3 bg-blue-400 text-black-900 rounded-lg mx-2"
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
                <div className="Officers-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Officers</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add Officer'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Officer</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Officer ID</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.officer_id}
                                        onChange={(e) => setNewOfficer({...newOfficer, officer_id: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Officer Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.officer_name}
                                        onChange={(e) => setNewOfficer({...newOfficer, officer_name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Designation</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.designation}
                                        onChange={(e) => setNewOfficer({...newOfficer, designation: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Gender</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.gender}
                                        onChange={(e) => setNewOfficer({...newOfficer, gender: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Started Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.started_date || ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            setNewOfficer({...newOfficer, started_date: dateValue});
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.end_date || ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            setNewOfficer({...newOfficer, end_date: dateValue});
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.city}
                                        onChange={(e) => setNewOfficer({...newOfficer, city: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact No.</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newOfficer.Contact}
                                        onChange={(e) => setNewOfficer({...newOfficer, Contact: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddOfficers}>
                                Save Officer
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search Officer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">Officer ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Officer Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Designation</th>
                                    <th className="border border-gray-300 p-2 text-left">Gender</th>
                                    <th className="border border-gray-300 p-2 text-left">Started Date</th>
                                    <th className="border border-gray-300 p-2 text-left">End Date</th>
                                    <th className="border border-gray-300 p-2 text-left">City</th>
                                    <th className="border border-gray-300 p-2 text-left">Contact No.</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredOfficers.length > 0 ? (
                                    filteredOfficers.map((officer) => (
                                        <OfficersRow 
                                            key={officer.officer_id} 
                                            officer={officer} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="border border-gray-300 p-2 text-center">
                                            {officers.length === 0 ? 'No Officers available' : 'No matching Officer found'}
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

function OfficersRow({ officer, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedOfficers, setEditedOfficers] = useState({
        designation: officer?.designation,
        end_date: officer?.end_date || new Date().toISOString().split('T')[0],
        city: officer?.city,
        Contact: officer?.Contact // Assuming Contact is not editable here
    });

    const handleSave = () => {
        // Prepare update data with proper null handling
        const updateData = {
            designation: editedOfficers.designation,
            end_date: editedOfficers.end_date === '' ? null : editedOfficers.end_date,
            city: editedOfficers.city,
            Contact: officer.Contact // Assuming Contact is not editable here
        };
        
        onEdit(officer.officer_id, updateData);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{officer.officer_id}</td>
            <td className="border border-gray-300 p-2">{officer.officer_name}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficers.designation}
                        onChange={(e) => setEditedOfficers({ ...editedOfficers, designation: e.target.value })}
                    />
                ) : (
                    officer.designation
                )}
            </td>
            <td className="border border-gray-300 p-2">{officer.gender}</td>
            <td className="border border-gray-300 p-2">
                {officer.started_date ? new Date(officer.started_date).toLocaleDateString() : 'N/A'}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficers.end_date}
                        onChange={(e) => setEditedOfficers({ ...editedOfficers, end_date: e.target.value })}
                    />
                ) : (
                    officer.end_date ? new Date(officer.end_date).toLocaleDateString() : 'N/A'
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficers.city}
                        onChange={(e) => setEditedOfficers({ ...editedOfficers, city: e.target.value })}
                    />
                ) : (
                    officer.city
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedOfficers.Contact}
                        onChange={(e) => setEditedOfficers({ ...editedOfficers, Contact: e.target.value })}
                    />
                ) : (
                    officer.Contact
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
                            onClick={() => onDelete(officer.officer_id)}
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