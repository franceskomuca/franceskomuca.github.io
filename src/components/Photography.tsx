import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoItem {
  id: string;
  src: string;
  title: string;
  category: string;
  thumbnail_url?: string;
  drive_url?: string;
}

const Photography = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [portfolioImages, setPortfolioImages] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback static images for when database is empty
  const fallbackImages: PhotoItem[] = [
    {
      id: 'fallback-1',
      src: '/images/cinematic_wedding_kiss_romantic_pergola.jpg',
      title: 'Wedding Kiss',
      category: 'Wedding'
    },
    {
      id: 'fallback-2',
      src: '/images/professional_fashion_portrait_studio_lighting_monochrome_jacket.jpg',
      title: 'Fashion Portrait',
      category: 'Fashion'
    },
    {
      id: 'fallback-3',
      src: '/images/cinematic_golden_hour_landscape_valley_lake.jpg',
      title: 'Golden Hour Landscape',
      category: 'Landscape'
    },
    {
      id: 'fallback-4',
      src: '/images/luxury_product_photography_cinematic_ice_landscape.jpg',
      title: 'Luxury Product',
      category: 'Product'
    },
    {
      id: 'fallback-5',
      src: '/images/cinematic_urban_street_photography_old_man_smoking.jpg',
      title: 'Street Photography',
      category: 'Street'
    },
    {
      id: 'fallback-6',
      src: '/images/hero-background.jpg',
      title: 'Professional Portrait',
      category: 'Portrait'
    }
  ];

  // Fetch photography content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.functions.invoke('get-content', {
          body: {}
        });

        if (error) {
          console.error('Error fetching content:', error);
          setError('Failed to load content');
          setPortfolioImages(fallbackImages);
          return;
        }

        // Check if data has the expected structure
        const photography = data?.data?.photography || [];
        
        if (photography.length === 0) {
          // Use fallback images if database is empty (limit to 6)
          setPortfolioImages(fallbackImages.slice(0, 6));
        } else {
          // Map database images to component format
          const mappedImages = photography.map((photo: any) => ({
            id: photo.id,
            src: photo.thumbnail_url || photo.drive_url || '',
            title: photo.title || 'Untitled',
            category: photo.category || 'General',
            thumbnail_url: photo.thumbnail_url,
            drive_url: photo.drive_url,
            created_at: photo.created_at
          }));
          // Sort by creation date (newest first) and limit to 6
          const sortedImages = mappedImages
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 6);
          setPortfolioImages(sortedImages);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load content');
        setPortfolioImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? portfolioImages.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === portfolioImages.length - 1 ? 0 : selectedImage + 1);
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        switch (e.key) {
          case 'Escape':
            closeLightbox();
            break;
          case 'ArrowLeft':
            navigateImage('prev');
            break;
          case 'ArrowRight':
            navigateImage('next');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <>
      <section id="photography" className="py-24 lg:py-32 bg-background-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Photography Portfolio
            </h2>
            <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
              A curated selection of my photography work, showcasing moments, 
              emotions, and stories captured through the lens.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              <span className="ml-3 text-lg text-neutral-600">Loading portfolio...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-neutral-600">Showing fallback images</p>
            </div>
          )}

          {/* Masonry Gallery */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              {portfolioImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group cursor-pointer overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-250"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-auto object-cover transition-transform duration-250 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-250 flex items-end">
                      <div className="p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                        <span className="text-sm font-medium bg-primary-500 px-3 py-1 rounded-full">
                          {image.category}
                        </span>
                        <h3 className="text-xl font-semibold mt-3">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-200"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={portfolioImages[selectedImage].src}
              alt={portfolioImages[selectedImage].title}
              className="max-w-full max-h-full object-contain animate-fade-in"
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 text-white text-center">
            <h3 className="text-lg font-semibold">{portfolioImages[selectedImage].title}</h3>
            <p className="text-sm text-white/80">
              {selectedImage + 1} of {portfolioImages.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Photography;
