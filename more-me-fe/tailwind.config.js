/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
}

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx,css}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [ require("autoprefixer")],
// }

// tailwind.config.js
// module.exports = {
//   corePlugins: {
//     preflight: false,
//   },
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './src/**/*.{js,jsx,ts,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
