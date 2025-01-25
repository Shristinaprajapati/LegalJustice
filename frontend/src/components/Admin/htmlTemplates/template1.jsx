import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Assuming you're using react-router
import { JoditEditor } from 'jodit-react';

const DivorceAgreementForm = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true); // Start loading while fetching the document content

  // Fetch the DivorceAgreement data from the backend and generate the HTML content
  useEffect(() => {
    const fetchAgreementData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/divorseagreement/generate-divorce-agreement/${id}`);
        setHtmlContent(response.data.htmlContent);
        setLoading(false); // Stop loading when the content is received
      } catch (error) {
        console.error('Error generating Divorce Agreement:', error);
        setLoading(false);
        alert('Failed to generate Divorce Agreement');
      }
    };

    if (id) {
      fetchAgreementData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading your Divorce Agreement...</div>;
  }

  return (
    <div>
      <h2>Your Divorce Agreement</h2>

      {htmlContent ? (
        <div>
          <JoditEditor
            value={htmlContent}
            onChange={(newContent) => setHtmlContent(newContent)} // Allows for editing
            config={{
              readonly: false, // set to true if you want it to be read-only
              height: 500,
            }}
          />
        </div>
      ) : (
        <p>Failed to generate Divorce Agreement. Please try again later.</p>
      )}
    </div>
  );
};

export default DivorceAgreementForm;
