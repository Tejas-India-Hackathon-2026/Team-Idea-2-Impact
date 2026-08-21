import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (transcript: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onTranscript }) => {
  const { showNotification } = useApp();
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'error'>('listening');
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setStatus('listening');
    setTranscriptText('');
    setErrorDetails(null);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus('error');
      setErrorDetails('Voice search is not supported by your browser. Please type into the search bar.');
      return;
    }

    let recognition: any = null;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscriptText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        setStatus('error');
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorDetails('Microphone access denied. Please enable microphone permissions in your browser settings.');
        } else {
          setErrorDetails(`Voice recognition error (${event.error}). Please try speaking again.`);
        }
      };

      recognition.onend = () => {
        setStatus('processing');
        setTimeout(() => {
          if (transcriptText.trim()) {
            onTranscript(transcriptText.trim());
            onClose();
          } else {
            setStatus('error');
            setErrorDetails('No speech recognized. Please tap retry and speak clearly into your microphone.');
          }
        }, 600);
      };

      recognition.start();
    } catch (e: any) {
      setStatus('error');
      setErrorDetails(e?.message || 'Could not access microphone.');
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Voice Search
          </span>
          <h3 className="text-lg font-bold text-white">LocalKart Voice Assistant</h3>
        </div>

        {/* Visualizer Circle */}
        <div className="relative flex items-center justify-center my-2">
          {status === 'listening' && (
            <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full animate-ping pointer-events-none"></div>
          )}
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            status === 'listening' 
              ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-950/80' 
              : status === 'processing'
              ? 'bg-amber-500 text-slate-950 shadow-xl'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {status === 'listening' ? (
              <Mic className="w-10 h-10 animate-pulse" />
            ) : status === 'processing' ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              <MicOff className="w-8 h-8" />
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="min-h-[48px] flex flex-col items-center justify-center">
          {status === 'listening' && (
            <>
              <p className="text-xs font-bold text-emerald-400">Listening...</p>
              <p className="text-xs text-slate-300 italic mt-1 max-w-[240px] truncate">
                {transcriptText ? `"${transcriptText}"` : 'Say e.g. "Handmade Pottery in Patna"'}
              </p>
            </>
          )}

          {status === 'processing' && (
            <p className="text-xs font-bold text-amber-400">Processing speech...</p>
          )}

          {status === 'error' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rose-400 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Voice Recognition Error</span>
              </p>
              <p className="text-[11px] text-slate-400">{errorDetails}</p>
            </div>
          )}
        </div>

        {status === 'error' && (
          <button
            onClick={() => {
              setStatus('listening');
              setTranscriptText('');
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Try Again 🎙️
          </button>
        )}
      </div>
    </div>
  );
};
