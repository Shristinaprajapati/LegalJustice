import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./privacyPolicy.module.css"; 
import Header from "./Main/Header.jsx";
import Footer from './Footer.jsx';

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        // Fetch privacy policy content using the correct type
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/post/content/privacyPolicy`);
        setPrivacyPolicy(response.data.content);
      } catch (err) {
        setError("Failed to fetch privacy policy content.");
        console.error("Error fetching privacy policy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const handleBackClick = () => navigate(-1); // Go back to the previous page

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.container}>
      <Header />
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroText}>Privacy Policy</div>
      </div>

      {/* Main Content */}
      <div className={styles.contentContainer}>
        <div className={styles.privacyPolicyContent}>
          <div
            className={styles.privacyPolicyHtml}
            dangerouslySetInnerHTML={{ __html: privacyPolicy || "No privacy policy content available." }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;