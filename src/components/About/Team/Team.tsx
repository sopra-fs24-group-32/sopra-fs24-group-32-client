// components/About/Team/Team.jsx
import React from 'react';
import './Team.scss';

const Team = () => {
  const teamMembers = [
    {
      name: 'Alexander Thompson',
      role: 'Founder & CEO',
      bio: 'Former AI researcher with a passion for gaming and creative tech experiences. Founded GPTuessr to bridge the gap between AI and social gaming.',
      avatar: '/images/team/alexander.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Sophia Chen',
      role: 'CTO',
      bio: 'AI specialist with 10+ years of experience. Previously worked at top tech companies developing computer vision systems for creative applications.',
      avatar: '/images/team/sophia.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Marcus Williams',
      role: 'Lead Game Designer',
      bio: 'Award-winning game designer who brings the fun factor to GPTuessr. Expert in creating engaging, accessible games for diverse audiences.',
      avatar: '/images/team/marcus.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Elena Rodriguez',
      role: 'UX/UI Designer',
      bio: 'Design expert specializing in game interfaces. Creates the intuitive, delightful experience that makes GPTuessr accessible to everyone.',
      avatar: '/images/team/elena.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#'
      }
    }
  ];

  return (
    <section className="team" id="team">
      <div className="container">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="section-description">
          The passionate minds behind GPTuessr who combine expertise in AI, gaming, design, and community building.
        </p>
        
        <div className="team__grid">
          {teamMembers.map((member, index) => (
            <div className="team__member" key={index}>
              <div className="team__member-avatar">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=200`;
                  }}
                />
                <div className="team__member-social">
                  <a href={member.social.twitter} aria-label="Twitter" title="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 3.01006C22.0424 3.68553 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 22.6608 4.40277 23 3.01006Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href={member.social.linkedin} aria-label="LinkedIn" title="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a href={member.social.github} aria-label="GitHub" title="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.50001C19.9988 8.30498 19.5549 7.15732 18.7667 6.30001C19.1397 5.26198 19.1087 4.11164 18.68 3.10001C18.68 3.10001 17.7 2.80001 15.5 4.10001C13.68 3.60001 11.72 3.60001 9.9 4.10001C7.7 2.80001 6.72 3.10001 6.72 3.10001C6.29134 4.11164 6.26034 5.26198 6.63333 6.30001C5.84542 7.15764 5.40142 8.30532 5.4 9.50001C5.4 14.1 8.1 15.2 10.9 15.5C10.3 16.1 10.2 16.7 10.2 17.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        
        <div className="team__join">
          <div className="team__join-content">
            <h3>Join Our Growing Team</h3>
            <p>
              We&apos;re always looking for talented individuals who are passionate about gaming, AI, and creating awesome user experiences. Check out our open positions!
            </p>
            <a href="/careers" className="team__join-button">View Open Positions</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;