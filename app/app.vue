<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { Analytics } from '@vercel/analytics/nuxt'
const { protocol, host } = useRequestURL()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'MiroMiro – Chrome Extension for Designers & Developers';
const description = 'Inspect elements, extract assets, and generate design systems effortlessly. MiroMiro lets you analyze any website’s visuals, reveal brand identity insights, and export everything in production-ready formats.';

const baseUrl = `${protocol}//${host}`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: `${baseUrl}/images/og-image.png`,
  twitterImage: `${baseUrl}/images/og-image.png`,
  twitterCard: 'summary_large_image'
})

const items = computed<NavigationMenuItem[]>(() => [ {
  label: 'Features',
  to: '#features',
},
{
  label: 'Waitlist',
  to: '#waitlist',
},
{
  label: 'Pricing',
  to: '#pricing',
}])
</script>

<template>
  <UApp>
    <Analytics />

    <UHeader title="MiroMiro" to="/" mode="drawer">
      <UNavigationMenu :items="items" />

      <template #right>
        <!-- <UColorModeButton /> -->
         <UButton
          to="/signin"
          variant="outline"
          color="neutral"
          disabled
        >
          Sign In
        </UButton>
          <UButton
          to="/signup"
          color="neutral"
          disabled
        >
          Sign Up
        </UButton>
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built by Soraia with ❤️ • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://x.com/SoraiaDev"
          target="_blank"
          icon="i-simple-icons-x"
          aria-label="Twitter"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
