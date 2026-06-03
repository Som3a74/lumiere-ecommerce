import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-05-27.dahlia' as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    // If you don't have STRIPE_WEBHOOK_SECRET set (e.g. local dev without stripe cli),
    // you might want to skip verification for testing, but in production this is critical.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        payload,
        signature as string,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // Fallback for local testing if secret is not provided
      event = JSON.parse(payload) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  const supabase = await createClient();

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const userId = paymentIntent.metadata.userId;

    if (!userId) {
      console.error('No userId in payment intent metadata');
      return NextResponse.json({ received: true });
    }

    try {
      // Check if order already exists (in case client-side confirmation already ran)
      const { data: existingOrder } = await supabase
        .from('payments')
        .select('order_id')
        .eq('provider', paymentIntent.id)
        .single();
        
      if (existingOrder) {
         console.log(`Order already fulfilled for payment intent ${paymentIntent.id}`);
         return NextResponse.json({ received: true });
      }

      // We need to fulfill the order. In a full webhook flow, we should 
      // have stored the shipping/contact info in metadata or a pending order table.
      // For this implementation, since we are doing Client-Side confirmation, 
      // the webhook serves as a backup or logging mechanism.
      console.log(`Payment Intent Succeeded: ${paymentIntent.id} for user ${userId}`);
      
      // Update order status if we had a pending order table.
    } catch (error) {
      console.error('Error fulfilling order in webhook:', error);
    }
  }

  return NextResponse.json({ received: true });
}
