/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Blues
        primary: {
          DEFAULT: '#138DCC',
          light: '#3F788B',
          lighter: '#E5F6FF',
          dark: '#377888',
        },
        // Secondary Colors
        secondary: {
          blue: '#449F9D',
          orange: '#EDAC5E',
          teal: '#9FF4E5',
          green: '#C4E78F',
        },
        // Grays
        gray: {
          50: '#FFFFFF',
          100: '#E5F6FF',
          200: '#B3CCDA',
          300: '#526D82',
        },
        // Status Colors
        status: {
          done: '#C4E78F',
          ongoing: '#EDAC5E',
          paused: '#526D82',
          future: '#138DCC',
          leave: '#B3CCDA',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        // Headings
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '500' }],
        'h2': ['24px', { lineHeight: '1.2', fontWeight: '500' }],
        'h3': ['20px', { lineHeight: '1.2', fontWeight: '500' }],
        'h4': ['16px', { lineHeight: '1.2', fontWeight: '500' }],
        // Body Text
        'body': ['24px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['16px', { lineHeight: '1.5', fontWeight: '300' }],
        'body-xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
