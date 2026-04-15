/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        trello: {
          blue: '#0079bf',
          'blue-dark': '#026aa7',
          green: '#61bd4f',
          yellow: '#f2d600',
          orange: '#ff9f1a',
          red: '#eb5a46',
          purple: '#c377e0',
          pink: '#ff78cb',
          sky: '#00c2e0',
          lime: '#51e898',
          gray: {
            50: '#fafbfc',
            100: '#f4f5f7',
            200: '#ebecf0',
            300: '#dfe1e6',
            400: '#b3bac5',
            500: '#8993a4',
            600: '#6b778c',
            700: '#5e6c84',
            800: '#505f79',
            900: '#42526e',
          }
        }
      },
      boxShadow: {
        'card': '0 1px 0 rgba(9,30,66,.13)',
        'card-hover': '0 4px 8px rgba(9,30,66,.25)',
        'modal': '0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08)',
      }
    },
  },
  plugins: [],
}
