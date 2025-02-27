import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Button from '../Button/Button';
import 'styles/views/Header.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserButton } from "@clerk/clerk-react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const isAboutPage = location.pathname === '/about';
    
    // Use the auth context to get authentication state
    const { isAuthenticated, user, logout, isLoading } = useAuth();
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    const handleLogoClick = () => {
        if (isAuthenticated) {
        navigate('/home');
        } else {
        navigate('/');
        }
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
      console.log('Login button clicked');
    };
  
    // Handler for signup button
    const handleSignupClick = () => {
      console.log('Signup button clicked');
    };
  
    // Handler for logout button
    const handleLogoutClick = async () => {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
  
    return (
      <header className={`header ${scrolled || !isHomePage ? 'header--scrolled' : ''}`}>
        <div className="header__container">
            <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                <Logo />
            </div>
          
          <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
            <ul className="header__nav-list">
              {/* Show these navigation items on Home or About page */}
              {(isHomePage || isAboutPage) ? (
                <>
                  <li className="header__nav-item">
                    <a href={isAboutPage ? "/#how-to-play" : "#how-to-play"} className="header__nav-link">How to Play</a>
                  </li>
                  <li className="header__nav-item">
                    <a href={isAboutPage ? "/#features" : "#features"} className="header__nav-link">Features</a>
                  </li>
                  <li className="header__nav-item">
                    <a href="/about" className="header__nav-link">About</a>
                  </li>
                </>
              ) : (
                <>
                  {isAuthenticated && !isLoading && (
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
            
            {/* Mobile Auth Buttons - Only visible on extra small screens */}
            {!isLoading && !isAuthenticated && (
              <div className="header__mobile-auth">
                <Link to="/login" className="header__mobile-login-link">
                  <Button 
                    label="Log In" 
                    variant="outline" 
                    className="header__login-btn"
                    onClick={handleLoginClick}
                  />
                </Link>
                <Link to="/register" className="header__mobile-register-link">
                  <Button 
                    label="Sign Up" 
                    variant="primary" 
                    className="header__signup-btn"
                    onClick={handleSignupClick}
                  />
                </Link>
              </div>
            )}
            
            {/* Mobile logout button (only for authenticated users) */}
            {!isLoading && isAuthenticated && (
              <div className="header__mobile-auth">
                <Button 
                  label="Logout" 
                  variant="outline" 
                  onClick={handleLogoutClick} 
                  className="header__logout-btn"
                />
              </div>
            )}
          </nav>
          
          <div className="header__actions">
            {!isLoading && (
              !isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button 
                      label="Sign In" 
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
                <div className="header__user-container">
                  {user && (
                    <div className="header__user-info">
                      <span className="header__username">
                        {user.username || user.firstName || 'User'}
                      </span>
                      <div className="header__user-button">
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
            {isLoading && (
              <div className="header__loading">
                <div className="header__loading-spinner"></div>
              </div>
            )}
          </div>
          
          {/* Mobile menu toggle button - moved after all other elements */}
          <button 
            className={`header__mobile-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    );
};
  
export default Header;