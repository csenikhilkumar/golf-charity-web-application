import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature') as string

    if (!webhookSecret) {
      console.error('Missing Stripe Webhook Secret')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const userId = session.metadata?.userId
      const charityId = session.metadata?.charityId
      const charityPct = Number(session.metadata?.charityContributionPercentage || 10)

      if (!userId) {
        console.error('No userId found in session metadata')
        return NextResponse.json({ received: true }) // Return 200 so Stripe doesn't infinitely retry bad test data
      }

      // Update User with their chosen charity and percentage
      if (charityId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            charityId,
            charityPct
          }
        })
      }

      // We need to retrieve the full subscription from Stripe to get accurate periods
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const isYearly = subscription.items.data[0].price.recurring?.interval === 'year'

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: isYearly ? 'YEARLY' : 'MONTHLY',
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          },
          update: {
            plan: isYearly ? 'YEARLY' : 'MONTHLY',
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          }
        })
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      const invoiceSubscription = invoice.parent?.type === 'subscription_details' ? invoice.parent.subscription_details?.subscription : null
      if (invoiceSubscription) {
        const subscription = await stripe.subscriptions.retrieve(invoiceSubscription as string)
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'ACTIVE',
            currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          }
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Unhandled webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
