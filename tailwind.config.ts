import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8fafc",
          100: "#eef2f7",
          200: "#d8e1eb",
          300: "#b2c4d8",
          400: "#7f9bb7",
          500: "#5d7f9f",
          600: "#46637f",
          700: "#3a5168",
          800: "#334558",
          900: "#2f3b49"
        },
        accent: "#d97706"
      }
    },
  },
  plugins: [],
};

export default config;
