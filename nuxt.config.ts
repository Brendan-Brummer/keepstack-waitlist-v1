// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-csurf',
  ],

  css: [
    '~/assets/css/fonts.css',
  ],

  // CSRF Protection Configuration
  csurf: {
    https: process.env.NODE_ENV === 'production',
    cookieKey: 'csrf-token',
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  // Runtime Configuration
  runtimeConfig: {
    // Private keys (server-side only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    resendAudienceId: process.env.RESEND_AUDIENCE_ID || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
    cronSecret: process.env.CRON_SECRET || '',

    // Public keys (exposed to client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    },
  },

  // App Configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
})
