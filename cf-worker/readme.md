+# Cloudflare Worker Proxy
+
+Proxy minimalista para reenviar solicitudes a la API de OpenAI Chat Completions con streaming.
+
+## Configuración
+
+1. Edita `wrangler.toml` y reemplaza `https://example.com` en `PRIMARY_ORIGIN` por tu dominio principal (incluye protocolo).
+2. Guarda tu clave de OpenAI:
+
+   ```bash
+   wrangler secret put OPENAI_API_KEY
+   ```
+
+3. (Opcional) Ajusta el modelo o la URL base de OpenAI mediante las variables `OPENAI_MODEL` y `OPENAI_BASE_URL`.
+
+## Comandos Wrangler
+
+```bash
+# Ejecutar en modo desarrollo
+wrangler dev
+
+# Desplegar a Cloudflare
+wrangler deploy
+
+# Ver registros
+wrangler tail
+```
+
+El endpoint principal expone `POST /generate` (streaming) y maneja `OPTIONS` para CORS.

