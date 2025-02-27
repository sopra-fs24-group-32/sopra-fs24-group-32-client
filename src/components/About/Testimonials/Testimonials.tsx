// components/About/Testimonials/Testimonials.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Testimonials.scss';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  
  const testimonials = [
    {
      quote: "GPTuessr has become our go-to game for team building activities. It's the perfect blend of creativity and competition that gets everyone engaged!",
      author: "Sarah Johnson",
      role: "Team Lead at TechCorp",
      avatar: "/images/testimonials/sarah.jpg"
    },
    {
      quote: "I've played a lot of online games, but GPTuessr stands out for its unique concept. It's fascinating to see how AI interprets our prompts and creates images.",
      author: "Michael Chen",
      role: "Game Developer",
      avatar: "/images/testimonials/michael.jpg"
    },
    {
      quote: "Using GPTuessr in my classroom has been a fantastic way to encourage creative thinking and vocabulary development among my students.",
      author: "Emily Rodriguez",
      role: "High School English Teacher",
      avatar: "/images/testimonials/emily.jpg"
    },
    {
      quote: "As a designer, I find GPTuessr to be not only entertaining but also a great source of unexpected inspiration for my creative projects!",
      author: "David Kim",
      role: "UX Designer",
      avatar: "/images/testimonials/david.jpg"
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
  };

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
  }, [activeIndex]);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <h2 className="section-title">What Players Say</h2>
        <p className="section-description">
          Don&apos;t just take our word for it - hear from our community of players around the world.
        </p>
        
        <div className="testimonials__carousel-container">
          <div className="testimonials__carousel">
            <button 
              className="testimonials__arrow testimonials__arrow--prev" 
              onClick={() => {
                prevSlide();
                resetTimer();
              }}
              aria-label="Previous testimonial"
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
                  <div className="testimonials__slide" key={index}>
                    <div className="testimonials__card">
                      <div className="testimonials__quote">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="testimonials__quote-icon">
                          <path d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V15C10 16.0609 9.57857 17.0783 8.82843 17.8284C8.07828 18.5786 7.06087 19 6 19H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V15C20 16.0609 19.5786 17.0783 18.8284 17.8284C18.0783 18.5786 17.0609 19 16 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p>{testimonial.quote}</p>
                      </div>
                      
                      <div className="testimonials__author">
                        <div className="testimonials__avatar">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.author}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.author)}&background=random`;
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
              className="testimonials__arrow testimonials__arrow--next" 
              onClick={() => {
                nextSlide();
                resetTimer();
              }}
              aria-label="Next testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
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
              />
            ))}
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
                <span>★</span>
              </div>
              Average Rating
            </div>
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
      </div>
    </section>
  );
};

export default Testimonials;