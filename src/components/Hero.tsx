import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-700 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-background.jpg"
          alt="Professional photographer portfolio background"
          className="w-full h-full object-cover opacity-50"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Brand/Logo */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              ShotsByFra
            </h1>
          </div>

          {/* Main Headline */}
          <h2
            className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Photography & Videography
          </h2>

          {/* Tagline */}
          <p
            className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-4 font-medium transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Transforming real moments into visual stories
          </p>

          {/* Location */}
          <p
            className={`text-base md:text-lg text-white/80 mb-12 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Based in Vlora, Albania
          </p>

          {/* CTA Button */}
          <div
            className={`transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={() => scrollToSection('photography')}
              className="bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-200 group"
          aria-label="Scroll to about section"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown
            className="w-6 h-6 animate-bounce group-hover:animate-pulse"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
};

export default Hero;