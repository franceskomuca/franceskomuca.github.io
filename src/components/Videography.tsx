import React, { useState, useEffect } from 'react';
import { Play, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoItem {
  id: string;
  youtube_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
}

const Videography = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback static videos for when database is empty
  const fallbackVideos: VideoItem[] = [
    {
      id: 'fallback-1',
      youtube_id: 'tgZ6SVie8bA',
      title: 'Cinematic Wedding Film',
      description: 'A romantic wedding film capturing the beauty of love and celebration.',
      thumbnail_url: 'https://img.youtube.com/vi/tgZ6SVie8bA/maxresdefault.jpg'
    },
    {
      id: 'fallback-2',
      youtube_id: 'kYcINun6Wzk',
      title: 'Commercial Product Showcase',
      description: 'Professional product videography with cinematic lighting and movement.',
      thumbnail_url: 'https://img.youtube.com/vi/kYcINun6Wzk/maxresdefault.jpg'
    },
    {
      id: 'fallback-3',
      youtube_id: 'qAk5M2mqits',
      title: 'Documentary Style Portrait',
      description: 'Intimate portrait cinematography showcasing character and emotion.',
      thumbnail_url: 'https://img.youtube.com/vi/qAk5M2mqits/maxresdefault.jpg'
    }
  ];

  // Fetch videography content from Supabase
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
          setVideos(fallbackVideos);
          return;
        }

        // Check if data has the expected structure
        const videography = data?.data?.videography || [];
        
        if (videography.length === 0) {
          // Use fallback videos if database is empty (limit to 6)
          setVideos(fallbackVideos.slice(0, 6));
        } else {
          // Map database videos to component format
          const mappedVideos = videography.map((video: any) => ({
            id: video.id,
            youtube_id: video.youtube_id,
            title: video.title || 'Untitled Video',
            description: video.description || '',
            thumbnail_url: video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`,
            created_at: video.created_at
          }));
          // Sort by creation date (newest first) and limit to 6
          const sortedVideos = mappedVideos
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 6);
          setVideos(sortedVideos);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load content');
        setVideos(fallbackVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`;
  };

  return (
    <section id="videography" className="py-24 lg:py-32 bg-background-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Videography Portfolio
          </h2>
          <p className="text-lg md:text-xl text-neutral-700 max-w-3xl mx-auto">
            Cinematic video content that tells compelling stories and captures 
            the essence of every moment with professional quality.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span className="ml-3 text-lg text-neutral-600">Loading videos...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-neutral-600">Showing fallback videos</p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-250 overflow-hidden"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-neutral-200 overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
                    loading="lazy"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* External Link */}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    aria-label={`Watch ${video.title} on YouTube`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    {video.title}
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    {video.description}
                  </p>
                  
                  {/* Watch Button */}
                  <a
                    href={getEmbedUrl(video.youtube_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium transition-colors duration-200"
                  >
                    Watch on YouTube
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-primary-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Need a Video Project?
            </h3>
            <p className="text-neutral-700 mb-6 max-w-2xl mx-auto">
              Let's collaborate to create compelling visual content that tells your story 
              and engages your audience with cinematic quality.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videography;
