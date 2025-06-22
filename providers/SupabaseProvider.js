'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabaseBrowser } from '../lib/supabaseBrowser';

export default function SupabaseProvider({ children }) {
  const supabase = supabaseBrowser();
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
} 