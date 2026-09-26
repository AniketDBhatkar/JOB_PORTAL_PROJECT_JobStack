/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101826",
        paper: "#F3F0E6",
        accent: "#3F5EFB",
        accent2: "#FC466B",
        accentDark: "#8F6425",
        line: "#DFD9C4",
        muted: "#5D6270",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};