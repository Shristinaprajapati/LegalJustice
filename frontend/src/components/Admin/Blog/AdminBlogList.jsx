import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Sidebar";
import AdminBlogForm from "./AdminBlogForm";
import styles from "./AdminBlogList.module.css";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5; // Number of blogs per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await axios.get("/api/blogs");
    setBlogs(res.data);
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
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.contentContainer}>
        <h2 className={styles.heading}>Manage Blogs</h2>
        {!showForm ? (
          <>
            <button
              onClick={() => setShowForm(true)}
              className={styles.addBlogButton}
            >
              Add Blog
            </button>
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
                {currentBlogs.map((blog) => (
                  <tr key={blog._id} className={styles.blogRow}>
                    <td className={styles.blogTitle}>{blog.title}</td>
                    <td className={styles.author}>{blog.author}</td>
                    <td className={styles.date}>
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={styles.viewDetailButton}
                        onClick={() => handleViewDetails(blog._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span> Page {currentPage} of {totalPages} </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <AdminBlogForm onSave={() => { setShowForm(false); fetchBlogs(); }} />
        )}
      </div>
    </div>
  );
};

export default AdminBlogList;