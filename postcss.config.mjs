// postcss.config.mjs
// Tailwind CSS v4 requires @tailwindcss/postcss — not the bare tailwindcss plugin
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};