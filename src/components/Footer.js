// import facebook-icon from "../"
import React from 'react';
import facebookicon from "../assets/images/facebookicon.png"
import instagramicon from "../assets/images/instagramicon.jfif"
import twitericon from "../assets/images/twitericon.png"
import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <div>

        <div className={`${styles['footer-container']} ${styles.container}`}>
          <footer className="py-5">
            <div className="row">
              <div className="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
                </ul>
              </div>
        
              <div className="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
                </ul>
              </div>
        
              <div className="col-6 col-md-2 mb-3">
                <h5>Section</h5>
                <ul className="nav flex-column">
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Home</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Features</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">Pricing</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">FAQs</a></li>
                  <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-body-secondary">About</a></li>
                </ul>
              </div>
        
              <div className="col-md-5 offset-md-1 mb-3">
                <form>
                  <h5>Subscribe to our newsletter</h5>
                  <p>Monthly digest of what's new and exciting from us.</p>
                  <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                    <label for="newsletter1" className="visually-hidden">Email address</label>
                    <input id="newsletter1" type="text" className="form-control" placeholder="Email address"/>
                    <button className="btn btn-primary" type="button">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
        
            

            <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
              <p className="mb-0 flex-grow-1">© 2024 Stitch & Thread. All rights reserved.</p>
              {/* <ul className="socialmedia d-flex list-unstyled mb-0"> */}
              <ul className={`${styles.socialmedia} d-flex list-unstyled mb-0`} >
                  <li className="ms-3"><a className="link-body-emphasis" href="https://twitter.com/yourprofile"><img src={twitericon} alt="Twitter"/></a></li>
                  <li className="ms-3"><a className="link-body-emphasis" href="https://instagram.com/yourprofile"><img src={instagramicon} alt="Instagram"/></a></li>
                  <li className="ms-3"><a className="link-body-emphasis" href="https://facebook.com/yourprofile"><img src={facebookicon} alt="Facebook"/></a></li>
              </ul>
            </div>
          </footer>
        </div>             
      
    </div>
  )
}

export default Footer
