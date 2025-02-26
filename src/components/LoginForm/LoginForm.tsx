// components/LoginForm/LoginForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import './LoginForm.scss';
import { api, handleError } from "../../helpers/api";
import User from "../../models/User";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onClose, onToggleMode, initialMode }) => {
  // Set initial signup state based on initialMode prop
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const toggleMode = () => {
    // Update local state
    const newSignUpState = !isSignUp;
    setIsSignUp(newSignUpState);
    setError('');
    
    // Call the callback if provided
    if (typeof onToggleMode === 'function') {
      onToggleMode(newSignUpState);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!username.trim()) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await doRegister();
      } else {
        await doLogin();
      }
      
      // Close modal after successful login/registration
      if (typeof onClose === 'function') {
        onClose();
      }
      
    } catch (error) {
      console.error(`Authentication error: ${handleError(error)}`);
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      // Get the returned user and update a new object
      const user = new User(response.data);

      // Store the userToken into the local storage
      localStorage.setItem("userToken", user.userToken);
      localStorage.setItem("username", user.username);
      localStorage.setItem("id", user.id);

      // Navigate to the home page
      navigate("/home");
    } catch (error) {
      console.error(`Login failed: ${handleError(error)}`);
      throw error;
    }
  };

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, email, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object
      const user = new User(response.data);

      // Store the userToken into the local storage
      localStorage.setItem("userToken", user.userToken);
      localStorage.setItem("username", user.username);
      localStorage.setItem("id", user.id);

      // Navigate to the home page
      navigate("/home");
    } catch (error) {
      console.error(`Registration failed: ${handleError(error)}`);
      throw error;
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && typeof onClose === 'function') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="login-modal">
      <div className="login-modal__content" ref={modalRef}>
        <button 
          className="login-modal__close" 
          onClick={() => typeof onClose === 'function' && onClose()}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="login-modal__header">
          <h2 className="login-modal__title">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="login-modal__subtitle">
            {isSignUp 
              ? 'Join the GPTuessr community and start playing!' 
              : 'Log in to continue your GPTuessr adventure'
            }
          </p>
        </div>

        {error && (
          <div className="login-modal__error">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label htmlFor="username" className="login-form__label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="login-form__input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <div className="login-form__field">
              <label htmlFor="email" className="login-form__label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="login-form__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="login-form__field">
            <label htmlFor="password" className="login-form__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-form__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {!isSignUp && (
            <div className="login-form__forgot">
              <a href="#reset-password">Forgot password?</a>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            label={isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
            className="login-form__submit"
            disabled={isLoading}
            onClick={() => {}} // Empty onClick handler to satisfy prop type requirement
          />
        </form>

        <div className="login-modal__toggle">
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
          <button 
            className="login-modal__toggle-btn" 
            onClick={toggleMode}
            disabled={isLoading}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onToggleMode: PropTypes.func,
  initialMode: PropTypes.oneOf(['login', 'signup'])
};

LoginForm.defaultProps = {
  initialMode: 'login'
};

export default LoginForm;