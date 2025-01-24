import React from "react";
import styles from "./PracticeArea.module.css";
import Header from "../Header"; 

const practiceAreas = [
  {
    title: "Family Law",
    description: "Providing expert advice and representation on family-related legal matters, including divorce, child custody, and prenuptial agreements.",
    icon: "👪",
  },
  {
    title: "Real Estate Law",
    description: "Handling property disputes, lease agreements, and real estate transactions with precision.",
    icon: "🏠",
  },
  {
    title: "Intellectual Property",
    description: "Protect your inventions, trademarks, and copyrights with our dedicated legal services.",
    icon: "⚖️",
  },
  {
    title: "Corporate Law",
    description: "Guiding businesses with legal compliance, mergers, and contracts.",
    icon: "💼",
  },
  {
    title: "Criminal Law",
    description: "Aggressive representation in criminal defense cases to protect your rights.",
    icon: "👮‍♂️",
  },
];

const testimonials = [
  {
    name: "John Doe",
    feedback: "Legal Justice helped me win a tough case. Their professionalism and dedication are unmatched!",
    photo: "https://via.placeholder.com/100",
  },
  {
    name: "Jane Smith",
    feedback: "They provided excellent legal advice for my business. Highly recommended!",
    photo: "https://via.placeholder.com/100",
  },
];

const PracticeArea = () => {
  return (
    <>
      <Header />

      <div className={styles.container}>

        {/* Practice Area Section */}
        <section className={styles.practiceAreaSection}>
          <h1 className={styles.heading}>Our Practice Areas</h1>
          <p className={styles.description}>
            At <strong>Legal Justice</strong>, we specialize in a variety of legal fields to provide comprehensive services to our clients.
          </p>

          <div className={styles.grid}>
            {practiceAreas.map((area, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.icon}>{area.icon}</div>
                <h2 className={styles.title}>{area.title}</h2>
                <p className={styles.text}>{area.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection}>
          <h2 className={styles.subheading}>What Our Clients Say</h2>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <img src={testimonial.photo} alt={`${testimonial.name}`} className={styles.testimonialPhoto} />
                <p className={styles.testimonialFeedback}>"{testimonial.feedback}"</p>
                <p className={styles.testimonialName}>- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h3>500+</h3>
              <p>Cases Resolved</p>
            </div>
            <div className={styles.statItem}>
              <h3>50+</h3>
              <p>Expert Advocates</p>
            </div>
            <div className={styles.statItem}>
              <h3>10+</h3>
              <p>Years of Experience</p>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className={styles.ctaSection}>
          <div className={styles.cta}>
            <h2>Need Legal Advice?</h2>
            <p>Contact us today to schedule a consultation with one of our experienced advocates.</p>
            <button className={styles.ctaButton}>Schedule Consultation</button>
          </div>
        </section>

      </div>
    </>
  );
};

export default PracticeArea;
