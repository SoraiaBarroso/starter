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

    // Check if bucket exists
    const { data: buckets } = await client.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === 'avatars')

    if (bucketExists) {
      return {
        success: true,
        message: 'Storage bucket already exists',
        bucket: 'avatars'
      }
    }

    // Create the avatars bucket
    const { data: bucketData, error: bucketError } = await client.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    })

    if (bucketError) {
      console.error('Bucket creation error:', bucketError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create storage bucket: ${bucketError.message}`
      })
    }

    return {
      success: true,
      message: 'Storage bucket created successfully',
      bucket: bucketData
    }
  } catch (error: any) {
    console.error('Storage setup error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to setup storage'
    })
  }
})
