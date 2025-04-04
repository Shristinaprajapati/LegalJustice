import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Sidebar from '../Sidebar';
import styles from './testimonial.module.css';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    case: ''
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('/api/testimonials/admin');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/testimonials', formData);
      setFormData({ quote: '', author: '', case: '' });
      fetchTestimonials();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding testimonial:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/testimonials/${id}/approve`);
      fetchTestimonials();
    } catch (err) {
      console.error('Error approving testimonial:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        {showForm ? (
          <div className={styles.formContainer}>
            <button 
              onClick={() => setShowForm(false)} 
              className={styles.backButton}
            >
              <Icon icon="mdi:arrow-left" /> Back to Testimonials
            </button>
            <h2>Add New Testimonial</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Quote:</label>
                <textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleChange}
                  required
                  rows={5}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Author:</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Case:</label>
                <input
                  type="text"
                  name="case"
                  value={formData.case}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Save Testimonial
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.header}>
              <h2>Testimonials Management</h2>
              <button 
                onClick={() => setShowForm(true)}
                className={styles.addButton}
              >
                <Icon icon="mdi:plus" /> Add Testimonial
              </button>
            </div>
            
            <div className={styles.tableContainer}>
              <table className={styles.testimonialsTable}>
                <thead>
                  <tr>
                    <th>Quote</th>
                    <th>Author</th>
                    <th>Case</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.noData}>No testimonials found</td>
                    </tr>
                  ) : (
                    testimonials.map((testimonial) => (
                      <tr key={testimonial._id}>
                        <td className={styles.quoteCell}>
                          <div className={styles.quoteText}>"{testimonial.quote}"</div>
                        </td>
                        <td>{testimonial.author}</td>
                        <td>{testimonial.case}</td>
                        <td>
                          <span className={`${styles.status} ${testimonial.approved ? styles.approved : styles.pending}`}>
                            {testimonial.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className={styles.actionsCell}>
                          {!testimonial.approved && (
                            <button
                              onClick={() => handleApprove(testimonial._id)}
                              className={styles.approveButton}
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(testimonial._id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;