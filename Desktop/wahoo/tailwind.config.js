/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#05050A', /* Deep black/blue slate */
        surface: 'rgba(255, 255, 255, 0.03)', /* Frost glass base */
        borderGlow: 'rgba(255, 255, 255, 0.1)',
        ink: {
          DEFAULT: '#FFFFFF',
          muted: '#A1A1AA',
          faint: '#52525B',
        },
        accent: {
          neon: '#00F0FF',
          purple: '#7000FF',
          green: '#00FF66',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #7000FF55 0deg, #00F0FF55 180deg, #00FF6655 360deg)',
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
