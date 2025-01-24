import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar"; // Import the Sidebar
import axios from "axios";
import styles from "./AdminDocuments.module.css";

const AdminDocuments = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories] = useState([
    "All",
    "Family Law",
    "Real Estate Documents",
    "Intellectual Property",
    "Legal Letters",
    "Litigation and Dispute Resolution",
  ]);
  const [templates, setTemplates] = useState([]);
  const [file, setFile] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "Family Law",
  });
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Fetch templates on component mount or category change
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/templates?category=${selectedCategory}`
        );
        setTemplates(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching templates.");
      }
    };
    fetchTemplates();
  }, [selectedCategory]);

  // Handle upload
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", newTemplate.name);
      formData.append("category", newTemplate.category);

      const response = await axios.post(
        "http://localhost:8080/api/templates/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Upload successful:", response.data);
      alert("File uploaded successfully.");
      setTemplates((prev) => [...prev, response.data.template]); // Add new template to state
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("Error uploading file.");
    }
  };

  // Handle download
  const handleDownload = async (id) => {
    try {
      const { data, headers } = await axios.get(
        `http://localhost:8080/api/templates/download/${id}`,
        {
          responseType: "blob", // Ensure the response is treated as a file
        }
      );

      const blob = new Blob([data], { type: headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      // Optionally open the file in a new tab
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Error downloading template.");
    }
  };

  // Handle editing
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/templates/${editingTemplate._id}`,
        {
          name: editingTemplate.name,
          category: editingTemplate.category,
        }
      );
      alert(data.message);
      setTemplates((prev) =>
        prev.map((template) =>
          template._id === editingTemplate._id ? data.template : template
        )
      );
      setEditingTemplate(null);
    } catch (err) {
      console.error(err);
      alert("Error updating template.");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1>Document Templates</h1>
        <form className={styles.uploadForm} onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, name: e.target.value })
            }
            required
          />
          <select
            value={newTemplate.category}
            onChange={(e) =>
              setNewTemplate({ ...newTemplate, category: e.target.value })
            }
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit">Upload</button>
        </form>
        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${
                selectedCategory === category ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className={styles.templateGrid}>
          {templates.map((template) => (
            <div key={template._id} className={styles.templateCard}>
              {editingTemplate?._id === template._id ? (
                <form onSubmit={handleEdit}>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    value={editingTemplate.category}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3>{template.name}</h3>
                  <p>Category: {template.category}</p>
                  <button
                    className={styles.editButton}
                    onClick={() => setEditingTemplate(template)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.downloadButton}
                    onClick={() => handleDownload(template._id)}
                  >
                    Open
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDocuments;
