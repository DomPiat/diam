import { create } from 'zustand'
import { supabase } from '../lib/supabase/client'  // ← Chemin relatif (monte d'un niveau)
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  init: () => Promise<void>
  signOut: () => Promise<void>
  getUserId: () => string | null
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({
      session,
      user: session?.user ?? null,
      loading: false
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        loading: false
      })
    })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },

  getUserId: () => {
    const user = get().user
    return user?.id || null
  }
}))