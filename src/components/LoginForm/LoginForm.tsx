import React, { useEffect, useRef, useState } from 'react';
import './LoginForm.scss';
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, initialMode = "login" }) => {
  // Set initial mode based on initialMode prop
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { openSignIn, openSignUp } = useClerk();
  const { user: clerkUser, isSignedIn } = useUser();
  const profileUpdatedRef = useRef(false);
 
  // Use the auth context to access user state and update function
  const { isAuthenticated, user, isLoading, error } = useAuth();

  // Update auth context when Clerk authentication state changes
  useEffect(() => {
    const updateUserProfile = async () => {
      if (isSignedIn && clerkUser && !profileUpdatedRef.current) {
        profileUpdatedRef.current = true;
        
        // Extract relevant user data from Clerk user object
        const userData = {
          id: clerkUser.id,
          username: clerkUser.username,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          profilePicture: clerkUser.imageUrl,
          // Add any other properties you need from the Clerk user object
        };
      }
    };
    
    updateUserProfile();
    
    // Reset the flag when user signs out
    if (!isSignedIn) {
      profileUpdatedRef.current = false;
    }
  }, [isSignedIn, clerkUser]);

  // Close modal when clicking outside the form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current &&
          !formRef.current.contains(event.target as Node) &&
          modalRef.current &&
          modalRef.current.contains(event.target as Node) &&
          typeof onClose === 'function') {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Redirect to home when user is authenticated
 useEffect(() => {
    if ((isAuthenticated && user) || (isSignedIn && clerkUser)) {
      // Show success state briefly before redirecting
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }
  }, [isAuthenticated, user, isSignedIn, clerkUser, navigate]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="login-modal" ref={modalRef}>
      <div className="login-modal__form-container" ref={formRef}>
        <button
          className="login-modal__close"
          onClick={() => typeof onClose === 'function' && onClose()}
          aria-label="Close"
        >
          &times;
        </button>
       
        {/* Show loading indicator when auth state is being loaded */}
        {isLoading && (
          <div className="login-modal__loading">
            <p>Loading...</p>
          </div>
        )}
       
        {/* Show error message if there's an error */}
        {error && (
          <div className="login-modal__error">
            <p>{error}</p>
          </div>
        )}

        <SignedOut>
          {mode === 'signup' ? (
            <>
              <SignUp
                afterSignUpUrl="/home"
                signInUrl="/login"
                routing="virtual"
              />
              {/* Removed the mode switch section */}
            </>
          ) : (
            <>
              <SignIn
                afterSignInUrl="/home"
                signUpUrl="/register"
                routing="virtual"
              />
              {/* Removed the mode switch section */}
            </>
          )}
        </SignedOut>
       
        <SignedIn>
          <div className="login-modal__signedin">
            <div className="login-modal__success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            
            {(user || (isSignedIn && clerkUser)) && (
              <div className="login-modal__user-info">
                <p className="login-modal__welcome">
                  Welcome, {user?.username || user?.firstName || clerkUser?.username || clerkUser?.firstName || 'User'}!
                </p>
                {(user?.profilePicture || clerkUser?.imageUrl) && (
                  <img
                    src={user?.profilePicture || clerkUser?.imageUrl}
                    alt="Profile"
                    className="login-modal__avatar"
                  />
                )}
              </div>
            )}
            <div className="login-modal__user-button">
              <UserButton />
            </div>
            <p className="login-modal__redirect-text">Redirecting to dashboard...</p>
            <button
              className="login-modal__goto-home"
              onClick={() => {
                onClose();
                navigate("/home");
              }}
            >
              Go to Home
            </button>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default LoginForm;