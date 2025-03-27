import React, { useState } from "react";
import styles from "./about.module.css";
import { FaAngleDown, FaAngleUp, FaGavel, FaUserTie, FaFileAlt, FaBalanceScale, FaShieldAlt } from "react-icons/fa";

const PracticeAreas = () => {

  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleDescription = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const practiceAreas = [
    // Criminal Law
    { title: "Criminal Defense", description: "Experienced legal representation for criminal charges.", details: "Our team defends against charges like theft, assault, and drug offenses.", icon: <FaGavel />, category: "Criminal Law" },
    { title: "White Collar Crimes", description: "Defense for financial crime cases.", details: "Specializing in fraud, embezzlement, and insider trading cases.", icon: <FaGavel />, category: "Criminal Law" },
    { title: "Domestic Violence", description: "Legal support for domestic violence victims and accused.", details: "We handle cases of domestic violence, providing legal support and defense.", icon: <FaGavel />, category: "Criminal Law" },
    { title: "Drug Offenses", description: "Fighting drug-related criminal charges.", details: "We offer defense for drug possession, trafficking, and related crimes.", icon: <FaGavel />, category: "Criminal Law" },

    // Family Law
    { title: "Divorce", description: "Guidance through the divorce process.", details: "We offer advice on asset division, child custody, and alimony during divorce.", icon: <FaUserTie />, category: "Family Law" },
    { title: "Child Custody", description: "Support for parents navigating child custody cases.", details: "We assist with custody agreements, visitation rights, and parental responsibilities.", icon: <FaUserTie />, category: "Family Law" },
    { title: "Adoption", description: "Helping families with the adoption process.", details: "We provide guidance and legal assistance for adopting children, ensuring a smooth process.", icon: <FaUserTie />, category: "Family Law" },
    { title: "Spousal Support", description: "Legal services for spousal support and alimony cases.", details: "We help clients secure or dispute spousal support payments in divorce cases.", icon: <FaUserTie />, category: "Family Law" },

    // Civil Litigation
    { title: "Contract Disputes", description: "Resolve contract disputes through litigation.", details: "We represent clients in disputes over breach of contract, damages, and more.", icon: <FaFileAlt />, category: "Civil Litigation" },
    { title: "Personal Injury", description: "Legal services for personal injury claims.", details: "We represent individuals seeking compensation for injuries due to accidents or negligence.", icon: <FaFileAlt />, category: "Civil Litigation" },
    { title: "Property Disputes", description: "Resolution for property and land disputes.", details: "We help clients resolve conflicts related to property ownership, boundaries, and disputes.", icon: <FaFileAlt />, category: "Civil Litigation" },
    { title: "Insurance Claims", description: "Assistance with insurance claim disputes.", details: "We provide legal support for clients facing issues with insurance claims, including denied claims.", icon: <FaFileAlt />, category: "Civil Litigation" },

    // Corporate Law
    { title: "Business Formation", description: "Legal guidance on forming a business.", details: "We help clients navigate the process of forming corporations, LLCs, and partnerships.", icon: <FaBalanceScale />, category: "Corporate Law" },
    { title: "Mergers & Acquisitions", description: "Support in mergers and acquisition transactions.", details: "Our team advises on legal strategies for mergers, acquisitions, and company takeovers.", icon: <FaBalanceScale />, category: "Corporate Law" },
    { title: "Intellectual Property", description: "Legal services for intellectual property matters.", details: "We protect patents, trademarks, copyrights, and trade secrets for businesses.", icon: <FaBalanceScale />, category: "Corporate Law" },
    { title: "Corporate Governance", description: "Ensuring proper corporate governance practices.", details: "We advise on corporate structure, director duties, and compliance with regulations.", icon: <FaBalanceScale />, category: "Corporate Law" },

    // Immigration Law
    { title: "Visa Applications", description: "Assistance with visa applications for individuals.", details: "We assist clients in applying for various types of visas including work, student, and family visas.", icon: <FaShieldAlt />, category: "Immigration Law" },
    { title: "Green Card Applications", description: "Legal help for green card applications.", details: "We guide clients through the process of applying for a green card for permanent residency.", icon: <FaShieldAlt />, category: "Immigration Law" },
    { title: "Asylum & Refugee Law", description: "Assistance with asylum and refugee status.", details: "We help individuals seeking asylum or refugee status due to fear of persecution.", icon: <FaShieldAlt />, category: "Immigration Law" },
    { title: "Citizenship Process", description: "Guidance through the citizenship application process.", details: "We assist clients with the legal steps to obtain U.S. citizenship.", icon: <FaShieldAlt />, category: "Immigration Law" },
  ];

  const categories = ["Criminal Law", "Family Law", "Civil Litigation", "Corporate Law", "Immigration Law"];

  const filteredPracticeAreas = selectedCategory === "All" 
    ? practiceAreas 
    : practiceAreas.filter(area => area.category === selectedCategory);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Explore our Practice Areas</h2>
      <p className={styles.subtitle}>
        Providing expert legal services to address your needs with professionalism and care.
      </p>

      <div className={styles.categories}>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`${styles.category} ${selectedCategory === category ? styles.selectedCategory : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.serviceList}>
        {filteredPracticeAreas.map((area, index) => (
          <div key={index} className={styles.serviceItem}>
            <div className={styles.serviceHeader} onClick={() => toggleDescription(index)}>
              <span className={styles.icon}>{area.icon}</span>
              <h3 className={styles.serviceTitle}>{area.title}</h3>
              <p className={styles.serviceDescription}>{area.description}</p>
              <span className={styles.arrow}>
                {openIndex === index ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>
            {openIndex === index && (
              <div className={styles.serviceDetails}>
                <p>{area.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeAreas;
