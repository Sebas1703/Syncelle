// Versión adaptada para Next.js del AI Service
const API_BASE = "https://cf-worker-proxy.tiansebasp17-03.workers.dev/generate";

export async function generateSiteContent(prompt, onProgress, model = "fast") {
  const payload = {
    prompt: `[INTENT: ECOMMERCE ELITE] ${prompt.trim()}`,
    brand: "Syncelle Elite v5",
    version: 5,
    model: model,
    config: {
      model: model === "elite" ? "gpt-4o" : "gpt-4o-mini",
      format: "multi-page-json",
      blocks: ["hero", "product-grid", "bento-grid", "narrative", "showcase", "cta-footer"]
    }
  };

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Syncelle-Service-Key": process.env.NEXT_PUBLIC_SYNCELLE_SERVICE_KEY || "syncelle-dev-key-123"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    // ----- Caso 1: Streaming SSE -----
    if (contentType.includes("text/event-stream")) {
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
    }

    // ----- Caso 2: Respuesta JSON directa -----
    const directJson = await response.json();
    if (onProgress) onProgress(JSON.stringify(directJson).length);
    return directJson;

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
}

