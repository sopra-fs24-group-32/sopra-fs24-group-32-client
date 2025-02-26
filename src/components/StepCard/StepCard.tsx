// components/StepCard/StepCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './StepCard.scss';

const StepCard = ({ number, title, description, icon }) => {
    return (
      <div className="step-card">
        <div className="step-card__number">{number}</div>
        
        <div className="step-card__icon">
          {icon}
        </div>
        
        <h3 className="step-card__title">{title}</h3>
        
        <p className="step-card__description">{description}</p>
        
        <div className="step-card__dots">
          <span className="step-card__dot"></span>
          <span className="step-card__dot"></span>
          <span className="step-card__dot"></span>
        </div>
      </div>
    );
  };

StepCard.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

export default StepCard;