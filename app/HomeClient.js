'use client';
import { useUser } from '@supabase/auth-helpers-react'
import HomeContent from './HomeContent'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomeClient() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/dashboards')
    }
  }, [user, router])

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <HomeContent />
        {user && (
          <Link href="/dashboards" className="mt-4 text-blue-500">
            Manage API Keys
          </Link>
        )}
      </main>
    </div>
  )
}
