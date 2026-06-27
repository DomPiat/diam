'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      } else {
        // Inscription via API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de l\'inscription')
        }

        setError('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.')
        setIsLogin(true)
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      console.error('Erreur:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">D</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">DIAM</h2>
          <p className="mt-1 text-sm text-gray-600">
            Dématérialisation Interface Amiante Mobile
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 h-12 text-base border border-gray-300 rounded-lg"
                placeholder="votre@email.fr"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 h-12 text-base border border-gray-300 rounded-lg pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xl"
                >
                  {showPassword ? '🔒' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-sm ${error.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 h-12 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : "S'inscrire"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin ? "Vous n'avez pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-gray-400 mt-4">
          <p>DIAM v0.1.0 • © 2026</p>
        </div>
      </div>
    </div>
  )
}