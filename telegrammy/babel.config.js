// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env', // Transpile ES6+ syntax
    '@babel/preset-react' // Transpile JSX
  ],
  // Enable this if you're using ES modules
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
};
