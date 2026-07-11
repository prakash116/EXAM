import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FCF8EC",
          100: "#F8EED0",
          200: "#F0DDA0",
          300: "#E6C86B",
          400: "#DDB63E",
          500: "#D4A017",
          600: "#B8860B",
          700: "#93690A",
          800: "#6F4F09",
          900: "#4B3506",
        },
        charcoal: {
          DEFAULT: "#23272E",
          light: "#2F343D",
          dark: "#1A1D22",
        },
        cream: "#FBF8F1",
      },
      boxShadow: {
        card: "0 1px 3px rgba(35, 39, 46, 0.08), 0 4px 16px rgba(35, 39, 46, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
