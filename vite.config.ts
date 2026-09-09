/// <reference types="vitest" />
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,           // Permite usar 'describe', 'it', 'expect' sem importar em cada arquivo
    environment: 'jsdom',    // Configura o simulador de navegador
    setupFiles: './src/setupTests.ts', // Arquivo para carregar extensões (opcional, mas recomendado)
  },
})
