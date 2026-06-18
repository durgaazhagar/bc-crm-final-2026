module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f172a',
          800: '#111827',
          700: '#1e293b',
          600: '#273449',
          500: '#ef4444',
          400: '#f87171',
        },
      },
      boxShadow: {
        glass: '0 20px 60px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
