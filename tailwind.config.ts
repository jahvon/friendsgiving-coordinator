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
        autumn: {
          50: '#fef9f3',
          100: '#fef3e7',
          200: '#fde1c3',
          300: '#fbcf9f',
          400: '#f9ab57',
          500: '#f6870f',
          600: '#dd7a0e',
          700: '#b8650c',
          800: '#925009',
          900: '#774208',
        },
        harvest: {
          50: '#fef6ee',
          100: '#fdecd4',
          200: '#fad5a8',
          300: '#f6b871',
          400: '#f19138',
          500: '#ed7114',
          600: '#de570a',
          700: '#b8420a',
          800: '#93350f',
          900: '#772d10',
        },
        cranberry: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b9',
          400: '#ed7592',
          500: '#e14b70',
          600: '#cc2b55',
          700: '#ac1f45',
          800: '#8f1d3e',
          900: '#7a1c39',
        },
      },
    },
  },
  plugins: [],
};
export default config;
