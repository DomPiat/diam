import { create } from 'zustand'
import { supabase } from '../lib/supabase/client'
import { useAuthStore } from './authStore'

interface CreditState {
  credits: number
  loading: boolean
  transactions: any[]
  fetchCredits: () => Promise<void>
  fetchTransactions: () => Promise<void>
  checkTrial: () => Promise<boolean>
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: 0,
  loading: true,
  transactions: [],

  fetchCredits: async () => {
    const userId = useAuthStore.getState().user?.id
    if (!userId) {
      set({ credits: 0, loading: false })
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (!error && data) {
      set({ credits: data.credits || 0, loading: false })
    } else {
      set({ loading: false })
    }
  },

  fetchTransactions: async () => {
    const userId = useAuthStore.getState().user?.id
    if (!userId) return

    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      set({ transactions: data })
    }
  },

  checkTrial: async () => {
    const userId = useAuthStore.getState().user?.id
    if (!userId) return false

    const { data, error } = await supabase
      .from('profiles')
      .select('trial_used, credits')
      .eq('id', userId)
      .single()

    if (error) return false

    if (!data.trial_used && data.credits > 0) {
      await supabase
        .from('profiles')
        .update({ trial_used: true })
        .eq('id', userId)

      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: 1,
          type: 'trial',
          description: 'Crédit d\'essai offert',
        })

      set({ credits: data.credits })
      return true
    }
    return false
  },
}))