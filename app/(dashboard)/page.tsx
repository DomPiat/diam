'use client'

import { useAuthStore } from '../stores/authStore'
import { CreditBalance } from '../components/credits/CreditBalance'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.email || 'Utilisateur'} 👋
        </h1>
        <CreditBalance />
      </div>

      {/* Menu de navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/entreprise" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800">🏢 Entreprises</h2>
          <p className="text-sm text-gray-500 mt-1">Gérer vos entreprises</p>
        </Link>
        <Link href="/personnel" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800">👷 Personnels</h2>
          <p className="text-sm text-gray-500 mt-1">Gérer vos équipes</p>
        </Link>
        <Link href="/dossiers" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800">📂 Dossiers</h2>
          <p className="text-sm text-gray-500 mt-1">Gérer vos dossiers (1 crédit = 1 dossier)</p>
        </Link>
        <Link href="/credits" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold text-gray-800">💰 Crédits</h2>
          <p className="text-sm text-gray-500 mt-1">Acheter des crédits</p>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Entreprises</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Personnels</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500">Dossiers</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}
