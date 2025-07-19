import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";
import JoditEditor from "jodit-react";
import Sidebar from "../Sidebar";
import styles from "./BlogDetail.module.css";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

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

  const handleBackClick = () => navigate("/admin/blogs");
  const handleEditClick = () => setIsEditing(true);
  const handleSaveClick = async () => {
    const updatedContent = editorRef.current ? editorRef.current.value : "";
    const updatedBlog = { ...blog, content: updatedContent };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/blogs/${id}`,
        updatedBlog
      );
      setBlog(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update blog post");
    }
  };

  if (!blog) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={`${styles.container} ${isEditing ? styles.editMode : ""}`}>
      <Sidebar />

      {/* Header - Separate from Content */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <Icon icon="mdi:arrow-left" className={styles.icon} />
        </button>
        {!isEditing && (
          <button
          onClick={handleEditClick}
          className={styles.editButton}
        >
          <Icon icon="mdi:pencil" /> Edit
        </button>
        

          
        )}
      </div>

      {/* Blog Content Container */}
      <div className={styles.contentContainer}>
        <div className={styles.blogDetail}>
          <h1 className={styles.blogTitle}>{blog.title}</h1>
          <p className={styles.blogDate}>
            <Icon icon="mdi:calendar" className={styles.icon} />{" "}
            {new Date(blog.publishedDate).toLocaleDateString()}
          </p>

          {/* Blog Content */}
          <div className={styles.blogContent}>
            {!isEditing ? (
              <div
                className={styles.blogContentHtml}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <JoditEditor ref={editorRef} value={blog.content} />
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <button className={styles.saveButton} onClick={handleSaveClick}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
