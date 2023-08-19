/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ice: "#7df9ff",
        green: "#2fff2f",
        pink: "#ff00f5",
        purple: "#3300ff",
        purple_dark: "#2813bb",
        yellow: "#ffff00",
        orange: "#ff4911",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-0.5deg)" },
          "50%": { transform: "rotate(0.5deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.33s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
