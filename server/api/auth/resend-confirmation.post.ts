import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const { email: rawEmail } = body

    const email = rawEmail?.toLowerCase().trim()

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    // Resend confirmation email
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${getRequestURL(event).origin}/confirm`
      }
    })

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      message: 'Confirmation email resent successfully'
    }
  } catch (error: any) {
    console.error('Resend confirmation error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to resend confirmation'
    })
  }
})
