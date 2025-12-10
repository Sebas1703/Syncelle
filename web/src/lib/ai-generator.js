// Versión adaptada para Next.js del AI Service
const API_BASE = "https://cf-worker-proxy.tiansebasp17-03.workers.dev/generate";

export async function generateSiteContent(prompt, onProgress) {
  const payload = {
    prompt: prompt.trim(),
    brand: "Syncelle Client",
    sections: [],
    version: 2
  };

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    // Manejo de Streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let buffer = "";
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const content = data.choices?.[0]?.delta?.content || "";
              if (content) {
                accumulatedText += content;
                if (onProgress) onProgress(accumulatedText.length);
              }
            } catch (e) {
              // Ignorar errores de parsing parcial
            }
          }
        }
      }
    }

    // Limpieza final de Markdown
    let cleanJson = accumulatedText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
}

