import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - no user session'
      })
    }

    const client = await serverSupabaseClient(event)

    // Check if profile already exists
    const { data: existingProfile } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return {
        success: true,
        profile: existingProfile,
        message: 'Profile already exists'
      }
    }

    // Get user metadata from auth
    const { data: { user: authUser }, error: userError } = await client.auth.getUser()

    if (userError || !authUser) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to get user data'
      })
    }

    // Extract metadata
    const metadata = authUser.user_metadata || {}
    const hasWaitlistDiscount = metadata.has_waitlist_discount || false
    const discountPercentage = metadata.discount_percentage || 0

    // Extract name information (for OAuth providers)
    const fullName = metadata.full_name || metadata.name || null
    let firstName = null
    let lastName = null

    if (fullName) {
      const nameParts = fullName.trim().split(' ')
      firstName = nameParts[0]
      if (nameParts.length > 1) {
        lastName = nameParts.slice(1).join(' ')
      }
    }

    // Create the profile
    const { data: newProfile, error: profileError } = await client
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        avatar_url: metadata.avatar_url || null,
        has_waitlist_discount: hasWaitlistDiscount,
        discount_percentage: discountPercentage,
        plan: 'free'
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create profile: ${profileError.message}`
      })
    }

    return {
      success: true,
      profile: newProfile,
      message: 'Profile created successfully'
    }
  } catch (error: any) {
    console.error('Ensure profile error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to ensure profile exists'
    })
  }
})
