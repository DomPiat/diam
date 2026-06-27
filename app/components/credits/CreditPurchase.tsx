'use client'

import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

const PACKS = [
  { credits: 1, price: '19€' },
  { credits: 5, price: '90€' },
  { credits: 10, price: '170€' },
  { credits: 20, price: '320€' },
  { credits: 25, price: '375€' },
]

export function CreditPurchase() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePurchase = async (credits: number) => {
    setLoading(true)
    setError('')

    try {
      // 1. Créer la session côté serveur
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credits,
          userId: user?.id,
          userEmail: user?.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session')
      }

      // 2. ✅ Redirection directe vers Stripe Checkout
      // On utilise window.location.href qui fonctionne toujours
      window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`

    } catch (err: any) {
      console.error('Erreur de paiement:', err)
      setError(err.message || 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PACKS.map((pack) => (
          <div
            key={pack.credits}
            className="border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-shadow bg-white"
          >
            <div className="text-3xl font-bold text-blue-600">{pack.credits}</div>
            <div className="text-sm text-gray-500 mb-1">crédits</div>
            <div className="text-xl font-semibold text-gray-800 my-2">{pack.price}</div>
            <button
              onClick={() => handlePurchase(pack.credits)}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : 'Acheter'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}