import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-05-27.dahlia' as any,
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get cart items for the user
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        product:products ( price )
      `)
      .eq('user_id', user.id);

    if (error || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or not found' }, { status: 400 });
    }

    // Calculate total securely on the server
    const subtotal = cartItems.reduce((sum, item) => {
      const productData = Array.isArray(item.product) ? item.product[0] : item.product;
      const price = productData?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Stripe expects amount in cents
    const amountInCents = Math.round(total * 100);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.id,
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error('Error creating payment intent:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
