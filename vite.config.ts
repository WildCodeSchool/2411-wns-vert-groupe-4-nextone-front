import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4000,
    host: true,
    open: false,
    allowedHosts: ['frontend'],
  },
  test: { globals: true, environment: "jsdom",
    setupFiles: ["./setupTests.js"],

   },
})
