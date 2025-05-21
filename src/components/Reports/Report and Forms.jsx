import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReportsAndForms.module.css';
import {  ChevronLeft } from 'lucide-react';

const ReportsAndForms = () => {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/report-categories', { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
      });
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch {
      console.error('Failed to fetch reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBackClick = () => {
        navigate(-1);
    };

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/report-categories', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setReports([...reports, response.data]);
      setIsModalOpen(false);
      setFormData({ name: '' });
      alert('Report category added successfully');
    } catch {
      alert('Failed to add report category');
    }
  };

  const handleDeleteReport = async (id) => {
    if (!confirm('Are you sure to delete this report category?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/report-categories/${id}`, { 
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
      });
      setReports(reports.filter(report => report.id !== id));
      alert('Report category deleted successfully');
    } catch {
      alert('Failed to delete report category');
    }
  };

  const navigateToReport = (id) => {
    navigate(`/reports/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBackClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Reports and Forms</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Add Report Category
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => navigateToReport(report.id)}
                    >
                      Open
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add New Report Category</h2>
            <form onSubmit={handleAddReport}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Report Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.modalButtons}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAndForms;