<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const toast = useToast()
const isSubmitting = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/waitlist', {
      method: 'POST',
      body: {
        email: event.data.email
      }
    })

    toast.add({
      title: 'Success!',
      description: 'You\'ve been added to the waitlist. Check your email!',
      color: 'success'
    })

    // Reset the form
    state.email = undefined
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to join waitlist. Please try again.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const plans = ref([
  {
    title: 'Free',
    description: 'Tailored for indie hackers.',
    price: '$0',
    features: [
      'One developer',
      'Lifetime access'
    ],
    button: {
      label: 'Buy now'
    }
  },
  {
    title: 'Premium',
    description: 'Best suited for small teams.',
    price: '$3.99/mo',
    features: [
      'Up to 5 developers',
      'Everything in Solo'
    ],
    button: {
      label: 'Buy now'
    }
  },
])
</script>

<template>
  <div>
    <UPageHero
      title="Extract Assets from Any Website in Seconds"
      description="The ultimate Chrome extension for designers and developers. Capture colors, typography, assets, and generate complete design systems instantly."
      :ui="{
        container: 'bg-[/assets/bg.jpg]',
        root: 'bg-[/assets/bg.jpg]',
      }"
      :links="[{
        label: 'Join the Waitlist',
        to: '#waitlist',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        variant: 'soft',
        class: 'rounded-full'
      }, {
        label: 'See how It Works',
        to: '#features',
        size: 'xl',
        color: 'neutral',
        variant: 'soft',
        class: 'rounded-full'
      }]"
    />
    
    <UPageCTA
      id="waitlist"
      title="Be First to Know"
      description="Join our waitlist and have the chance to get premium features."
      variant="subtle"
      :ui="{
        container: 'flex flex-col items-center justify-center !gap-8',
      }"
    >
      <UForm :schema="schema" :state="state" class="space-y-4 w-xs" @submit="onSubmit">
        <UFormField  name="email" class="w-full">
          <UInput placeholder="name@mail.com" v-model="state.email" class="w-full" />
        </UFormField>
        <UButton type="submit" class="w-full flex justify-center items-center" :disabled="!state.email || isSubmitting" :loading="isSubmitting">
          Join Waitlist
        </UButton>
      </UForm>
    </UPageCTA>
   
    <UPageSection
      title="Overview"
      description="Automaticly extracts infomraiton when you ennter a website"
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
    >
      <img
        src="assets/dashboard.png"
        width="352"
        alt="Illustration"
        class="w-full rounded-lg"
      />
    </UPageSection>

    <UPageSection
      title="Overview"
      description="Automaticly extracts infomraiton when you ennter a website"
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
      reverse
    >
      <img
        src="assets/feature1.png"
        width="352"
        alt="Illustration"
        class="w-full rounded-lg"
      />
    </UPageSection>

     <UPageSection
      title="Overview"
      description="Automaticly extracts infomraiton when you ennter a website"
      orientation="horizontal"
    >
      <img
        src="assets/dashboard.png"
        width="352"
        alt="Illustration"
        class="w-full rounded-lg"
      />
    </UPageSection>

    <UPageSection id="pricing" title="Pricing" description="Choose the plan that fits your needs. Upgrade, downgrade, or cancel anytime with no hidden fees. Simple, transparent pricing for everyone.">
          <UPricingPlans :plans="plans"/>
    </UPageSection>

    <!-- <UPageSection
      id="features"
      title="Everything you need to build modern Nuxt apps"
      description="Start with a solid foundation. This template includes all the essentials for building production-ready applications with Nuxt UI's powerful component system."
      :features="[{
        icon: 'i-lucide-rocket',
        title: 'Production-ready from day one',
        description: 'Pre-configured with TypeScript, ESLint, Tailwind CSS, and all the best practices. Focus on building features, not setting up tooling.'
      }, {
        icon: 'i-lucide-palette',
        title: 'Beautiful by default',
        description: 'Leveraging Nuxt UI\'s design system with automatic dark mode, consistent spacing, and polished components that look great out of the box.'
      }, {
        icon: 'i-lucide-zap',
        title: 'Lightning fast',
        description: 'Optimized for performance with SSR/SSG support, automatic code splitting, and edge-ready deployment. Your users will love the speed.'
      }, {
        icon: 'i-lucide-blocks',
        title: '100+ components included',
        description: 'Access Nuxt UI\'s comprehensive component library. From forms to navigation, everything is accessible, responsive, and customizable.'
      }, {
        icon: 'i-lucide-code-2',
        title: 'Developer experience first',
        description: 'Auto-imports, hot module replacement, and TypeScript support. Write less boilerplate and ship more features.'
      }, {
        icon: 'i-lucide-shield-check',
        title: 'Built for scale',
        description: 'Enterprise-ready architecture with proper error handling, SEO optimization, and security best practices built-in.'
      }]"
    /> -->
  </div>
</template>
