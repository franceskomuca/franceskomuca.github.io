import React from 'react';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import About from './components/About';
import Photography from './components/Photography';
import Videography from './components/Videography';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';

import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-background-page text-neutral-900 font-sans smooth-scroll">
      <Navigation />
      <Hero />
      <About />
      <Photography />
      <Videography />

      <Contact />
      <Footer />
      <Lightbox />
    </div>
  );
}

export default App;