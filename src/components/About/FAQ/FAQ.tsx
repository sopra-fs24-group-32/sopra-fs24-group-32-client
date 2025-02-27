// components/About/FAQ/FAQ.jsx
import React, { useState } from 'react';
import './FAQ.scss';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: 'What is GPTuessr?',
      answer: 'GPTuessr is an online multiplayer game that combines creative text prompts with AI-generated images. Players take turns creating text prompts that are transformed into images by DALL-E, while other players try to guess what the prompt was.'
    },
    {
      question: 'Do I need to know about AI to play?',
      answer: 'Not at all! GPTuessr is designed to be accessible to everyone. The game handles all the AI aspects behind the scenes, so you can focus on being creative and having fun.'
    },
    {
      question: 'Is GPTuessr free to play?',
      answer: 'We offer a free tier that allows you to join a limited number of games each day. For unlimited play and additional features, we offer Premium subscriptions starting at $4.99/month.'
    },
    {
      question: 'Can I play with my friends?',
      answer: 'Absolutely! You can create private game rooms and invite friends using a unique code or direct links. Private games support 2-10 players.'
    },
    {
      question: 'Is GPTuessr appropriate for all ages?',
      answer: 'Yes, GPTuessr is designed to be family-friendly. We have content filters in place to ensure all prompts and generated images are appropriate for players of all ages.'
    },
    {
      question: 'How long does a typical game last?',
      answer: 'A standard 5-round game with 4-6 players typically takes about 15-20 minutes. You can customize the number of rounds and time limits in private games.'
    },
    {
      question: 'Can I play on mobile devices?',
      answer: 'Yes, GPTuessr is fully responsive and works on smartphones, tablets, and desktop computers. We have native apps available for iOS and Android for an enhanced mobile experience.'
    },
    {
      question: 'How are points calculated?',
      answer: 'Players earn 100 points for exact matches to the original prompt, and 30 points for close guesses. You can also earn bonus points for creating prompts that generate interesting images as voted by other players.'
    }
  ];

  return (
    <section className="faq bg-alt" id="faq">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-description">
          Have questions about GPTuessr? Find answers to the most common questions below.
        </p>
        
        <div className="faq__accordion">
          {faqItems.map((item, index) => (
            <div 
              className={`faq__item ${activeIndex === index ? 'faq__item--active' : ''}`}
              key={index}
            >
              <button 
                className="faq__question" 
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {item.question}
                <span className="faq__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div 
                className="faq__answer-container"
                style={{ 
                  maxHeight: activeIndex === index ? '500px' : '0' 
                }}
                id={`faq-answer-${index}`}
              >
                <div className="faq__answer">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="faq__more">
          <p>
            Still have questions? We&apos;re here to help!
          </p>
          <div className="faq__buttons">
            <a href="/support" className="faq__button faq__button--primary">
              Contact Support
            </a>
            <a href="/docs" className="faq__button faq__button--secondary">
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;