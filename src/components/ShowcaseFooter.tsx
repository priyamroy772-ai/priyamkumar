import React from 'react';
import { GroceryVisual } from './GroceryVisual';
import { Edit2, RotateCcw, Database, Smartphone, Sparkles, ShoppingCart } from 'lucide-react';

export const ShowcaseFooter: React.FC = () => {
  return (
    <footer className="mt-0 pt-2 pb-2.5 border-t border-amber-200/40 bg-gradient-to-b from-transparent via-amber-50/15 to-transparent">
      <div className="w-full space-y-2.5">
        {/* Top Brand & Tagline - Signature Priyam Grocery Manager */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <GroceryVisual name="basket" size="sm" className="w-9 h-9" />
            <div>
              <h3 className="text-base font-black text-[#D97706] tracking-tight font-display leading-tight">
                Priyam Grocery Manager
              </h3>
              <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5">
                <span>Smart Grocery</span>
                <span>•</span>
                <span>Healthy Family</span>
                <span>•</span>
                <span>Happy Life</span>
              </p>
            </div>
          </div>

          {/* Yellow Fun Sticker matching reference */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FFD21F] to-[#F5B800] text-amber-950 font-black text-[10px] shadow-xs rotate-[-1deg] border border-amber-300 shrink-0">
            <ShoppingCart className="w-3 h-3 stroke-[2.5]" />
            <span className="font-display">Smart Shopping!</span>
          </div>
        </div>

        {/* 4 Feature Cards in a neat 2x2 mobile grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* 1. Edit Items */}
          <div className="p-2.5 rounded-xl bg-white border border-amber-100/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFD21F] to-amber-400 text-amber-950 flex items-center justify-center shadow-xs shrink-0">
              <Edit2 className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Edit Items</h4>
              <p className="text-[10px] text-slate-500 truncate">Name, price, qty</p>
            </div>
          </div>

          {/* 2. Restore Deleted */}
          <div className="p-2.5 rounded-xl bg-white border border-amber-100/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFD21F] to-amber-400 text-amber-950 flex items-center justify-center shadow-xs shrink-0">
              <RotateCcw className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Restore Deleted</h4>
              <p className="text-[10px] text-slate-500 truncate">Recover anytime</p>
            </div>
          </div>

          {/* 3. Local Storage */}
          <div className="p-2.5 rounded-xl bg-white border border-amber-100/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFD21F] to-amber-400 text-amber-950 flex items-center justify-center shadow-xs shrink-0">
              <Database className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Local Storage</h4>
              <p className="text-[10px] text-slate-500 truncate">Safe on device</p>
            </div>
          </div>

          {/* 4. Responsive Design */}
          <div className="p-2.5 rounded-xl bg-white border border-amber-100/80 shadow-xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFD21F] to-amber-400 text-amber-950 flex items-center justify-center shadow-xs shrink-0">
              <Smartphone className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">Phone Format</h4>
              <p className="text-[10px] text-slate-500 truncate">Fast & mobile-ready</p>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] font-medium text-slate-400">
          Priyam Grocery Manager © 2026 · Smart Family Checklist
        </div>
      </div>
    </footer>
  );
};
