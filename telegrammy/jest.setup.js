global.importMetaEnv = {
  VITE_API_URL: 'http://localhost:8080/api',
};
Object.defineProperty(global, 'import.meta', {
  value: { env: global.importMetaEnv },
});
