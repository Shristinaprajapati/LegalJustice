import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import styles from "./blogDetail.module.css";
import Header from "../Main/Header.jsx";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Failed to fetch blog details");
      }
    };
    fetchBlog();
  }, [id]);

  const handleBackClick = () => navigate(-1); // Go back to the previous page

  if (!blog) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <Header />
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroText}>Legal Justice Blogs</div>
      </div>

      {/* Blog Content Container */}
      <div className={styles.contentContainer}>
        <div className={styles.blogDetail}>
        <div className={styles.TitleText}>{blog.title}</div>
          <p className={styles.blogDate}>
            <Icon icon="mdi:calendar" className={styles.icon} />{" "}
            {new Date(blog.publishedDate).toLocaleDateString()}
          </p>

          {/* Blog Content */}
          <div className={styles.blogContent}>
            <div
              className={styles.blogContentHtml}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;