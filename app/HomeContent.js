'use client';

import Image from 'next/image';
import Link from 'next/link';
import { supabaseBrowser } from '../lib/supabaseBrowser';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const handleGoogleSignIn = async () => {
  const supabase = supabaseBrowser();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
};

export default function HomeContent() {
  const { user, isLoading } = useUser() || {};
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState(null);

  // Handle redirectedFrom and loggedOut query params
  useEffect(() => {
    const redirectedFrom = searchParams.get('redirectedFrom');
    if (redirectedFrom) {
      setToast('Please sign in to access that page.');
      const params = new URLSearchParams(searchParams);
      params.delete('redirectedFrom');
      router.replace(`/?${params.toString()}`, { scroll: false });
      return;
    }

    if (searchParams.get('loggedOut')) {
      setToast('Signed out successfully.');
      const params = new URLSearchParams(searchParams);
      params.delete('loggedOut');
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-down bg-red-600 text-white">
          <span className="font-medium">{toast}</span>
          <button className="ml-2" onClick={() => setToast(null)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{' '}
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                app/page.js
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
          </ol>

          {/* Google Login */}
          <button
            onClick={handleGoogleSignIn}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-600 text-white gap-2 hover:bg-red-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" aria-hidden>
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.4h146.8c-6.4 34.7-25 64.1-53.2 83.7l86 66.9c50.4-46.5 81.9-115 81.9-195.6z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c71.6 0 131.6-23.7 175.5-64.5l-86-66.9c-23.8 16-54.4 25.7-89.5 25.7-68.8 0-127-46.5-148-109.2l-90.2 69.7c43.8 86.4 134.4 145.2 238.2 145.2z"
              />
              <path fill="#fbbc04" d="M124 329.4c-10.8-31.7-10.8-66.1 0-97.8v-69.7l-90.2-69.7c-39.2 78.4-39.2 169.7 0 248.1l90.2-69.7z" />
              <path
                fill="#ea4335"
                d="M272 107.7c37.5 0 71.5 12.9 98.2 34.6l73.5-73.5C402.5 24.1 347.4 0 272 0 168.2 0 77.6 58.8 33.8 145.2l90.2 69.7C145 154.2 203.2 107.7 272 107.7z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="/dashboards"
              style={{ display: !isLoading && user ? 'flex' : 'none' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage API Keys
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
