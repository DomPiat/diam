import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Client admin avec la clé service_role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    console.log('🔵 Tentative de création pour:', email)

    // Créer l'utilisateur via l'API admin
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // ✅ Confirme l'email automatiquement
      user_metadata: {
        credits: 1,
        trial_used: false,
      },
    })

    if (error) {
      console.error('🔴 Erreur création utilisateur:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'utilisateur' },
        { status: 500 }
      )
    }

    console.log('✅ Utilisateur créé avec succès:', data.user.email)

    return NextResponse.json(
      { 
        message: '✅ Utilisateur créé avec succès',
        user: {
          id: data.user.id,
          email: data.user.email,
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('🔴 Erreur inscription:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
