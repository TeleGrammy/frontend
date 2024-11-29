/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '0.625rem', // 10px
      },
      colors: {
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-border': 'var(--border)',
        'bg-hover': 'var(--bg-hover)',
        'bg-line': 'var(--bg-line)',
        'bg-search': 'var(--bg-search)',
        'bg-button': 'var(--bg-button)',
        'bg-button-hover': 'var(--bg-button-hover)',
        'border-search': 'var(--border-search)',
        'bg-message-sender': 'var(--bg-message-sender)',
        'bg-message-receiver': 'var(--bg-message-receiver)',
      },
    },
  },
  plugins: [],
};
