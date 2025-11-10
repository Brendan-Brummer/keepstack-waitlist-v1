import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Validation schema
const WaitlistSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().email('Invalid email address'),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = WaitlistSchema.parse(body)

    const { name, email } = validatedData
    const normalizedEmail = email.toLowerCase().trim()

    // Initialize Supabase client
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey // Use service key for server-side operations
    )

    // Insert into Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        name: name?.trim() || null,
        email: normalizedEmail,
      })
      .select()
      .single()

    if (insertError) {
      // Check if it's a duplicate email error
      if (insertError.code === '23505') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Email already registered',
          data: { message: 'This email is already on the waitlist.' },
        })
      }

      console.error('Supabase insert error:', insertError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Database Error',
        data: { message: 'Failed to save your information. Please try again.' },
      })
    }

    // Initialize Resend
    const resend = new Resend(config.resendApiKey)

    // Sync to Resend Audience (non-blocking - log errors but don't fail request)
    try {
      await resend.contacts.create({
        email: normalizedEmail,
        firstName: name?.trim() || undefined,
        audienceId: config.resendAudienceId,
      })
    } catch (resendError) {
      console.error('Resend audience sync error:', resendError)
      // Log to sync_pending table for retry
      await supabase.from('sync_pending').insert({
        email: normalizedEmail,
        retry_count: 0,
      })
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'KeepStack <noreply@keepstack.com>',
        to: normalizedEmail,
        subject: "You're on the KeepStack waitlist!",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0201d7; font-size: 24px; margin-bottom: 16px;">Welcome to KeepStack!</h1>
            <p style="color: #6c6e80; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              ${name ? `Hi ${name},` : 'Hi there,'}
            </p>
            <p style="color: #6c6e80; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              You're officially on the waitlist for KeepStack—the only photo app that guarantees your family's memories will be accessible in 18 years, even if we're not.
            </p>
            <p style="color: #6c6e80; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              We'll let you know as soon as we launch. In the meantime, we're working hard to build something that makes losing family photos impossible.
            </p>
            <p style="color: #6c6e80; font-size: 16px; line-height: 1.6;">
              Thanks for trusting us with what matters most.
            </p>
            <p style="color: #6c6e80; font-size: 16px; line-height: 1.6; margin-top: 32px;">
              — The KeepStack Team
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      // Log but don't fail - user is already saved
      console.error('Confirmation email error:', emailError)
    }

    // Send admin notification
    try {
      await resend.emails.send({
        from: 'KeepStack Waitlist <noreply@keepstack.com>',
        to: config.adminEmail,
        subject: '🎉 New KeepStack Waitlist Signup',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #0201d7; font-size: 20px; margin-bottom: 16px;">New Waitlist Signup</h2>
            <p style="color: #6c6e80; font-size: 16px; line-height: 1.6;">
              <strong>Name:</strong> ${name || 'Not provided'}<br>
              <strong>Email:</strong> ${normalizedEmail}<br>
              <strong>Time:</strong> ${new Date().toISOString()}
            </p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      // Log but don't fail
      console.error('Admin notification error:', adminEmailError)
    }

    // Return success
    return {
      success: true,
      message: 'Successfully joined the waitlist!',
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        data: { message: error.errors[0].message },
      })
    }

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Generic error
    console.error('Waitlist endpoint error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: 'Something went wrong. Please try again.' },
    })
  }
})
