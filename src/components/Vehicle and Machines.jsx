import React, { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Edit, Trash} from 'react-feather';
import { Package, FileText, Users, Plus, LogOut, Grid, Shield } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function VehicleandMachines() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [VehicleandMachines, setVehicleandMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newVehicleandMachines, setNewVehicleandMachines] = useState({
        vm_id: '',
        name: '',
        quantity: '',
        minimum_level: '',
        lastrecieveddate: ''
    });

    const fetchVehicleandMachines = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }
    
          const response = await fetch('http://localhost:5000/api/vehicle-and-machines', {
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
            setVehicleandMachines(data);
        } else {
            throw new Error(data.message || 'Failed to fetch vehicle & machine');
        }
          if (!Array.isArray(data)) {
            throw new Error('Invalid data format received');
          }
    
          setVehicleandMachines(data);
          setError(null);
        } catch (err) {
          console.error('Fetch vehicle & machine error:', err);
          setError(err.message);
          setVehicleandMachines([]);
        } finally {
          setLoading(false);
        }
      };

    const handleAddVehicleandMachines = () => {
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newVehicleandMachines.tl_id || !newVehicleandMachines.name || !newVehicleandMachines.quantity) {
            alert('VM ID, Name, and Quantity are required fields');
            return;
        }
    
        // Prepare the data to send
        const VehicleandMachinesData = {
            vm_id: newVehicleandMachines.vm_id,
            name: newVehicleandMachines.name,
            quantity: parseInt(newVehicleandMachines.quantity),
            minimum_level: parseInt(newVehicleandMachines.minimum_level) || 1, // Default to 1 if not provided
            lastrecieveddate: newVehicleandMachines.lastrecieveddate || null // Change from current date to null
        };
    
        fetch('http://localhost:5000/api/vehicle-and-machines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(VehicleandMachinesData)
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Failed to add the vehicle & machine') });
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                fetchVehicleandMachines(); // Refresh the vehicle & machine list
                setIsAdding(false);
                setNewVehicleandMachines({
                    vm_id: '',
                    name: '',
                    quantity:'',
                    minimum_level: '',
                    lastrecieveddate: ''
                });
            }
        })
        .catch((error) => {
            console.error('Error adding the vehicle & machine:', error);
            alert(error.message || 'Error adding vehicle & machine');
        });
    };

    const handleEdit = (vm_id, updatedFields) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/vehicle-and-machines/${vm_id}`, {
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
                throw new Error(data.message || 'Failed to update vehicle & machine');
            }
            fetchVehicleandMachines(); // Refresh the list
            return data;
        })
        .catch((error) => {
            console.error('Error updating vehicle & machine:', error);
            alert(error.message || 'Error updating vehicle & machine. Please try again later.');
        });
    };

    const handleDelete = (vm_id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/vehicle-and-machines/${vm_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to delete vehicle & machine');
                setVehicleandMachines(VehicleandMachines.filter((vehicleandMachine) => vehicleandMachine.vm_id !== vm_id));
            })
            .catch((error) => {
                console.error('Error deleting vehicle & machine:', error);
                alert('Error deleting vehicle & machine. Please try again later.');
            });
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      };

    useEffect(() => {
        fetchVehicleandMachines();
    }, []);

    const filteredVehicleandMachines = VehicleandMachines.filter(vehicleandMachine => 
        (vehicleandMachine?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
        vehicleandMachine?.vm_id?.toString()?.includes(searchTerm)) ?? []
    );

    if (loading) {
        return <div>Loading vehicle & machine...</div>;
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
                <div className="Vehicle-and-Machines-page">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Vehicle & Machine</h1>
                        <div>
                        <button 
                                className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center"
                                onClick={() => setIsAdding(!isAdding)}
                            >
                                <Plus className="mr-1" size={16} />
                                {isAdding ? 'Cancel' : 'Add vehicle & machine'}
                            </button>
                        </div>
                    </div>

                    {isAdding && (
                        <div className="mb-4 p-4 border border-gray-300 rounded">
                            <h2 className="text-lg font-semibold mb-3">Add New Vehicle & Machine</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">VM ID</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newVehicleandMachines.vm_id}
                                        onChange={(e) => setNewVehicleandMachines({...newVehicleandMachines, vm_id: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vehicle & Machine Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newVehicleandMachines.name}
                                        onChange={(e) => setNewVehicleandMachines({...newVehicleandMachines, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newVehicleandMachines.quantity}
                                        onChange={(e) => setNewVehicleandMachines({...newVehicleandMachines, quantity: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minimum Level</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newVehicleandMachines.minimum_level}
                                        onChange={(e) => setNewVehicleandMachines({...newVehicleandMachines, minimum_level: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded"
                                        value={newVehicleandMachines.lastrecieveddate || ''}
                                        onChange={(e) => {
                                            const dateValue = e.target.value;
                                            setNewVehicleandMachines({...newVehicleandMachines, lastrecieveddate: dateValue});
                                        }}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleAddVehicleandMachines}>
                                Save vehicle & machine
                            </button>
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search vehicle & machines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-300 p-2 text-left">VM ID</th>
                                    <th className="border border-gray-300 p-2 text-left">Name</th>
                                    <th className="border border-gray-300 p-2 text-left">Quantity</th>
                                    <th className="border border-gray-300 p-2 text-left">Last Received Date</th>
                                    <th className="border border-gray-300 p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredVehicleandMachines.length > 0 ? (
                                    filteredVehicleandMachines.map((vehicleandMachine) => (
                                        <VehicleandMachinesRow 
                                            key={vehicleandMachine.vm_id} 
                                            vehicleandMachine={vehicleandMachine} 
                                            onEdit={handleEdit} 
                                            onDelete={handleDelete} 
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 p-2 text-center">
                                            {VehicleandMachines.length === 0 ? 'No vehicle & machine available' : 'No matching vehicle & machine found'}
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

function VehicleandMachinesRow({ vehicleandMachine, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedVehicleandMachines, setEditedVehicleandMachines] = useState({
        quantity: vehicleandMachine?.quantity || 0,
        lastrecieveddate: vehicleandMachine?.lastrecieveddate || new Date().toISOString().split('T')[0]
    });

    const handleSave = () => {
        // Prepare update data with proper null handling
        const updateData = {
            quantity: editedVehicleandMachines.quantity,
            lastrecieveddate: editedVehicleandMachines.lastrecieveddate === '' ? null : editedVehicleandMachines.lastrecieveddate
        };
        
        onEdit(vehicleandMachine.vm_id, updateData);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 p-2">{vehicleandMachine.vm_id}</td>
            <td className="border border-gray-300 p-2">{vehicleandMachine.name}</td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="number"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedVehicleandMachines.quantity}
                        onChange={(e) => setEditedVehicleandMachines({ ...editedVehicleandMachines, quantity: e.target.value })}
                    />
                ) : (
                    vehicleandMachine.quantity
                )}
            </td>
            <td className="border border-gray-300 p-2">
                {isEditing ? (
                    <input
                        type="date"
                        className="w-full p-1 border border-gray-300 rounded"
                        value={editedVehicleandMachines.lastrecieveddate}
                        onChange={(e) => setEditedVehicleandMachines({ ...editedVehicleandMachines, lastrecieveddate: e.target.value })}
                    />
                ) : (
                    vehicleandMachine.lastrecieveddate ? new Date(vehicleandMachine.lastrecieveddate).toLocaleDateString() : 'Never'
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
                            onClick={() => onDelete(vehicleandMachine.vm_id)}
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