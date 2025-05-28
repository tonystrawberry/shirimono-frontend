import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/kanji-background.css'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    public: {
      environment: process.env.NODE_ENV || 'development'
    }
  }
})