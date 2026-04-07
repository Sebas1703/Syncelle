export async function POST(request) {
  try {
    const { plan, user_id, user_email } = await request.json();

    if (!user_id || !user_email) {
      return Response.json({ error: 'Missing user data' }, { status: 400 });
    }

    const variantId = plan === 'annual'
      ? process.env.LEMONSQUEEZY_VARIANT_ANNUAL
      : process.env.LEMONSQUEEZY_VARIANT_MONTHLY;

    if (!variantId) {
      return Response.json({ error: 'LemonSqueezy variant not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: user_email,
              custom: {
                user_id: user_id,
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://syncelle.com'}/dashboard?payment=success`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData?.errors?.[0]?.detail || 'LemonSqueezy checkout creation failed';
      return Response.json({ error: message }, { status: response.status });
    }

    const result = await response.json();
    const checkoutUrl = result.data.attributes.url;

    return Response.json({ url: checkoutUrl });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
