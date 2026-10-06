import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Build the entire MPA by declaring all HTML entry points
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        practice: resolve(__dirname, 'pages/practice.html'),
        exam: resolve(__dirname, 'pages/exam.html'),
        vocabulary: resolve(__dirname, 'pages/vocabulary.html'),
        vocabQuiz: resolve(__dirname, 'pages/vocab-quiz.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
      },
    },
  },
  // In development, serve the data directory as static assets
  // so that fetch('../data/...') works from pages/ subdirectory
  server: {
    // This is fine - Vite serves from project root by default
  },
  // Resolve __dirname in ESM context
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
