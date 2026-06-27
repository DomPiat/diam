'use client'

import { useState } from 'react'
import { useEntrepriseStore } from '../../../stores/entrepriseStore'
import { useRouter } from 'next/navigation'

export default function NouvelleEntreprisePage() {
  const { createEntreprise, loading } = useEntrepriseStore()
  const router = useRouter()

  const [formData, setFormData] = useState({
    raison_sociale: '',
    siret: '',
    adresse: {
      rue: '',
      codePostal: '',
      ville: ''
    },
    contact: {
      email: '',
      telephone: ''
    },
    dirigeant: {
      civilite: 'M.',
      nom: '',
      prenom: '',
      fonction: ''
    },
    referent_demat: {
      nom: '',
      prenom: '',
      email: '',
      telephone: ''
    },
    certification: {
      organisme: 'AFNOR Certification',
      numero: '',
      dateDelivrance: '',
      dateExpiration: '',
      norme: 'NF X 46-010'
    },
    conformite: {
      cotisationOPPBTP: false,
      typeDeclarant: 'Entreprise de désamiantage (SS3)'
    }
  })

  // ✅ Fonction corrigée
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any> || {}),
          [child]: type === 'checkbox' ? checked : value
        }
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createEntreprise(formData)
      router.push('/entreprise')
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle entreprise</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Section : Identité */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Identité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Raison sociale *</label>
              <input
                type="text"
                name="raison_sociale"
                value={formData.raison_sociale}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SIRET *</label>
              <input
                type="text"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="14 chiffres"
              />
            </div>
          </div>
        </div>

        {/* Section : Adresse */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Adresse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Rue</label>
              <input
                type="text"
                name="adresse.rue"
                value={formData.adresse.rue}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code postal</label>
              <input
                type="text"
                name="adresse.codePostal"
                value={formData.adresse.codePostal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                name="adresse.ville"
                value={formData.adresse.ville}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section : Certification */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Certification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organisme *</label>
              <select
                name="certification.organisme"
                value={formData.certification.organisme}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="AFNOR Certification">AFNOR Certification</option>
                <option value="Qualibat">Qualibat</option>
                <option value="GLOBAL Certification">GLOBAL Certification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de certificat *</label>
              <input
                type="text"
                name="certification.numero"
                value={formData.certification.numero}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de délivrance</label>
              <input
                type="date"
                name="certification.dateDelivrance"
                value={formData.certification.dateDelivrance}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'expiration *</label>
              <input
                type="date"
                name="certification.dateExpiration"
                value={formData.certification.dateExpiration}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section : Dirigeant */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Dirigeant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Civilité</label>
              <select
                name="dirigeant.civilite"
                value={formData.dirigeant.civilite}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Mlle">Mlle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="dirigeant.nom"
                value={formData.dirigeant.nom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                name="dirigeant.prenom"
                value={formData.dirigeant.prenom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section : Référent DEMAT */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Référent DEMAT@MIANTE</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="referent_demat.nom"
                value={formData.referent_demat.nom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                name="referent_demat.prenom"
                value={formData.referent_demat.prenom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="referent_demat.email"
                value={formData.referent_demat.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                name="referent_demat.telephone"
                value={formData.referent_demat.telephone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section : Conformité OPPBTP */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Conformité</h2>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="conformite.cotisationOPPBTP"
              checked={formData.conformite.cotisationOPPBTP}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Cotisation OPPBTP</label>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/entreprise')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer l\'entreprise'}
          </button>
        </div>
      </form>
    </div>
  )
}