import { buildPrompt } from '@/lib/prompts';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { doc_type, questionnaire_data, user_id } = await request.json();

    if (!doc_type || !questionnaire_data || !user_id) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check active subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user_id)
      .single();

    const isActive = subscription &&
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      new Date(subscription.current_period_end) > new Date();

    if (!isActive) {
      return Response.json({ error: 'SUBSCRIPTION_REQUIRED' }, { status: 403 });
    }

    const prompt = buildPrompt(doc_type, questionnaire_data);
    if (!prompt) {
      return Response.json({ error: 'Invalid document type' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        temperature: 0.3,
        max_tokens: doc_type === 'dpa' ? 8000 : 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json({ error: err.error?.message || 'OpenAI API error' }, { status: 500 });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;
    const finishReason = data.choices?.[0]?.finish_reason;

    if (!content) {
      return Response.json({ error: 'No content generated' }, { status: 500 });
    }

    // If output was truncated, append a warning
    if (finishReason === 'length') {
      content += '\n\n---\n\n**Note:** This document was truncated due to length limits. Please regenerate or contact support.';
    }

    // Strip code fences if the AI wraps output in ```markdown ... ```
    content = content.replace(/^```(?:markdown)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    return Response.json({ content });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
