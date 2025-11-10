import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client composable
 *
 * Provides a configured Supabase client for database operations.
 * Uses environment variables for configuration.
 */
export const useSupabase = () => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseAnonKey

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration. Please check your environment variables.')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  return supabase
}
