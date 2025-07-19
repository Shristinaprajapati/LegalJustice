import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import styles from "./blogDetail.module.css";
import Header from "../Main/Header.jsx";
import Footer from '../Footer.jsx';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog details");
      }
    };
    fetchBlog();
  }, [id]);

  const handleBackClick = () => navigate(-1);

  if (!blog) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.contentWrapper}>
        <div className={styles.blogContainer}>
          <button onClick={handleBackClick} className={styles.backButton}>
            <Icon icon="mdi:arrow-left" /> Back to Articles
          </button>
          
          <h1 style={{
  fontSize: "2rem",
  color: "#003366",
  margin: "0 0 20px 0",
  lineHeight: "1.3",
  fontWeight: "600",
  textShadow: "none"
}}>
  {blog.title}
</h1>
          
          <div className={styles.blogMeta}>
            <span className={styles.blogDate}>
              <Icon icon="mdi:calendar" className={styles.icon} />
              {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          <div 
            className={styles.blogContent}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
          <h3 style={{
  fontWeight: "bold"
}}
className={styles.sidebarTitle}>
  Practice Areas
</h3>
            <ul className={styles.sidebarList}>
              <li>Banking & Finance</li>
              <li>Corporate & Commercial</li>
              <li>Litigation & Arbitration</li>
              <li>Mergers & Acquisitions</li>
            </ul>
          </div>

          <div className={styles.sidebarSection}>
            <h3 
            style={{
              fontWeight: "bold"
            }}className={styles.sidebarTitle}>Latest Posts</h3>
            <ul className={styles.sidebarList}>
              <li>Arbitration law in Nepal</li>
              <li>Nepal Project Finance Guide</li>
              <li>Doing Business in Nepal</li>
              <li>Foreign Investment Act 2019</li>
            </ul>
          </div>
        </aside>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;