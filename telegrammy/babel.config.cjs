module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    'babel-plugin-transform-vite-meta-env', // Transform `import.meta.env`
  ],
};
