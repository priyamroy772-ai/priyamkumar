import React, { useState, useEffect, useRef } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { parseVoiceGroceryInput } from '../utils/voiceSpeechRecognition';
import { GroceryVisual } from './GroceryVisual';
import { Mic, MicOff, X, Volume2, Sparkles, Check, AlertCircle } from 'lucide-react';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemRecognized?: (name: string, quantity: number, unit: any, price: number, category: any, imageUrl: string) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onItemRecognized,
}) => {
  const { openAddModal, showToast } = useGrocery();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'hi-IN' | 'en-IN'>('en-IN');
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  const isSpeechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = () => {
    setErrorMsg(null);
    setTranscript('');

    if (!isSpeechSupported) {
      setErrorMsg('Speech recognition is not supported in this browser. You can select one of the quick voice items below.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          handleFinalTranscript(resultTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access denied. Please allow microphone permission in your browser settings.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech detected. Please tap the mic and speak clearly.');
        } else {
          setErrorMsg(`Voice error: ${event.error}. Try tapping a quick option below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition', err);
      setErrorMsg('Could not access microphone. Please try again.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  useEffect(() => {
    if (isOpen) {
      // Auto-start listening when modal opens
      startListening();
    } else {
      stopListening();
      setTranscript('');
      setErrorMsg(null);
    }
    return () => {
      stopListening();
    };
  }, [isOpen, selectedLanguage]);

  const handleFinalTranscript = (spokenText: string) => {
    stopListening();
    if (!spokenText.trim()) return;

    const parsed = parseVoiceGroceryInput(spokenText);
    showToast(`Voice Recognized: "${parsed.cleanedName}" (${parsed.quantity} ${parsed.unit})`);

    if (onItemRecognized) {
      onItemRecognized(
        parsed.cleanedName,
        parsed.quantity,
        parsed.unit,
        parsed.price,
        parsed.category,
        parsed.imageUrl
      );
    } else {
      openAddModal({
        name: parsed.cleanedName,
        quantity: parsed.quantity,
        unit: parsed.unit,
        price: parsed.price,
        category: parsed.category,
        customImageUrl: parsed.imageUrl,
        notes: `Added via voice command: "${spokenText}"`,
      });
    }

    onClose();
  };

  const handleQuickVoiceSample = (sampleText: string) => {
    setTranscript(sampleText);
    handleFinalTranscript(sampleText);
  };

  if (!isOpen) return null;

  const quickSamples = [
    { label: '2 kg Sugar', text: '2 kg sugar' },
    { label: '1 ltr Milk', text: '1 litre milk' },
    { label: 'चीनी (Sugar)', text: 'चीनी' },
    { label: 'चावल (5 kg Rice)', text: '5 kg chawal' },
    { label: '1 pack Bread', text: '1 pack bread' },
    { label: '1 dozen Bananas', text: '1 dozen banana' },
    { label: '2 kg Tomato', text: '2 kg tamatar' },
    { label: 'Cooking Oil', text: '1 litre cooking oil' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col p-6 text-slate-800 text-center animate-in zoom-in-95 duration-200">
        
        {/* Header & Close */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wider font-display">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Voice to Add Item</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selector Chips */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSelectedLanguage('en-IN')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedLanguage === 'en-IN'
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            English (India)
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('hi-IN')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              selectedLanguage === 'hi-IN'
                ? 'bg-amber-400 text-amber-950 shadow-xs scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>

        {/* Large Animated Microphone Visual */}
        <div className="my-3 flex flex-col items-center justify-center">
          <div className="relative">
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping duration-1000" />
                <span className="absolute -inset-3 rounded-full bg-amber-400/20 animate-pulse duration-700" />
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white ring-4 ring-rose-200'
                  : 'bg-gradient-to-tr from-[#FFD21F] to-amber-500 text-amber-950 ring-4 ring-amber-100 hover:brightness-105'
              }`}
              title={isListening ? 'Tap to stop listening' : 'Tap to start speaking'}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-pulse" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Sound Waves Animation while listening */}
          {isListening ? (
            <div className="flex items-center gap-1.5 mt-4">
              <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-8 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-10 bg-emerald-500 rounded-full animate-bounce" />
              <span className="w-1 h-8 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          ) : (
            <p className="text-xs font-semibold text-slate-500 mt-3">
              Tap microphone to speak
            </p>
          )}
        </div>

        {/* Live Transcript / Feedback */}
        <div className="min-h-14 flex items-center justify-center px-4 py-2 rounded-2xl bg-amber-50/70 border border-amber-200/60 my-2">
          {transcript ? (
            <p className="text-sm font-bold text-amber-950 leading-snug">
              "{transcript}"
            </p>
          ) : isListening ? (
            <p className="text-xs font-medium text-amber-800 animate-pulse">
              Listening... Speak item name and quantity (e.g. "2 kg Sugar", "दूध 1 लीटर")
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Speak item name like "Sugar", "2 kg Tamatar", "Milk"
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium mb-2 flex items-center gap-1.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Voice Simulations / Tap-to-test */}
        <div className="mt-2 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Or tap a common grocery to add:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
            {quickSamples.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleQuickVoiceSample(sample.text)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-950 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-xs"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          {transcript ? (
            <button
              type="button"
              onClick={() => handleFinalTranscript(transcript)}
              className="px-4 py-2 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add "{transcript.slice(0, 15)}..."</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                isListening
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isListening ? 'Stop' : 'Start Speaking'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
