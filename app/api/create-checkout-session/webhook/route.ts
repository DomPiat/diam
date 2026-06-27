import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase/client'  // ✅ 3 niveaux

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  if (!sig) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Erreur webhook:', err)
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  // Traitement du paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id
    const credits = parseInt(session.metadata?.credits || '0')

    if (userId && credits > 0) {
      try {
        // Ajouter les crédits à l'utilisateur
        const { error: updateError } = await supabase.rpc('increment_credits', {
          user_id: userId,
          amount: credits,
        })

        if (updateError) {
          console.error('Erreur update crédits:', updateError)
          return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
        }

        // Enregistrer la transaction
        const { error: insertError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: userId,
            amount: credits,
            type: 'purchase',
            description: `Achat de ${credits} crédits`,
            payment_intent_id: session.payment_intent,
          })

        if (insertError) {
          console.error('Erreur insert transaction:', insertError)
        }
      } catch (error) {
        console.error('Erreur traitement:', error)
        return NextResponse.json({ error: 'Erreur traitement' }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}