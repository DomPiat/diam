import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(req: Request) {
  try {
    const { credits, userId, userEmail } = await req.json()

    const prices: Record<number, number> = {
      1: 1900,
      5: 9000,
      10: 17000,
      20: 32000,
      25: 37500,
    }

    const amount = prices[credits]
    if (!amount) {
      return NextResponse.json(
        { error: 'Nombre de crédits invalide' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${credits} crédits DIAM`,
              description: `Pack de ${credits} crédits pour l'application DIAM`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        credits: credits.toString(),
        user_id: userId,
      },
      client_reference_id: userId,
      customer_email: userEmail,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Erreur Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session' },
      { status: 500 }
    )
  }
}