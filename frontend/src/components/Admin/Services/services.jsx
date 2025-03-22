import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminServices.module.css';
import Sidebar from '../Sidebar';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
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

  if (loading) return <div>Loading services...</div>;

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Manage Services</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.servicesList}>
          <h3>Existing Services</h3>
          <table>
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
                      />
                    ) : (
                      service.title
                    )}
                  </td>
                  <td>
                    {editService?._id === service._id ? (
                      <textarea
                        name="description"
                        value={editService.description}
                        onChange={handleEditChange}
                      />
                    ) : (
                      service.description
                    )}
                  </td>
                  <td>
                    {editService?._id === service._id ? (
                      <input
                        type="number"
                        name="price"
                        value={editService.price}
                        onChange={handleEditChange}
                      />
                    ) : (
                      service.price
                    )}
                  </td>
                  <td>
                    {editService?._id === service._id ? (
                      <button className={styles.saveButton} onClick={handleUpdateService}>
                        Save
                      </button>
                    ) : (
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditClick(service)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteService(service._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.addServiceForm}>
          <h3>Add New Service</h3>
          <input
            className={styles.input}
            type="text"
            name="title"
            placeholder="Service Title"
            value={newService.title}
            onChange={handleInputChange}
          />
          <textarea
            className={styles.textarea}
            name="description"
            placeholder="Service Description"
            value={newService.description}
            onChange={handleInputChange}
          />
          <input
            className={styles.input}
            type="number"
            name="price"
            placeholder="Price (Rs.)"
            value={newService.price}
            onChange={handleInputChange}
          />
          <div className={styles.serviceType}>
            <label>
              <input
                type="radio"
                name="category"
                value="consulting"
                checked={newService.category === 'consulting'}
                onChange={handleInputChange}
              />
              Consulting Service
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="documentation"
                checked={newService.category === 'documentation'}
                onChange={handleInputChange}
              />
              Documentation Service
            </label>
          </div>

          {newService.category === 'documentation' && (
            <div className={styles.formTemplate}>
              <label>Select a form template:</label>
              <select
                name="formTemplate"
                value={newService.formTemplate}
                onChange={handleInputChange}
              >
                <option value="">Select a form</option>
                <option value="form1">Divorce Agreement Form</option>
                <option value="form2">Form 2</option>
                <option value="form3">Rental Agreement Form</option>
                <option value="form4">Marriage Proof Form</option>
                <option value="form5">Property Transfer Form</option>
                <option value="form6">Employment Contract Form</option>
              </select>
            </div>
          )}

          {newService.category === 'documentation' && renderFormTemplate()}

          <button className={styles.addButton} onClick={handleAddService}>
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;