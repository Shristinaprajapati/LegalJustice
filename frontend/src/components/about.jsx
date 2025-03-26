import React, { useEffect } from 'react';

const Hero = () => {
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
    <div className="hero-wrap js-fullheight" style={{ backgroundImage: "url('images/bg_1.jpg')" }} data-stellar-background-ratio="0.5">
      <div className="overlay"></div>
      <div className="container">
        <div className="row no-gutters slider-text js-fullheight align-items-center justify-content-start" data-scrollax-parent="true">
          <div className="col-md-6 ftco-animate">
            <h2 className="subheading">Welcome To Legalcare</h2>
            <h1>Attorneys Fighting For Your 
              <span
                className="txt-rotate"
                data-period="2000"
                data-rotate='[ " Freedom.", " Rights.", " Case.", " Custody." ]'></span>
            </h1>
            <p className="mb-4">We have help thousands of people to get relief from national wide fights wrongfull denials. Now they trusted legalcare attorneys</p>
            <p><a href="#" className="btn btn-primary mr-md-4 py-2 px-4">Get Legal Advice <span className="ion-ios-arrow-forward"></span></a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;