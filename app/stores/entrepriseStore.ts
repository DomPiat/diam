import { create } from 'zustand'
import { supabase } from '../lib/supabase/client'  // ← Chemin relatif
import { useAuthStore } from './authStore'

export interface Entreprise {
  id: string
  raison_sociale: string
  siret: string
  code_ape?: string
  forme_juridique?: string
  adresse: any
  contact: any
  dirigeant: any
  referent_demat: any
  certification: any
  conformite: any
  instances: any
  metadata: {
    versionActuelle: string
    dateCreation: string
    createur: string
    versions: Array<{
      indice: string
      date: string
      responsable: string
      commentaire: string
    }>
  }
  created_at: string
  updated_at: string
  user_id: string
}

interface EntrepriseState {
  entreprises: Entreprise[]
  entrepriseCourante: Entreprise | null
  loading: boolean
  error: string | null
  fetchEntreprises: () => Promise<void>
  fetchEntreprise: (id: string) => Promise<Entreprise | null>
  createEntreprise: (data: Partial<Entreprise>) => Promise<Entreprise>
  updateEntreprise: (id: string, data: Partial<Entreprise>) => Promise<Entreprise>
  deleteEntreprise: (id: string) => Promise<void>
}

export const useEntrepriseStore = create<EntrepriseState>((set, get) => ({
  entreprises: [],
  entrepriseCourante: null,
  loading: false,
  error: null,

  fetchEntreprises: async () => {
    set({ loading: true, error: null })
    const userId = useAuthStore.getState().getUserId()
    if (!userId) {
      set({ error: 'Utilisateur non connecté', loading: false })
      return
    }

    try {
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ entreprises: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  fetchEntreprise: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      set({ entrepriseCourante: data, loading: false })
      return data
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  createEntreprise: async (data: Partial<Entreprise>) => {
    set({ loading: true, error: null })
    const userId = useAuthStore.getState().getUserId()
    if (!userId) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      const dataWithMeta = {
        ...data,
        user_id: userId,
        metadata: {
          versionActuelle: 'V1',
          dateCreation: new Date().toISOString(),
          createur: userId,
          versions: [
            {
              indice: 'V1',
              date: new Date().toISOString(),
              responsable: userId,
              commentaire: 'Création du profil entreprise'
            }
          ]
        }
      }

      const { data: result, error } = await supabase
        .from('entreprises')
        .insert([dataWithMeta])
        .select()
        .single()

      if (error) throw error
      
      set(state => ({
        entreprises: [result, ...state.entreprises],
        entrepriseCourante: result,
        loading: false
      }))
      return result
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  updateEntreprise: async (id: string, data: Partial<Entreprise>) => {
    set({ loading: true, error: null })
    try {
      const ancienne = get().entreprises.find(e => e.id === id)
      const versions = ancienne?.metadata?.versions || []
      
      const dataWithMeta = {
        ...data,
        metadata: {
          ...data.metadata,
          versionActuelle: `V${versions.length + 1}`,
          versions: [
            ...versions,
            {
              indice: `V${versions.length + 1}`,
              date: new Date().toISOString(),
              responsable: data.metadata?.createur || 'Système',
              commentaire: data.metadata?.commentaire || 'Mise à jour'
            }
          ]
        }
      }

      const { data: result, error } = await supabase
        .from('entreprises')
        .update(dataWithMeta)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      set(state => ({
        entreprises: state.entreprises.map(e => e.id === id ? result : e),
        entrepriseCourante: result,
        loading: false
      }))
      return result
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  deleteEntreprise: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('entreprises')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      set(state => ({
        entreprises: state.entreprises.filter(e => e.id !== id),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
}))