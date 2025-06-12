/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2260FF",
        secondary: "#22CEFF",
        tertiary: "#E0F2F7",
        danger: "#F44336",
        gold: "#EFBF04",
      },
    },
  },
  plugins: [],
};
