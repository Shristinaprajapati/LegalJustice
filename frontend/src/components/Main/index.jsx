import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import ParallaxSection from '../ParallaxSection.jsx';
import ScrollableFrame from '../ScrollableFrame.jsx';
import Service from '../Service.jsx';
import Header from './Header.jsx';  
import styles from './styles.module.css';

const Home = () => (
  <div>
    <ParallaxSection />
    <ScrollableFrame />
  </div>
);

const Services = () => (
  <Service />
);

const PracticeAreas = () => (
  <section className={styles.practiceAreasSection} id="practice-areas">
    <h2>Practice Areas</h2>
    <div className={styles.practiceAreasList}>
      <div className={styles.practiceAreaItem}>
        <h3>Family Law</h3>
        <p>Handling divorce, custody, and adoption cases.</p>
      </div>
      <div className={styles.practiceAreaItem}>
        <h3>Criminal Law</h3>
        <p>Providing defense for various criminal charges.</p>
      </div>
      <div className={styles.practiceAreaItem}>
        <h3>Corporate Law</h3>
        <p>Advising businesses on legal compliance and disputes.</p>
      </div>
    </div>
  </section>
);

const About = () => (
  <section>
    <h2>About Us</h2>
    <p>Information about the legal firm and its history.</p>
  </section>
);

const Contact = () => (
  <footer className={styles.footer} id="contact">
    <div className={styles.footerContent}>
      <h3>Contact Us</h3>
      <p>Legal Justice</p>
      <p>Email: info@legaljustice.com</p>
      <p>Phone: +1 (123) 456-7890</p>
      <p>Address: 123 Justice Street, City, Country</p>
    </div>
    <p>&copy; 2024 Legal Justice. All rights reserved.</p>
  </footer>
);

const Main = () => (
  <div className={styles.Main}>
    <Header />  {/* Add Header here to make it visible across all pages */}

    {/* Define Routes */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/service" element={<Services />} />
      <Route path="/practice-areas" element={<PracticeAreas />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </div>
);

export default Main;
