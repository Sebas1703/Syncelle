import { buildPrompt } from '@/lib/prompts';

export async function POST(request) {
  try {
    const { doc_type, questionnaire_data } = await request.json();

    if (!doc_type || !questionnaire_data) {
      return Response.json({ error: 'Missing doc_type or questionnaire_data' }, { status: 400 });
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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return Response.json({ error: err.error?.message || 'OpenAI API error' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json({ error: 'No content generated' }, { status: 500 });
    }

    return Response.json({ content });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
