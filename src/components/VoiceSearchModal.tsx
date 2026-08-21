import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, RefreshCw, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (transcript: string) => void;
  lang?: string;
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'result' | 'error';

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onResult,
  lang = 'en-IN'
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>(lang);

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen, selectedLang]);

  let recognitionInstance: any = null;

  const startListening = () => {
    setVoiceState('listening');
    setTranscript('');
    setErrorMsg('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('error');
      setErrorMsg('Web Speech API is not supported in this browser. Please type your search manually.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setVoiceState('processing');

        if (event.results[0].isFinal) {
          setVoiceState('result');
          setTimeout(() => {
            onResult(currentTranscript.trim());
            onClose();
          }, 800);
        }
      };

      recognition.onerror = (event: any) => {
        setVoiceState('error');
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone permission is required for voice search. Please allow mic access and try again.');
        } else if (event.error === 'no-speech') {
          setErrorMsg("Couldn't understand that or no speech detected. Please try speaking again.");
        } else {
          setErrorMsg(`Voice recognition error (${event.error}). Please try again.`);
        }
      };

      recognition.onend = () => {
        if (voiceState === 'listening' && !transcript) {
          setVoiceState('idle');
        }
      };

      recognition.start();
      recognitionInstance = recognition;
    } catch (err: any) {
      setVoiceState('error');
      setErrorMsg('Failed to initialize microphone speech recognition.');
    }
  };

  const stopListening = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        // ignore stop errors
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div>
          <h3 className="text-lg font-extrabold text-white">Voice Search LocalKart</h3>
          <p className="text-xs text-slate-400 mt-1">Speak what you are looking for in your area</p>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedLang('en-IN')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedLang === 'en-IN'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            English (en-IN)
          </button>
          <button
            onClick={() => setSelectedLang('hi-IN')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedLang === 'hi-IN'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            हिंदी (hi-IN)
          </button>
        </div>

        {/* Microphone Pulse Display */}
        <div className="py-6 flex flex-col items-center justify-center min-h-[160px]">
          {voiceState === 'listening' && (
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-20 h-20 bg-emerald-500/30 rounded-full animate-pulse pointer-events-none" />
              <button
                onClick={startListening}
                className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-950/80 active:scale-95"
              >
                <Mic className="w-8 h-8 stroke-[2.5]" />
              </button>
            </div>
          )}

          {voiceState === 'processing' && (
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
              <span className="text-xs font-bold text-emerald-300">Processing Speech...</span>
            </div>
          )}

          {voiceState === 'result' && (
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">Speech Recognized!</span>
            </div>
          )}

          {voiceState === 'error' && (
            <div className="flex flex-col items-center space-y-2">
              <AlertCircle className="w-10 h-10 text-rose-400" />
              <span className="text-xs font-bold text-rose-400">Voice Recognition Error</span>
            </div>
          )}

          {voiceState === 'idle' && (
            <button
              onClick={startListening}
              className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700"
            >
              <MicOff className="w-8 h-8" />
            </button>
          )}
        </div>

        {/* Live Transcript / Status Text */}
        <div className="min-h-[48px] px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 flex items-center justify-center text-center">
          {voiceState === 'listening' && (
            <span className="text-emerald-400 font-semibold animate-pulse">
              🎙️ Listening... "Say e.g. handmade wooden lamp"
            </span>
          )}
          {transcript && (
            <span className="text-white font-bold">"{transcript}"</span>
          )}
          {errorMsg && (
            <span className="text-rose-400 text-xs">{errorMsg}</span>
          )}
        </div>

        {/* Action Button */}
        {voiceState === 'error' ? (
          <button
            onClick={startListening}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
          >
            Try Again
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700"
          >
            Type Search Manually
          </button>
        )}

      </div>
    </div>
  );
};
