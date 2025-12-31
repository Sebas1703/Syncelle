'use client';

import { useState } from 'react';
import BlockRenderer from './BlockRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function SiteView({ projectData, projectId }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isEditing, setIsGenerating] = useState(false);
  const [currentData, setCurrentData] = useState(projectData);

  const siteData = currentData;
  const theme = siteData.theme || {};
  const palette = theme.palette || {};
  const navbar = siteData.navbar || null;
  
  // Soporte para estructura antigua vs nueva
  const pages = siteData.pages || { home: { blocks: siteData.blocks || [] } };
  const currentBlocks = pages[currentPage]?.blocks || [];

  const dynamicStyles = {
    '--bg-page': palette.background || '#09090b',
    '--text-main': theme.mode === 'light' ? '#000000' : '#ffffff',
    '--primary': palette.primary || '#10b981',
    '--secondary': palette.secondary || '#3b82f6',
    '--surface': palette.surface || '#18181b',
    '--accent': palette.accent || '#f59e0b',
    'fontFamily': theme.typography?.bodyFont || 'sans-serif',
  };

  const headingFont = theme.typography?.headingFont || 'Inter';
  const bodyFont = theme.typography?.bodyFont || 'Inter';

  const handleEdit = async () => {
    if (!feedback.trim()) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://cf-worker-proxy.tiansebasp17-03.workers.dev/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEdit: true,
          currentData: currentData,
          feedback: feedback
        })
      });

      if (!response.ok) throw new Error("Error en la edición");
      
      const newData = await response.json();
      setCurrentData(newData);
      
      // Guardar en Supabase el cambio
      await supabase
        .from('projects')
        .update({ structured_data: newData })
        .eq('id', projectId);

      setFeedback('');
      setIsChatOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al editar el sitio");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadProject = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentData.meta?.projectName || 'site'}_project.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-700 ease-in-out"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
        ...dynamicStyles
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}:wght@400;700;900&family=${bodyFont.replace(/ /g, '+')}:wght@300;400;600&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: '${headingFont}', sans-serif !important; }
        body, p, button, span, div { font-family: '${bodyFont}', sans-serif; }
      `}} />

      {/* NAVBAR GENERADO */}
      {navbar && (
        <nav className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-center pointer-events-none">
          <div className="glass-panel-strong px-8 py-3 rounded-full flex items-center gap-12 pointer-events-auto shadow-2xl">
            <span className="font-black text-xl tracking-tighter" style={{ color: 'var(--primary)' }}>
              {navbar.logo}
            </span>
            <div className="hidden md:flex gap-8">
              {navbar.links?.map((link, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(link.target)}
                  className={`text-sm font-bold uppercase tracking-widest hover:opacity-100 transition-opacity ${currentPage === link.target ? 'opacity-100' : 'opacity-50'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            {navbar.cta && (
              <button 
                onClick={() => setCurrentPage(navbar.cta.target)}
                className="px-6 py-2 rounded-full font-bold text-xs uppercase"
                style={{ backgroundColor: 'var(--primary)', color: 'black' }}
              >
                {navbar.cta.text}
              </button>
            )}
          </div>
        </nav>
      )}

      {/* RENDERER DE BLOQUES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {currentBlocks.map((block, index) => (
            <BlockRenderer key={`${currentPage}-${index}`} block={block} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* FOOTER */}
      {siteData.footer && (
        <footer className="py-12 px-6 border-t border-white/5 opacity-50 text-center text-sm">
          {siteData.footer.text}
        </footer>
      )}

      {/* TOOLS (DOWNLOAD & EDIT) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel-strong p-6 rounded-3xl w-80 shadow-2xl border border-white/10"
            >
              <h4 className="font-bold mb-4">¿Qué quieres cambiar?</h4>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ej: Pon el fondo azul marino y cambia el título por..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors resize-none mb-4"
              />
              <button 
                onClick={handleEdit}
                disabled={isEditing || !feedback.trim()}
                className="w-full py-3 rounded-xl font-bold bg-white text-black disabled:opacity-50"
              >
                {isEditing ? "Procesando..." : "Aplicar Cambios ✨"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          <button 
            onClick={downloadProject}
            className="p-4 bg-zinc-900 border border-white/10 text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
            title="Descargar Proyecto"
          >
            📥
          </button>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="p-4 bg-[var(--primary)] text-black rounded-full shadow-2xl hover:scale-110 transition-transform font-bold"
            title="Editar con IA"
          >
            {isChatOpen ? '✕' : '💬'}
          </button>
          <a 
            href="/dashboard"
            className="px-6 py-4 bg-black/80 border border-white/10 text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-transform"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

