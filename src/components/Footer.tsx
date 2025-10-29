import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-neutral-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ShotsByFra</h3>
            <p className="text-neutral-400 mb-4">
              Cinematic photography and videography that tells your story 
              with professional quality and artistic vision.
            </p>
            <div className="flex items-center text-neutral-400">
              <span className="text-sm">Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" />
              <span className="text-sm">in Vlora, Albania</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('photography')}
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  Photography
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('videography')}
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  Videography
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-neutral-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>Wedding Photography</li>
              <li>Commercial Videography</li>
              <li>Portrait Sessions</li>
              <li>Event Coverage</li>
              <li>Brand Storytelling</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm">
            © {currentYear} ShotsByFra. All rights reserved.
          </div>
          <div className="text-neutral-400 text-sm mt-4 md:mt-0">
            Available for projects worldwide
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;