import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './BlogList.module.css';  // Import the CSS Module

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("/api/blogs").then((res) => setBlogs(res.data));
  }, []);

  return (
    <div className={styles['blog-list-container']}>
      <h2 className={styles['blog-list-heading']}>Latest Blogs</h2>
      {blogs.map((blog) => (
        <div className={styles['blog-item']} key={blog._id}>
          <h3 className={styles['blog-item-title']}>
            <Link to={`/blog/${blog.slug}`} className={styles['blog-item-link']}>
              {blog.title}
            </Link>
          </h3>
          <p className={styles['blog-item-author']}><strong>Author:</strong> {blog.author}</p>
          <p className={styles['blog-item-date']}>{new Date(blog.publishedDate).toLocaleDateString()}</p>
          <Link to={`/blog/${blog.slug}`} className={styles['blog-item-read-more']}>Read More</Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
