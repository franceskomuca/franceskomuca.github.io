/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '32px',
				sm: '24px',
				lg: '32px',
				xl: '32px',
				'2xl': '32px',
			},
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
			},
			colors: {
				// ShotsByFra Brand Colors
				primary: {
					50: '#E6F0FF',
					100: '#CCE0FF',
					500: '#0066FF',
					600: '#0052CC',
					900: '#003D99',
					DEFAULT: '#0066FF',
					foreground: '#FFFFFF',
				},
				neutral: {
					50: '#FAFAFA',
					100: '#F5F5F5',
					200: '#E5E5E5',
					500: '#A3A3A3',
					700: '#404040',
					900: '#171717',
				},
				// Semantic Colors
				success: '#10B981',
				error: '#DC2626',
				warning: '#F59E0B',
				info: '#0066FF',
				// Background System
				background: {
					page: '#FAFAFA',
					surface: '#FFFFFF',
					overlay: 'rgba(0, 0, 0, 0.5)',
				},
				// Legacy compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				foreground: 'hsl(var(--foreground))',
				secondary: {
					DEFAULT: '#404040',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#0066FF',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			spacing: {
				'xs': '8px',
				'sm': '16px',
				'md': '24px',
				'lg': '32px',
				'xl': '48px',
				'2xl': '64px',
				'3xl': '96px',
				'4xl': '128px',
			},
			borderRadius: {
				sm: '8px',
				md: '12px',
				lg: '16px',
				xl: '24px',
				full: '9999px',
				DEFAULT: '16px',
			},
			boxShadow: {
				card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
				modal: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
			},
			fontSize: {
				hero: ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				title: ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
				subtitle: ['32px', { lineHeight: '1.3' }],
				'body-large': ['20px', { lineHeight: '1.6' }],
				body: ['16px', { lineHeight: '1.5' }],
				caption: ['14px', { lineHeight: '1.5' }],
				metadata: ['12px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.25s ease-out',
				'fade-in-up': 'fade-in-up 0.3s ease-out',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'fade-in-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			transitionTimingFunction: {
				smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
				inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
				out: 'cubic-bezier(0, 0, 0.2, 1)',
			},
			transitionDuration: {
				'200': '200ms',
				'250': '250ms',
				'300': '300ms',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
	],
}