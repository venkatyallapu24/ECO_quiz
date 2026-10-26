/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          forest: {
            DEFAULT: '#0F382A',
            deep: '#09241B',
            light: '#1B5440',
          },
          emerald: {
            DEFAULT: '#10B981',
            dark: '#059669',
            light: '#34D399',
          },
          lime: {
            DEFAULT: '#84CC16',
            light: '#A3E635',
            dark: '#65A30D',
          },
          earth: {
            DEFAULT: '#78350F',
            light: '#B45309',
          },
          canvas: {
            DEFAULT: '#F8FAF6',
            subtle: '#EFF4EC',
            dark: '#0C1C16',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
