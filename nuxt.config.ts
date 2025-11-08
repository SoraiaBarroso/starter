// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-nodemailer', '@nuxtjs/supabase'],
  ui: {
    colorMode: false,
  },
  supabase: {
    types: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/", // User will be redirected to this path if not authenticated or after logout.
      callback: "/", // This is the path the user will be redirect to after supabase login redirection.
      include: undefined, // Routes to include in the redirect. ['/admin(/*)?'] will enable the redirect only for the admin page and all sub-pages.
      exclude: ["/"],
      cookieRedirect: false,
    },
  },
  nodemailer: {
    from: '"MiroMiro" <noreply@miromiro.com>',
    host: process.env.NODEMAILER_HOST || 'smtp.gmail.com',
    port: Number(process.env.NODEMAILER_PORT) || 465,
    secure: process.env.NODEMAILER_SECURE === 'true',
    auth: {
      user: process.env.NODEMAILER_USER || '',
      pass: process.env.NODEMAILER_PASS || '',
    },
  },
  devtools: {
    enabled: true
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})