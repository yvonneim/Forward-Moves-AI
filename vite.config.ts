// ... existing imports
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/Forward-Moves-AI/', // Ensure it starts AND ends with a slash /
    plugins: [react(), tailwindcss()],
    // ... rest of your code