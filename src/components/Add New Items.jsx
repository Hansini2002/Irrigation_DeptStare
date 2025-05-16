import { useState, useEffect } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import { Package, FileText, Users, LogOut, Grid, ChevronLeft } from 'lucide-react';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { useNavigate } from 'react-router-dom';

export default function AddNewItemsPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [newItem, setNewItem] = useState({
        item_id: '',
        name: '',
        category: '',
        quantity: '',
        minimum_level: '',
        lastreceiveddate: '',
        unit_price: ''
    });

    // Fetch categories from API
    const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log('Categories data:', data); // Debug log

        if (!Array.isArray(data)) {
        throw new Error('Expected an array of categories');
        }
        setCategories(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        // Validate required fields
        if (!newItem.item_id || !newItem.name || !newItem.category || !newItem.quantity || !newItem.unit_price) {
            alert('Item ID, Name, Category, Quantity and Unit Price are required fields');
            return;
        }

        // Prepare the data to send
        const itemData = {
            item_id: newItem.item_id,
            name: newItem.name,
            category: newItem.category,
            quantity: parseInt(newItem.quantity),
            minimum_level: parseInt(newItem.minimum_level) || 1,
            lastreceiveddate: newItem.lastreceiveddate || null,
            unit_price: parseFloat(newItem.unit_price)
        };

        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to add the item');
            }

            if (data.success) {
                // Show success message and reset form
                setSuccessMessage('Item added successfully!');
                setNewItem({
                    item_id: '',
                    name: '',
                    category: '',
                    quantity: '',
                    minimum_level: '',
                    lastreceiveddate: '',
                    unit_price: ''
                });
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Detailed error:', error);
            alert(error.message || 'Error adding item. Please check console for details.');
        }
    };

    const handleBackClick = () => {
        navigate(-1); // Go back to previous page
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return <div>Loading categories...</div>;
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
                <div className="add-item-page">
                    <div className="flex items-center">
                        <button onClick={handleBackClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Add New Item</h1>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleAddItem} className="p-4 border border-gray-300 rounded">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Item ID*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.item_id}
                                    onChange={(e) => setNewItem({...newItem, item_id: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Item Name*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category*</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.category_id} value={category.category_name}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity*</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Minimum Level</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.minimum_level}
                                    onChange={(e) => setNewItem({...newItem, minimum_level: e.target.value})}
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Received Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.lastreceiveddate || ''}
                                    onChange={(e) => {
                                        const dateValue = e.target.value;
                                        setNewItem({...newItem, lastreceiveddate: dateValue});
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Unit price*</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={newItem.unit_price}
                                    onChange={(e) => setNewItem({...newItem, unit_price: e.target.value})}
                                    min="1"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save Item
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}