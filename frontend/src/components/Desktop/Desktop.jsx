import React from "react";
import dividerImage2 from "./assets/profile1.jpg";
import "./styles.css";

const Desktop = () => {
  return (
    <div className="desktop">
      <div className="content-container">
        <div className="header-section">
          <h1 className="main-heading">Dedicated Legal Support for</h1>
          <div className="scratch-section">
            <h2 className="scratch-heading">
              <span className="from-text">Every </span>
              <span className="scratch-text">Step</span>
            </h2>
          </div>
          <div className="underline"></div>
        </div>

        <p className="description">
        At Legal Justice, we offer friendly and helpful legal support for all your needs. Our team is here to guide you through every step.
        </p>

        <div className="divider-container">
          <img src={dividerImage2} alt="Divider line" className="divider-image" />
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">2.5k</div>
            <div className="stat-label">Projects Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Years of Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Trusted Companies</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1.5k</div>
            <div className="stat-label">Happy Clients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;