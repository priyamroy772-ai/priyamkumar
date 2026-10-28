import React, { useState, useRef, useEffect } from 'react';
import { GroceryItem } from '../types';
import { GroceryVisual } from './GroceryVisual';
import { formatCurrencyINR, calculateLineTotal } from '../data/initialData';
import {
  CheckCircle2,
  Trash2,
  Edit2,
  Check,
  Sparkles,
} from 'lucide-react';

interface SwipeableGroceryItemProps {
  item: GroceryItem;
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
  onTogglePurchased: (id: string) => void;
}

export const SwipeableGroceryItem: React.FC<SwipeableGroceryItemProps> = ({
  item,
  onEdit,
  onDelete,
  onTogglePurchased,
}) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = -75; // Pixels to trigger full delete reveal
  const AUTO_DELETE_THRESHOLD = -140; // Pixels to immediately auto-trigger delete on release

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    // Only allow swiping to the left (negative diff)
    if (diff < 0) {
      // Add slight resistance after -100px
      const dampedDiff = diff < -120 ? -120 + (diff + 120) * 0.3 : diff;
      setDragOffset(dampedDiff);
      currentXRef.current = currentX;
    } else {
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < AUTO_DELETE_THRESHOLD) {
      // Auto-trigger delete
      triggerDelete();
    } else if (dragOffset < SWIPE_THRESHOLD) {
      // Keep revealed at -84px so user can tap delete or swipe more
      setDragOffset(-84);
    } else {
      // Snap back
      setDragOffset(0);
    }
  };

  // Pointer/Mouse events for desktop swipe testing
  const handlePointerDown = (e: React.PointerEvent) => {
    // Ignore if clicking on interactive buttons
    if ((e.target as HTMLElement).closest('button')) return;
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    if (diff < 0) {
      const dampedDiff = diff < -120 ? -120 + (diff + 120) * 0.3 : diff;
      setDragOffset(dampedDiff);
      currentXRef.current = e.clientX;
    } else {
      setDragOffset(0);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < AUTO_DELETE_THRESHOLD) {
      triggerDelete();
    } else if (dragOffset < SWIPE_THRESHOLD) {
      setDragOffset(-84);
    } else {
      setDragOffset(0);
    }
  };

  const triggerDelete = () => {
    setIsDeleting(true);
    // Haptic vibration feedback on delete
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch (e) {
        // ignore
      }
    }
    setTimeout(() => {
      onDelete(item.id);
    }, 220);
  };

  // Handle Mark as Purchased with Haptic-like visual feedback ripple
  const handleTogglePurchased = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 1. Device Haptic Vibration (if supported)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25, 35, 25]);
      } catch (err) {
        // ignore
      }
    }

    // 2. Visual Haptic Ripple Wave
    setIsRippling(true);
    if (!item.purchased) {
      setShowCelebration(true);
    }

    // 3. Dispatch toggle state
    onTogglePurchased(item.id);

    // 4. Reset ripple timer
    setTimeout(() => {
      setIsRippling(false);
      setShowCelebration(false);
    }, 700);
  };

  const lineTotal = calculateLineTotal(item.quantity, item.price);
  const isSwipedOpen = dragOffset <= SWIPE_THRESHOLD;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl select-none transition-all duration-200 ${
        isDeleting ? 'opacity-0 -translate-x-full max-h-0 py-0 my-0' : 'max-h-32'
      }`}
    >
      {/* Red Background Swipe-to-Delete Action Reveal */}
      <div className="absolute inset-0 bg-gradient-to-l from-rose-600 via-rose-500 to-red-600 rounded-2xl flex items-center justify-end px-5 text-white shadow-inner">
        <button
          type="button"
          onClick={triggerDelete}
          className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer"
          aria-label="Confirm delete"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <Trash2 className="w-5 h-5 text-white animate-bounce" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider">
            {dragOffset < AUTO_DELETE_THRESHOLD ? 'Release' : 'Delete'}
          </span>
        </button>
      </div>

      {/* Main Foreground Card (Swipeable with touch/drag) */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            if (dragOffset < AUTO_DELETE_THRESHOLD) triggerDelete();
            else if (dragOffset < SWIPE_THRESHOLD) setDragOffset(-84);
            else setDragOffset(0);
          }
        }}
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.2, 0.9, 0.4, 1)',
        }}
        className={`relative p-3 rounded-2xl bg-white border transition-colors shadow-xs flex items-center justify-between group touch-pan-y ${
          isRippling
            ? 'animate-card-haptic border-emerald-400'
            : item.purchased
            ? 'border-emerald-200/80 bg-emerald-50/20'
            : 'border-amber-100/90 hover:border-amber-300'
        }`}
      >
        {/* Haptic Visual Ripple Wave Layer */}
        {isRippling && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
            {/* Expanding circular ripple */}
            <span
              className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400/40 via-teal-300/30 to-amber-300/20 animate-haptic-ripple pointer-events-none"
            />
            {/* Shimmer flash */}
            <span className="absolute inset-0 bg-emerald-400/10 animate-pulse duration-300" />
          </div>
        )}

        {/* Celebration Floating Badge */}
        {showCelebration && (
          <div className="absolute -top-1.5 right-12 z-20 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black shadow-md flex items-center gap-1 animate-in zoom-in-75 fade-in duration-150">
            <Sparkles className="w-2.5 h-2.5 text-yellow-200 animate-spin" />
            <span>Purchased!</span>
          </div>
        )}

        {/* Left: Illustration + Info */}
        <div
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
          onClick={() => {
            if (isSwipedOpen) {
              setDragOffset(0);
            } else {
              onEdit(item);
            }
          }}
        >
          <GroceryVisual
            name={item.name}
            category={item.category}
            customImageUrl={item.customImageUrl}
            size="md"
            className="w-12 h-12"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-bold truncate transition-colors ${
                  item.purchased
                    ? 'line-through text-slate-400'
                    : 'text-slate-900 font-display'
                }`}
              >
                {item.name}
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {item.category}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {item.quantity} {item.unit} · {formatCurrencyINR(lineTotal)}
              {item.quantity > 1 && (
                <span className="text-[10px] text-slate-400 ml-1">
                  (₹{item.price}/{item.unit})
                </span>
              )}
            </p>

            {item.notes && (
              <p className="text-[11px] text-slate-400 truncate mt-0.5 italic">
                "{item.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Right Action Buttons: Purchased Toggle with Haptic pop, Edit, and Swipe indicator */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Purchased Toggle Button with Spring Pop & Haptic visual */}
          <button
            type="button"
            onClick={handleTogglePurchased}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
              isRippling ? 'animate-haptic-pop' : ''
            } ${
              item.purchased
                ? 'bg-emerald-500 text-white shadow-md hover:bg-emerald-600 ring-2 ring-emerald-200'
                : 'bg-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 active:scale-95'
            }`}
            title={item.purchased ? 'Mark unpurchased' : 'Mark purchased (Haptic tap)'}
            aria-label={item.purchased ? 'Mark unpurchased' : 'Mark purchased'}
          >
            <CheckCircle2
              className={`w-5 h-5 transition-transform ${
                item.purchased ? 'fill-emerald-500 text-white scale-105' : 'text-slate-400'
              }`}
            />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-700 hover:bg-amber-100/60 active:scale-95 transition-all cursor-pointer"
            title="Edit item details"
            aria-label="Edit item"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Quick Delete Fallback Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerDelete();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
            title="Swipe left to delete or tap"
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
