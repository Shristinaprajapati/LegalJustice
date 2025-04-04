import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import AdminBlogForm from "./AdminBlogForm";
import { Icon } from '@iconify/react';
import styles from "./AdminBlogList.module.css";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/blog/${id}`);
  };

  // Pagination Logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        {showForm ? (
          <AdminBlogForm 
            onSave={() => { 
              setShowForm(false); 
              fetchBlogs(); 
            }} 
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <div className={styles.header}>
              <h2>Blog Management</h2>
              <button
                onClick={() => setShowForm(true)}
                className={styles.addButton}
              >
                <Icon icon="mdi:plus" /> Add Blog
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.blogTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Published Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBlogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.noData}>No blogs found</td>
                    </tr>
                  ) : (
                    currentBlogs.map((blog) => (
                      <tr key={blog._id}>
                        <td className={styles.titleCell}>{blog.title}</td>
                        <td>{blog.author}</td>
                        <td>
                          {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className={styles.actionsCell}>
                          <button
                            onClick={() => handleViewDetails(blog._id)}
                            className={styles.viewButton}
                          >
                            <Icon icon="mdi:eye-outline" /> View
                          </button>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBlogList;