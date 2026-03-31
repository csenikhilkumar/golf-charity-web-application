import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

const MONTHLY_PRICE = 9900 // $99.00 in cents
const YEARLY_PRICE = 99000 // $990.00 in cents

export async function POST(req: Request) {
  try {
    const { billing, charityId, percentage, userId } = await req.json()

    if (!userId || !charityId) {
      return NextResponse.json({ error: 'Missing required configuration' }, { status: 400 })
    }

    const isYearly = billing === 'yearly'
    const unitAmount = isYearly ? YEARLY_PRICE : MONTHLY_PRICE

    // Create a robust checkout session with inline price_data
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Golf Charity ${isYearly ? 'Yearly' : 'Monthly'} Membership`,
              description: `Includes ${percentage}% commitment to your selected charity.`,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: isYearly ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        charityId,
        charityContributionPercentage: percentage.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscribe`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Exception:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
