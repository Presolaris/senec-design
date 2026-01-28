/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // SENEC Brand Colors
        primary: {
          50: '#e6f7f7',
          100: '#ccefef',
          200: '#99dfdf',
          300: '#66cfcf',
          400: '#33bfbf',
          500: '#008080', // Teal - Primary
          600: '#006666',
          700: '#004d4d',
          800: '#003333',
          900: '#001a1a',
        },
        secondary: {
          50: '#fff8e6',
          100: '#fff1cc',
          200: '#ffe399',
          300: '#ffd566',
          400: '#ffc733',
          500: '#f5a623', // Orange - Accent
          600: '#c48500',
          700: '#936400',
          800: '#624200',
          900: '#312100',
        },
        dark: {
          50: '#e6e7e8',
          100: '#cdd0d1',
          200: '#9ba1a3',
          300: '#697275',
          400: '#374347',
          500: '#1a2b32', // Dark Blue-Gray
          600: '#152228',
          700: '#101a1e',
          800: '#0a1114',
          900: '#05090a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
