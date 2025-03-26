import React, { useEffect } from 'react';
import styles from './ParallaxSection.module.css'; 

const ParallaxSection = () => {
  useEffect(() => {
    // Text rotation effect
    if (typeof window !== 'undefined') {
      const TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
      };

      TxtRotate.prototype.tick = function() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        const that = this;
        let delta = 300 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 500;
        }

        setTimeout(function() {
          that.tick();
        }, delta);
      };

      const elements = document.getElementsByClassName('txt-rotate');
      for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
      }
    }
  }, []);

  return (
    <div className={styles.parallax}>
      <div className={styles.parallaxContent}>
        <h2 className={styles.subheading}>Welcome To Legal Justice</h2>
        <h1 className={styles.heading}>
          Attorneys Fighting For Your 
          <span
            className="txt-rotate"
            data-period="2000"
            data-rotate='[ " Freedom.", " Rights.", " Case.", " Custody." ]'></span>
        </h1>
        <p className={styles.description}>
          We have helped thousands of people get relief from nationwide fights against wrongful denials. 
          Now they trust Legalcare attorneys.
        </p>
        {/* <button className={styles.contactButton}>
          Get Legal Advice <span className={styles.arrowIcon}>→</span>
        </button> */}
      </div>

      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          {[...Array(10)].map((_, i) => (
            <img 
              key={i} 
              src={`/Images/scroll${i % 2 + 1}.png`} 
              alt={`Logo ${i % 2 + 1}`} 
              className={styles.logo}
            />
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default ParallaxSection;