// components/About/Team/Team.jsx
import React, { useEffect, useRef } from 'react';
import './Team.scss';

const Team = () => {
  const sectionRef = useRef(null);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport');
          }
        });
      },
      { threshold: 0.1 }
    );

    const memberCards = document.querySelectorAll('.team__member');
    memberCards.forEach((card) => observer.observe(card));

    return () => {
      memberCards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  const teamMembers = [
    {
      name: 'Roger Jeasy Bavibidila',
      role: 'Backend Developer',
      bio: 'Core backend engineer focusing on server infrastructure and API integration with DALL-E and ChatGPT for image generation and answer verification.',
      github: 'rogerjeasy',
      email: 'rogerjeasy.bavibidila@uzh.ch'
    },
    {
      name: 'Eduard Gash',
      role: 'Frontend Developer',
      bio: 'Frontend specialist working on responsive UI components and ensuring cross-device compatibility for the best user experience.',
      github: 'eduard54',
      email: 'eduard.gash@uzh.ch'
    },
    {
      name: 'Nicolas Huber',
      role: 'Backend Developer',
      bio: 'Backend architect responsible for game logic implementation, real-time communication, and database management.',
      github: 'nicolasHuber3',
      email: 'nicolas.huber@uzh.ch'
    },
    {
      name: 'Eric Rudischhauser',
      role: 'Frontend Developer',
      bio: 'UI/UX expert designing intuitive game interfaces and implementing smooth animations for an engaging gaming experience.',
      github: 'Ericode99',
      email: 'ericsebastian.rudischhauser@uzh.ch'
    },
    {
      name: 'Nicolas Schärer',
      role: 'Frontend Developer',
      matriculation: '20-931-507',
      bio: 'Creative frontend engineer focusing on game flow, interactive components, and visual aspects of the guessing experience.',
      github: 'Nlcolas',
      email: 'nicolasalexander.schaerer@uzh.ch'
    }
  ];

  return (
    <section className="team" id="team" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="section-description">
          The talented developers behind GPTuessr who combine expertise in gaming, AI integration, and 
          user experience design to create this innovative multiplayer guessing game.
        </p>
        
        <div className="team__grid">
          {teamMembers.map((member, index) => (
            <div 
              className="team__member" 
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="team__member-avatar">
                <div className="team__avatar-wrapper">
                  <div className="team__avatar-placeholder">
                    {member.name.split(' ').map(name => name[0]).join('')}
                  </div>
                </div>
                <div className="team__member-social">
                  <a 
                    href={`https://github.com/${member.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub" 
                    title={`Visit ${member.name}'s GitHub`}
                    className="social-link github"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.50001C19.9988 8.30498 19.5549 7.15732 18.7667 6.30001C19.1397 5.26198 19.1087 4.11164 18.68 3.10001C18.68 3.10001 17.7 2.80001 15.5 4.10001C13.68 3.60001 11.72 3.60001 9.9 4.10001C7.7 2.80001 6.72 3.10001 6.72 3.10001C6.29134 4.11164 6.26034 5.26198 6.63333 6.30001C5.84542 7.15764 5.40142 8.30532 5.4 9.50001C5.4 14.1 8.1 15.2 10.9 15.5C10.3 16.1 10.2 16.7 10.2 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a 
                    href={`mailto:${member.email}`} 
                    aria-label="Email" 
                    title={`Email ${member.name}`}
                    className="social-link email"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="team__member-info">
                <h3 className="team__member-name">{member.name}</h3>
                <p className="team__member-role">{member.role}</p>
                <p className="team__member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="team__game-description">
          <div className="team__game-content">
            <h3>About GPTuessr</h3>
            <p>
              GPTuessr is an innovative online multiplayer game that combines the fun of drawing and 
              guessing games with AI-driven art generation. Players provide text descriptions that 
              DALL-E transforms into images, which other players then attempt to guess.
            </p>
            <p>
              Featuring user authentication, lobby management, and real-time gameplay powered by 
              DALL-E and ChatGPT, GPTuessr offers a unique social gaming experience accessible 
              across all devices.
            </p>
            <a href="/play" className="team__cta-button">Try GPTuessr Now</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;