import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

// Use service role key for webhook (server-side, bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function verifySignature(rawBody, signature) {
  const hmac = createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest('hex');
  return digest === signature;
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-signature');

  if (!signature || !verifySignature(rawBody, signature)) {
    return Response.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = body.meta?.event_name;
  const userId = body.meta?.custom_data?.user_id;
  const attributes = body.data?.attributes;

  if (!userId || !attributes) {
    return Response.json({ error: 'Missing user_id or attributes' }, { status: 400 });
  }

  try {
    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated': {
        const variantId = String(attributes.variant_id);
        const monthlyVariant = process.env.LEMONSQUEEZY_VARIANT_MONTHLY;
        const plan = variantId === monthlyVariant ? 'monthly' : 'annual';

        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: userId,
            lemonsqueezy_subscription_id: String(body.data.id),
            status: attributes.status,
            plan,
            current_period_end: attributes.renews_at || attributes.ends_at,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        break;
      }

      case 'subscription_payment_success': {
        // Refresh subscription status on successful payment
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: attributes.renews_at || attributes.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        break;
      }

      case 'subscription_payment_failed': {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        break;
      }

      case 'subscription_cancelled': {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            ends_at: attributes.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        break;
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
