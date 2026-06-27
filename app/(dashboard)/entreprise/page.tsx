'use client'

import { useEffect } from 'react'
import { useEntrepriseStore } from '../../stores/entrepriseStore'   // ← Dossier "entreprise" (avec un "e")
import { useRouter } from 'next/navigation'
import { EntrepriseCard } from '../../components/entreprise/EntrepriseCard'   // ← Dossier "entreprise", fichier "EntrepriseCard"

export default function EntreprisePage() {
  const { entreprises, fetchEntreprises, loading } = useEntrepriseStore()
  const router = useRouter()

  useEffect(() => {
    fetchEntreprises()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
        <button
          onClick={() => router.push('/entreprise/nouveau')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>+</span> Nouvelle entreprise
        </button>
      </div>

      {entreprises.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Aucune entreprise enregistrée</p>
          <button
            onClick={() => router.push('/entreprise/nouveau')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Créer votre première entreprise
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entreprises.map((entreprise) => (
            <EntrepriseCard
              key={entreprise.id}
              entreprise={entreprise}
              onClick={() => router.push(`/entreprise/${entreprise.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}