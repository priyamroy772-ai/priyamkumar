import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryVisual } from './GroceryVisual';
import { ShowcaseFooter } from './ShowcaseFooter';
import { formatCurrencyINR, calculateLineTotal } from '../data/initialData';
import {
  Plus,
  ChevronRight,
  List,
  LayoutGrid,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';

/* -------------------------------------------------------------
 * 3D Graphic Components matching the Reference Screenshot
 * ----------------------------------------------------------- */

// 1. Hero 3D Grocery Basket with fresh produce and floating leaves
export const HeroGroceryBasket: React.FC<{ className?: string }> = ({ className = 'w-36 h-36' }) => (
  <div className={`relative flex items-center justify-center shrink-0 select-none ${className}`}>
    {/* Floating green leaf 1 (top-left) */}
    <div className="absolute -top-1 left-2 w-5 h-5 -rotate-45 animate-bounce-subtle pointer-events-none drop-shadow-sm">
      <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-500">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </svg>
    </div>

    {/* Floating green leaf 2 (mid-left) */}
    <div className="absolute top-16 -left-2 w-4 h-4 rotate-12 pointer-events-none drop-shadow-sm opacity-90">
      <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-600">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </svg>
    </div>

    {/* Floating green leaf 3 (right side) */}
    <div className="absolute top-8 -right-1 w-5 h-5 45deg pointer-events-none drop-shadow-sm">
      <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-500">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </svg>
    </div>

    {/* Main 3D Basket SVG */}
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      <defs>
        {/* Basket Yellow Gradient */}
        <linearGradient id="heroBasketGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="35%" stopColor="#FFD21F" />
          <stop offset="80%" stopColor="#F5B400" />
          <stop offset="100%" stopColor="#D99B00" />
        </linearGradient>

        <linearGradient id="baguetteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <radialGradient id="broccoliGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#68D391" />
          <stop offset="60%" stopColor="#2F855A" />
          <stop offset="100%" stopColor="#1C4532" />
        </radialGradient>

        <radialGradient id="redPepperGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="55%" stopColor="#E53E3E" />
          <stop offset="100%" stopColor="#9B2C2C" />
        </radialGradient>

        <radialGradient id="yellowPepperGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEFCBF" />
          <stop offset="50%" stopColor="#ECC94B" />
          <stop offset="100%" stopColor="#B7791F" />
        </radialGradient>
      </defs>

      {/* PRODUCE BACKGROUND */}
      {/* Tall French Baguette */}
      <g transform="rotate(22 155 55)">
        <rect x="135" y="10" width="22" height="75" rx="10" fill="url(#baguetteGrad)" />
        <ellipse cx="146" cy="24" rx="7" ry="2.5" fill="#FEF3C7" opacity="0.6" />
        <ellipse cx="146" cy="38" rx="7" ry="2.5" fill="#FEF3C7" opacity="0.6" />
        <ellipse cx="146" cy="52" rx="7" ry="2.5" fill="#FEF3C7" opacity="0.6" />
      </g>

      {/* Milk / Juice Bottle */}
      <g>
        <rect x="120" y="24" width="20" height="36" rx="4" fill="#FFFFFF" opacity="0.95" stroke="#90CDF4" strokeWidth="1.5" />
        <rect x="124" y="18" width="12" height="7" rx="2" fill="#3182CE" />
        <rect x="122" y="36" width="16" height="14" fill="#F6E05E" opacity="0.85" rx="1" />
      </g>

      {/* Broccoli Florets (top left) */}
      <circle cx="50" cy="50" r="18" fill="url(#broccoliGrad)" />
      <circle cx="36" cy="58" r="14" fill="url(#broccoliGrad)" />
      <circle cx="62" cy="42" r="15" fill="url(#broccoliGrad)" />
      <circle cx="52" cy="38" r="8" fill="#9AE6B4" opacity="0.6" />

      {/* Sweet Corn Cob */}
      <g transform="rotate(-15 130 75)">
        <rect x="120" y="60" width="16" height="34" rx="8" fill="#F6E05E" stroke="#D69E2E" strokeWidth="1" />
        <circle cx="125" cy="66" r="1.5" fill="#ECC94B" />
        <circle cx="131" cy="66" r="1.5" fill="#ECC94B" />
        <circle cx="125" cy="74" r="1.5" fill="#ECC94B" />
        <circle cx="131" cy="74" r="1.5" fill="#ECC94B" />
        <circle cx="128" cy="82" r="1.5" fill="#ECC94B" />
      </g>

      {/* Red Bell Pepper */}
      <g>
        <ellipse cx="112" cy="64" rx="14" ry="16" fill="url(#redPepperGrad)" />
        <path d="M112 48 Q113 42 116 40" stroke="#38A169" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="107" cy="58" rx="4" ry="7" fill="#FEB2B2" opacity="0.6" />
      </g>

      {/* Yellow Bell Pepper */}
      <g>
        <ellipse cx="94" cy="68" rx="16" ry="18" fill="url(#yellowPepperGrad)" />
        <path d="M94 50 Q96 44 98 42" stroke="#38A169" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="88" cy="62" rx="4" ry="8" fill="#FFFFF0" opacity="0.7" />
      </g>

      {/* Front Red Tomato */}
      <g>
        <circle cx="70" cy="74" r="14" fill="url(#redPepperGrad)" />
        <path d="M70 60 L68 56 L72 56 Z" fill="#2F855A" />
        <ellipse cx="65" cy="70" rx="3.5" ry="5" fill="#FEB2B2" opacity="0.6" />
      </g>

      {/* YELLOW BASKET BODY */}
      {/* Front Basket Wall */}
      <path
        d="M26 80 L166 80 L146 156 C144 163 136 168 128 168 L64 168 C56 168 48 163 46 156 Z"
        fill="url(#heroBasketGold)"
        stroke="#D99B00"
        strokeWidth="3.5"
      />

      {/* Top Rim of Basket */}
      <rect x="22" y="74" width="148" height="10" rx="5" fill="#FFF275" stroke="#D99B00" strokeWidth="2.5" />

      {/* Slotted Basket Grids / Vents */}
      {/* Black Grid Logo Box on Basket Front (matching image) */}
      <rect x="52" y="96" width="22" height="22" rx="4" fill="#1A202C" />
      <circle cx="58" cy="102" r="1.5" fill="#FFD21F" />
      <circle cx="63" cy="102" r="1.5" fill="#FFD21F" />
      <circle cx="68" cy="102" r="1.5" fill="#FFD21F" />
      <circle cx="58" cy="107" r="1.5" fill="#FFD21F" />
      <circle cx="63" cy="107" r="1.5" fill="#FFD21F" />
      <circle cx="68" cy="107" r="1.5" fill="#FFD21F" />
      <circle cx="58" cy="112" r="1.5" fill="#FFD21F" />
      <circle cx="63" cy="112" r="1.5" fill="#FFD21F" />
      <circle cx="68" cy="112" r="1.5" fill="#FFD21F" />

      {/* Slotted vertical vents right side */}
      <rect x="94" y="98" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
      <rect x="105" y="98" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
      <rect x="116" y="98" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
      <rect x="127" y="98" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />

      <rect x="92" y="126" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
      <rect x="103" y="126" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
      <rect x="114" y="126" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
      <rect x="125" y="126" width="5" height="18" rx="2.5" fill="#B7791F" opacity="0.9" transform="skewX(-10)" />
    </svg>
  </div>
);

// 2. 3D Yellow Basket Icon (Total Items Card)
export const Basket3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="cardBasketGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="50%" stopColor="#FFD21F" />
          <stop offset="100%" stopColor="#F5B400" />
        </linearGradient>
      </defs>
      {/* Fresh Veggies sticking out */}
      <circle cx="36" cy="36" r="10" fill="#38A169" />
      <circle cx="50" cy="30" r="11" fill="#E53E3E" />
      <circle cx="64" cy="34" r="9" fill="#ECC94B" />
      <path d="M48 20 Q50 14 54 12" stroke="#2F855A" strokeWidth="2.5" strokeLinecap="round" />
      {/* Basket Handle */}
      <path d="M28 42 C28 20 72 20 72 42" stroke="#ECC94B" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Basket Body */}
      <path d="M18 44 L82 44 L72 84 C71 88 67 90 62 90 L38 90 C33 90 29 88 28 84 Z" fill="url(#cardBasketGold)" stroke="#D69E2E" strokeWidth="2" />
      {/* Grid Slits */}
      <line x1="32" y1="56" x2="68" y2="56" stroke="#B7791F" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="34" y1="68" x2="66" y2="68" stroke="#B7791F" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="38" y1="80" x2="62" y2="80" stroke="#B7791F" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  </div>
);

// 3. 3D Green Wallet with Rupee Coin (Monthly Budget Card)
export const GreenWallet3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="walletGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <radialGradient id="rupeeCoin" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#CA8A04" />
        </radialGradient>
      </defs>
      {/* Wallet Back */}
      <rect x="16" y="24" width="56" height="48" rx="8" fill="#047857" />
      {/* Cash Notes Sticking Out */}
      <rect x="22" y="16" width="44" height="20" rx="3" fill="#A7F3D0" stroke="#059669" strokeWidth="1" />
      <line x1="30" y1="22" x2="58" y2="22" stroke="#059669" strokeWidth="1.5" />
      {/* Wallet Front Flap */}
      <rect x="14" y="28" width="60" height="46" rx="8" fill="url(#walletGreen)" stroke="#065F46" strokeWidth="1.5" />
      {/* Stitching */}
      <rect x="17" y="31" width="54" height="40" rx="6" fill="none" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
      {/* Rupee Symbol on Wallet */}
      <text x="32" y="58" fill="#ECFDF5" fontSize="18" fontWeight="bold">₹</text>
      {/* Shiny Gold Rupee Coin overlapping right */}
      <circle cx="70" cy="62" r="16" fill="url(#rupeeCoin)" stroke="#A16207" strokeWidth="1.5" />
      <circle cx="70" cy="62" r="13" fill="none" stroke="#FEF08A" strokeWidth="1" opacity="0.8" />
      <text x="70" y="68" fill="#854D0E" fontSize="15" fontWeight="black" textAnchor="middle">₹</text>
    </svg>
  </div>
);

// 4. 3D Red Wallet with Coins Stack (Remaining Budget Card)
export const RedWallet3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="walletRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="coinGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>
      {/* Red Wallet Body */}
      <rect x="28" y="24" width="56" height="48" rx="8" fill="url(#walletRed)" stroke="#7F1D1D" strokeWidth="1.5" />
      {/* Folded Flap */}
      <path d="M28 24 L84 24 L84 48 C84 48 60 56 28 48 Z" fill="#EF4444" opacity="0.85" />
      {/* Golden Clasp */}
      <circle cx="56" cy="48" r="5" fill="#FACC15" stroke="#A16207" strokeWidth="1" />
      <circle cx="56" cy="48" r="2" fill="#FFFFFF" />
      {/* Stack of 3 Gold Coins at Bottom Left */}
      {/* Coin 1 (bottom) */}
      <ellipse cx="24" cy="74" rx="14" ry="5.5" fill="url(#coinGold)" stroke="#854D0E" strokeWidth="1" />
      <rect x="10" y="69" width="28" height="5" fill="#CA8A04" />
      <ellipse cx="24" cy="69" rx="14" ry="5.5" fill="url(#coinGold)" stroke="#854D0E" strokeWidth="1" />
      {/* Coin 2 (middle) */}
      <rect x="10" y="63" width="28" height="5" fill="#CA8A04" />
      <ellipse cx="24" cy="63" rx="14" ry="5.5" fill="url(#coinGold)" stroke="#854D0E" strokeWidth="1" />
      {/* Coin 3 (top) */}
      <rect x="10" y="57" width="28" height="5" fill="#CA8A04" />
      <ellipse cx="24" cy="57" rx="14" ry="5.5" fill="#FEF08A" stroke="#854D0E" strokeWidth="1" />
      <text x="24" y="60" fill="#713F12" fontSize="9" fontWeight="bold" textAnchor="middle">₹</text>
    </svg>
  </div>
);

// 5. 3D Receipt with Green Checkmark (Spent Card)
export const Receipt3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="receiptPaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* White Receipt Paper */}
      <path
        d="M24 16 L76 16 L76 74 L70 70 L64 74 L58 70 L52 74 L46 70 L40 74 L34 70 L28 74 L24 70 Z"
        fill="url(#receiptPaper)"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      {/* Printed receipt text lines */}
      <line x1="32" y1="26" x2="52" y2="26" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="34" x2="68" y2="34" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="42" x2="64" y2="42" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="50" x2="56" y2="50" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
      {/* Green Checkmark Circle Badge */}
      <circle cx="68" cy="64" r="14" fill="url(#checkGrad)" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M62 64 L66 68 L74 60" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </div>
);

/* -------------------------------------------------------------
 * Main DashboardScreen matching the Reference Image
 * ----------------------------------------------------------- */

export const DashboardScreen: React.FC = () => {
  const {
    totalActiveItems,
    settings,
    remainingBudget,
    spentTotal,
    isOverBudget,
    openAddModal,
    setActiveTab,
    setIsBudgetModalOpen,
    openBudgetAlert,
    items,
  } = useGrocery();

  // Recent purchases for the lower section
  const recentPurchases = items.filter((i) => i.purchased).slice(0, 3);

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Golden Hero Banner matching Reference Screenshot */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF7B8] via-[#FFD745] to-[#F5B400] p-4.5 sm:p-5 border border-[#FFECA8] shadow-[0_10px_24px_rgba(245,180,0,0.22)]">
        {/* Soft yellow glow circles in background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/25 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Left Text & CTA */}
          <div className="flex-1 min-w-0 pr-1">
            <h2 className="text-[21px] sm:text-[23px] font-black text-slate-900 tracking-tight leading-tight font-display">
              Good shopping
            </h2>
            <div className="text-[29px] sm:text-[33px] font-black text-[#EA580C] leading-none tracking-tight font-display my-1">
              starts here
            </div>
            <p className="text-[11.5px] font-semibold text-slate-800 leading-snug mt-1.5 max-w-[190px]">
              Organize & optimize your family grocery checklist
            </p>

            {/* Glossy Yellow 3D "+ Add Grocery >" Button */}
            <button
              type="button"
              onClick={() => openAddModal()}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-gradient-to-b from-[#FFE766] via-[#FFD21F] to-[#F5AE00] border border-[#FFF099] shadow-[0_4px_12px_rgba(217,119,6,0.28)] active:scale-95 transition-transform cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span className="text-xs font-black text-slate-950 tracking-tight">
                Add Grocery
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.8] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right 3D Basket with Groceries & Floating Leaves */}
          <div className="shrink-0 flex items-center justify-center">
            <HeroGroceryBasket className="w-36 h-36 sm:w-40 sm:h-40" />
          </div>
        </div>
      </section>

      {/* 2. Four Metric Cards in 2x2 Grid matching Reference Screenshot */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: TOTAL ITEMS */}
        <div
          onClick={() => setActiveTab('list')}
          className="rounded-2xl p-3 bg-gradient-to-br from-[#FFFDF2] to-[#FFF9DC] border border-amber-200/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-1.5 group active:scale-98"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Basket3DIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                TOTAL ITEMS
              </span>
              <div className="text-2xl font-black text-slate-900 font-display leading-tight tabular-nums mt-0.5">
                {totalActiveItems}
              </div>
              <span className="text-[10px] font-medium text-slate-500 block truncate">
                items in your list
              </span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.6]" />
          </div>
        </div>

        {/* Card 2: MONTHLY BUDGET */}
        <div
          onClick={() => setIsBudgetModalOpen(true)}
          className="rounded-2xl p-3 bg-gradient-to-br from-[#F0FDF4] to-[#E6F9EE] border border-emerald-200/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-1.5 group active:scale-98"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <GreenWallet3DIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                MONTHLY BUDGET
              </span>
              <div className="text-2xl font-black text-slate-900 font-display leading-tight tabular-nums truncate mt-0.5">
                ₹{settings.monthlyBudget}
              </div>
              <span className="text-[10px] font-medium text-slate-500 block truncate">
                set your budget
              </span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.6]" />
          </div>
        </div>

        {/* Card 3: REMAINING BUDGET */}
        <div
          onClick={() => {
            if (isOverBudget) {
              openBudgetAlert();
            } else {
              setActiveTab('budget');
            }
          }}
          className="rounded-2xl p-3 bg-gradient-to-br from-[#FFF5F5] to-[#FEECEC] border border-rose-200/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-1.5 group active:scale-98"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <RedWallet3DIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                REMAINING BUDGET
              </span>
              <div
                className={`text-2xl font-black font-display leading-tight tabular-nums truncate mt-0.5 ${
                  remainingBudget < 0 ? 'text-[#E11D48]' : 'text-slate-900'
                }`}
              >
                {remainingBudget < 0
                  ? `₹${remainingBudget}`
                  : `₹${remainingBudget}`}
              </div>
              <span
                className={`text-[10px] font-medium block truncate ${
                  remainingBudget < 0 ? 'text-rose-600' : 'text-slate-500'
                }`}
              >
                {remainingBudget < 0 ? 'You are over budget' : 'remaining to spend'}
              </span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.6]" />
          </div>
        </div>

        {/* Card 4: SPENT */}
        <div
          onClick={() => setActiveTab('reports')}
          className="rounded-2xl p-3 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] border border-sky-200/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-1.5 group active:scale-98"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Receipt3DIcon className="w-10 h-10 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                SPENT
              </span>
              <div className="text-2xl font-black text-slate-900 font-display leading-tight tabular-nums truncate mt-0.5">
                ₹{spentTotal}
              </div>
              <span className="text-[10px] font-medium text-slate-500 block truncate">
                total expenses
              </span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:bg-sky-200 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.6]" />
          </div>
        </div>
      </section>

      {/* 3. Quick Actions Header + 2x2 Action Pills matching Reference Screenshot */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 text-lg leading-none select-none">⚡</span>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-display">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Add Item (Light Green) */}
          <button
            type="button"
            onClick={() => openAddModal()}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#E8FAF0] border border-emerald-100/90 shadow-xs hover:bg-[#DDF7E7] hover:border-emerald-200 active:scale-97 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                Add Item
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-500 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 2: View List (Light Blue) */}
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#EDF6FF] border border-sky-100/90 shadow-xs hover:bg-[#E1EFFF] hover:border-sky-200 active:scale-97 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <List className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                View List
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-sky-500 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 3: Categories (Light Purple) */}
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#F5F0FF] border border-purple-100/90 shadow-xs hover:bg-[#EBE2FF] hover:border-purple-200 active:scale-97 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                Categories
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-500 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 4: Reports (Light Amber) */}
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9EA] border border-amber-100/90 shadow-xs hover:bg-[#FFF2D4] hover:border-amber-200 active:scale-97 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <BarChart2 className="w-5 h-5 stroke-[2.4]" />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                Reports
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-500 stroke-[2.5] shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* 4. Recent Purchases (compact, clean integration) */}
      {recentPurchases.length > 0 && (
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Purchases
            </h4>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentPurchases.map((item) => {
              const lineTotal = calculateLineTotal(item.quantity, item.price);
              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl bg-white border border-amber-100/80 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GroceryVisual
                      name={item.name}
                      category={item.category}
                      customImageUrl={item.customImageUrl}
                      size="sm"
                      className="w-9 h-9"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {item.quantity} {item.unit} · {formatCurrencyINR(lineTotal)}
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Signature Priyam Grocery Manager footer */}
      <div className="pt-1">
        <ShowcaseFooter />
      </div>
    </div>
  );
};
