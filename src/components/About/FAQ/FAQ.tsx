// components/About/FAQ/FAQ.tsx
import React, { useState, useEffect, useRef } from 'react';
import './FAQ.scss';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Array<{question: string, answer: string}>>([]); 
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
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
    },
    {
      question: 'Can I practice before playing with others?',
      answer: 'Yes! We offer a single-player practice mode where you can experiment with prompts and see how DALL-E generates images. This is a great way to get familiar with the game mechanics before joining multiplayer games.'
    },
    {
      question: 'Are there community events or tournaments?',
      answer: 'Absolutely! We host weekly themed challenges and monthly tournaments with prizes. Join our Discord community to stay updated on upcoming events and connect with other players.'
    }
  ];

  // Set up filtered items when component mounts or search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(faqItems);
    } else {
      const filtered = faqItems.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
      
      // Auto-expand first match
      if (filtered.length > 0) {
        const firstMatchIndex = faqItems.findIndex(item => 
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setActiveIndex(firstMatchIndex);
      } else {
        setActiveIndex(null);
      }
    }
  }, [searchTerm]);

  // Initialize filtered items with all FAQ items
  useEffect(() => {
    setFilteredItems(faqItems);
  }, []);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Get highlighted text that shows search matches
  const highlightMatches = (text: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <section className="faq" id="faq">
      <div className="faq__background"></div>
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-description">
          Have questions about GPTuessr? Find answers to the most common questions below.
        </p>
        
        <div className="faq__search-container">
          <div className="faq__search-wrapper">
            <input
              type="text"
              className="faq__search"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search frequently asked questions"
            />
            {searchTerm && (
              <button className="faq__search-clear" onClick={clearSearch} aria-label="Clear search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <span className="faq__search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          {searchTerm && (
            <div className="faq__search-results">
              {filteredItems.length === 0 ? (
                <p>No matching questions found. Try a different search term.</p>
              ) : (
                <p>Found {filteredItems.length} matching results</p>
              )}
            </div>
          )}
        </div>
        
        <div className="faq__accordion">
          {filteredItems.map((item, index) => {
            const actualIndex = faqItems.findIndex(faq => faq.question === item.question);
            
            return (
              <div 
                className={`faq__item ${actualIndex === activeIndex ? 'faq__item--active' : ''} in-viewport`}
                key={actualIndex}
                ref={el => accordionRefs.current[actualIndex] = el}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button 
                  className="faq__question" 
                  onClick={() => toggleAccordion(actualIndex)}
                  aria-expanded={actualIndex === activeIndex}
                  aria-controls={`faq-answer-${actualIndex}`}
                >
                  <div 
                    className="faq__question-text"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMatches(item.question) 
                    }}
                  ></div>
                  <span className={`faq__icon ${actualIndex === activeIndex ? 'faq__icon--active' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                
                {/* Render answer content directly when active */}
                {activeIndex === actualIndex && (
                  <div 
                    className="faq__answer-wrapper"
                    id={`faq-answer-${actualIndex}`}
                  >
                    <div 
                      className="faq__answer"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatches(item.answer) 
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="faq__no-results">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No matching questions found</h3>
            <p>Try using different keywords or <button onClick={clearSearch} className="faq__reset-search">clear your search</button>.</p>
          </div>
        )}
        
        <div className="faq__more">
          <div className="faq__more-content">
            <h3>Still have questions?</h3>
            <p>
              Didn&apos;t find the answer you were looking for? We&apos;re here to help!
            </p>
            <div className="faq__buttons">
              <a href="/support" className="faq__button faq__button--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="currentColor"/>
                </svg>
                Contact Support
              </a>
              <a href="/community" className="faq__button faq__button--secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M23 21V19C22.9986 17.1771 21.7315 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13C17.7356 3.58399 19.0072 5.17838 19.0072 7.005C19.0072 8.83162 17.7356 10.426 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;