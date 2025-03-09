import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./blogclient.module.css";
import Header from "../Main/Header.jsx";
import { htmlToText } from "html-to-text"; // Import html-to-text library

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
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
    navigate(`/blogDetail/${id}`);
  };

  // Function to extract plain text from HTML content
  const extractBlogDetail = (htmlContent) => {
    if (!htmlContent) return ""; // Return empty string if content is undefined
    return htmlToText(htmlContent); // Convert HTML to plain text
  };

  // Function to extract the first two lines of blogDetail and remove extra > < tags
  const getExcerpt = (text) => {
    if (!text) return ""; // Return an empty string if text is undefined or null

    // Remove extra > and < tags using a regular expression
    const cleanedText = text.replace(/[<>]/g, "");

    // Split the text by new lines
    const lines = cleanedText.split("\n");

    // Take lines 2 to 5 (index 2 to 4) and join them
    return lines.slice(2, 5).join("\n");
  };

  // Pagination Logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.heroSection}>
        <div className={styles.heroText}>Legal Justice Blogs</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>PRACTICE AREAS</h3>
          <ul className={styles.sidebarList}>
            <li>Banking & Finance</li>
            <li>Corporate & Commercial</li>
            <li>Litigation & Arbitration</li>
            <li>Mergers & Acquisitions</li>
          </ul>

          <h3 className={styles.sidebarTitle}>LATEST POST</h3>
          <ul className={styles.sidebarList}>
            <li>Arbitration law and procedure in Nepal</li>
            <li>Nepal Project Finance Guide</li>
            <li>Doing Business in Nepal Guide</li>
            <li>Overview of the new Foreign Investment Act 2019</li>
          </ul>
        </div>

        <div className={styles.mainContent}>
          <h2 className={styles.heading}>LATEST POST</h2>
          {currentBlogs.map((blog) => (
            <div key={blog._id} className={styles.blogCard}>
              <h3 className={styles.blogTitle}>{blog.title}</h3>
              <p className={styles.blogMeta}>
                📖 {new Date(blog.publishedDate).toLocaleDateString()}
              </p>
              <p className={styles.blogExcerpt}>
                {getExcerpt(extractBlogDetail(blog.content))}
              </p>
              <button
                className={styles.readMoreButton}
                onClick={() => handleViewDetails(blog._id)}
              >
                READ MORE ❯
              </button>
            </div>
          ))}

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogList;