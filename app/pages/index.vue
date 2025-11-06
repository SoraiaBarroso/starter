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
    title: 'Free Plan',
    description: '  Perfect for designers and developers getting started.',
    price: '$0',
    features: [
      'Extract images and videos from any website',
      'Download SVGs and icons in original format',
      'Instant page overview (colors, fonts, typography)',
      'Manual color picking and copying',
    ],
    button: {
      label: 'Coming Soon'
    }
  },
  {
    title: 'Pro Plan',
    description: 'For professionals who need production-ready exports',
    price: '$3.99/mo',
    features: [
      'Everything in Free, plus:',
      'AI-powered brand analysis',
      'Automatic design system generation',
      'Export to CSS Variables or Tailwind',
      'WCAG accessibility validation',
    ],
    button: {
      label: 'Coming Soon'
    }
  },
])
</script>

<template>
  <div>
    <UPageHero
      title="Inspect. Extract. Build Faster."
      description="Extract images, videos, and SVGs with one click. Hover to inspect any element and instantly reveal colors, typography, and brand identity insights — then export everything in production-ready formats."
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
      title="Instant Page Overview"
      description="The moment you open a website, MiroMiro analyzes everything: background colors, text colors, font families and color usage frequency. Get a complete snapshot of any site's visual language in seconds."
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
    >
      <img
        src="assets/overview.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageSection
      title="Smart Element Inspector"
      description="Hover over any element to see its complete style breakdown. Colors, fonts, spacing, shadows, borders—all displayed in
  real-time. Copy values instantly or inspect design patterns as you browse."
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
      reverse
    >
      <img
        src="assets/overview.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

    <UPageSection
      title="One-Click Media Extraction"
      description="Download all images and videos from any website instantly. No more digging for assets—MiroMiro captures every visual asset on the page with a single click. "
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
    >
      <img
        src="assets/images1.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageSection
      title="SVG & Icon Capture"
      description=" Extract SVG graphics and icons in their original vector format. Download them individually or in bulk, preserving full editability. Perfect for designers who need clean, scalable assets without
  digging through page source."
      orientation="horizontal"
      reverse
    >
      <img
        src="assets/svg.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
      />
    </UPageSection>

     <UPageSection
      icon="i-lucide:sparkles"
      title="AI Design System Generator"
      description="AI that converts any website into production-ready code.
It detects hero colors, brand accents, and builds complete color scales with WCAG-validated accessibility.
Export as CSS variables or Tailwind configs instantly."
      orientation="horizontal"
      :ui="{
        container: '!pb-8'
      }"
    >
      <img
        src="assets/ai.png"
        width="352"
        alt="Illustration"
        class="w-full border-2 border-neutral-200 rounded-3xl"
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
