'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DOC_TITLES = {
  privacy_policy: 'Privacy Policy',
  terms_of_service: 'Terms of Service',
  dpa: 'Data Processing Agreement',
  sub_processors: 'Sub-processor List',
};

export default function DocumentViewer() {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const params = useParams();
  const docType = params.type;

  useEffect(() => {
    loadDocument();
  }, [docType]);

  const loadDocument = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('doc_type', docType)
      .single();

    if (error || !data) {
      router.push('/dashboard');
      return;
    }

    setDocument(data);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!document?.content) return;
    await navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!document?.content) return;
    const blob = new Blob([document.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${docType}-${document.company_name || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const title = DOC_TITLES[docType] || docType;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors text-sm">
              &larr; Dashboard
            </Link>
            <span className="text-zinc-800">|</span>
            <h1 className="font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-sm font-bold transition-colors"
            >
              Download .md
            </button>
          </div>
        </div>
      </header>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-8 md:p-12">
          {document?.company_name && (
            <p className="text-xs text-zinc-600 mb-6 font-mono uppercase tracking-widest">
              {document.company_name} — Last updated {new Date(document.updated_at).toLocaleDateString()}
            </p>
          )}
          <div className="prose prose-invert prose-emerald max-w-none prose-headings:tracking-tight prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-zinc-200 prose-h2:text-2xl prose-h2:mt-10 prose-h3:text-xl">
            <MarkdownRenderer content={document?.content || ''} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown renderer (no dependency needed for basic rendering)
function MarkdownRenderer({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];

  const renderInline = (text) => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    return text;
  };

  const flushTable = () => {
    if (tableRows.length === 0) return null;

    const headerRow = tableRows[0];
    const dataRows = tableRows.slice(2); // Skip separator row

    const el = (
      <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              {headerRow.map((cell, i) => (
                <th key={i} className="text-left py-3 px-4 text-zinc-300 font-semibold">{cell.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} className="border-b border-zinc-900">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-3 px-4 text-zinc-400">{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    tableRows = [];
    inTable = false;
    return el;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.startsWith('|')) {
      inTable = true;
      const cells = line.split('|').filter(c => c.trim() !== '' || false);
      if (cells.length > 0) {
        // Skip separator rows (|---|---|)
        if (/^[\s\-:|]+$/.test(cells.join(''))) {
          tableRows.push(cells);
        } else {
          tableRows.push(cells);
        }
      }
      continue;
    } else if (inTable) {
      const tableEl = flushTable();
      if (tableEl) elements.push(tableEl);
    }

    // Headers
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} dangerouslySetInnerHTML={{ __html: renderInline(line.slice(3)) }} />);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} dangerouslySetInnerHTML={{ __html: renderInline(line.slice(4)) }} />);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} />);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={i} dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} />);
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(<li key={i} dangerouslySetInnerHTML={{ __html: renderInline(line.replace(/^\d+\.\s/, '')) }} />);
    } else if (line.trim() === '') {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: renderInline(line) }} />);
    }
  }

  // Flush remaining table
  if (inTable) {
    const tableEl = flushTable();
    if (tableEl) elements.push(tableEl);
  }

  return <>{elements}</>;
}
