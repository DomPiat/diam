import { create } from 'zustand'
import { supabase } from '../lib/supabase/client'
import { useAuthStore } from './authStore'
import { useCreditStore } from './creditStore'

export interface Dossier {
  id: string
  reference: string
  entreprise_id: string
  statut: 'brouillon' | 'payant' | 'valide' | 'archive'
  metadata: any
  created_at: string
  updated_at: string
}

interface DossierState {
  dossiers: Dossier[]
  dossierCourant: Dossier | null
  loading: boolean
  error: string | null
  fetchDossiers: () => Promise<void>
  fetchDossier: (id: string) => Promise<Dossier | null>
  createDossier: (data: { reference: string; entreprise_id: string }) => Promise<Dossier>
  updateDossier: (id: string, data: Partial<Dossier>) => Promise<Dossier>
  deleteDossier: (id: string) => Promise<void>
}

export const useDossierStore = create<DossierState>((set, get) => ({
  dossiers: [],
  dossierCourant: null,
  loading: false,
  error: null,

  fetchDossiers: async () => {
    set({ loading: true, error: null })
    const userId = useAuthStore.getState().user?.id
    if (!userId) {
      set({ error: 'Utilisateur non connecté', loading: false })
      return
    }

    try {
      const { data, error } = await supabase
        .from('dossiers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ dossiers: data || [], loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  fetchDossier: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('dossiers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      set({ dossierCourant: data, loading: false })
      return data
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  createDossier: async (data: { reference: string; entreprise_id: string }) => {
    set({ loading: true, error: null })
    const userId = useAuthStore.getState().user?.id
    if (!userId) {
      throw new Error('Utilisateur non connecté')
    }

    try {
      // 1. Vérifier les crédits disponibles
      const { credits } = useCreditStore.getState()
      if (credits < 1) {
        throw new Error('Crédits insuffisants. Veuillez acheter des crédits.')
      }

      // 2. Créer le dossier
      const { data: dossier, error: dossierError } = await supabase
        .from('dossiers')
        .insert([{
          user_id: userId,
          reference: data.reference,
          entreprise_id: data.entreprise_id,
          statut: 'brouillon',
          metadata: {
            credits_consumed: 1,
            consumed_at: new Date().toISOString()
          }
        }])
        .select()
        .single()

      if (dossierError) throw dossierError

      // 3. Consommer 1 crédit
      const { error: updateError } = await supabase.rpc('increment_credits', {
        user_id: userId,
        amount: -1
      })

      if (updateError) throw updateError

      // 4. Enregistrer la transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: -1,
          type: 'consumption',
          description: `Création du dossier ${data.reference}`,
        })

      // 5. Rafraîchir le solde de crédits
      await useCreditStore.getState().fetchCredits()

      set(state => ({
        dossiers: [dossier, ...state.dossiers],
        dossierCourant: dossier,
        loading: false
      }))
      return dossier
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  updateDossier: async (id: string, data: Partial<Dossier>) => {
    set({ loading: true, error: null })
    try {
      const { data: result, error } = await supabase
        .from('dossiers')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      set(state => ({
        dossiers: state.dossiers.map(d => d.id === id ? result : d),
        dossierCourant: result,
        loading: false
      }))
      return result
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  deleteDossier: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase
        .from('dossiers')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      set(state => ({
        dossiers: state.dossiers.filter(d => d.id !== id),
        loading: false
      }))
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  }
}))
