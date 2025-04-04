import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminServices.module.css';
import Sidebar from '../Sidebar';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import DivorceAgreementForm from '../htmlTemplates/DivorseAgreementForm';
import RentalAgreementForm from '../htmlTemplates/RentalAgreementForm';
import MarriageproofAgreement from '../htmlTemplates/MarriageproofAgreementForm';
import PropertytransferAgreement from '../htmlTemplates/PropertytransferAgreementForm';
import EmploymentContract from '../htmlTemplates/EmploymentcontractForm';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    formTemplate: '',
  });
  const [editService, setEditService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/services');
        setServices(response.data);
      } catch (err) {
        setError('Failed to fetch services');
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleAddService = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/services', newService);
      setServices([...services, response.data]);
      setNewService({ title: '', description: '', price: '', category: '', formTemplate: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add service');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/services/${id}`);
      setServices(services.filter((service) => service._id !== id));
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const handleEditClick = (service) => {
    setEditService(service);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditService({ ...editService, [name]: value });
  };

  const handleUpdateService = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/services/${editService._id}`, editService);
      setServices(services.map((service) => (service._id === editService._id ? response.data : service)));
      setEditService(null);
    } catch (err) {
      setError('Failed to update service');
    }
  };

  const renderFormTemplate = () => {
    switch (newService.formTemplate) {
      case 'form1':
        return <DivorceAgreementForm submitForm={handleAddService} />;
      case 'form2':
        return <div>Form 2 Content</div>;
      case 'form3':
        return <RentalAgreementForm submitForm={handleAddService} />;
      case 'form4':
        return <MarriageproofAgreement submitForm={handleAddService} />;
      case 'form5':
        return <PropertytransferAgreement submitForm={handleAddService} />;
      case 'form6':
        return <EmploymentContract submitForm={handleAddService} />;
      default:
        return null;
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading services...</p>
    </div>
  );

  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            {/* <span className={styles.titleIcon}>📋</span> */}
            Manage Services
          </h1>
          {error && <div className={styles.errorBanner}>{error}</div>}
        </div>

        {!showAddForm ? (
          <div className={styles.servicesDashboard}>
            <div className={styles.actionsBar}>
              <button 
                className={styles.primaryButton}
                onClick={() => setShowAddForm(true)}
              >
                <FaPlus className={styles.buttonIcon} />
                Add New Service
              </button>
            </div>

            <div className={styles.servicesTableContainer}>
              <table className={styles.servicesTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price (Rs.)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td>
                        {editService?._id === service._id ? (
                          <input
                            type="text"
                            name="title"
                            value={editService.title}
                            onChange={handleEditChange}
                            className={styles.tableInput}
                          />
                        ) : (
                          <span className={styles.serviceTitle}>{service.title}</span>
                        )}
                      </td>
                      <td>
                        {editService?._id === service._id ? (
                          <textarea
                            name="description"
                            value={editService.description}
                            onChange={handleEditChange}
                            className={styles.tableTextarea}
                          />
                        ) : (
                          <span className={styles.serviceDescription}>{service.description}</span>
                        )}
                      </td>
                      <td>
                        {editService?._id === service._id ? (
                          <input
                            type="number"
                            name="price"
                            value={editService.price}
                            onChange={handleEditChange}
                            className={styles.tableInput}
                          />
                        ) : (
                          <span className={styles.servicePrice}>Rs. {service.price}</span>
                        )}
                      </td>
                      <td>
                        {editService?._id === service._id ? (
                          <button 
                            className={styles.saveButton} 
                            onClick={handleUpdateService}
                          >
                            Save Changes
                          </button>
                        ) : (
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditClick(service)}
                            >
                              <FaEdit className={styles.actionIcon} />
                              Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteService(service._id)}
                            >
                              <FaTrash className={styles.actionIcon} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <button 
                className={styles.backButton}
                onClick={() => setShowAddForm(false)}
              >
                <FaArrowLeft className={styles.backIcon} />
                Back to Services
              </button>
            </div>
            
            <div className={styles.formContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Service Title</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="title"
                  placeholder="Enter service title"
                  value={newService.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formTextarea}
                  name="description"
                  placeholder="Enter service description"
                  value={newService.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price (Rs.)</label>
                <input
                  className={styles.formInput}
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={newService.price}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Service Type</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="category"
                      value="consulting"
                      checked={newService.category === 'consulting'}
                      onChange={handleInputChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>Consulting Service</span>
                  </label>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="category"
                      value="documentation"
                      checked={newService.category === 'documentation'}
                      onChange={handleInputChange}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>Documentation Service</span>
                  </label>
                </div>
              </div>

              {newService.category === 'documentation' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Form Template</label>
                  <select
                    name="formTemplate"
                    value={newService.formTemplate}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value="">Select a form template</option>
                    <option value="form1">Divorce Agreement Form</option>
                    <option value="form2">Partnership Form</option>
                    <option value="form3">Rental Agreement Form</option>
                    <option value="form4">Marriage Proof Form</option>
                    <option value="form5">Property Transfer Form</option>
                    <option value="form6">Employment Contract Form</option>
                  </select>
                </div>
              )}

              <div className={styles.formActions}>
                <button 
                  className={styles.submitButton}
                  onClick={handleAddService}
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;