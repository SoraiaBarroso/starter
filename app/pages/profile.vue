<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// Use shared avatar state
const { updateAvatar } = useUserAvatar()

// Profile state
const loading = ref(false)
const uploadingAvatar = ref(false)
const profile = ref<any>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Form schema
const schema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50)
})

type Schema = z.output<typeof schema>

// Load profile data
async function loadProfile() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.value?.sub)
      .single()

    if (error) throw error
    profile.value = data
  } catch (error: any) {
    console.error('Error loading profile:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load profile',
      color: 'error'
    })
  }
}

const changeProfilePicture = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]

  // Validate file size
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      title: 'Error',
      description: 'File size exceeds 5MB limit.',
      color: 'error'
    })
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    toast.add({
      title: 'Error',
      description: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
      color: 'error'
    })
    return
  }

  uploadingAvatar.value = true

  try {
    // Create FormData and upload via API endpoint
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch('/api/profile/upload-avatar', {
      method: 'POST',
      body: formData
    })

    toast.add({
      title: 'Success',
      description: 'Profile picture updated successfully.',
      color: 'success'
    })

    // Update local profile data
    if (profile.value) {
      profile.value.avatar_url = response.avatar_url
    }

    // Update global avatar state (this updates the navigation bar)
    updateAvatar(response.avatar_url)

    // Clear the input
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (error: any) {
    console.error('Error uploading profile picture:', error)
    toast.add({
      title: 'Error',
      description: error.data?.statusMessage || 'Failed to upload profile picture.',
      color: 'error'
    })
  } finally {
    uploadingAvatar.value = false
  }
}
// Load profile on mount
onMounted(async () => {
  await loadProfile()
})
</script>

<template>
  <UPage>
    <UPageSection>
      <div class="max-w-4xl mx-auto">
        <h1 class="text-highlighted font-semibold text-3xl mb-8">Profile Settings</h1>

        <div class="grid gap-6">
          <!-- Profile Picture Section -->
          <UPageCard>
            <template #title>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-image" class="text-xl" />
                <span>Profile Picture</span>
              </div>
            </template>
            
            <div class="flex items-center gap-4">
              <div class="relative">
                <UAvatar
                  :src="profile?.avatar_url || '/default-avatar.png'"
                  size="xl"
                  class="hover:opacity-80 transition duration-200 cursor-pointer"
                  :class="{ 'opacity-50': uploadingAvatar }"
                  @click="fileInputRef?.click()"
                />
                <div v-if="uploadingAvatar" class="absolute inset-0 flex items-center justify-center">
                  <UIcon name="i-lucide-loader-2" class="text-2xl animate-spin text-primary" />
                </div>
              </div>
              <input
                type="file"
                ref="fileInputRef"
                class="hidden"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                @change="changeProfilePicture"
                :disabled="uploadingAvatar"
              />
              <div>
                <h1 class="text-highlighted font-semibold">Update Profile Picture</h1>
                <p class="text-muted">Click avatar to upload. Recommended: Square image, at least 400x400px. Max size: 5MB</p>
                <p class="text-xs text-muted mt-1">Supported formats: JPEG, PNG, GIF, WebP</p>
              </div>
            </div>
          </UPageCard>

          <!-- Personal Information Section -->
          <UPageCard>
            <template #title>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-user" class="text-xl" />
                <span>Personal Information</span>
              </div>
            </template>

            <UForm
              v-if="profile"
              :schema="schema"
              :state="{ first_name: profile.first_name || '', last_name: profile.last_name || '' }"
            >
              <div class="grid gap-4">
                <UFormField label="Email" name="email" class="w-full" description="Email cannot be changed">
                  <UInput
                    :model-value="profile.email"
                    disabled
                    icon="i-lucide-mail"
                    class="w-1/2"
                  />
                </UFormField>

                <UFormField label="First Name" name="first_name" required class="w-full">
                  <UInput
                    icon="i-lucide-user"
                    placeholder="Enter your first name"
                    :model-value="profile.first_name"
                    class="w-1/2"
                  />
                </UFormField>

                <UFormField label="Last Name" name="last_name" required class="w-full">
                  <UInput
                    icon="i-lucide-user"
                    placeholder="Enter your last name"
                    :model-value="profile.last_name"
                    class="w-1/2"
                  />
                </UFormField>

                <div class="flex justify-end pt-4 mr-auto">
                  <UButton
                    type="submit"
                    color="primary"
                    :loading="loading"
                  >
                    Save Changes
                  </UButton>
                </div>
              </div>
            </UForm>
          </UPageCard>

          <!-- Plan & Billing Section -->
          <UPageCard>
            <template #title>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-credit-card" class="text-xl" />
                <span>Plan & Billing</span>
              </div>
            </template>

            <div v-if="profile" class="space-y-6">
              <!-- Current Plan -->
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold mb-1">Current Plan</h3>
                  <div class="flex items-center gap-2">
                    <UBadge
                      :color="profile.premium_tier === 'free' ? 'neutral' : 'primary'"
                      size="lg"
                      class="capitalize"
                      variant="outline"
                    >
                      {{ profile.premium_tier || 'free' }}
                    </UBadge>
                    <UBadge
                      v-if="profile.has_waitlist_discount"
                      color="success"
                      variant="subtle"
                    >
                      {{ profile.discount_percentage }}% Waitlist Discount
                    </UBadge>
                  </div>
                </div>
                <UButton
                  color="primary"
                  variant="outline"
                  disabled
                >
                  <UIcon name="i-lucide-sparkles" />
                  Upgrade Plan
                </UButton>
              </div>

              <!-- Plan Features -->
              <div class="border-t border-muted pt-6">
                <h4 class="font-semibold mb-3">Available Plans</h4>
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <!-- Free Plan -->
                  <div
                    class="p-4 rounded-lg border border-purple-500"
                    :class="profile.premium_tier === 'free' ? 'border-purple-500 bg-purple-500/5' : ''"
                  >
                    <h5 class="font-semibold mb-2">Free</h5>
                    <p class="text-2xl font-bold mb-2">$0<span class="text-sm font-normal text-gray-500">/mo</span></p>
                    <ul class="text-sm space-y-1 text-purple-600 dark:text-gray-400">
                      <li>✓ Basic features</li>
                      <li>✓ Community support</li>
                    </ul>
                  </div>

                  <!-- Basic Plan -->
                  <div
                    class="p-4 rounded-lg border border-purple-500"
                    :class="profile.premium_tier === 'basic' ? 'border-primary bg-primary/5' : ''"
                  >
                    <h5 class="font-semibold mb-2">Basic</h5>
                    <p class="text-2xl font-bold mb-2">$9<span class="text-sm font-normal text-gray-500">/mo</span></p>
                    <ul class="text-sm space-y-1 text-purple-600 dark:text-gray-400">
                      <li>✓ All Free features</li>
                      <li>✓ Priority support</li>
                      <li>✓ Advanced analytics</li>
                    </ul>
                  </div>

                  <!-- Pro Plan -->
                  <div
                    class="p-4 rounded-lg border border-purple-500"
                    :class="profile.premium_tier === 'pro' ? 'border-primary bg-primary/5' : ''"
                  >
                    <h5 class="font-semibold mb-2">Pro</h5>
                    <p class="text-2xl font-bold mb-2">$29<span class="text-sm font-normal text-gray-500">/mo</span></p>
                    <ul class="text-sm space-y-1 text-purple-600 dark:text-gray-400">
                      <li>✓ All Basic features</li>
                      <li>✓ Custom integrations</li>
                      <li>✓ API access</li>
                    </ul>
                  </div>

                  <!-- Enterprise Plan -->
                  <div
                    class="p-4 rounded-lg border border-purple-500"
                    :class="profile.premium_tier === 'enterprise' ? 'border-primary bg-primary/5' : ''"
                  >
                    <h5 class="font-semibold mb-2">Enterprise</h5>
                    <p class="text-2xl font-bold mb-2">Custom</p>
                    <ul class="text-sm space-y-1 text-purple-600 dark:text-gray-400">
                      <li>✓ All Pro features</li>
                      <li>✓ Dedicated support</li>
                      <li>✓ Custom solutions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </UPageCard>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>