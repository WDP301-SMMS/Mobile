/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0288D1",
        secondary: "#81D4FA",
        tertiary: "#E0F2F7",   // Màu nền cực nhạt, thích hợp cho nền các block hoặc viền nhạt
        danger: "#F44336",
      },
    },
  },
  plugins: [],
};
