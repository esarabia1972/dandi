"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import { useUser } from '@supabase/auth-helpers-react';

const navItems = [
  { label: 'Overview', href: '/dashboards', icon: '🏠' },
  { label: 'API Playground', href: '/dashboards/playground', icon: '🔧' },
  { label: 'Use Cases', href: '/dashboards/use-cases', icon: '✨' },
  { label: 'Billing', href: '/dashboards/billing', icon: '💳' },
  { label: 'Settings', href: '/dashboards/settings', icon: '⚙️' },
  { label: 'Documentation', href: '/dashboards/docs', icon: '📄' },
  { label: 'Tavily MCP', href: '/dashboards/mcp', icon: '🌐' }
];

export default function Sidebar({ open = true, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  if (!open) return null;
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col p-4 fixed left-0 top-0 shadow-md z-40">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <span className="text-xl font-semibold">Dandi AI</span>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Personal dropdown placeholder */}
      <button className="w-full flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium mb-8">
        Personal
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      <nav className="flex-1 overflow-y-auto">
        {navItems.map(({ label, href, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 hover:bg-gray-100 ${active ? 'text-blue-600 font-medium bg-gray-100' : 'text-gray-600'}`}> 
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User avatar footer */}
      <div className="mt-auto flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div 
          className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-gray-600 overflow-hidden ${
            user?.user_metadata?.avatar_url ? 'bg-transparent' : 'bg-gray-300'
          }`}
        >
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt={user.email || 'User avatar'} className="w-full h-full object-cover" />
          ) : user?.email ? (
            user.email.charAt(0).toUpperCase()
          ) : (
            '?'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{user ? user.email : 'Account'}</p>
          <button
            onClick={async () => {
              const supabase = supabaseBrowser();
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="text-left text-xs text-red-600 hover:text-red-800"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
} 