import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./blogclient.module.css";
import Header from "../Main/Header.jsx";
import { htmlToText } from "html-to-text";
import Footer from '../Footer.jsx';

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
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

  const extractBlogDetail = (htmlContent) => {
    if (!htmlContent) return "";
    return htmlToText(htmlContent);
  };

  const getExcerpt = (text) => {
    if (!text) return "";
    const cleanedText = text.replace(/[<>]/g, "");
    const lines = cleanedText.split("\n");
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
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>Legal Justice Blogs</h1>
        </div>
      </div>

      <div className={styles.contentContainer}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Practice Areas</h3>
            <ul className={styles.sidebarList}>
              <li>Banking & Finance Law</li>
              <li>Corporate & Commercial Law</li>
              <li>Litigation & Arbitration</li>
              <li>Mergers & Acquisitions</li>
              <li>Intellectual Property</li>
              <li>Employment Law</li>
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarTitle}>Recent Posts</h3>
            <ul className={styles.sidebarList}>
              {blogs.slice(0, 4).map((blog) => (
                <li key={blog._id} onClick={() => handleViewDetails(blog._id)}>
                  {blog.title}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h2 className={styles.heading}>Latest Legal Articles</h2>
            <div className={styles.resultsCount}>{blogs.length} articles found</div>
          </div>

          <div className={styles.blogList}>
            {currentBlogs.map((blog) => (
              <article key={blog._id} className={styles.blogCard}>
                <div className={styles.blogHeader}>
                  <h3 className={styles.blogTitle}>{blog.title}</h3>
                  <time className={styles.blogDate}>
                    {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className={styles.blogExcerpt}>
                  {getExcerpt(extractBlogDetail(blog.content))}
                </div>
                <button
                  className={styles.readMoreButton}
                  onClick={() => handleViewDetails(blog._id)}
                >
                  Continue Reading
                  <span className={styles.arrowIcon}>→</span>
                </button>
              </article>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={`${styles.paginationButton} ${styles.prevButton}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              className={`${styles.paginationButton} ${styles.nextButton}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminBlogList;