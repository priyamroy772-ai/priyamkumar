import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { GroceryVisual } from './GroceryVisual';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, isInstalled, isAndroid, promptInstall } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'instant' | 'apk-file' | 'developer'>('instant');

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-pre-g7ikpnvotqdrfhygo3eca2-646794449319.asia-southeast1.run.app';

  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    setInstallStatus('prompting');
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      setInstallStatus('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setInstallStatus('guide');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-amber-400 via-[#FFD21F] to-amber-300 flex items-center justify-between text-slate-900 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/90 p-1.5 shadow-sm flex items-center justify-center">
              <GroceryVisual name="basket" size="sm" className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-display text-slate-900 leading-tight">
                Android APK & App Install
              </h3>
              <p className="text-[11px] font-semibold text-slate-800/80">
                Priyam Grocery Manager v1.0 • Android & PWA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-amber-50/50 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'instant'
                ? 'bg-white text-slate-900 shadow-sm border border-amber-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
            <span>1-Tap Phone App</span>
          </button>

          <button
            onClick={() => setActiveTab('apk-file')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'apk-file'
                ? 'bg-white text-slate-900 shadow-sm border border-amber-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Download .APK</span>
          </button>

          <button
            onClick={() => setActiveTab('developer')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'developer'
                ? 'bg-white text-slate-900 shadow-sm border border-amber-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-600" />
            <span>Android Studio</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-200/70">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Direct Android Installation (WebAPK)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Android phones create a native app with home screen icon, splash screen, and offline local database — no browser URL bar needed!
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-amber-200/60 flex flex-col gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFD21F] to-amber-400 text-slate-950 font-extrabold text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-amber-300"
                  >
                    <Smartphone className="w-4 h-4 text-slate-900" />
                    <span>Install App on Phone Now</span>
                  </button>

                  {installStatus === 'success' && (
                    <p className="text-xs font-bold text-emerald-600 text-center flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" /> App successfully added to your device!
                    </p>
                  )}
                </div>
              </div>

              {/* Android Chrome Manual Steps */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Android Phone me 2 Second me Install karein:
                </h5>
                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside pl-1 font-medium">
                  <li className="leading-snug">
                    Apne Android phone ke <strong>Google Chrome</strong> me yeh link open karein.
                  </li>
                  <li className="leading-snug">
                    Top right corner me <strong>3 dots (⋮)</strong> menu par tap karein.
                  </li>
                  <li className="leading-snug">
                    <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par click karein.
                  </li>
                  <li className="leading-snug">
                    Apke phone ke Home screen & App Drawer me <strong>Priyam Grocery</strong> app icon aa jayega!
                  </li>
                </ol>
              </div>

              {/* Share link box */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                <div className="truncate text-xs text-slate-600 font-mono select-all">
                  {currentUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'apk-file' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Download Signed .APK / .AAB Package
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Convert this live web app into an installable Android APK file using PWABuilder (Official Microsoft tool for Android WebAPK packages).
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-emerald-200/70 space-y-2">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>Generate & Download APK on PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                  <p className="text-[11px] text-slate-500 text-center">
                    Manifest and icons are 100% pre-validated and ready for package generation.
                  </p>
                </div>
              </div>

              {/* How to use PWABuilder */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  How to generate .APK file:
                </h5>
                <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 font-medium">
                  <li>Upar diye gaye <strong>"PWABuilder"</strong> button par click karein.</li>
                  <li>Page open hone ke baad <strong>"Package for Stores"</strong> ya <strong>"Android"</strong> par click karein.</li>
                  <li><strong>"Generate Package"</strong> dabayein — aapko ready-to-install <strong>.apk</strong> aur <strong>.aab</strong> zip file mil jayegi.</li>
                  <li>Apne phone me file transfer karke <strong>Install</strong> kar sakte hain.</li>
                </ol>
              </div>

              {/* Package specifications */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-slate-700 grid grid-cols-2 gap-2 font-medium">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Package Name</span>
                  <span className="font-mono text-xs text-slate-900">com.priyam.grocerymanager</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">App Name</span>
                  <span className="text-xs font-bold text-slate-900">Priyam Grocery</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Theme Color</span>
                  <span className="text-xs font-bold text-amber-700">#FFD21F (Yellow)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Offline Support</span>
                  <span className="text-xs font-bold text-emerald-700">Active (Service Worker)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'developer' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2.5 overflow-x-auto">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-sans font-bold text-amber-400">Capacitor Android Build Steps</span>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-slate-400 font-sans text-xs">
                  Run these commands in terminal to open in Android Studio & compile release APK:
                </p>
                <div className="space-y-1.5 text-amber-300 select-all">
                  <p>npm run build</p>
                  <p>npx @capacitor/cli init "Priyam Grocery" com.priyam.grocerymanager</p>
                  <p>npx cap add android</p>
                  <p>npx cap copy</p>
                  <p>npx cap open android</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">In Android Studio:</p>
                <p>Go to <strong>Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)</strong> to generate the standalone <code>.apk</code>.</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Offline & Safe Local Storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
