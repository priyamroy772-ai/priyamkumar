import React, { useState, useEffect } from 'react';
import { GroceryCategory } from '../types';
import { autoMatchGrocery, getCategoryFallbackImage } from '../utils/groceryAutoMatcher';

interface GroceryVisualProps {
  name?: string;
  category?: GroceryCategory | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  customImageUrl?: string;
}

export const GroceryVisual: React.FC<GroceryVisualProps> = ({
  name = '',
  category = 'Vegetables',
  className = '',
  size = 'md',
  customImageUrl,
}) => {
  const [imageError, setImageError] = useState(false);
  const normalized = name.toLowerCase().trim();

  // Reset error when props change
  useEffect(() => {
    setImageError(false);
  }, [name, customImageUrl, category]);

  // Check if an image URL is explicitly given or auto-matched via Hindi/English catalog
  const matchedCatalog = !imageError ? autoMatchGrocery(name) : null;
  const effectiveImageUrl = !imageError
    ? customImageUrl || matchedCatalog?.imageUrl || (normalized && normalized !== 'basket' && normalized !== 'hero' && !normalized.includes('priyam') ? getCategoryFallbackImage(category) : undefined)
    : undefined;

  // Size configurations
  const sizeClasses = {
    sm: 'w-9 h-9 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
    hero: 'w-44 h-44 text-7xl',
  };

  // If a high-resolution photo is matched (e.g., for 'चीनी' / 'sugar', 'दूध' / 'milk', etc.), render it beautifully
  if (effectiveImageUrl && !imageError && normalized !== 'basket' && normalized !== 'hero' && !normalized.includes('priyam')) {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden bg-white shadow-xs border border-amber-100/80 p-0.5 ${sizeClasses[size]} ${className}`}
      >
        <img
          src={effectiveImageUrl}
          alt={name || 'grocery'}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
      </div>
    );
  }

  // Helper renderers with realistic gradient SVGs inspired by the reference illustration
  if (normalized.includes('tomato')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-red-50 to-rose-100 p-1.5 shadow-sm border border-rose-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Main Tomato Body */}
          <defs>
            <radialGradient id="tomatoGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="55%" stopColor="#E60000" />
              <stop offset="90%" stopColor="#B30000" />
              <stop offset="100%" stopColor="#7A0000" />
            </radialGradient>
            <radialGradient id="tomatoHighlight" cx="30%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FF8585" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E60000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="56" rx="42" ry="38" fill="url(#tomatoGrad)" />
          <ellipse cx="36" cy="46" rx="16" ry="12" fill="url(#tomatoHighlight)" />
          {/* Green Calyx / Stem */}
          <path d="M50 20 C48 10 52 6 56 4 C58 7 54 14 52 20 Z" fill="#2E7D32" />
          <path d="M50 20 Q40 16 28 22 Q40 25 48 24 Z" fill="#4CAF50" />
          <path d="M50 20 Q60 16 72 22 Q60 25 52 24 Z" fill="#388E3C" />
          <path d="M50 20 Q44 28 35 34 Q45 30 50 24 Z" fill="#43A047" />
          <path d="M50 20 Q56 28 65 34 Q55 30 50 24 Z" fill="#2E7D32" />
          <circle cx="50" cy="22" r="4" fill="#1B5E20" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('potato')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-50 to-yellow-100 p-1.5 shadow-sm border border-amber-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="potatoGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E4BA78" />
              <stop offset="60%" stopColor="#C49647" />
              <stop offset="100%" stopColor="#8C6221" />
            </radialGradient>
          </defs>
          <path d="M22 45 C15 30 35 15 62 18 C85 20 92 38 88 62 C85 82 58 88 35 84 C18 80 12 60 22 45 Z" fill="url(#potatoGrad)" />
          <ellipse cx="38" cy="35" rx="14" ry="8" fill="#FFFFFF" opacity="0.3" transform="rotate(-10 38 35)" />
          {/* Eyes / texture */}
          <ellipse cx="40" cy="30" rx="4" ry="1.5" fill="#6B4B18" opacity="0.6" />
          <ellipse cx="65" cy="45" rx="5" ry="2" fill="#6B4B18" opacity="0.6" />
          <ellipse cx="35" cy="62" rx="4" ry="1.5" fill="#6B4B18" opacity="0.6" />
          <ellipse cx="70" cy="68" rx="3" ry="1.2" fill="#6B4B18" opacity="0.5" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('onion')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-purple-50 to-pink-100 p-1.5 shadow-sm border border-purple-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="onionGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E06D9E" />
              <stop offset="60%" stopColor="#9C2770" />
              <stop offset="100%" stopColor="#5E1140" />
            </radialGradient>
          </defs>
          <path d="M50 12 C52 24 85 45 85 68 C85 86 69 92 50 92 C31 92 15 86 15 68 C15 45 48 24 50 12 Z" fill="url(#onionGrad)" />
          {/* Onion sprout tip & roots */}
          <path d="M50 12 Q53 4 57 2 Q53 8 50 16 Z" fill="#8BC34A" />
          <path d="M46 92 Q50 97 54 92" stroke="#4A1535" strokeWidth="2" strokeLinecap="round" />
          {/* Surface stripes */}
          <path d="M50 20 Q35 50 32 78" stroke="#FF99C8" strokeWidth="2.5" opacity="0.4" fill="none" />
          <path d="M50 20 Q65 50 68 78" stroke="#FF99C8" strokeWidth="2.5" opacity="0.4" fill="none" />
          <ellipse cx="40" cy="50" rx="8" ry="14" fill="#FFFFFF" opacity="0.25" transform="rotate(-15 40 50)" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('banana')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-50 to-yellow-100 p-1.5 shadow-sm border border-yellow-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="bananaGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="70%" stopColor="#FBC02D" />
              <stop offset="100%" stopColor="#E65100" />
            </radialGradient>
          </defs>
          <path d="M20 78 C25 86 52 92 78 72 C88 64 94 48 90 32 C88 28 82 28 80 32 C78 50 64 68 46 72 C32 75 22 72 20 78 Z" fill="url(#bananaGrad)" />
          <path d="M12 66 C18 78 48 84 74 62 C82 54 88 38 82 22 C80 18 74 18 73 22 C70 42 54 58 36 62 C22 65 14 60 12 66 Z" fill="#FDD835" />
          {/* Stems */}
          <path d="M82 22 L86 16 L80 14 L76 20 Z" fill="#689F38" />
          <path d="M12 66 L8 70 L10 74 L14 70 Z" fill="#5D4037" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('milk')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-blue-50 to-sky-100 p-1.5 shadow-sm border border-blue-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="milkCap" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E88E5" />
              <stop offset="100%" stopColor="#0D47A1" />
            </linearGradient>
            <linearGradient id="milkGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          {/* Bottle body */}
          <path d="M40 18 L60 18 L60 30 C68 38 74 48 74 62 L74 84 C74 90 68 94 60 94 L40 94 C32 94 26 90 26 84 L26 62 C26 48 32 38 40 30 Z" fill="url(#milkGlass)" stroke="#CBD5E1" strokeWidth="2" />
          {/* Milk cap */}
          <rect x="38" y="10" width="24" height="10" rx="3" fill="url(#milkCap)" />
          {/* Milk badge */}
          <rect x="34" y="52" width="32" height="22" rx="4" fill="#3B82F6" opacity="0.85" />
          <text x="50" y="66" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">MILK</text>
          {/* Glass sheen */}
          <path d="M32 46 L32 86" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('bread')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-100 p-1.5 shadow-sm border border-amber-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="crustGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E6A857" />
              <stop offset="60%" stopColor="#C47D2B" />
              <stop offset="100%" stopColor="#8C4A0E" />
            </radialGradient>
          </defs>
          {/* Bread loaf */}
          <rect x="18" y="38" width="64" height="46" rx="10" fill="#F8E1BE" stroke="#8C4A0E" strokeWidth="2" />
          <path d="M12 45 C12 25 30 18 50 18 C70 18 88 25 88 45 L88 50 L12 50 Z" fill="url(#crustGrad)" />
          {/* Cuts */}
          <ellipse cx="32" cy="32" rx="3" ry="8" fill="#F8E1BE" transform="rotate(-25 32 32)" />
          <ellipse cx="50" cy="30" rx="3" ry="8" fill="#F8E1BE" />
          <ellipse cx="68" cy="32" rx="3" ry="8" fill="#F8E1BE" transform="rotate(25 68 32)" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('rice')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-50 to-yellow-100 p-1.5 shadow-sm border border-amber-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Rice Mound */}
          <ellipse cx="50" cy="50" rx="38" ry="18" fill="#FFFFFF" />
          <path d="M15 50 Q50 25 85 50 Z" fill="#F8FAFC" />
          {/* Rice grains details */}
          <ellipse cx="40" cy="40" rx="4" ry="1.5" fill="#E2E8F0" transform="rotate(20 40 40)" />
          <ellipse cx="55" cy="38" rx="4" ry="1.5" fill="#E2E8F0" transform="rotate(-30 55 38)" />
          <ellipse cx="50" cy="46" rx="4" ry="1.5" fill="#E2E8F0" transform="rotate(10 50 46)" />
          {/* Bowl */}
          <path d="M14 50 C14 78 30 88 50 88 C70 88 86 78 86 50 Z" fill="url(#bowlGrad)" stroke="#92400E" strokeWidth="2" />
          <ellipse cx="50" cy="50" rx="36" ry="6" fill="#F59E0B" opacity="0.3" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('carrot')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-orange-50 to-amber-100 p-1.5 shadow-sm border border-orange-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="carrotGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF9800" />
              <stop offset="70%" stopColor="#F57C00" />
              <stop offset="100%" stopColor="#E65100" />
            </radialGradient>
          </defs>
          {/* Leaves */}
          <path d="M72 18 Q85 8 90 12 Q80 22 70 24" fill="#4CAF50" />
          <path d="M72 18 Q78 4 82 8 Q75 18 70 24" fill="#388E3C" />
          {/* Carrot Body */}
          <path d="M74 22 C78 28 72 34 66 36 L20 84 C16 88 12 86 14 80 L36 30 C38 24 45 20 54 20 Z" fill="url(#carrotGrad)" />
          {/* Ridges */}
          <line x1="45" y1="36" x2="52" y2="39" stroke="#BF360C" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="48" x2="44" y2="52" stroke="#BF360C" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="64" x2="33" y2="67" stroke="#BF360C" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('broccoli')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-emerald-50 to-green-100 p-1.5 shadow-sm border border-emerald-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Stem */}
          <path d="M42 55 L38 90 L62 90 L58 55 Z" fill="#81C784" stroke="#388E3C" strokeWidth="2" />
          {/* Florets */}
          <circle cx="34" cy="46" r="18" fill="#2E7D32" />
          <circle cx="66" cy="46" r="18" fill="#2E7D32" />
          <circle cx="50" cy="32" r="22" fill="#388E3C" />
          <circle cx="38" cy="30" r="14" fill="#4CAF50" />
          <circle cx="62" cy="30" r="14" fill="#43A047" />
          <circle cx="50" cy="22" r="12" fill="#66BB6A" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('apple')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-red-50 to-rose-100 p-1.5 shadow-sm border border-rose-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="appleGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF5252" />
              <stop offset="60%" stopColor="#D50000" />
              <stop offset="100%" stopColor="#8A0000" />
            </radialGradient>
          </defs>
          {/* Stem & Leaf */}
          <path d="M50 20 Q56 8 62 6" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M54 14 Q66 10 70 18 Q62 20 54 14 Z" fill="#4CAF50" />
          {/* Apple Heart Body */}
          <path d="M50 30 C38 18 16 26 16 52 C16 78 38 92 50 92 C62 92 84 78 84 52 C84 26 62 18 50 30 Z" fill="url(#appleGrad)" />
          {/* Shine */}
          <ellipse cx="34" cy="45" rx="8" ry="14" fill="#FFFFFF" opacity="0.3" transform="rotate(-15 34 45)" />
        </svg>
      </div>
    );
  }

  if (normalized.includes('cheese') || normalized.includes('paneer')) {
    const isPaneer = normalized.includes('paneer');
    return (
      <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-50 to-yellow-100 p-1.5 shadow-sm border border-amber-200/50 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="cheeseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isPaneer ? "#FFFFFF" : "#FFD54F"} />
              <stop offset="100%" stopColor={isPaneer ? "#E2E8F0" : "#FFA000"} />
            </linearGradient>
          </defs>
          {/* Wedge / Block */}
          <path d="M18 64 L78 78 L88 44 L32 30 Z" fill="url(#cheeseGrad)" stroke={isPaneer ? "#CBD5E1" : "#FF8F00"} strokeWidth="2" />
          <path d="M32 30 L88 44 L60 22 L18 28 Z" fill={isPaneer ? "#F8FAFC" : "#FFE082"} />
          <path d="M18 28 L18 64 L32 30 Z" fill={isPaneer ? "#E2E8F0" : "#FFB300"} />
          {/* Cheese Holes if not paneer */}
          {!isPaneer && (
            <>
              <ellipse cx="45" cy="52" rx="5" ry="3" fill="#FF8F00" opacity="0.6" />
              <ellipse cx="64" cy="58" rx="6" ry="4" fill="#FF8F00" opacity="0.6" />
              <ellipse cx="56" cy="40" rx="4" ry="2" fill="#FF8F00" opacity="0.5" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Brand Grocery Basket Hero representation (for splash & hero)
  if (normalized === 'basket' || normalized === 'hero' || normalized.includes('priyam')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="basketGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="40%" stopColor="#FFD21F" />
              <stop offset="85%" stopColor="#F5B800" />
              <stop offset="100%" stopColor="#D49D00" />
            </linearGradient>
            <radialGradient id="vegGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#81C784" />
              <stop offset="100%" stopColor="#2E7D32" />
            </radialGradient>
          </defs>
          {/* Fresh Produce in Basket */}
          {/* Greens */}
          <circle cx="55" cy="58" r="24" fill="url(#vegGrad)" />
          <circle cx="40" cy="50" r="16" fill="#4CAF50" />
          {/* Milk carton / bottle */}
          <rect x="100" y="40" width="22" height="36" rx="4" fill="#FFFFFF" stroke="#90CAF9" strokeWidth="2" />
          <rect x="106" y="32" width="10" height="8" rx="2" fill="#1E88E5" />
          {/* Carrot stick */}
          <path d="M78 40 L92 68 L84 72 L72 42 Z" fill="#FF9800" />
          {/* Red Bell pepper / Tomato */}
          <circle cx="86" cy="62" r="18" fill="#E53935" />
          <path d="M86 46 Q88 40 92 38" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
          {/* Yellow Pepper */}
          <circle cx="68" cy="66" r="16" fill="#FBC02D" />

          {/* Golden Basket Handles */}
          <path d="M40 70 C40 30 120 30 120 70" stroke="#F5B800" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.9" />

          {/* Yellow Wire Basket Body */}
          <path d="M25 72 L135 72 L120 135 C118 142 110 146 102 146 L58 146 C50 146 42 142 40 135 Z" fill="url(#basketGold)" stroke="#D49D00" strokeWidth="3" />
          
          {/* Basket Weave / Grid Slits */}
          <line x1="32" y1="84" x2="128" y2="84" stroke="#FFF9D2" strokeWidth="3" strokeLinecap="round" />
          <line x1="37" y1="98" x2="123" y2="98" stroke="#FFF9D2" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="112" x2="118" y2="112" stroke="#FFF9D2" strokeWidth="3" strokeLinecap="round" />
          <line x1="47" y1="126" x2="113" y2="126" stroke="#FFF9D2" strokeWidth="3" strokeLinecap="round" />
          
          {/* Vertical Ribs */}
          <line x1="48" y1="74" x2="56" y2="144" stroke="#D49D00" strokeWidth="3" />
          <line x1="70" y1="74" x2="72" y2="144" stroke="#D49D00" strokeWidth="3" />
          <line x1="90" y1="74" x2="88" y2="144" stroke="#D49D00" strokeWidth="3" />
          <line x1="112" y1="74" x2="104" y2="144" stroke="#D49D00" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  // Category based defaults
  switch (category) {
    case 'Vegetables':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-emerald-50 to-green-100 p-1.5 shadow-sm border border-emerald-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="38" cy="54" r="22" fill="#2E7D32" />
            <circle cx="64" cy="56" r="20" fill="#388E3C" />
            <circle cx="50" cy="42" r="24" fill="#4CAF50" />
            <path d="M50 20 Q48 35 50 60" stroke="#81C784" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="44" cy="38" r="8" fill="#A5D6A7" opacity="0.6" />
          </svg>
        </div>
      );
    case 'Fruits':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-100 p-1.5 shadow-sm border border-amber-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="62" cy="55" r="24" fill="#FF9800" />
            <ellipse cx="40" cy="52" rx="22" ry="26" fill="#E53935" />
            <path d="M40 24 Q44 14 50 12" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M44 18 Q54 16 56 22 Z" fill="#4CAF50" />
            <ellipse cx="32" cy="46" rx="6" ry="12" fill="#FFFFFF" opacity="0.3" transform="rotate(-15 32 46)" />
          </svg>
        </div>
      );
    case 'Dairy':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-blue-50 to-sky-100 p-1.5 shadow-sm border border-blue-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="28" y="24" width="28" height="60" rx="4" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="2" />
            <rect x="34" y="16" width="16" height="8" rx="2" fill="#2563EB" />
            <path d="M54 50 L84 62 L84 84 L54 84 Z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
            <ellipse cx="68" cy="70" rx="4" ry="2.5" fill="#D97706" opacity="0.6" />
          </svg>
        </div>
      );
    case 'Snacks':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-orange-50 to-amber-100 p-1.5 shadow-sm border border-orange-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M25 22 L75 16 L82 84 L18 88 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <path d="M25 22 L20 18 L24 16 L28 18 Z" fill="#FCA5A5" />
            <path d="M75 16 L72 12 L76 10 L80 12 Z" fill="#FCA5A5" />
            <rect x="28" y="44" width="44" height="24" rx="4" fill="#FBBF24" />
            <text x="50" y="60" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle">CHIPS</text>
          </svg>
        </div>
      );
    case 'Grains':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-yellow-50 to-amber-100 p-1.5 shadow-sm border border-yellow-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M24 45 C24 75 36 86 50 86 C64 86 76 75 76 45 Z" fill="#D97706" />
            <ellipse cx="50" cy="45" rx="26" ry="14" fill="#FEF3C7" />
            <ellipse cx="50" cy="40" rx="20" ry="10" fill="#FFFFFF" />
            <path d="M50 20 L50 36 M44 26 L56 30 M42 34 L58 22" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'Beverages':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-rose-50 to-pink-100 p-1.5 shadow-sm border border-rose-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M42 20 L58 20 L62 34 L68 50 L68 86 L32 86 L32 50 L38 34 Z" fill="#F43F5E" />
            <rect x="44" y="12" width="12" height="8" rx="2" fill="#BE123C" />
            <rect x="36" y="52" width="28" height="18" rx="2" fill="#FFFFFF" opacity="0.9" />
            <text x="50" y="65" fill="#BE123C" fontSize="9" fontWeight="bold" textAnchor="middle">JUICE</text>
          </svg>
        </div>
      );
    case 'Household':
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-cyan-50 to-teal-100 p-1.5 shadow-sm border border-cyan-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="25" y="38" width="26" height="52" rx="6" fill="#06B6D4" />
            <path d="M25 38 L38 20 L44 20 L38 38 Z" fill="#0891B2" />
            <rect x="56" y="44" width="24" height="46" rx="5" fill="#3B82F6" />
            <path d="M60 44 L60 28 L72 28 L72 44" fill="#2563EB" />
            <rect x="68" y="22" width="16" height="6" rx="2" fill="#1D4ED8" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-yellow-50 to-amber-100 p-1.5 shadow-sm border border-yellow-200/50 ${sizeClasses[size]} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="36" fill="#FFD21F" />
            <circle cx="50" cy="50" r="28" fill="#FFF9C4" />
            <text x="50" y="58" fill="#B45309" fontSize="24" fontWeight="bold" textAnchor="middle">🛒</text>
          </svg>
        </div>
      );
  }
};
