import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const Main = () => (
  <div className={styles.Main}>
    <Header />  {/* Add Header here to make it visible across all pages */}

    {/* Define Routes */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/service" element={<Services />} />
      {/* The following routes are left as placeholders, but corresponding components are not needed */}
      <Route path="/practice-areas" element={<div />} />
      <Route path="/about" element={<div />} />
      <Route path="/contact" element={<div />} />
    </Routes>
  </div>
);

export default Main;
