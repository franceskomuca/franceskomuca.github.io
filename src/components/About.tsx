import React from 'react';
import { Camera, Video, Film } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-8 leading-tight">
                About Francesko Muça
              </h2>
              
              <div className="prose prose-lg text-neutral-700 space-y-6">
                <p className="text-lg leading-relaxed">
                  I'm a cinematic videographer and photographer based in Vlora, Albania, 
                  specializing in transforming real moments into compelling visual narratives. 
                  With a passion for storytelling and an eye for the extraordinary, I capture 
                  the essence of every moment through my lens.
                </p>
                
                <p className="text-lg leading-relaxed">
                  My approach combines technical expertise with artistic vision, creating 
                  content that resonates with audiences and elevates brands. Whether it's 
                  a wedding, commercial project, or artistic endeavor, I bring the same 
                  level of dedication and creativity to every frame.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Available for projects worldwide, I'm committed to delivering exceptional 
                  visual content that tells your story with impact and authenticity.
                </p>
              </div>

              {/* Services */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-neutral-900 mb-8">Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-background-surface p-6 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-250">
                    <div className="flex items-center mb-4">
                      <Camera className="w-8 h-8 text-primary-500 mr-3" />
                      <h4 className="text-xl font-semibold text-neutral-900">Photography</h4>
                    </div>
                    <p className="text-neutral-700">
                      Professional photography services for weddings, events, portraits, 
                      and commercial projects with a cinematic approach.
                    </p>
                  </div>
                  
                  <div className="bg-background-surface p-6 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-250">
                    <div className="flex items-center mb-4">
                      <Video className="w-8 h-8 text-primary-500 mr-3" />
                      <h4 className="text-xl font-semibold text-neutral-900">Videography</h4>
                    </div>
                    <p className="text-neutral-700">
                      Cinematic videography for events, commercials, and brand storytelling 
                      with professional post-production.
                    </p>
                  </div>
                  
                  <div className="bg-background-surface p-6 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-250">
                    <div className="flex items-center mb-4">
                      <Film className="w-8 h-8 text-primary-500 mr-3" />
                      <h4 className="text-xl font-semibold text-neutral-900">Storytelling</h4>
                    </div>
                    <p className="text-neutral-700">
                      Creative storytelling through visual media, crafting narratives 
                      that connect emotionally with audiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src="/images/francesko-photo-optimized.png"
                alt="Francesko Muça - Professional Portrait"
                className="w-80 h-auto rounded-lg shadow-card"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;