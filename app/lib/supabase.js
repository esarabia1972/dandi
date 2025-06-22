import { createClient } from '@supabase/supabase-js';
import { supabaseBrowser } from '../lib/supabaseBrowser';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabase = supabaseBrowser();

// Only create the admin client when the service key is present. This prevents the app
// from crashing locally (500s on every API route) when you haven't provided the
// private service key.
export const supabaseAdmin = process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    })
  : null;