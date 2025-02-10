import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminServices.module.css';
import Sidebar from '../Sidebar'; // Import Sidebar component
import DivorceAgreementForm from '..//htmlTemplates/DivorseAgreementForm';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    category: '', // Use category instead of type
    formTemplate: '', // Add field for formTemplate
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch services');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle new service input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  // Add a new service
  const handleAddService = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/services', newService);
      setServices([...services, response.data]);
      setNewService({ title: '', description: '', price: '', category: '', formTemplate: '' }); // Reset form
    } catch (err) {
      setError('Failed to add service');
    }
  };

  // Delete a service
  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/services/${id}`);
      setServices(services.filter((service) => service._id !== id));
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  if (loading) {
    return <div>Loading services...</div>;
  }

  // Render specific form for each form template
  const renderFormTemplate = () => {
    switch (newService.formTemplate) {
      case 'form1':
        return <DivorceAgreementForm submitForm={handleAddService} />; // Render DivorceAgreementForm
      case 'form2':
        return <div>Form 2 Content</div>; // Replace with actual form content for form2
      case 'form3':
        return <div>Form 3 Content</div>; // Replace with actual form content for form3
      case 'form4':
        return <div>Form 4 Content</div>; // Replace with actual form content for form4
      case 'form5':
        return <div>Form 5 Content</div>; // Replace with actual form content for form5
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2>Manage Services</h2>
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Add New Service Form */}
        <div className={styles.addServiceForm}>
          <h3>Add New Service</h3>
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={newService.title}
            onChange={handleInputChange}
          />
          <div className={styles.textSpace}>
            <textarea
              name="description"
              placeholder="Service Description"
              value={newService.description}
              onChange={handleInputChange}
            />
          </div>
          <input
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
                name="category" // Changed to category
                value="consulting"
                checked={newService.category === 'consulting'}
                onChange={handleInputChange}
              />
              Consulting Service
            </label>
            <label>
              <input
                type="radio"
                name="category" // Changed to category
                value="documentation"
                checked={newService.category === 'documentation'}
                onChange={handleInputChange}
              />
              Documentation Service
            </label>
          </div>

          {/* Show dropdown menu only if category is 'documentation' */}
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
                <option value="form3">Form 3</option>
                <option value="form4">Form 4</option>
                <option value="form5">Form 5</option>
              </select>
            </div>
          )}

          {/* Render the corresponding form only if category is 'documentation' */}
          {newService.category === 'documentation' && renderFormTemplate()}

          <button onClick={handleAddService}>Add Service</button>
        </div>

        {/* Existing Services Table */}
        <div className={styles.servicesList}>
          <h3>Existing Services</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Price (Rs.)</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.title}</td>
                  <td>{service.description}</td>
                  <td>{service.price}</td>
                  <td>{service.category}</td> {/* Display the category */}
                  <td>
                    <button onClick={() => handleDeleteService(service._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
