import React from "react";
import styles from "./Footer.module.css";  // Import the CSS module
import logo from "../assets/images/movieapplogo.jpg";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const Footer = () => {

  // Function to scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };

  return (
    <footer className="text-center text-lg-start text-muted" style={{ backgroundColor: '#f4f4f9', marginTop: '50px', width: '100%', transition: 'background-color 0.2s ease, margin-top 0.2s ease' }}>

      {/* Content Section */}
      <section className="">
        <div className="container text-md-start mt-5 ml-5" style={{ paddingTop: '20px', paddingBottom: '30px' }}>
          <div className="row mt-3">
            {/* Company Section (Logo Column) */}
            <div className={`col-md-6 col-lg-6 col-xl-6 mx-auto mb-4 ${styles.footerColumn} d-flex justify-content-center`}>
              <div className="text-center">
                <img src={logo} alt="Logo" className={styles.footerLogo} />
                <div>
                  <p className={styles.footerDetailText}>
                    Discover, review, and share movies and TV shows with our community-driven platform. Powered by TMDB and Finnkino open data, we provide a rich, up-to-date database to enhance your cinematic experience. Learn more about our platform and features in the About section.
                  </p>
                </div>
              </div>
            </div>

            {/* General Section */}
            <div className={'col-md-1 col-lg-1 col-xl-1 mx-auto'} >
              <h6 className={`text-uppercase fw-bold mb-3 mt-2 ${styles.footerHeading}`}>General</h6>
              <p className={styles.footerText}>
                <Link to="/" className={`text-reset ${styles.footerLink}`} onClick={scrollToTop}>Home</Link>
              </p>
              <p className={styles.footerText}>
                <Link to="/about" className={`text-reset ${styles.footerLink}`} onClick={scrollToTop}>About</Link>
              </p>
              <p className={styles.footerText}>
                <Link to="/" className={`text-reset ${styles.footerLink}`} onClick={scrollToTop}>Privacy Policy</Link>
              </p>
              <p className={styles.footerText}>
                <Link to="/" className={`text-reset ${styles.footerLink}`} onClick={scrollToTop}>Terms of Service</Link>
              </p>
            </div>

            {/* Social Media Follow Section */}
            <div className={'col-md-1 col-lg-1 col-xl-1 mx-auto '} >
              <h6 className={`text-uppercase fw-bold mb-3 mt-2 ${styles.footerHeading}`}>Follow Us</h6>
              <p className={styles.footerText}>
                <a href="https://www.facebook.com" className={`text-reset ${styles.footerLink}`} target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook me-2"></i>Facebook
                </a>
              </p>
              <p className={styles.footerText}>
                <a href="https://www.twitter.com" className={`text-reset ${styles.footerLink}`} target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-twitter me-2"></i>Twitter
                </a>
              </p>
              <p className={styles.footerText}>
                <a href="https://www.instagram.com" className={`text-reset ${styles.footerLink}`} target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram me-2"></i>Instagram
                </a>
              </p>
            </div>

            {/* Contact Section */}
            <div className={'col-md-2 col-lg-2 col-xl-2 mx-auto '} >
              <h6 className={`text-uppercase fw-bold mb-3 mt-2 ${styles.footerHeading}`}>Contact Us</h6>
              <p className={styles.footerText}>
                <i className="bi bi-telephone me-2"></i>+358 xxxxxx
              </p>
              <p className={styles.footerText}>
                <i className="bi bi-envelope me-2"></i>contact@nordflix.com
              </p>
              <p className={styles.footerText}>
                <i className="bi bi-geo-alt me-2"></i>Yliopistokatu 990570 Oulu, FI
              </p>
            </div>

            {/* Newsletter Subscription Section
            <div className={'col-md-3 col-lg-3 col-xl-3 mx-auto '} >
              <h6 className={`text-uppercase fw-bold mb-3 mt-2 ${styles.footerHeading}`}>Subscribe to Our Newsletter</h6>
              <p className={styles.footerText}>
                Stay updated with our latest news and offers. Subscribe to our newsletter!
              </p>
              <form>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    aria-label="Email address"
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </div>
              </form>
            </div> */}

          </div>
        </div>
      </section>

      {/* Copyright Section */}
      <div className="text-center p-3" style={{ backgroundColor: '#6d6d6e', color: '#f4f4f9' }}>
        © 2024 NordFlix. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;