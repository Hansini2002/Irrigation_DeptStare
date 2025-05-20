import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReportForm.module.css';

const ReportForm = () => {
  const [loading, setLoading] = useState(true);
  const [reportDefinition, setReportDefinition] = useState(null);
  const [dataSources, setDataSources] = useState({});
  const [formValues, setFormValues] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchReportDefinition();
  }, [id]);

  const fetchReportDefinition = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/report-definitions?category_id=${id}`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      console.log('API Response:', response.data);
      if (!response.data || !response.data.fields) {
        throw new Error('Invalid response structure');
      }
    
      setReportDefinition(response.data);
      
      const sources = {};
      response.data.fields.forEach(field => {
        if (field.data_source) {
          sources[field.data_source] = null;
        }
      });
      
      await Promise.all(Object.keys(sources).map(async (source) => {
        const res = await axios.get(`http://localhost:5000/api/${source}`);
        sources[source] = res.data;
      }));
      
      setDataSources(sources);
      
      // Initialize form values
      const initialValues = {};
      response.data.fields.forEach(field => {
        initialValues[field.field_name] = '';
      });
      setFormValues(initialValues);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading report definition:', err);
      alert(`Failed to load report definition: ${err.message}`);
      navigate('/reports');
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const onFinish = async (e) => {
    e.preventDefault();
    try {
      const reportRes = await axios.post('http://localhost:5000/api/reports',{ report_category_id: id },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const dataToSave = Object.entries(formValues).map(([field_name, field_value]) => ({
        report_id: reportRes.data.id,
        field_name,
        field_value
      }));
      console.log('dataToSave', dataToSave);
      
      await axios.post('http://localhost:5000/api/report-data/bulk', dataToSave,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert('Report saved successfully!');
      navigate('/reports');
    } catch {
      alert('Failed to save report');
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.field_name,
      name: field.field_name,
      value: formValues[field.field_name] || '',
      onChange: (e) => handleInputChange(field.field_name, e.target.value),
      required: field.required
    };

    switch (field.field_type) {
      
      case 'text':
        return <input type="text" {...commonProps} />;
      case 'textarea':
        return <textarea rows={4} {...commonProps} />;
      case 'number':
        return <input type="number" {...commonProps} />;
      case 'date':
        return (
          <input 
            type="date" 
            value={formValues[field.field_name] || ''}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            required={field.required}
          />
        );
      case 'checkbox':
        return (
          <input 
            type="checkbox" 
            checked={formValues[field.field_name] || false}
            onChange={(e) => handleInputChange(field.field_name, e.target.checked)}
          />
        );
      case 'radio':
        if (field.data_source) {
          const options = dataSources[field.data_source] || [];
          return (
            <div className={styles.radioGroup}>
              {options.map(item => (
                <div key={item.id} className={styles.radioOption}>
                  <input
                    type="radio"
                    id={`${field.field_name}-${item.id}`}
                    name={field.field_name}
                    value={item.id}
                    checked={formValues[field.field_name] === item.id}
                    onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                    required={field.required}
                  />
                  <label htmlFor={`${field.field_name}-${item.id}`}>
                    {item.name || item.title || item.id}
                  </label>
                </div>
              ))}
            </div>
          );
        }
        break;
      case 'select':
        if (field.data_source) {
          const options = dataSources[field.data_source] || [];
          return (
            <select
              value={formValues[field.field_name] || ''}
              onChange={(e) => handleInputChange(field.field_name, e.target.value)}
              required={field.required}>
              <option value="">Select an option</option>
              {options.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name || item.title || item.id}
                </option>
              ))}
            </select>
          );
        }
        
        return <input type="text" {...commonProps} />;
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  if (loading) {
    return <div className={styles.loader}>Loading report definition...</div>;
  }

  if (!reportDefinition) {
    return <div className={styles.error}>No report definition found</div>;
  }

  return (
    <div className={styles.reportContainer}>
      <div className={styles.reportHeader}>
        <h1>{reportDefinition.category.name}</h1>
      </div>
      
      <form onSubmit={onFinish} className={styles.reportForm}>
        {reportDefinition.fields.map(field => (
          <div key={field.field_name} className={styles.formGroup}>
            <label htmlFor={field.field_name}>
              {field.field_name.replace(/_/g, ' ')}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Generate Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;