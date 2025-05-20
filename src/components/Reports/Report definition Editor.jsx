import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReportForm.module.css';

const ReportDefinitionEditor = () => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [fields, setFields] = useState([]);
  const [availableFieldTypes, setAvailableFieldTypes] = useState([]);
  const [availableDataSources, setAvailableDataSources] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [categoryRes, fieldTypesRes, dataSourcesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/report-categories/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/field-types', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/data-sources', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setCategory(categoryRes.data);
      setAvailableFieldTypes(fieldTypesRes.data);
      setAvailableDataSources(dataSourcesRes.data);
      
      // Load existing fields if any
      const definitionRes = await axios.get(
        `http://localhost:5000/api/report-definitions?category_id=${id}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      
      if (definitionRes.data.fields) {
        setFields(definitionRes.data.fields);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to load data');
      navigate('/admin/report-categories');
    }
  };

  const handleAddField = () => {
    setFields([...fields, {
      field_name: '',
      field_type: 'text',
      required: false,
      data_source: ''
    }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/report-definitions',
        { report_category_id: id, fields },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Report definition saved successfully!');
      navigate('/admin/report-categories');
    } catch (err) {
      console.error(err);
      alert('Failed to save report definition');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.reportContainer}>
      <h1>Configure Fields for: {category.name}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.fieldsContainer}>
          {fields.map((field, index) => (
            <div key={index} className={styles.fieldRow}>
              <div className={styles.formGroup}>
                <label>Field Name</label>
                <input
                  type="text"
                  value={field.field_name}
                  onChange={(e) => handleFieldChange(index, 'field_name', e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Field Type</label>
                <select
                  value={field.field_type}
                  onChange={(e) => handleFieldChange(index, 'field_type', e.target.value)}
                >
                  {availableFieldTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {field.field_type === 'select' && (
                <div className={styles.formGroup}>
                  <label>Data Source</label>
                  <select
                    value={field.data_source || ''}
                    onChange={(e) => handleFieldChange(index, 'data_source', e.target.value)}
                  >
                    <option value="">Select data source</option>
                    {availableDataSources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                  />
                  Required
                </label>
              </div>
              
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className={styles.formActions}>
          <button type="button" onClick={handleAddField} className={styles.addButton}>
            Add Field
          </button>
          <button type="submit" className={styles.submitButton}>
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportDefinitionEditor;