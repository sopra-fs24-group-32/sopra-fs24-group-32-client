import React from "react";
import Logo from "./Logo";
import "styles/views/Footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__description">
              The most creative multiplayer game powered by AI. Create amazing art with DALL-E and challenge your friends to guess what you described!
            </p>
            <div className="footer__social">
              <a href="https://twitter.com" className="footer__social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <nav className="footer__nav">
            <div className="footer__nav-column">
              <h3 className="footer__nav-title">Game</h3>
              <ul className="footer__nav-list">
                <li><a href="#how-to-play" className="footer__nav-link">How to Play</a></li>
                <li><a href="#features" className="footer__nav-link">Features</a></li>
                <li><a href="#" className="footer__nav-link">Leaderboard</a></li>
                <li><a href="#" className="footer__nav-link">Updates</a></li>
              </ul>
            </div>
            
            <div className="footer__nav-column">
              <h3 className="footer__nav-title">Company</h3>
              <ul className="footer__nav-list">
                <li><a href="#about" className="footer__nav-link">About Us</a></li>
                <li><a href="#" className="footer__nav-link">Careers</a></li>
                <li><a href="#" className="footer__nav-link">Press</a></li>
                <li><a href="#" className="footer__nav-link">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer__nav-column">
              <h3 className="footer__nav-title">Support</h3>
              <ul className="footer__nav-list">
                <li><a href="#" className="footer__nav-link">Help Center</a></li>
                <li><a href="#" className="footer__nav-link">FAQ</a></li>
                <li><a href="#" className="footer__nav-link">Community</a></li>
                <li><a href="#" className="footer__nav-link">Feedback</a></li>
              </ul>
            </div>
          </nav>
        </div>
        
        <div className="footer__bottom">
          <div className="footer__legal">
            <p className="footer__copyright">
              &copy; {currentYear} GPTuessr. All rights reserved.
            </p>
            <div className="footer__legal-links">
              <a href="#" className="footer__legal-link">Privacy Policy</a>
              <a href="#" className="footer__legal-link">Terms of Service</a>
              <a href="#" className="footer__legal-link">Cookie Policy</a>
            </div>
          </div>
          <div className="footer__credits">
            <p>Powered by DALL-E & ChatGPT</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;