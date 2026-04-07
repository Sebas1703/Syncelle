import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use service role key for webhook (server-side, bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return Response.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.user_id;
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        // Fetch subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: subscription.status,
            plan: subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        // Find user by stripe_customer_id
        const { data: sub } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (sub) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', sub.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', invoice.customer);

        break;
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
