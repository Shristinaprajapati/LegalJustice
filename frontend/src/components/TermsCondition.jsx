import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TermsCondition.module.css";
import Header from "./Main/Header.jsx";
import Footer from './Footer.jsx';

const TermsAndConditions = () => {
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        // Fetch terms and conditions content using the correct type
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/post/content/termsAndConditions`);
        setTermsAndConditions(response.data.content);
      } catch (err) {
        setError("Failed to fetch terms and conditions content.");
        console.error("Error fetching terms and conditions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, []);

  const handleBackClick = () => navigate(-1); // Go back to the previous page

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.container}>
      <Header />
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroText}>Terms and Conditions</div>
      </div>

      {/* Main Content */}
      <div className={styles.contentContainer}>
        <div className={styles.termsAndConditionsContent}>
          <div
            className={styles.termsAndConditionsHtml}
            dangerouslySetInnerHTML={{ __html: termsAndConditions || "No terms and conditions content available." }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;