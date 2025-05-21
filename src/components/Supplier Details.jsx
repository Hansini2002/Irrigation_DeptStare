import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SupplierDetails = () => {
  const { sup_id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(false);
  const [supplierFormData, setSupplierFormData] = useState({
    contact_no: ''
  });
  // Fetch supplier details
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/suppliers/${sup_id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setSupplier(data);
        setSupplierFormData({
          contact_no: data.contact_no
        });
      } catch (error) {
        console.error('Error fetching supplier:', error);
      }
    };
    fetchSupplier();
  }, [sup_id]);

  const handleEditsupplier = () => {
    setEditingSupplier(true);
  };

  const handlesupplierFormChange = (e) => {
    const { name, value } = e.target;
    setSupplierFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSupplier = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/suppliers/${sup_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(supplierFormData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update supplier');
      }

      // Refresh supplier data
      const updatedResponse = await fetch(`http://localhost:5000/api/suppliers/${sup_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const updatedData = await updatedResponse.json();
      setSupplier(updatedData);
      setEditingSupplier(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingSupplier(false);
    // Reset form data to original values
    if (supplier) {
      setSupplierFormData({
        contact_no: supplier.contact_no
      });
    }
  };

  if (!supplier) {
    return <div className="p-8">Loading supplier details...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 mr-4">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Supplier Details</h1>
      </div>

      <div className="grid grid-cols-1 mb-8">
        {/* supplier Details Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!editingSupplier ? (
              <button 
                onClick={handleEditsupplier}
                className="text-blue-600 hover:text-blue-800">
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSaveSupplier}
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
              <label className="block text-sm font-medium text-gray-500">Supplier ID</label>
              <p className="mt-1">{supplier.sup_id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1">{supplier.supplier_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Contact No</label>
              {editingSupplier ? (
                <input
                  type="text"
                  name="contact_no"
                  value={supplierFormData.contact_no}
                  onChange={handlesupplierFormChange}
                  className="mt-1 p-2 border rounded w-full"
                />
              ) : (
                <p className="mt-1">{supplier.contact_no}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">City</label>
              <p className="mt-1">{supplier.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;