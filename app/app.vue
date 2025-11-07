<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

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

const title = 'Nuxt Starter Template'
const description = 'A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
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
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
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
