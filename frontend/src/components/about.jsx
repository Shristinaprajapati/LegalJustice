import React, { useState } from "react";
import styles from "./about.module.css";
import { FaAngleDown, FaAngleUp, FaGavel, FaUserTie, FaFileAlt, FaBalanceScale, FaShieldAlt, FaChevronDown } from "react-icons/fa";

const PracticeAreas = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const toggleDescription = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const practiceAreas = [
    // Legal Document Consulting
    { 
      title: "Legal Document Drafting", 
      description: "Professional assistance in drafting legal documents.", 
      details: "We ensure accuracy in contracts, agreements, and legal filings, minimizing risks and delays.", 
      icon: <FaFileAlt />, 
      category: "Legal Documentation" 
    },
    { 
      title: "Contract Review, Advisory", 
      description: "Expert guidance on contract terms and legal risks.", 
      details: "We analyze contracts for potential risks and ensure compliance with legal standards.", 
      icon: <FaFileAlt />, 
      category: "Legal Documentation" 
    },
  
    // Business Consultation
    { 
      title: "Business Compliance", 
      description: "Legal support for starting and managing businesses.", 
      details: "We guide you through company registration, compliance, and legal structuring.", 
      icon: <FaBalanceScale />, 
      category: "Corporate Law" 
    },
    { 
      title: "Risk Advisory", 
      description: "Ensure your business meets legal and regulatory standards.", 
      details: "We help businesses manage risks, draft policies, and navigate legal requirements.", 
      icon: <FaBalanceScale />, 
      category: "Corporate Law" 
    },
  
    // Family Law Consultation
    { 
      title: "Divorce & Separation", 
      description: "Legal guidance for divorce and marital separation.", 
      details: "We assist with asset division, alimony, and child custody matters, prioritizing your interests.", 
      icon: <FaUserTie />, 
      category: "Family Law" 
    },
    { 
      title: "Child Custody & Support", 
      description: "Legal support for custody and child support cases.", 
      details: "We help parents establish custody agreements and secure financial support for their children.", 
      icon: <FaUserTie />, 
      category: "Family Law" 
    },
  
    // Dispute Resolution & Mediation
    { 
      title: "Mediation & Arbitration", 
      description: "Alternative dispute resolution for legal conflicts.", 
      details: "We facilitate negotiations to resolve disputes efficiently, avoiding court proceedings.", 
      icon: <FaGavel />, 
      category: "Dispute Resolution" 
    },
    { 
      title: "Business Disputes", 
      description: "Resolve conflicts between businesses and individuals.", 
      details: "We handle disputes over contracts, agreements, and business operations with legal expertise.", 
      icon: <FaGavel />, 
      category: "Dispute Resolution" 
    },
  
    // Labor Law Consultation
    { 
      title: "Employment Compliance", 
      description: "Ensure fair workplace policies and legal compliance.", 
      details: "We advise on employment contracts, workplace policies, and labor law regulations.", 
      icon: <FaShieldAlt />, 
      category: "Employment Law" 
    },
    { 
      title: "Workplace Disputes", 
      description: "Legal support for workplace conflicts and violations.", 
      details: "We assist in cases of wrongful termination, discrimination, and labor rights violations.", 
      icon: <FaShieldAlt />, 
      category: "Employment Law" 
    },
  
    // Intellectual Property Consultation
    { 
      title: "Copyright Protection", 
      description: "Secure your brand, ideas, and creative works.", 
      details: "We assist in trademark registration, copyright protection, and legal enforcement of IP rights.", 
      icon: <FaBalanceScale />, 
      category: "Intellectual Property" 
    },
    { 
      title: "Patent Advisory", 
      description: "Protect and commercialize your inventions legally.", 
      details: "We guide clients through patent applications, infringement claims, and licensing agreements.", 
      icon: <FaBalanceScale />, 
      category: "Intellectual Property" 
    },
  ];
  

  const categories = ["All", "Criminal Law", "Family Law", "Civil Litigation", "Corporate Law", "Immigration Law"];

  const filteredPracticeAreas = selectedCategory === "All" 
    ? practiceAreas 
    : practiceAreas.filter(area => area.category === selectedCategory);

  const visibleAreas = showAll ? filteredPracticeAreas : filteredPracticeAreas.slice(0, 6);
  const hasMore = !showAll && filteredPracticeAreas.length > 6;

  return (
    <section className={styles.practiceAreas}>
      <div className={styles.header}>
        <div className={styles.sectionLabel}>Practice</div>
        <h2 className={styles.sectionTitle}>Explore Our Practice Areas</h2>
      </div>

      <div className={styles.categoryFilters}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => {
              setSelectedCategory(category);
              setShowAll(false); // Reset to showing 2 when category changes
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.servicesGrid}>
        {visibleAreas.map((area, index) => (
          <div 
            key={index} 
            className={`${styles.serviceCard} ${openIndex === index ? styles.expanded : ''}`}
            onClick={() => toggleDescription(index)}
          >
            <div className={styles.serviceHeader}>
              <div className={styles.serviceIcon}>{area.icon}</div>
              <div className={styles.serviceInfo}>
                <h3>{area.title}</h3>
                <p className={styles.serviceDescription}>{area.description}</p>
              </div>
              <div className={styles.serviceToggle}>
                {openIndex === index ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            </div>
            
            <div className={styles.serviceDetailsWrapper}>
              <div className={styles.serviceDetails}>
                <p>{area.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className={styles.seeMoreContainer}>
          <button className={styles.seeMoreButton} onClick={toggleShowAll}>
            See More <FaChevronDown />
          </button>
        </div>
      )}

      {showAll && (
        <div className={styles.seeMoreContainer}>
          <button className={styles.seeMoreButton} onClick={toggleShowAll}>
            Show Less <FaChevronDown style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}
    </section>
  );
};

export default PracticeAreas;