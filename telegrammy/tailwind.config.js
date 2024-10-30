/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem', // 10px
      },
      colors: {
        'text-primary': 'var(--text-primary)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'border': 'var(--border)',
        'bg-hover': 'var(--bg-hover)',
        'bg-line': 'var(--bg-line)',
        'bg-search': 'var(--bg-search)',
        'border-search': 'var(--border-search)',
      },
    },
  },
  plugins: [],
};
