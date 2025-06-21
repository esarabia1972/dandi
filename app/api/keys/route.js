import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import crypto from 'crypto';

// Helper function to generate API key
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// GET /api/keys - List all API keys
export async function GET() {
  try {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ apiKeys });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/keys - Create a new API key
export async function POST(request) {
  try {
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