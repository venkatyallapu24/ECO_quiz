/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          forest: {
            DEFAULT: '#176B3A',
            deep: '#0F4726',
            light: '#23894C',
            hover: '#135830',
          },
          sage: {
            DEFAULT: '#5F8274',
            light: '#E5ECE8',
            border: '#CAD8D0',
            dark: '#3E5B50',
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
          canvas: {
            DEFAULT: '#F7F8F3',
            subtle: '#EEF0E8',
            border: '#E2E6DC',
            dark: '#0C1C16',
          },
          text: {
            DEFAULT: '#142620',
            muted: '#526860',
            light: '#7F948C',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'eco-sm': '0 1px 2px 0 rgba(20, 56, 43, 0.05)',
        'eco': '0 2px 8px -1px rgba(20, 56, 43, 0.08), 0 1px 4px -1px rgba(20, 56, 43, 0.04)',
        'eco-md': '0 4px 16px -2px rgba(20, 56, 43, 0.10), 0 2px 6px -2px rgba(20, 56, 43, 0.05)',
      },
    },
  },
  plugins: [],
};
