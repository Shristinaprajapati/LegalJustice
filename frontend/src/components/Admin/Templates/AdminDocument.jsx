import React, { useState } from 'react';
import Sidebar from '../Sidebar'; // Import the existing Sidebar
import styles from './AdminDocuments.module.css';

const AdminDocuments = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Legal', 'Business', 'Personal', 'Education'];
  const templates = [
    { id: 1, name: 'Contract Template', category: 'Legal' },
    { id: 2, name: 'Invoice Template', category: 'Business' },
    { id: 3, name: 'Resume Template', category: 'Personal' },
    { id: 4, name: 'Assignment Template', category: 'Education' },
    { id: 5, name: 'Will Template', category: 'Legal' },
  ];

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(template => template.category === selectedCategory);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1>Document Templates</h1>
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className={styles.templateGrid}>
          {filteredTemplates.map((template) => (
            <div key={template.id} className={styles.templateCard}>
              <h3>{template.name}</h3>
              <p>Category: {template.category}</p>
              <button className={styles.editButton}>Edit</button>
              <button className={styles.downloadButton}>Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;
