module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <-- Add this line
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
