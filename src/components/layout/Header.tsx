// components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Button from '../Button/Button';
import 'styles/views/Header.scss';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state
    const location = useLocation();
    const isHomePage = location.pathname === '/';
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    // Close menu when route changes
    useEffect(() => {
      setMenuOpen(false);
    }, [location]);
  
    // Handler for login button
    const handleLoginClick = () => {
      // This is just a placeholder - the actual navigation is handled by the Link
      console.log('Login button clicked');
    };
  
    // Handler for signup button
    const handleSignupClick = () => {
      // This is just a placeholder - the actual navigation is handled by the Link
      console.log('Signup button clicked');
    };
  
    // Handler for logout button
    const handleLogoutClick = () => {
      // Add logout logic here
      console.log('Logout button clicked');
      setIsLoggedIn(false);
      // You would typically call your auth service here
      // authService.logout();
    };
  
    return (
      <header className={`header ${scrolled || !isHomePage ? 'header--scrolled' : ''}`}>
        <div className="header__container">
          <Logo />
          
          <button 
            className={`header__mobile-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            <ul className="header__nav-list">
              {isHomePage ? (
                <>
                  <li className="header__nav-item">
                    <a href="#how-to-play" className="header__nav-link">How to Play</a>
                  </li>
                  <li className="header__nav-item">
                    <a href="#features" className="header__nav-link">Features</a>
                  </li>
                  <li className="header__nav-item">
                    <a href="#about" className="header__nav-link">About</a>
                  </li>
                </>
              ) : (
                <>
                  {isLoggedIn && (
                    <>
                      <li className="header__nav-item">
                        <Link to="/home" className="header__nav-link">Dashboard</Link>
                      </li>
                      <li className="header__nav-item">
                        <Link to="/lobby/create" className="header__nav-link">Create Lobby</Link>
                      </li>
                      <li className="header__nav-item">
                        <Link to="/lobby/join" className="header__nav-link">Join Lobby</Link>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
          
          <div className="header__actions">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button 
                    label="Log In" 
                    variant="outline" 
                    className="header__login-btn"
                    onClick={handleLoginClick}
                  />
                </Link>
                <Link to="/register" className="header__register-link">
                  <Button 
                    label="Sign Up" 
                    variant="primary" 
                    className="header__signup-btn"
                    onClick={handleSignupClick}
                  />
                </Link>
              </>
            ) : (
              <Button 
                label="Logout" 
                variant="outline" 
                onClick={handleLogoutClick} 
                className="header__logout-btn"
              />
            )}
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;