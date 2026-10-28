import React, { useEffect, useState } from 'react';
import { authenticateWithWebAuthn } from '../utils/webAuthnBiometrics';
import { Fingerprint, CheckCircle2, ShieldCheck, X, RefreshCw } from 'lucide-react';

interface BiometricPromptModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const BiometricPromptModal: React.FC<BiometricPromptModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [status, setStatus] = useState<'prompt' | 'scanning' | 'success' | 'failed'>('prompt');
  const [authType, setAuthType] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      triggerScan();
    } else {
      setStatus('prompt');
    }
  }, [isOpen]);

  const triggerScan = async () => {
    setStatus('scanning');
    try {
      const result = await authenticateWithWebAuthn('Priyam Roy');
      if (result.success) {
        setAuthType(result.type === 'webauthn-hardware' ? 'WebAuthn Device Passkey' : 'Simulated Biometric Sensor');
        setStatus('success');
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          aria-label="Cancel biometric scan"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Biometric Scanner Visual Area */}
        <div className="relative my-4 flex items-center justify-center">
          <div
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              status === 'success'
                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-600 shadow-[0_0_25px_rgba(34,197,94,0.4)]'
                : status === 'failed'
                ? 'bg-rose-100 border-2 border-rose-400 text-rose-600'
                : 'bg-amber-50 border-2 border-amber-300 text-amber-700'
            }`}
          >
            {/* Animated Scanning Wave Ring */}
            {status === 'scanning' && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border border-emerald-400 animate-pulse" />
              </>
            )}

            {status === 'success' ? (
              <CheckCircle2 className="w-12 h-12 stroke-[2.5] text-emerald-600 animate-in zoom-in-50 duration-200" />
            ) : (
              <Fingerprint className={`w-12 h-12 stroke-[1.8] ${status === 'scanning' ? 'text-emerald-600 animate-pulse' : 'text-amber-700'}`} />
            )}
          </div>
        </div>

        {/* Status Copy */}
        <h3 className="text-lg font-black text-slate-900 tracking-tight font-display mb-1">
          {status === 'success'
            ? 'Identity Verified'
            : status === 'failed'
            ? 'Verification Failed'
            : 'Biometric Login'}
        </h3>

        <p className="text-xs text-slate-500 mb-4 px-2">
          {status === 'scanning'
            ? 'Scanning Face ID / Fingerprint sensor...'
            : status === 'success'
            ? `Verified via ${authType || 'WebAuthn'}`
            : status === 'failed'
            ? 'Could not recognize biometric sensor. Please retry or enter password.'
            : 'Touch sensor or scan face to continue'}
        </p>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 py-1.5 px-3 rounded-full border border-amber-200/80 mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Web Authentication API · End-to-End Secure</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          {status === 'failed' ? (
            <button
              type="button"
              onClick={triggerScan}
              className="py-2.5 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Use Password
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
