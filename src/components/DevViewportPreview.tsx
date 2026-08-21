import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

export type ViewMode = 'desktop' | 'mobile';

export const DevViewportPreview: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDev = 
    (import.meta as any).env?.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

  const isFrame = window.location.search.includes('preview_frame=true');

  if (!isDev || isFrame) {
    return <>{children}</>;
  }

  const [mode, setMode] = useState<ViewMode>('desktop');
  const frameUrl = `${window.location.origin}${window.location.pathname}?preview_frame=true`;

  return (
    <div className="dev-preview-root min-h-screen bg-slate-950 flex flex-col font-sans relative text-white">
      {/* TOP-RIGHT FLOATING DESKTOP / MOBILE SWITCHER */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1 bg-slate-900/95 backdrop-blur border border-slate-800 p-1 rounded-md shadow-xl pointer-events-auto">
        <button
          onClick={() => setMode('desktop')}
          className={`h-7 px-2.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
            mode === 'desktop'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>

        <button
          onClick={() => setMode('mobile')}
          className={`h-7 px-2.5 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
            mode === 'mobile'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>
      </div>

      {/* CANVAS CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-auto bg-slate-950 min-h-screen">
        {mode === 'desktop' ? (
          <div className="w-full flex-1 min-h-screen">
            {children}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center transition-all my-auto py-6 px-4">
            {/* Mobile Viewport Frame (390px width) */}
            <div
              className="bg-slate-900 border-4 border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 relative my-auto"
              style={{
                width: '390px',
                height: '844px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)'
              }}
            >
              <iframe
                src={frameUrl}
                title="LocalKart Mobile Preview Frame"
                className="w-full h-full border-none bg-slate-950"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
