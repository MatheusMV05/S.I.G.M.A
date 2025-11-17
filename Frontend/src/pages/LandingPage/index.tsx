import { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import AboutSigma from './AboutSigma';
import Features from './Features';
import BecomeSigma from './BecomeSigma';
import Footer from './Footer';

const LandingPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <AboutSigma />
      <Features />
      <BecomeSigma />
      <Footer />
    </div>
  );
};

export default LandingPage;
