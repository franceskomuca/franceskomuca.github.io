# ShotsByFra Portfolio

A professional photography and videography portfolio showcasing cinematic work and visual storytelling.

## 🚀 Live Demo

**Portfolio URL**: [View Live Site](https://yourusername.github.io/shotsbyfra-portfolio/)

## 📸 Features

### Portfolio Sections
- **Photography**: Curated collection of cinematic and professional photography
- **Videography**: Showcase of video productions and creative content
- **About**: Professional background and experience
- **Contact**: Get in touch for bookings and collaborations

### Key Features
- ✨ **Responsive Design**: Mobile-first, looks great on all devices
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- 📱 **Mobile Optimized**: Touch-friendly interface for mobile users
- ⚡ **Fast Loading**: Optimized images and efficient code
- 🔍 **SEO Optimized**: Proper meta tags and structured content
- 🎯 **Latest Content**: Automatically shows the 6 most recent photos and videos

### Technical Features
- **Automated Content Sync**: Daily updates from Google Drive and YouTube
- **Lightbox Gallery**: Professional photo viewing experience
- **Video Integration**: Embedded YouTube content with thumbnails
- **Error Handling**: Robust error boundaries and fallback content
- **Performance Optimized**: Code splitting and optimized bundles

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Content Sync**: Google Drive API + YouTube API
- **Hosting**: GitHub Pages (with automated deployment)
- **Cron Jobs**: Daily content synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (preferred) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/shotsbyfra-portfolio.git
cd shotsbyfra-portfolio

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Hero.tsx          # Landing page hero section
│   ├── Navigation.tsx    # Main navigation
│   ├── Photography.tsx   # Photo portfolio
│   ├── Videography.tsx   # Video portfolio
│   ├── About.tsx         # About section
│   ├── Contact.tsx       # Contact information
│   ├── Footer.tsx        # Site footer
│   └── Lightbox.tsx      # Image lightbox component
├── lib/
│   ├── supabase.ts       # Supabase client configuration
│   └── utils.ts          # Utility functions
└── hooks/
    └── use-mobile.tsx    # Mobile detection hook

supabase/
├── functions/            # Edge functions
│   ├── get-content/      # Fetch portfolio content
│   ├── sync-google-drive/# Google Drive sync
│   └── sync-youtube/     # YouTube sync
└── migrations/           # Database migrations
```

## 🎯 Content Management

### Automated Sync
- **Google Drive Photos**: Syncs daily at 2:00 AM UTC
- **YouTube Videos**: Syncs daily at 3:00 AM UTC
- **Latest Content**: Automatically shows 6 most recent items

### Manual Content
- Static fallback content for immediate deployment
- Database-driven dynamic content
- Responsive image optimization

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Live at `https://yourusername.github.io/repository-name/`

### Alternative Hosting
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder
- **Custom Server**: Deploy `dist` folder contents

## 📝 Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
pnpm run type-check   # Run TypeScript checks
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Developer

Built with ❤️ by ShotsByFra

---

**Made with React + TypeScript + Vite + Tailwind CSS**