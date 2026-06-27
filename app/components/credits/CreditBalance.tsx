'use client'

import { useEffect } from 'react'
import { useCreditStore } from '../../stores/creditStore'

export function CreditBalance() {
  const { credits, loading, fetchCredits } = useCreditStore()

  useEffect(() => {
    fetchCredits()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
      <span className="text-sm text-gray-600">💰 Crédits :</span>
      <span className="font-bold text-lg text-blue-700">{credits}</span>
    </div>
  )
}
