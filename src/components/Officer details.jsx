import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Edit, Save, X, Check, Plus } from 'lucide-react';

const OfficerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [issuedItems, setIssuedItems] = useState([]);
  const [editingOfficer, setEditingOfficer] = useState(false);
  const [officerFormData, setOfficerFormData] = useState({
    designation: '',
    end_date: '',
    contact_no: ''
  });
  const [newItem, setNewItem] = useState({
    item_id: '',
    item_name: '',
    quantity: 1,
    issued_date: new Date().toISOString().split('T')[0]
  });
  const [editingItem, setEditingItem] = useState(null);
  const [editItemData, setEditItemData] = useState({
    quantity: '',
    issued_date: ''
  });
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);

  // Fetch officer details
  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/officer-details/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setOfficer(data);
        setOfficerFormData({
          designation: data.designation,
          end_date: data.end_date || '',
          contact_no: data.contact_no
        });
      } catch (error) {
        console.error('Error fetching officer:', error);
      }
    };
    fetchOfficer();
  }, [id]);

  // Fetch items issued to officer
  useEffect(() => {
    const fetchIssuedItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/officer-items/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setIssuedItems(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error('Error fetching issued items:', error);
      }
    };
    fetchIssuedItems();
  }, [id]);

  // Fetch available items for issuing
  useEffect(() => {
    const fetchAvailableItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/available-items', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setAvailableItems(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error('Error fetching available items:', error);
      }
    };
    fetchAvailableItems();
  }, []);

  const handleEditOfficer = () => {
    setEditingOfficer(true);
  };

  const handleOfficerFormChange = (e) => {
    const { name, value } = e.target;
    setOfficerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveOfficer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/officer-details/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(officerFormData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update officer');
      }

      // Refresh officer data
      const updatedResponse = await fetch(`http://localhost:5000/api/officer-details/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const updatedData = await updatedResponse.json();
      setOfficer(updatedData);
      setEditingOfficer(false);
    } catch (error) {
      console.error('Error updating officer:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingOfficer(false);
    // Reset form data to original values
    if (officer) {
      setOfficerFormData({
        designation: officer.designation,
        end_date: officer.end_date || '',
        contact_no: officer.contact_no
      });
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    const selectedItem = availableItems.find(item => item.item_id === itemId);
    if (selectedItem) {
      setNewItem(prev => ({
        ...prev,
        item_id: selectedItem.item_id,
        item_name: selectedItem.name,
        quantity: 1 // Reset quantity when item changes
      }));
    }
  };

  const handleIssueItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.item_id || !newItem.quantity) {
      alert('Please select an item and enter quantity');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/officer-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          officer_id: id,
          item_id: newItem.item_id,
          quantity: newItem.quantity,
          issued_date: newItem.issued_date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to issue item');
      }

      // Refresh issued items list
      const itemsResponse = await fetch(`http://localhost:5000/api/officer-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const itemsData = await itemsResponse.json();
      setIssuedItems(Array.isArray(itemsData) ? itemsData : itemsData.items || []);

      // Refresh available items
      const availableResponse = await fetch('http://localhost:5000/api/available-items', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const availableData = await availableResponse.json();
      setAvailableItems(Array.isArray(availableData) ? availableData : availableData.items || []);

      // Reset form
      setNewItem({
        item_id: '',
        item_name: '',
        quantity: 1,
        issued_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error issuing item:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item.issue_id);
    setEditItemData({
      quantity: item.quantity,
      issued_date: item.issued_date
    });
  };

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditItemData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveItemEdit = async (issueId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/officer-items/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editItemData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update item');
      }

      // Refresh issued items list
      const itemsResponse = await fetch(`http://localhost:5000/api/officer-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const itemsData = await itemsResponse.json();
      setIssuedItems(Array.isArray(itemsData) ? itemsData : itemsData.items || []);

      // Refresh available items
      const availableResponse = await fetch('http://localhost:5000/api/available-items', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const availableData = await availableResponse.json();
      setAvailableItems(Array.isArray(availableData) ? availableData : availableData.items || []);

      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancelItemEdit = () => {
    setEditingItem(null);
  };

  const handleDeleteItemClick = (item) => {
    setItemToDelete(item);
    setShowDeleteItemModal(true);
  };

  const confirmDeleteItem = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/officer-items/${itemToDelete.issue_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete item');
      }

      // Refresh issued items list
      const itemsResponse = await fetch(`http://localhost:5000/api/officer-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const itemsData = await itemsResponse.json();
      setIssuedItems(Array.isArray(itemsData) ? itemsData : itemsData.items || []);

      // Refresh available items
      const availableResponse = await fetch('http://localhost:5000/api/available-items', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const availableData = await availableResponse.json();
      setAvailableItems(Array.isArray(availableData) ? availableData : availableData.items || []);

      setShowDeleteItemModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!officer) {
    return <div className="p-8">Loading officer details...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Officer Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Officer Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!editingOfficer ? (
              <button 
                onClick={handleEditOfficer}
                className="text-blue-600 hover:text-blue-800">
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSaveOfficer}
                  className="text-green-600 hover:text-green-800">
                  Save
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Officer ID</label>
              <p className="mt-1">{officer.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1">{officer.officer_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Designation</label>
              {editingOfficer ? (
                <input
                  type="text"
                  name="designation"
                  value={officerFormData.designation}
                  onChange={handleOfficerFormChange}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1">{officer.designation}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Gender</label>
              <p className="mt-1">{officer.gender}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Started Date</label>
              <p className="mt-1">{formatDate(officer.started_date)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">End Date</label>
              {editingOfficer ? (
                <input
                  type="date"
                  name="end_date"
                  value={officerFormData.end_date || ''}
                  onChange={handleOfficerFormChange}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1">{officer.end_date ? formatDate(officer.end_date) : 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">NIC</label>
              <p className="mt-1">{officer.nic}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Contact No</label>
              {editingOfficer ? (
                <input
                  type="text"
                  name="contact_no"
                  value={officerFormData.contact_no}
                  onChange={handleOfficerFormChange}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1">{officer.contact_no}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{officer.email || 'N/A'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">City</label>
              <p className="mt-1">{officer.city}</p>
            </div>
          </div>
        </div>

        {/* Issue New Item Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Issue New Item</h2>
          <form onSubmit={handleIssueItem}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
              <select
                name="item_id"
                value={newItem.item_id}
                onChange={handleItemSelect}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select an item</option>
                {availableItems.map(item => (
                  <option key={item.item_id} value={item.item_id}>
                    {item.name} (ID: {item.item_id}, Available: {item.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={newItem.quantity}
                onChange={handleNewItemChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
              <input
                type="date"
                name="issued_date"
                value={newItem.issued_date}
                onChange={handleNewItemChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Issue Item
            </button>
          </form>
        </div>
      </div>

      {/* Issued Items Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Issued Items</h2>
        {issuedItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border">Item ID</th>
                  <th className="p-3 text-left border">Item Name</th>
                  <th className="p-3 text-left border">Quantity</th>
                  <th className="p-3 text-left border">Issued Date</th>
                  <th className="p-3 text-left border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuedItems.map(item => (
                  <tr key={item.issue_id} className="border hover:bg-gray-50">
                    <td className="p-3 border">{item.item_id}</td>
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">
                      {editingItem === item.issue_id ? (
                        <input
                          type="number"
                          name="quantity"
                          min="1"
                          value={editItemData.quantity}
                          onChange={handleEditItemChange}
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="p-3 border">
                      {editingItem === item.issue_id ? (
                        <input
                          type="date"
                          name="issued_date"
                          value={editItemData.issued_date}
                          onChange={handleEditItemChange}
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        formatDate(item.issued_date)
                      )}
                    </td>
                    <td className="p-3 border">
                      {editingItem === item.issue_id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveItemEdit(item.issue_id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Save"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancelItemEdit}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteItemClick(item)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
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
          </div>
        ) : (
          <p className="text-gray-500">No items issued to this officer.</p>
        )}
      </div>

      {/* Delete Item Modal */}
      {showDeleteItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Issued Item</h2>
              <button 
                onClick={() => setShowDeleteItemModal(false)}
                className="p-1 rounded-full hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the issued item "{itemToDelete?.item_name}" (ID: {itemToDelete?.item_id})?
              </p>
              <p className="text-sm text-red-600 mt-2">This will return the item to inventory.</p>
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
};

export default OfficerDetails;