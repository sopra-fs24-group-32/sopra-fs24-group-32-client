// components/About/HowToPlay/HowToPlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import './HowToPlay.scss';
import { useLocation } from 'react-router-dom';

const HowToPlay = () => {
  const [activeTab, setActiveTab] = useState('steps');
  const [isVisible, setIsVisible] = useState({
    steps: false,
    demo: false,
    rules: false,
    tips: false
  });

  const sectionRefs = {
    steps: useRef(null),
    demo: useRef(null),
    rules: useRef(null),
    tips: useRef(null)
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = entry.target.getAttribute('data-section');
          if (targetId) {
            setIsVisible(prev => ({ ...prev, [targetId]: true }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Create a Prompt',
      description: 'Take turns crafting creative text prompts that will be used to generate images.',
      icon: '✍️',
      color: '#6366f1' // Primary color
    },
    {
      number: 2,
      title: 'Generate an Image',
      description: 'Your text prompt is transformed into a unique image using DALL-E AI technology.',
      icon: '🖼️',
      color: '#8b5cf6' // Secondary color
    },
    {
      number: 3,
      title: 'Players Guess',
      description: 'Other players try to guess what prompt was used to create the image.',
      icon: '🤔',
      color: '#ec4899' // Pink/accent
    },
    {
      number: 4,
      title: 'Score Points',
      description: 'Earn points for accurate guesses and creating prompts that generate interesting images.',
      icon: '🏆',
      color: '#10b981' // Success green
    }
  ];

  const rules = [
    {
      icon: '⏱️',
      title: 'Time Limits',
      description: 'Players have 30 seconds to submit a guess once an image is generated.'
    },
    {
      icon: '👍',
      title: 'Prompt Guidelines',
      description: 'Prompts should be creative but appropriate for all ages.'
    },
    {
      icon: '🎯',
      title: 'Scoring',
      description: '100 points for exact matches, 30 points for close guesses.'
    },
    {
      icon: '🔄',
      title: 'Turn Rotation',
      description: 'Players take turns creating prompts in a clockwise rotation.'
    }
  ];

  const tips = [
    'Be specific in your prompts for more recognizable images',
    'Look for small details in images that might reveal the prompt',
    'Try to create prompts that are challenging but not impossible',
    'The more you play, the better you\'ll get at both creating and guessing!'
  ];

  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay for smooth transition
      }
    }
  }, [hash]);

  return (
    <section className="how-to-play" id="how-to-play">
      <div className="how-to-play__bg-shapes">
        <div className="how-to-play__shape how-to-play__shape--1"></div>
        <div className="how-to-play__shape how-to-play__shape--2"></div>
        <div className="how-to-play__shape how-to-play__shape--3"></div>
      </div>
      
      <div className="container">
        <div className="how-to-play__header">
          <div className="how-to-play__badge">Game Instructions</div>
          <h2 className="section-title">How To <span className="highlight">Play</span></h2>
          <p className="section-description">
            GPTuessr is easy to learn but offers endless creativity. Follow these simple steps to get started!
          </p>
          
          <div className="how-to-play__tabs">
            <button 
              className={`how-to-play__tab ${activeTab === 'steps' ? 'how-to-play__tab--active' : ''}`}
              onClick={() => setActiveTab('steps')}
            >
              Game Steps
            </button>
            <button 
              className={`how-to-play__tab ${activeTab === 'rules' ? 'how-to-play__tab--active' : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              Rules
            </button>
            <button 
              className={`how-to-play__tab ${activeTab === 'tips' ? 'how-to-play__tab--active' : ''}`}
              onClick={() => setActiveTab('tips')}
            >
              Pro Tips
            </button>
          </div>
        </div>
        
        <div className="how-to-play__tab-content">
          {/* Game Steps */}
          <div 
            className={`how-to-play__content ${activeTab === 'steps' ? 'how-to-play__content--active' : ''}`}
            ref={sectionRefs.steps}
            data-section="steps"
          >
            <div className={`how-to-play__steps ${isVisible.steps ? 'is-visible' : ''}`}>
              {steps.map((step, index) => (
                <div 
                  className="how-to-play__step" 
                  key={step.number}
                  style={{'--animation-delay': `${index * 0.15}s`, '--step-color': step.color}}
                >
                  <div className="how-to-play__step-progress">
                    <div className="how-to-play__step-line-top"></div>
                    <div className="how-to-play__step-number">{step.number}</div>
                    <div className="how-to-play__step-line-bottom"></div>
                  </div>
                  
                  <div className="how-to-play__step-content">
                    <div className="how-to-play__step-icon-wrapper">
                      <div className="how-to-play__step-icon">{step.icon}</div>
                    </div>
                    <h3 className="how-to-play__step-title">{step.title}</h3>
                    <p className="how-to-play__step-description">{step.description}</p>
                  </div>
                  
                  <div className="how-to-play__step-shine"></div>
                </div>
              ))}
            </div>
            
            <div 
              className={`how-to-play__demo ${isVisible.demo ? 'is-visible' : ''}`}
              ref={sectionRefs.demo}
              data-section="demo"
            >
              <div className="how-to-play__demo-content">
                <div className="how-to-play__demo-badge">Video Tutorial</div>
                <h3>See the Game in Action</h3>
                <p>
                  Watch our quick demo video to see how GPTuessr works in real-time. Witness the fun and creativity that happens when players collaborate with AI!
                </p>
                <a href="#video-modal" className="how-to-play__demo-button">
                  Watch Demo
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
              <div className="how-to-play__demo-video">
                <div className="how-to-play__video-wrapper">
                  <img 
                    src="/images/game-demo-thumbnail.jpg" 
                    alt="GPTuessr gameplay demo" 
                    className="how-to-play__video-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/640x360?text=GPTuessr+Demo+Video";
                    }}
                  />
                  <div className="how-to-play__video-overlay">
                    <div className="how-to-play__play-button">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rules Tab */}
          <div 
            className={`how-to-play__content ${activeTab === 'rules' ? 'how-to-play__content--active' : ''}`}
            ref={sectionRefs.rules}
            data-section="rules"
          >
            <div className={`how-to-play__rules ${isVisible.rules ? 'is-visible' : ''}`}>
              <div className="how-to-play__rules-header">
                <h3>Game Rules</h3>
                <p>GPTuessr is designed to be flexible and fun, but here are some basic rules to ensure everyone has a great time:</p>
              </div>
              
              <div className="how-to-play__rules-grid">
                {rules.map((rule, index) => (
                  <div 
                    className="how-to-play__rule" 
                    key={index}
                    style={{'--animation-delay': `${index * 0.15}s`}}
                  >
                    <div className="how-to-play__rule-icon-wrapper">
                      <div className="how-to-play__rule-icon">{rule.icon}</div>
                    </div>
                    <div className="how-to-play__rule-content">
                      <h4>{rule.title}</h4>
                      <p>{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tips Tab */}
          <div 
            className={`how-to-play__content ${activeTab === 'tips' ? 'how-to-play__content--active' : ''}`}
            ref={sectionRefs.tips}
            data-section="tips"
          >
            <div className={`how-to-play__tips ${isVisible.tips ? 'is-visible' : ''}`}>
              <div className="how-to-play__tips-header">
                <div className="how-to-play__tips-icon">💡</div>
                <h3>Pro Tips for Winning</h3>
                <p>Master these strategies to maximize your chances of winning:</p>
              </div>
              
              <ul className="how-to-play__tips-list">
                {tips.map((tip, index) => (
                  <li 
                    key={index} 
                    style={{'--animation-delay': `${index * 0.15}s`}}
                    className="how-to-play__tip-item"
                  >
                    <div className="how-to-play__tip-number">{index + 1}</div>
                    <div className="how-to-play__tip-text">{tip}</div>
                  </li>
                ))}
              </ul>
              
              <div className="how-to-play__tips-footer">
                <p>Ready to put these tips into practice?</p>
                <a href="/register" className="how-to-play__tips-cta">
                  Play Now
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="how-to-play__wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HowToPlay;