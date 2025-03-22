/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: "#0D1F2D",
        blanco: "#F2F2F2",
        verde: "#58D68D",
        naranja: "#FF6F3C",
        azul: "#091620",
        gris: "#2C2C2C",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".input-field": {
          "@apply w-full p-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500":
            {},
        },
        ".error-message": {
          "@apply text-red-500 text-sm mt-1": {},
        },
      });
    },
  ],
};
