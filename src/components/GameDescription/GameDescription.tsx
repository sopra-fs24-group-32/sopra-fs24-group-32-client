// components/GameDescription/GameDescription.jsx
import React from 'react';
import StepCard from '../StepCard/StepCard';
import './GameDescription.scss';

const GameDescription = () => {
  const steps = [
    {
      id: 1,
      title: 'Create a Prompt',
      description: 'When it\'s your turn, enter a text description to generate an AI image using DALL-E.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Generate Art',
      description: 'DALL-E transforms your text into a unique image that other players will try to guess.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Guess',
      description: 'Other players try to guess what prompt was used to create the image.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Score Points',
      description: 'Win points for accurate guesses and challenging prompts that stump your friends.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];
  
  return (
    <section id="how-to-play" className="game-description">
      <div className="game-description__container">
        <div className="game-description__header">
          <h2 className="game-description__title">How to Play</h2>
          <p className="game-description__subtitle">
            GPTuessr combines creativity with AI technology for a fun, unique gaming experience
          </p>
        </div>
       
        <div className="game-description__steps">
          {steps.map(step => (
            <div key={step.id}>
              <StepCard
                number={step.id}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameDescription;