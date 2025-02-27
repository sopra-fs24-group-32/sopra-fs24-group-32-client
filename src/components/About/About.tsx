import React from 'react';
import HeroAbout from './HeroAbout/HeroAbout';
import GameDescriptionAbout from './GameDescriptionAbout/GameDescriptionAbout';
import HowToPlay from './HowToPlay/HowToPlay';
import Team from './Team/Team';
import FAQ from './FAQ/FAQ';
import Testimonials from './Testimonials/Testimonials';
import CallToAction from './CallToAction/CallToAction';
import './About.scss';

const About = () => {
  return (
    <div className="about-about">
      <HeroAbout />
      <GameDescriptionAbout />
      <HowToPlay />
      <Team />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </div>
  );
};

export default About;