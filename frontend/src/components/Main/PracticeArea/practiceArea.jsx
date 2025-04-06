import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PracticeArea.module.css";
import Header from "../Header";
import About from '../../about.jsx';
import { htmlToText } from "html-to-text";
import Footer from "../../Footer.jsx";

const practiceAreas = [
  {
    title: "Banking & Finance",
    description: "Expertise in high-value, complex transactions and regulatory compliance.",
    icon: "🏦",
    bgImage: "/images/banking.jpg"
  },
  {
    title: "Corporate & Commercial",
    description: "Comprehensive legal services for businesses, including contracts and compliance.",
    icon: "💼",
    bgImage: "/images/corporate.jpg"
  },
  {
    title: "Litigation & Arbitration",
    description: "Effective dispute resolution through litigation and arbitration.",
    icon: "⚖️",
    bgImage: "/images/litigation.jpg"
  },
  {
    title: "Mergers & Acquisitions",
    description: "Guidance through complex mergers, acquisitions, and corporate restructuring.",
    icon: "🤝",
    bgImage: "/images/mergers.jpg"
  },
];

const teamMembers = [
  {
    name: "Alice Johnson",
    role: "Senior Advocate",
    photo: "/images/team/member1.jpg"
  },
  {
    name: "Bob Smith",
    role: "Corporate Lawyer",
    photo: "/images/team/member2.jpg"
  },
  {
    name: "Charlie Brown",
    role: "Litigation Expert",
    photo: "/images/team/member3.jpg"
  }
];

const blogPosts = [
  {
    title: "Understanding Your Rights During a Police Stop",
    excerpt: "Learn what you should and shouldn't do when interacting with law enforcement.",
    date: "2023-11-15",
    readTime: "4 min read"
  },
  {
    title: "The Divorce Process: What to Expect",
    excerpt: "A step-by-step guide to navigating divorce proceedings in your state.",
    date: "2023-11-08",
    readTime: "6 min read"
  },
  {
    title: "Workplace Discrimination: Know Your Rights",
    excerpt: "Identifying and responding to illegal discrimination in the workplace.",
    date: "2023-10-30",
    readTime: "5 min read"
  }
];


const services = [
  {
    icon: '⚖️',
    title: 'Litigation & Dispute Resolution',
    description: 'Expert representation in civil and commercial litigation, with a proven track record of successful case outcomes in trials and settlements.'
  },
  {
    icon: '🏢',
    title: 'Corporate & Business Law',
    description: 'Comprehensive legal services for businesses including formation, contracts, compliance, and corporate governance matters.'
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Law',
    description: 'Compassionate guidance through divorce, child custody, adoption, and other sensitive family legal matters.'
  }
];

const testimonials = [
  {
    quote: "The team handled my case with professionalism and care. I couldn't have asked for better representation.",
    author: "Sarah Johnson",
    case: "Personal Injury Claim"
  },
  {
    quote: "They made the complex immigration process straightforward and kept me informed every step of the way.",
    author: "Miguel Rodriguez",
    case: "Citizenship Application"
  },
  {
    quote: "Our corporate merger was handled flawlessly thanks to their expertise and attention to detail.",
    author: "Jennifer Lee",
    case: "Business Acquisition"
  }
];

const PracticeArea = () => {

  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchBlogs();
    fetchTestimonials();
  }, []);


  const fetchTestimonials = async () => {
    try {
      const res = await axios.get('/api/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/blogDetail/${id}`);
  };

  const getExcerpt = (text) => {
    if (!text) return "";
    const cleanedText = text.replace(/[<>]/g, "");
    const lines = cleanedText.split("\n");
    return lines.slice(2, 5).join("\n");
  };
   const extractBlogDetail = (htmlContent) => {
      if (!htmlContent) return "";
      return htmlToText(htmlContent);
    };

  return (
    <div className={styles.wrapper}>
      <Header />
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>Practice Areas</h1>
        </div>
      </div>

      <div className={styles.servicesContainer}>
      <div className={styles.leftSection}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceItem}>
            <span className={styles.icon}>{service.icon}</span>
            <div className={styles.serviceContent}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.rightSection}>
        {/* <div className={styles.statsCard}>
          <div className={styles.statsContent}>
            <div className={styles.statItem}>
              <span className={styles.number}>10</span>
              <span className={styles.label}>YEARS EXPERIENCE</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <span className={styles.number}>254</span>
              <span className={styles.label}>TYPES OF COURSES</span>
            </div>
          </div>
        </div> */}
        <img src="/Images/hero3.png" alt="office2" className={styles.image} />
      </div>
    </div>


    <About/>
      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <p>Cases Resolved</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <p>Expert Advocates</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10+</span>
              <p>Years of Experience</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>95%</span>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>


 {/* Blog Section */}
 <section className={styles.blogSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Legal Insights</h2>
            <p className={styles.sectionSubtitle}>Stay informed with our latest articles and updates</p>
            <div className={styles.titleDivider}></div>
          </div>
          
          <div className={styles.blogGrid}>
            {blogs.map((blog) => (
              <div key={blog._id} className={styles.blogCard}>
                <div className={styles.blogHeader}>
                  <div className={styles.blogDate}>
                    {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <span className={styles.readTime}>5 min read</span>
                </div>
                <h3>{blog.title}</h3>
                <div className={styles.blogExcerpt}>
                                  {getExcerpt(extractBlogDetail(blog.content))}
                                </div>
                <button 
                  className={styles.readMore}
                  onClick={() => handleViewDetails(blog._id)}
                >
                  Read Article →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Updated to use fetched testimonials */}
      <section className={styles.testimonialSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Client Testimonials</h2>
            <p className={styles.sectionSubtitle}>Hear what our clients say about our services</p>
            <div className={styles.titleDivider}></div>
          </div>
          
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className={styles.testimonialCard}>
                <div className={styles.quoteMark}>"</div>
                <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.case}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
    
  );
};

export default PracticeArea;