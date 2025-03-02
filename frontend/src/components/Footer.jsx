import styles from "./Footer.module.css";

const Footer = () => {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>&copy; 2025 Legal Justice. All rights reserved.</p>
          <nav className={styles.footerNav}>
            <a href='#'>Privacy Policy</a>
            <a href='#'>Terms of Service</a>
            <a href='#'>Contact Us</a>
          </nav>
        </div>
      </footer>
    );
  };

  export default Footer;