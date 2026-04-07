import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { plan, user_id, user_email } = await request.json();

    if (!user_id || !user_email) {
      return Response.json({ error: 'Missing user data' }, { status: 400 });
    }

    const priceId = plan === 'annual'
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;

    if (!priceId) {
      return Response.json({ error: 'Stripe price not configured' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user_email,
      metadata: {
        user_id: user_id,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://syncelle.com'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://syncelle.com'}/dashboard?payment=cancelled`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
