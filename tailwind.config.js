/******** Tailwind CSS Config (safelist for dynamic classes) ********/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  safelist: [
    // Dynamic alert colors used via showAlert(color, message)
    "border-amber-200",
    "text-amber-200",
    "border-green-300",
    "text-green-300",
    "border-blue-300",
    "text-blue-300",
    "border-red-400",
    "text-red-400",
    "border-pink-400",
    "text-pink-400",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
