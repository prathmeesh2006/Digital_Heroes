import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using the service role key.
 * ONLY use in server-side code (API routes, server actions, webhooks).
 * This client bypasses RLS — use with caution.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
