import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReportForm.module.css';

const ReportDefinitionForm = ({ categoryId }) => {
  const [categoryName, setCategoryName] = useState('');
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  // Fetch category name and fields if editing
  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      try {
        // Fetch category name
        const catRes = await axios.get(`http://localhost:5000/api/report-categories`);
        const category = catRes.data.find(c => c.id === Number(categoryId));
        if (category) setCategoryName(category.name);

        // Fetch fields
        const fieldsRes = await axios.get(`http://localhost:5000/api/report-definitions?category_id=${categoryId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setFields(fieldsRes.data.map(f => ({
            ...f,
            required: Boolean(f.required)
        })));
      } catch  {
        alert('Failed to load report definition');
      }
    };
    fetchData();
  }, [categoryId]);

  const addField = () => {
    setFields([...fields, {
      field_name: '',
      field_type: 'text',
      required: true,
      data_source: ''
    }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryId) {
        // Update category name (optional, if you have a PUT endpoint)
        await axios.put(`http://localhost:5000/api/report-categories/${categoryId}`, {
          name: categoryName
        }, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });

        // Save fields
        await axios.post('http://localhost:5000/api/report-definitions', {
          report_category_id: categoryId,
          fields
        }, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
      } else {
        // Create new category
        const res = await axios.post('http://localhost:5000/api/report-categories', {
          name: categoryName
        }, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
        const newCategoryId = res.data.id;

        // Save fields
        await axios.post('http://localhost:5000/api/report-definitions', {
          report_category_id: newCategoryId,
          fields
        }, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });
      }
      navigate('/report-categories');
    } catch  {
      alert('Failed to save report category');
    }
  };

  return (
    <div className={styles.reportContainer}>
      <h1>{categoryId ? 'Edit Report Category' : 'Create New Report Category'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        
        <h3>Fields</h3>
        {fields.map((field, index) => (
          <div key={index} className={styles.fieldGroup}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Field Name</label>
                <input
                  type="text"
                  value={field.field_name}
                  onChange={(e) => updateField(index, 'field_name', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Field Type</label>
                <select
                  value={field.field_type}
                  onChange={(e) => updateField(index, 'field_type', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="textarea">Text Area</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Dropdown</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(index, 'required', e.target.checked)}
                  />
                  Required
                </label>
              </div>
              
              <button
                type="button"
                onClick={() => removeField(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
            
            {field.field_type === 'select' && (
              <div className={styles.formGroup}>
                <label>Data Source (table name)</label>
                <input
                  type="text"
                  value={field.data_source}
                  onChange={(e) => updateField(index, 'data_source', e.target.value)}
                  placeholder="e.g., departments, users"
                />
              </div>
            )}
          </div>
        ))}
        
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={addField}
            className={styles.addButton}
          >
            Add Field
          </button>
          <button type="submit" className={styles.submitButton}>
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportDefinitionForm;