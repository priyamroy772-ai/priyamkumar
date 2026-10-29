import React, { useEffect, useState } from 'react';
import { GroceryVisual } from './GroceryVisual';
import { ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { playPriyamGreeting, preloadPriyamGreeting } from '../utils/priyamVoiceGreeter';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Preload greeting audio and attempt to play sweet voice greeting
    preloadPriyamGreeting();
    playPriyamGreeting();

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            playPriyamGreeting();
            onComplete();
          }, 350);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FFFEF8] overflow-hidden select-none">
      {/* Top decorative gentle sunbeam curve */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#FFE779]/40 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute top-12 right-6 w-32 h-32 rounded-full bg-[#FFD21F]/15 blur-xl pointer-events-none" />

      {/* Top spacing / status dummy */}
      <div className="pt-12 flex items-center justify-center">
        <span className="text-xs font-semibold text-amber-700/60 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Fresh • Simple • Organized
        </span>
      </div>

      {/* Central Brand & 3D Basket Hero */}
      <div className="flex flex-col items-center px-6 text-center max-w-sm my-auto">
        {/* 3D Basket */}
        <div className="relative mb-6 transform hover:scale-105 transition-transform duration-300">
          <div className="absolute -inset-4 bg-gradient-to-b from-amber-200/30 via-yellow-300/20 to-transparent rounded-full blur-xl" />
          <GroceryVisual name="basket" size="hero" className="relative z-10 w-44 h-44 drop-shadow-2xl" />
        </div>

        {/* 3D Priyam Brand Text */}
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-b from-[#FFAE00] via-[#FF8800] to-[#E65100] drop-shadow-[0_4px_10px_rgba(212,160,23,0.35)]">
            Priyam
          </h1>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#222428] tracking-tight -mt-1 font-display">
            Grocery Manager
          </div>
        </div>

        <p className="mt-3 text-sm font-semibold text-slate-600 flex items-center justify-center gap-2">
          <span>Smart Shopping</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F]" />
          <span>Better Living</span>
        </p>
      </div>

      {/* Bottom Area: Yellow Wave background, Loading Bar and Skip/Enter */}
      <div className="relative w-full pb-10 pt-16 px-6 flex flex-col items-center">
        {/* Yellow Wave SVG backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 500 200"
            preserveAspectRatio="none"
            className="w-full h-full text-[#FFD21F]/30"
          >
            <path
              d="M0,80 C150,160 350,20 500,90 L500,200 L0,200 Z"
              fill="currentColor"
            />
          </svg>
          <svg
            viewBox="0 0 500 200"
            preserveAspectRatio="none"
            className="w-full h-full text-[#FFD21F]/60 -mt-12"
          >
            <path
              d="M0,100 C180,40 320,150 500,70 L500,200 L0,200 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Animated Loading Bar matching reference image */}
        <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-2">
          <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-[#F59E0B] rounded-full transition-all duration-150 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-amber-900 tracking-wide">
            {progress < 100 ? 'Loading...' : 'Ready!'}
          </span>

          <button
            onClick={() => {
              playPriyamGreeting(true);
              onComplete();
            }}
            className="mt-4 px-6 py-2.5 rounded-full bg-white text-amber-950 font-bold text-xs shadow-md border border-amber-200 flex items-center gap-2 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
          >
            <span>Enter App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
