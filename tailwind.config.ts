import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfa',
          100: '#faf7f3',
          200: '#f5f0e8',
          300: '#ebe3d5',
          400: '#ddd0ba',
          500: '#c9b89a',
        },
        warm: {
          50: '#fef5ed',
          100: '#fde8d6',
          200: '#fbd0ad',
          300: '#f8af7a',
          400: '#f58845',
          500: '#f26d1f',
          600: '#e34f0e',
          700: '#bc3a0d',
          800: '#952f12',
          900: '#792912',
        },
        terra: {
          50: '#f9f6f3',
          100: '#f0e8dd',
          200: '#e0cfba',
          300: '#d0b291',
          400: '#b8906b',
          500: '#a8774f',
          600: '#8b6243',
          700: '#72503a',
          800: '#5e4432',
          900: '#4f3a2b',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7cd4fd',
          400: '#36bffa',
          500: '#0ba5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7cfc8',
          300: '#a4b0a6',
          400: '#7f8e82',
          500: '#637268',
          600: '#4e5c53',
          700: '#414b45',
          800: '#363f3a',
          900: '#2f3632',
        },
      },
    },
  },
  plugins: [],
};
export default config;
