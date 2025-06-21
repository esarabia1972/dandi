import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// POST /api/validate-key
// Body: { "key": "<api_key_value>" }
// Returns: { valid: boolean }
export async function POST(request) {
  try {
    const { key } = await request.json();

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 => Row not found (PostgREST). Treat as not-found below.
      throw error;
    }

    const valid = !!data;
    return NextResponse.json({ valid });
  } catch (err) {
    return NextResponse.json(
      { valid: false, error: err.message },
      { status: 500 }
    );
  }
} 