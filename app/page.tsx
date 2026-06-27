'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'

export default function HomePage() {
  const { user, loading, init } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    console.log('🔍 HomePage - loading:', loading, 'user:', user)
    init()
  }, [])

  useEffect(() => {
    console.log('🔄 HomePage - Redirection vers:', loading ? 'attente...' : user ? '/dashboard' : '/login')
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}