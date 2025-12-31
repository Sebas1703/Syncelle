'use client';

import { useCallback } from 'react';

export default function SiteActions({ siteData }) {
  const handleDownload = useCallback(() => {
    if (!siteData) return;
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (siteData?.meta?.title || 'syncelle-site') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [siteData]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="/dashboard"
        className="px-4 py-3 bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-full font-medium shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group"
      >
        <span>←</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Volver al Dashboard</span>
        <span className="group-hover:hidden">Syncelle</span>
      </a>
      <button
        onClick={handleDownload}
        className="px-4 py-3 bg-white/90 text-black rounded-full font-semibold shadow-lg hover:shadow-xl transition hover:-translate-y-0.5"
      >
        Descargar JSON
      </button>
    </div>
  );
}

