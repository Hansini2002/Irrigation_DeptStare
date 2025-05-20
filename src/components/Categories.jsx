import React, { useEffect, useState } from 'react';
import logoImage from '../assets/freepik_br_570104c6-d98a-4035-a430-35ecf67600ef.png';
import CalendarImage from '../assets/Deduru Oya.jpg';
import { Package, FileText, Users, Plus, LogOut, Grid, ChevronLeft, ChevronRight, X, Trash2, Edit, Save, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Categories() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryItems, setCategoryItems] = useState({}); 
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({
        quantity: '',
        lastreceiveddate: '',
        unit_price: ''
    });
    
    useEffect(() => {
        fetchCategories();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            const categories = Array.isArray(data) ? data : data.categories || [];
            setCategories(categories);
            
            // Fetch items for each category
            const itemsData = {};
            for (const category of categories) {
                const itemsResponse = await fetch(`http://localhost:5000/api/items/category/${category.category_name}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (itemsResponse.ok) {
                    const items = await itemsResponse.json();
                    itemsData[category.category_name] = Array.isArray(items) ? items : items.items || [];
                }
            }
            setCategoryItems(itemsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data');
        }
    };

    const handleCategoryClick = (category_id) => {
        setActiveCategory(activeCategory === category_id ? null : category_id);
    };

    const handleBackClick = () => {
        navigate(-1);
    };
  
    const handleAddCategory = () => {
        setShowAddModal(true);
    };

    const handleSubmitNewCategory = async (e) => {
        e.preventDefault();
        
        if (!newCategoryName.trim()) {
            alert('Category name cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ category_name: newCategoryName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add category');
            }

            await fetchCategories();
            setNewCategoryName('');
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding category:', error);
            alert(error.message);
        }
    };

     const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDeleteCategory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${categoryToDelete.category_name}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete category');
            }

            await fetchCategories();
            setShowDeleteModal(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(`Error deleting category: ${error.message}`);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item.item_id);
        setEditFormData({
            quantity: item.quantity,
            lastreceiveddate: item.lastreceiveddate === 'N/A' ? '' : item.lastreceiveddate,
            unit_price: item.unit_price
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleSaveEdit = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    quantity: editFormData.quantity,
                    lastreceiveddate: editFormData.lastreceiveddate || null,
                    unit_price: editFormData.unit_price
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update item');
            }

            // Refresh the data
            await fetchCategories();
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
            alert(`Error updating item: ${error.message}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleDeleteItemClick = (item) => {
        setItemToDelete(item);
        setShowDeleteItemModal(true);
    };

    const confirmDeleteItem = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/items/${itemToDelete.item_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete item');
            }

            // Refresh the data
            await fetchCategories();
            setShowDeleteItemModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Error deleting item:', error);
            alert(`Error deleting item: ${error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === 'NULL' || dateString === 'null') {
            return 'N/A';
        }
        
        try {
            // MySQL dates come in YYYY-MM-DD format
            const [year, month, day] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error, 'Value:', dateString);
            return 'N/A';
        }
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
                                onClick={() => navigate('/stock-details')}>
                                <FileText className="mr-3" size={20} />
                                <span>Reports & Forms</span>
                            </div>
                        </li>
                        <li className="mb-1">
                            <div className="flex items-center px-4 py-3 hover:bg-green-600 text-black rounded-lg mx-2"
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
                                    <div
                                        key={i}
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
                    <button 
                        onClick={handleLogout}
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
                        <button 
                            onClick={handleBackClick}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Store Item Categories</h1>
                    </div>
                    
                    <button 
                        onClick={handleAddCategory}
                        className="bg-green-600 flex items-center px-4 py-3 hover:bg-green-500 text-white rounded-lg">
                        <Plus className='mr-3' size={24} />
                        <span>Add New Category</span>
                    </button>
                </div>
                    
                {/* Categories list */}
                <div className="space-y-4">
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <div key={category.category_name || `cat-${index}`}>
                                <div
                                    onClick={() => handleCategoryClick(category.category_name)}
                                    className={`
                                        flex justify-between items-center p-4 rounded-md cursor-pointer
                                        border border-gray-200 transition-all duration-200
                                        ${activeCategory === category.category_name ? 
                                        'bg-green-100 border-green-500 transform translate-y-[-2px] shadow-md' : 
                                        'hover:bg-gray-50'
                                        }
                                    `}>
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full bg-yellow-300 mr-4 ${activeCategory === category.category_id ? 'scale-110' : ''}`}></div>
                                        <span className="text-xl text-gray-700">{category.category_name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(category);
                                            }}
                                            className="p-2 mr-2 text-red-600 hover:bg-red-50 rounded-full"
                                            title="Delete category">
                                            <Trash2 size={20} />
                                        </button>
                                        <ChevronRight 
                                            size={24} 
                                            className={`text-gray-400 transition-transform ${activeCategory === category.category_name ? 'rotate-90' : ''}`}/>
                                    </div>
                                </div>
                                
                                {/* Items list for this category */}
                                {activeCategory === category.category_name && (
                                    <div className="ml-12 mt-2 border-l-2 border-green-200 pl-4">
                                        {categoryItems[category.category_name]?.length > 0 ? (
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="p-2 text-left border">Item ID</th>
                                                        <th className="p-2 text-left border">Name</th>
                                                        <th className="p-2 text-left border">Quantity</th>
                                                        <th className="p-2 text-left border">Last Received Date</th>
                                                        <th className="p-2 text-left border">Unit Price(Rs.)</th>
                                                        <th className="p-2 text-left border">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {categoryItems[category.category_name].map((item) => (
                                                        <tr key={item.item_id} className="hover:bg-gray-50">
                                                            <td className="p-2 border">{item.item_id}</td>
                                                            <td className="p-2 border">{item.name}</td>
                                                            {/* Quantity Cell */}
                                                            <td className="p-2 border">
                                                                {editingItem === item.item_id ? (
                                                                    <input
                                                                        type="number"
                                                                        name="quantity"
                                                                        value={editFormData.quantity}
                                                                        onChange={handleEditFormChange}
                                                                        className="w-full p-1 border border-gray-300 rounded"
                                                                    />
                                                                ) : (
                                                                    item.quantity
                                                                )}
                                                            </td>
                                                            {/* Last Received Date Cell */}
                                                            <td className="p-2 border">
                                                                {editingItem === item.item_id ? (
                                                                    <input
                                                                        type="date"
                                                                        name="lastreceiveddate"
                                                                        value={editFormData.lastreceiveddate || ''}
                                                                        onChange={handleEditFormChange}
                                                                        className="w-full p-1 border border-gray-300 rounded"
                                                                    />
                                                                ) : (
                                                                    formatDate(item.lastreceiveddate)
                                                                )}
                                                            </td>
                                                            {/* Unit Price Cell */}
                                                            <td className="p-2 border">
                                                                {editingItem === item.item_id ? (
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        name="unit_price"
                                                                        value={editFormData.unit_price}
                                                                        onChange={handleEditFormChange}
                                                                        className="w-full p-1 border border-gray-300 rounded"
                                                                    />
                                                                ) : (
                                                                    item.unit_price ? `Rs. ${item.unit_price}` : 'N/A'
                                                                )}
                                                            </td>
                                                            {/* Actions Cell */}
                                                            <td className="p-2 border">
                                                                {editingItem === item.item_id ? (
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleSaveEdit(item.item_id)}
                                                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                                            title="Save changes"
                                                                        >
                                                                            <Check size={18} />
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancelEdit}
                                                                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                                                            title="Cancel"
                                                                        >
                                                                            <X size={18} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleEditClick(item)}
                                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                                            title="Edit item"
                                                                        >
                                                                            <Edit size={18} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteItemClick(item)}
                                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                            title="Delete item"
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                No items found in this category
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No categories found. Click "Add New Category" to create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Category</h2>
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmitNewCategory}>
                            <div className="mb-4">
                                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="categoryName"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    Add Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Category Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Delete Category</h2>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete the category "{categoryToDelete?.category_name}"?
                            </p>
                            {categoryItems[categoryToDelete?.category_id]?.length > 0 && (
                                <p className="text-red-500 mt-2 text-sm">
                                    Warning: This category contains {categoryItems[categoryToDelete?.category_id]?.length} items. 
                                    Deleting it will also remove these items.
                                </p>
                            )}
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
                                onClick={confirmDeleteCategory}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Item Modal */}
            {showDeleteItemModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Delete Item</h2>
                            <button 
                                onClick={() => setShowDeleteItemModal(false)}
                                className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete the item "{itemToDelete?.name}" (ID: {itemToDelete?.item_id})?
                            </p>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteItemModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeleteItem}
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