import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req) {
  // Create a mutable response so Supabase can modify cookies as needed
  const res = NextResponse.next();

  // Initialise Supabase client with the request/responses
  const supabase = createMiddlewareClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('MW sees session:', session);

  // If user is not logged in and tries to access a protected path, redirect
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl, { status: 302 });
  }

  // Otherwise, allow.
  return res;
}

// Apply only to /dashboards and its sub-paths
export const config = {
  matcher: ['/dashboards/:path*'],
}; 