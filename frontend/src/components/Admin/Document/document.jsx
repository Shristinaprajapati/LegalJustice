import React, { useRef, useState } from 'react';
import styles from './document.module.css'; // Fixed the typo in the path
import JoditEditor from 'jodit-react';
import axios from 'axios';

const TemplateEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('<p>Enter your template here...</p>');

  const saveTemplate = async () => {
    try {
      await axios.post('/api/templates', { title: 'NDA Template', content });
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  return (
    <div>
      {/* Navbar Section */}
      <div className={`${styles.navbar} flex items-center px-[100px] h-[90px] justify-between bg-[#F4F4F4]`}>
      <img src="/Images/logo1.png" alt="Legal Justice Logo"/>
        <div className={`${styles.right} flex items-center justify-end gap-2`}>
          <div className={`${styles.inputBox} w-[30vw]`}>
            <input type="text" placeholder="Search Here...!" />
          </div>
          <button className={styles.btnBlue}>Search</button>
        </div>
      </div>

      {/* Jodit Editor Section */}
      <JoditEditor
        ref={editor}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />

      {/* Save Button */}
      <button onClick={saveTemplate} className={styles.btnBlue}>
        Save Template
      </button>
    </div>
  );
};

export default TemplateEditor;
