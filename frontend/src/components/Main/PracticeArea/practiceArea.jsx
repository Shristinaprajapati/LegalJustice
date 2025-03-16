import React from "react";
import styles from "./PracticeArea.module.css";
import Header from "../Header";

const practiceAreas = [
  {
    title: "Banking & Finance",
    description: "Expertise in high-value, complex transactions and regulatory compliance.",
    icon: "🏦",
  },
  {
    title: "Corporate & Commercial",
    description: "Comprehensive legal services for businesses, including contracts and compliance.",
    icon: "💼",
  },
  {
    title: "Litigation & Arbitration",
    description: "Effective dispute resolution through litigation and arbitration.",
    icon: "⚖️",
  },
  {
    title: "Mergers & Acquisitions",
    description: "Guidance through complex mergers, acquisitions, and corporate restructuring.",
    icon: "🤝",
  },
];

const latestPosts = [
  {
    title: "Arbitration Law and Procedure in Nepal",
    date: "2023-10-01",
  },
  {
    title: "Nepal Project Finance Guide",
    date: "2023-09-25",
  },
  {
    title: "Doing Business in Nepal Guide",
    date: "2023-09-18",
  },
  {
    title: "Overview of the New Foreign Investment Act 2019",
    date: "2023-09-10",
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

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Senior Advocate",
    photo: "https://via.placeholder.com/150",
  },
  {
    name: "Bob Smith",
    role: "Corporate Lawyer",
    photo: "https://via.placeholder.com/150",
  },
  {
    name: "Charlie Brown",
    role: "Litigation Expert",
    photo: "https://via.placeholder.com/150",
  },
];

const blogPosts = [
  {
    title: "Understanding Corporate Law in Nepal",
    date: "2023-10-05",
  },
  {
    title: "Key Changes in the New Labor Law",
    date: "2023-09-28",
  },
  {
    title: "How to Protect Your Intellectual Property",
    date: "2023-09-20",
  },
];

const PracticeArea = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* Practice Area Section */}
        <section className={styles.practiceAreaSection} style={{ backgroundColor: "#ffffff" }}>
          <h1 className={styles.heading}>PRACTICE AREAS</h1>
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

        {/* Latest Post Section */}
        <section className={styles.latestPostSection} style={{ backgroundColor: "#fcfcfc" }}>
          <h2 className={styles.subheading}>LATEST POST</h2>
          <div className={styles.postList}>
            {latestPosts.map((post, index) => (
              <div key={index} className={styles.postItem}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDate}>{new Date(post.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection} style={{ backgroundColor: "#ffffff" }}>
          <h2 className={styles.subheading}>Our Achievements</h2>
          <div className={styles.statsGrid}>
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

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection} style={{ backgroundColor: "#fcfcfc" }}>
          <h2 className={styles.subheading}>What Our Clients Say</h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialItem}>
                <img src={testimonial.photo} alt={testimonial.name} className={styles.testimonialPhoto} />
                <p className={styles.testimonialFeedback}>"{testimonial.feedback}"</p>
                <p className={styles.testimonialName}>- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection} style={{ backgroundColor: "#ffffff" }}>
          <h2 className={styles.subheading}>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <img src={member.photo} alt={member.name} className={styles.teamPhoto} />
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Highlights Section */}
        <section className={styles.blogHighlightsSection} style={{ backgroundColor: "#fcfcfc" }}>
          <h2 className={styles.subheading}>From Our Blog</h2>
          <div className={styles.blogHighlightsList}>
            {blogPosts.map((post, index) => (
              <div key={index} className={styles.blogHighlightItem}>
                <h3 className={styles.blogHighlightTitle}>{post.title}</h3>
                <p className={styles.blogHighlightDate}>{new Date(post.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className={styles.ctaSection} style={{ backgroundColor: "#ffffff" }}>
          <h2 className={styles.subheading}>Need Legal Advice?</h2>
          <p className={styles.ctaText}>Contact us today to schedule a consultation with one of our experienced advocates.</p>
          <button className={styles.ctaButton}>Schedule Consultation</button>
        </section>
      </div>
    </>
  );
};

export default PracticeArea;