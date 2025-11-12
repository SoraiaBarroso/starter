import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const { first_name, last_name, avatar_url } = body

    // Validate input
    if (!first_name?.trim() && !last_name?.trim() && !avatar_url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one field is required'
      })
    }

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (first_name !== undefined) {
      updateData.first_name = first_name.trim()
    }
    if (last_name !== undefined) {
      updateData.last_name = last_name.trim()
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url
    }

    // Update full_name if first or last name changed
    if (first_name !== undefined || last_name !== undefined) {
      const { data: currentProfile } = await client
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single()

      const finalFirstName = first_name !== undefined ? first_name.trim() : currentProfile?.first_name || ''
      const finalLastName = last_name !== undefined ? last_name.trim() : currentProfile?.last_name || ''
      updateData.full_name = `${finalFirstName} ${finalLastName}`.trim()
    }

    // Update profile
    const { data, error } = await client
      .from('user_profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      profile: data
    }
  } catch (error: any) {
    console.error('Profile update error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to update profile'
    })
  }
})
