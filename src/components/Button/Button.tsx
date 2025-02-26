// components/Button/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

const Button = ({ 
  label, 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon = null,
  iconPosition = 'left'
}) => {
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    className,
    icon && 'button--with-icon',
    icon && iconPosition === 'right' && 'button--icon-right'
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && (
        <span className="button__icon">{icon}</span>
      )}
      <span className="button__label">{label}</span>
      {icon && iconPosition === 'right' && (
        <span className="button__icon">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right'])
};

export default Button;