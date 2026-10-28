import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryVisual } from './GroceryVisual';
import { BiometricPromptModal } from './BiometricPromptModal';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Fingerprint, ShieldCheck, Sparkles } from 'lucide-react';

export const PhoneLoginScreen: React.FC = () => {
  const { loginWithPhone, loginWithGoogle, loginWithBiometrics, continueAsGuest } = useGrocery();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('98765 43210');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('Priyam Roy');
  const [error, setError] = useState('');
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    loginWithPhone(`+91 ${cleanPhone.slice(-10)}`, mode === 'signup' ? name : undefined);
  };

  return (
    <>
      <BiometricPromptModal
        isOpen={isBiometricOpen}
        onSuccess={() => {
          setIsBiometricOpen(false);
          loginWithBiometrics();
        }}
        onClose={() => setIsBiometricOpen(false)}
      />

      <div className="relative min-h-[720px] h-full flex flex-col justify-between bg-[#FFFEF8] overflow-y-auto px-6 py-6 select-none">
        {/* Top subtle decorative yellow sunburst glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-amber-200/40 via-[#FFD21F]/20 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute top-36 -left-12 w-32 h-32 rounded-full bg-amber-100/30 blur-xl pointer-events-none" />

        {/* Brand Header matching Phone 2 */}
        <div className="flex flex-col items-center text-center pt-2">
          {/* Cute 3D Basket Illustration */}
          <div className="w-20 h-20 mb-2 transform hover:scale-105 transition-transform duration-200">
            <GroceryVisual name="basket" size="md" className="w-20 h-20 drop-shadow-md" />
          </div>

          {/* Brand Name */}
          <h1 className="text-3xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-b from-[#FFAE00] via-[#FF8800] to-[#E65100] leading-none drop-shadow-[0_2px_4px_rgba(212,160,23,0.3)]">
            Priyam
          </h1>
          <div className="text-lg font-extrabold text-[#222428] tracking-tight -mt-0.5 font-display">
            Grocery Manager
          </div>

          <p className="text-xs font-semibold text-slate-500 mt-1">
            {mode === 'signin' ? 'Sign in to continue' : 'Create an account to start'}
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="my-auto py-4 space-y-3">
          {/* Biometric WebAuthn Passkey Button */}
          <button
            type="button"
            onClick={() => setIsBiometricOpen(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-300 hover:border-emerald-400 text-emerald-950 font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
            <span>Login with Face ID / Fingerprint</span>
            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 ml-1">
              WebAuthn
            </span>
          </button>

          {/* Continue with Google button matching Phone 2 */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-2.5 px-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-slate-800 font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Yellow Login with Mobile Number banner */}
          <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-300 via-[#FFD21F] to-amber-400 text-amber-950 font-bold text-xs shadow-sm flex items-center justify-center gap-2 border border-amber-300">
            <Phone className="w-3.5 h-3.5 fill-amber-950 stroke-[1.5]" />
            <span>Login with Mobile Number</span>
          </div>

          {/* "or" Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form Inputs matching Phone 2 */}
          <form onSubmit={handlePhoneSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-3.5 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-xs font-semibold text-slate-900 bg-white shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Mobile Number Input */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-slate-400 pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 border-r border-slate-300 pr-1.5 ml-1">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Mobile Number"
                  className="w-full pl-20 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-xs font-semibold text-slate-900 bg-white shadow-inner"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-xs font-semibold text-slate-900 bg-white shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-semibold text-center">{error}</p>
            )}

            {/* Login Yellow 3D Button matching Phone 2 */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-yellow-3d text-amber-950 font-extrabold text-sm shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer mt-1 text-center font-display"
            >
              {mode === 'signin' ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Quick Guest Bypass button */}
          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-amber-800 transition-colors flex items-center justify-center gap-1"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Toggle matching Phone 2 */}
        <div className="text-center pt-2 pb-1 border-t border-amber-100/60">
          <p className="text-xs font-medium text-slate-600">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="font-bold text-[#E65100] hover:underline cursor-pointer"
            >
              {mode === 'signin' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};
