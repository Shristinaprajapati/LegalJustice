import { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import slugify from "slugify";

const AdminBlogForm = ({ blogId, onSave }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (blogId) {
      axios.get(`/api/blogs/${blogId}`).then((res) => {
        setTitle(res.data.title);
        setSlug(res.data.slug);
        setAuthor(res.data.author);
        setContent(res.data.content);
      });
    }
  }, [blogId]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle, { lower: true, strict: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = { title, author, content };

    try {
      if (blogId) {
        await axios.put(`/api/blogs/${blogId}`, blogData);
      } else {
        await axios.post("/api/blogs", blogData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <div className="blog-form-container">
      <h2 className="form-title">{blogId ? "Edit Blog" : "Create Blog"}</h2>
      <form className="blog-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Slug (Auto-generated)</label>
          <input type="text" value={slug} readOnly />
        </div>

        <div className="form-group">
          <label>Author's Name</label>
          <input
            type="text"
            placeholder="Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, "bold", "italic"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
              ],
            }}
          />
        </div>

        <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    type="submit"
    style={{
      padding: "8px 16px", // Reduced padding
      fontSize: "14px", // Smaller font size
      fontWeight: "500",
      width: "100px", // Set a smaller fixed width
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    {blogId ? "Update" : "Publish"}
  </button>
  <button
    type="button"
    onClick={onSave}
    style={{
      padding: "8px 16px", // Reduced padding
      fontSize: "14px", // Smaller font size
      fontWeight: "500",
      width: "100px", // Set a smaller fixed width
      backgroundColor: "#6c757d",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Cancel
  </button>
</div>
      </form>
    </div>
  );
};

export default AdminBlogForm;
