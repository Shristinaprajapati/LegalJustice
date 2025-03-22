import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import { FaSave, FaTimes } from "react-icons/fa";
import styles from "./EditContent.module.css";

const EditContent = ({ content, onSave, onCancel, type }) => {
  const editor = useRef(null);

  // Jodit Editor configuration
  const config = {
    readonly: false,
    placeholder: "Start typing...",
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "ul",
      "ol",
      "font",
      "fontsize",
      "paragraph",
      "link",
      "image",
      "video",
      "table",
      "align",
      "undo",
      "redo",
    ],
    height: 500,
    width: "100%",
    style: {
      fontFamily: "'Arial', sans-serif",
      fontSize: "14px", // Set font size to 14px
      lineHeight: "1.6", // Set line height to 1.6
      color: "#333",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
    },
    defaultMode: "1", // WYSIWYG mode
    enter: "p", // Use <p> tags for new lines
    enterBlock: "p", // Use <p> tags for new blocks
    defaultFontSize: "14px", // Default font size
    defaultLineHeight: "1.6", // Default line height
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newContent = editor.current.value;
    onSave(newContent);
  };

  return (
    <div className={styles.container}>
      {/* Header with Title and Buttons */}
      <div className={styles.header}>
        <h2>{type === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</h2>
        <div className={styles.buttonsWrapper}>
          <button className={styles.cancelButton} onClick={onCancel}>
            <FaTimes /> Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            <FaSave /> Save
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className={styles.editorContainer}>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={(newContent) => (editor.current.value = newContent)}
        />
      </div>
    </div>
  );
};

export default EditContent;