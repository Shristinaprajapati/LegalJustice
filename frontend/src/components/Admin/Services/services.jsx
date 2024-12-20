import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminServices.module.css';
import Sidebar from '../Sidebar'; // Import Sidebar component

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
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
      setNewService({ title: '', description: '', price: '' }); // Reset form
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
          <textarea
            name="description"
            placeholder="Service Description"
            value={newService.description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price (Rs.)"
            value={newService.price}
            onChange={handleInputChange}
          />
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>{service.title}</td>
                  <td>{service.description}</td>
                  <td>{service.price}</td>
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
