'use client'

import { useEffect } from 'react'
import { useDossierStore, Dossier } from '../../stores/dossierStore'  // ← Ajoutez Dossier
import { useCreditStore } from '../../stores/creditStore'
import { useRouter } from 'next/navigation'


export default function DossiersPage() {
  const { dossiers, fetchDossiers, loading } = useDossierStore()
  const { credits, fetchCredits } = useCreditStore()
  const router = useRouter()

  useEffect(() => {
    fetchDossiers()
    fetchCredits()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📂 Dossiers</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">💰 Crédits disponibles : <strong className="text-blue-600">{credits}</strong></span>
          <button
            onClick={() => router.push('/dossiers/nouveau')}
            disabled={credits < 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Nouveau dossier
          </button>
        </div>
      </div>

      {dossiers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Aucun dossier enregistré</p>
          {credits < 1 && (
            <p className="text-sm text-red-500 mb-4">⚠️ Vous n'avez pas assez de crédits.</p>
          )}
          <button
            onClick={() => router.push('/credits')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Acheter des crédits
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {dossiers.map((dossier) => (
            <div key={dossier.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{dossier.reference}</h3>
                  <p className="text-sm text-gray-500">
                    Créé le {new Date(dossier.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dossier.statut === 'valide' ? 'bg-green-100 text-green-800' :
                  dossier.statut === 'brouillon' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {dossier.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
