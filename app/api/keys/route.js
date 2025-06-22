import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Helper function to generate API key
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// GET /api/keys - List all API keys for the current user
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ apiKeys });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/keys - Create a new API key for the current user
export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name, key: providedKey, type = 'default', usage = 0 } = await request.json();
    const apiKey = providedKey && providedKey.trim() !== '' ? providedKey.trim() : generateApiKey();

    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          key: apiKey,
          type,
          usage,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ apiKey: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 