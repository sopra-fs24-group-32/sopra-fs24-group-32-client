// components/About/Testimonials/Testimonials.tsx
import React, { useState, useRef, useEffect } from 'react';
import './Testimonials.scss';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoTransition, setAutoTransition] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced testimonials with more details and testimonial scores
  const testimonials = [
    {
      quote: "GPTuessr has become our go-to game for team building activities. It's the perfect blend of creativity and competition that gets everyone engaged! We've seen improved collaboration and communication among team members since we started using it.",
      author: "Sarah Johnson",
      role: "Team Lead at TechCorp",
      avatar: "/images/testimonials/sarah.jpg",
      rating: 5,
      date: "March 2025"
    },
    {
      quote: "I've played a lot of online games, but GPTuessr stands out for its unique concept. It's fascinating to see how AI interprets our prompts and creates images. The game perfectly balances technological innovation with fun gameplay.",
      author: "Michael Chen",
      role: "Game Developer",
      avatar: "/images/testimonials/michael.jpg",
      rating: 4,
      date: "February 2025"
    },
    {
      quote: "Using GPTuessr in my classroom has been a fantastic way to encourage creative thinking and vocabulary development among my students. They look forward to our weekly sessions, and I've noticed significant improvements in their descriptive language skills.",
      author: "Emily Rodriguez",
      role: "High School English Teacher",
      avatar: "/images/testimonials/emily.jpg",
      rating: 5,
      date: "January 2025"
    },
    {
      quote: "As a designer, I find GPTuessr to be not only entertaining but also a great source of unexpected inspiration for my creative projects! The AI-generated images sometimes give me ideas that I never would have thought of on my own.",
      author: "David Kim",
      role: "UX Designer",
      avatar: "/images/testimonials/david.jpg",
      rating: 5,
      date: "March 2025"
    },
    {
      quote: "My friends and I play GPTuessr every weekend over video chat. It's become our favorite virtual hangout activity because everyone can participate regardless of drawing skills. The laughs we get from the AI interpretations of our prompts are priceless!",
      author: "Olivia Martinez",
      role: "Marketing Specialist",
      avatar: "/images/testimonials/olivia.jpg",
      rating: 4,
      date: "February 2025"
    },
    {
      quote: "GPTuessr has revolutionized our family game nights! Even my grandparents who aren't tech-savvy enjoy playing along. It's wonderful to have a game that brings multiple generations together.",
      author: "James Wilson",
      role: "Software Engineer",
      avatar: "/images/testimonials/james.jpg",
      rating: 5,
      date: "March 2025"
    },
    {
      quote: "The combination of AI art generation and social gaming is brilliant. I'm always impressed by how accurately ChatGPT assesses our guesses. It feels fair and rewarding when you get a match right!",
      author: "Priya Patel",
      role: "AI Researcher",
      avatar: "/images/testimonials/priya.jpg",
      rating: 5,
      date: "January 2025"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match this with the transition duration in SCSS
  };

  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match this with the transition duration in SCSS
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    setIsAnimating(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match this with the transition duration in SCSS
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!isPaused && autoTransition) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 6000); // 6 seconds per slide
    }
  };

  const togglePause = () => {
    setIsPaused(prev => {
      if (!prev && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (prev && autoTransition) {
        resetTimer();
      }
      return !prev;
    });
  };
  
  const toggleAutoTransition = () => {
    setAutoTransition(prev => {
      if (!prev) {
        // If we're turning it back on, reset the timer
        resetTimer();
      } else if (intervalRef.current) {
        // If we're turning it off, clear the interval
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return !prev;
    });
  };

  // Apply slide transition and reset timer when active index changes
  useEffect(() => {
    resetTimer();
    
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex, isPaused, autoTransition]);
  
  // Auto-start the carousel when component mounts
  useEffect(() => {
    resetTimer();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Set up intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport');
            // Pause autoplay when not in view
            if (isPaused) {
              setIsPaused(false);
              resetTimer();
            }
          } else {
            // Pause autoplay when not in view
            if (!isPaused) {
              setIsPaused(true);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('testimonials');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, [isPaused]);

  // Render stars based on rating with proper styling
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => {
      // For full stars
      if (index < Math.floor(rating)) {
        return (
          <span 
            key={index} 
            className="testimonials__star testimonials__star--filled"
            aria-hidden="true"
          >
            ★
          </span>
        );
      }
      // For empty stars
      if (index >= Math.ceil(rating)) {
        return (
          <span 
            key={index} 
            className="testimonials__star"
            aria-hidden="true"
          >
            ★
          </span>
        );
      }
      // For half stars (when rating has .5)
      return (
        <span 
          key={index} 
          className="testimonials__star testimonials__star--half"
          aria-hidden="true"
        >
          ★
        </span>
      );
    });
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__background-pattern"></div>
      <div className="container">
        <h2 className="section-title">What Our Players Say</h2>
        <p className="section-description">
          Join thousands of happy users who have discovered the joy of AI-powered gaming with GPTuessr.
        </p>
        
        <div className="testimonials__carousel-container">
          <div 
            className="testimonials__carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              resetTimer();
            }}
          >
            <button 
              className={`testimonials__arrow testimonials__arrow--prev ${isAnimating ? 'disabled' : ''}`} 
              onClick={() => {
                if (!isAnimating) {
                  prevSlide();
                  resetTimer();
                }
              }}
              aria-label="Previous testimonial"
              disabled={isAnimating}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="testimonials__track-container">
              <div 
                className="testimonials__track" 
                ref={sliderRef}
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    className={`testimonials__slide ${index === activeIndex ? 'testimonials__slide--active' : ''}`}
                    key={index}
                  >
                    <div className="testimonials__card">
                      <div className="testimonials__rating">
                        <div className="testimonials__stars-container">
                          {renderStars(testimonial.rating)}
                        </div>
                        <span className="testimonials__date">{testimonial.date}</span>
                      </div>
                      
                      <div className="testimonials__quote">
                        <div className="testimonials__quote-mark">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="testimonials__quote-icon">
                            <path d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V15C10 16.0609 9.57857 17.0783 8.82843 17.8284C8.07828 18.5786 7.06087 19 6 19H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V15C20 16.0609 19.5786 17.0783 18.8284 17.8284C18.0783 18.5786 17.0609 19 16 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <p>{testimonial.quote}</p>
                      </div>
                      
                      <div className="testimonials__author">
                        <div className="testimonials__avatar">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.author}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=random&color=fff&size=80`;
                            }}
                          />
                        </div>
                        <div className="testimonials__info">
                          <h4>{testimonial.author}</h4>
                          <p>{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className={`testimonials__arrow testimonials__arrow--next ${isAnimating ? 'disabled' : ''}`} 
              onClick={() => {
                if (!isAnimating) {
                  nextSlide();
                  resetTimer();
                }
              }}
              aria-label="Next testimonial"
              disabled={isAnimating}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="testimonials__controls">
            <div className="testimonials__dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`testimonials__dot ${index === activeIndex ? 'testimonials__dot--active' : ''}`}
                  onClick={() => {
                    goToSlide(index);
                    resetTimer();
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
            
            <div className="testimonials__control-buttons">
              <button 
                className={`testimonials__auto ${!autoTransition ? 'testimonials__auto--disabled' : ''}`}
                onClick={toggleAutoTransition}
                aria-label={autoTransition ? "Disable automatic slideshow" : "Enable automatic slideshow"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <button 
                className={`testimonials__pause ${isPaused ? 'testimonials__pause--paused' : ''}`}
                onClick={togglePause}
                aria-label={isPaused ? "Resume automatic slideshow" : "Pause automatic slideshow"}
              >
                {isPaused ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="testimonials__stats">
          <div className="testimonials__stat">
            <div className="testimonials__stat-number">4.8</div>
            <div className="testimonials__stat-label">
              <div className="testimonials__stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="half-star">★</span>
              </div>
              Average Rating
            </div>
          </div>
          
          <div className="testimonials__stat">
            <div className="testimonials__stat-number">10k+</div>
            <div className="testimonials__stat-label">Active Players</div>
          </div>
          
          <div className="testimonials__stat">
            <div className="testimonials__stat-number">95%</div>
            <div className="testimonials__stat-label">Player Satisfaction</div>
          </div>
          
          <div className="testimonials__stat">
            <div className="testimonials__stat-number">87%</div>
            <div className="testimonials__stat-label">Return Players</div>
          </div>
        </div>
        
        <div className="testimonials__cta">
          <a href="/play" className="testimonials__cta-button">Start Playing Now</a>
          <p>Join thousands of players and experience the fun of AI-powered gaming</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;