'use client';

import { useCallback, useState } from 'react';
import { generateSiteContent } from '@/lib/ai-generator';

export default function SiteActions({ siteData, originalPrompt }) {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const [editedSite, setEditedSite] = useState(null);

  const handleDownloadJSON = useCallback((data, name = 'syncelle-site') => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadHTML = useCallback((data, name = 'syncelle-site') => {
    if (!data) return;
    const html = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${data?.meta?.title || 'Syncelle Site'}</title>
  <meta name="description" content="${data?.meta?.description || ''}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <style>
    body { font-family: ${data?.theme?.typography?.bodyFont || 'Inter'}, sans-serif; background: ${data?.theme?.palette?.background || '#0f1115'}; color: ${data?.theme?.palette?.textMain || '#fff'}; margin: 0; padding: 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
    h1,h2,h3 { font-family: ${data?.theme?.typography?.headingFont || 'Space Grotesk'}, sans-serif; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${data?.meta?.title || 'Sitio generado'}</h1>
    <p>${data?.meta?.description || ''}</p>
    <pre style="white-space: pre-wrap; word-break: break-word; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">${JSON.stringify(data, null, 2)}</pre>
  </div>
</body>
</html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.html';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleEdit = useCallback(async () => {
    if (!feedback.trim()) return;
    try {
      setStatus('Regenerando con tus cambios...');
      const combinedPrompt = `${originalPrompt || ''}\n\nInstrucciones de edición del usuario:\n${feedback}`;
      const updated = await generateSiteContent(combinedPrompt, (bytes) => {
        setStatus(`Generando... ${bytes} bytes`);
      });
      setEditedSite(updated);
      setStatus('Listo. Puedes descargar el JSON generado.');
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  }, [feedback, originalPrompt]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-[260px]">
      <a
        href="/dashboard"
        className="px-4 py-3 bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-full font-medium shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group"
      >
        <span>←</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Volver al Dashboard</span>
        <span className="group-hover:hidden">Syncelle</span>
      </a>

      <button
        onClick={() => handleDownloadJSON(siteData, siteData?.meta?.title || 'syncelle-site')}
        className="px-4 py-3 bg-white/90 text-black rounded-full font-semibold shadow-lg hover:shadow-xl transition hover:-translate-y-0.5"
      >
        Descargar JSON
      </button>

      <button
        onClick={() => handleDownloadHTML(siteData, siteData?.meta?.title || 'syncelle-site')}
        className="px-4 py-3 bg-white/80 text-black rounded-full font-semibold shadow-lg hover:shadow-xl transition hover:-translate-y-0.5"
      >
        Descargar HTML
      </button>

      <div className="bg-black/70 border border-white/10 rounded-2xl p-3 text-white text-sm">
        <p className="font-semibold mb-2">Editar (beta)</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Ej: Cambia fondo a claro, tipografía serif, textos más cortos..."
          className="w-full h-20 bg-black/40 border border-white/10 rounded-lg p-2 text-sm"
        />
        <button
          onClick={handleEdit}
          className="mt-2 w-full px-4 py-2 bg-emerald-500 text-black rounded-lg font-bold hover:scale-105 transition"
          disabled={!feedback.trim()}
        >
          Aplicar cambios
        </button>
        {status && <p className="mt-2 text-xs text-emerald-300">{status}</p>}
        {editedSite && (
          <button
            onClick={() => handleDownloadJSON(editedSite, editedSite?.meta?.title || 'syncelle-site-edited')}
            className="mt-2 w-full px-4 py-2 bg-white text-black rounded-lg font-semibold hover:scale-105 transition"
          >
            Descargar JSON editado
          </button>
        )}
      </div>
    </div>
  );
}

