import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Get user ID - can be user.id or user.sub depending on the auth method
    const userId = user.id || user.sub
    if (!userId) {
      console.error('User object:', user)
      throw createError({
        statusCode: 401,
        statusMessage: 'Unable to get user ID'
      })
    }

    // Use service role client to bypass RLS
    const client = serverSupabaseServiceRole(event)

    // Read the multipart form data
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!file.type || !allowedTypes.includes(file.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
      })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File too large. Maximum size is 5MB'
      })
    }

    // Generate unique filename
    const fileExt = file.filename?.split('.').pop() || 'jpg'
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`

    // Delete old avatar if exists
    const { data: profile } = await client
      .from('user_profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single()

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').slice(-2).join('/')
      await client.storage.from('avatars').remove([oldPath])
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await client.storage
      .from('avatars')
      .upload(fileName, file.data, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error details:', uploadError)
      throw createError({
        statusCode: 400,
        statusMessage: `Upload failed: ${uploadError.message}`
      })
    }

    console.log('File uploaded successfully:', uploadData.path)

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from('avatars')
      .getPublicUrl(uploadData.path)

    // Update profile with new avatar URL
    const { data: updatedProfile, error: updateError } = await client
      .from('user_profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      throw createError({
        statusCode: 400,
        statusMessage: updateError.message
      })
    }

    return {
      success: true,
      avatar_url: publicUrl,
      profile: updatedProfile
    }
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to upload avatar'
    })
  }
})
