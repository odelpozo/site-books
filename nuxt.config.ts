import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  nitro: { compatibilityDate: '2025-08-15' },
  modules: ['@pinia/nuxt'],
  builder: 'vite',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3002/api'
    }
  },
  css: ['~/assets/styles/main.scss'],
  compatibilityDate: '2025-08-15'
})