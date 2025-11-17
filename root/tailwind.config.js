// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // Next.js 13+ için (app router)
    "./pages/**/*.{js,ts,jsx,tsx}", // classic pages router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
