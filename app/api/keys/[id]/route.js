import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/keys/[id] - Get a specific API key
export async function GET(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/keys/[id] - Update an API key
export async function PUT(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'API key name is required' }, { status: 400 });
    }

    const { data: updatedKey, error } = await supabase
      .from('api_keys')
      .update({ name })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!updatedKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/keys/[id] - Delete an API key
export async function DELETE(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = params;
    const { name, key: newKey, type, usage } = await request.json();

    const updateObj = {};
    if (name) updateObj.name = name;
    if (newKey) updateObj.key = newKey;
    if (type) updateObj.type = type;
    if (usage !== undefined) updateObj.usage = usage;

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 