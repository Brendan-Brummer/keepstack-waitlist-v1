import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

/**
 * Daily cron job to sync pending emails to Resend Audience
 *
 * This endpoint is called by Vercel Cron at 2 AM daily to retry
 * any failed Resend Audience syncs from the sync_pending table.
 *
 * Protected by CRON_SECRET header for security.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  try {
    // Verify cron secret for security
    const cronSecret = getHeader(event, 'x-cron-secret')
    if (cronSecret !== config.cronSecret) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: { message: 'Invalid cron secret' },
      })
    }

    // Initialize clients
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceKey
    )
    const resend = new Resend(config.resendApiKey)

    // Get pending syncs (limit retries to 5)
    const { data: pendingSyncs, error: fetchError } = await supabase
      .from('sync_pending')
      .select('*')
      .lt('retry_count', 5)
      .order('created_at', { ascending: true })
      .limit(100) // Process in batches

    if (fetchError) {
      console.error('Error fetching pending syncs:', fetchError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Database Error',
        data: { message: 'Failed to fetch pending syncs' },
      })
    }

    if (!pendingSyncs || pendingSyncs.length === 0) {
      return {
        success: true,
        message: 'No pending syncs to process',
        processed: 0,
      }
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each pending sync
    for (const sync of pendingSyncs) {
      try {
        // Get user info from waitlist
        const { data: user } = await supabase
          .from('waitlist')
          .select('name, email')
          .eq('email', sync.email)
          .single()

        if (!user) {
          console.warn(`User not found for email: ${sync.email}`)
          // Delete from pending if user doesn't exist
          await supabase.from('sync_pending').delete().eq('id', sync.id)
          continue
        }

        // Attempt to sync to Resend Audience
        await resend.contacts.create({
          email: user.email,
          firstName: user.name || undefined,
          audienceId: config.resendAudienceId,
        })

        // Success - remove from pending
        await supabase.from('sync_pending').delete().eq('id', sync.id)
        results.success++
      } catch (error) {
        console.error(`Failed to sync ${sync.email}:`, error)

        // Update retry count
        await supabase
          .from('sync_pending')
          .update({
            retry_count: sync.retry_count + 1,
            last_attempted: new Date().toISOString(),
          })
          .eq('id', sync.id)

        results.failed++
        results.errors.push(`${sync.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)

        // If max retries reached, log and delete
        if (sync.retry_count + 1 >= 5) {
          console.error(`Max retries reached for ${sync.email}, removing from queue`)
          await supabase.from('sync_pending').delete().eq('id', sync.id)
        }
      }
    }

    // Log results
    console.log('Sync job completed:', {
      total: pendingSyncs.length,
      success: results.success,
      failed: results.failed,
    })

    return {
      success: true,
      message: 'Sync job completed',
      total: pendingSyncs.length,
      synced: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    }
  } catch (error) {
    console.error('Sync job error:', error)

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: 'Sync job failed' },
    })
  }
})
