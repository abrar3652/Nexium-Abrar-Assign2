import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

console.log('SUPABASE_URL:', SUPABASE_URL)
console.log('SUPABASE_KEY:', SUPABASE_KEY)

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Please define the SUPABASE_URL and SUPABASE_KEY environment variables')
}

// ✅ No unsupported "debug" field
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.39.2',
    },
  },
})

// Optional: Manual debug logging can be done where you use the client, like this:
export function logDebug(message: string, ...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Supabase Debug]', message, ...args)
  }
}
