import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryVisual } from './GroceryVisual';
import { formatCurrencyINR, calculateLineTotal } from '../data/initialData';
import { RotateCcw, X } from 'lucide-react';

export const RestoreModal: React.FC = () => {
  const { itemToRestore, setItemToRestore, restoreItem } = useGrocery();

  if (!itemToRestore) return null;

  const total = calculateLineTotal(itemToRestore.quantity, itemToRestore.price);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={() => setItemToRestore(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Green Recycle Icon Badge */}
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
          <RotateCcw className="w-7 h-7 stroke-[2.4]" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-display mb-1">
          Restore Item
        </h3>

        {/* Item Card Representation */}
        <div className="my-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3.5 text-left">
          <GroceryVisual
            name={itemToRestore.name}
            category={itemToRestore.category}
            size="lg"
            className="w-14 h-14"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900 truncate">
              {itemToRestore.name}
            </h4>
            <div className="text-xs text-slate-500 font-medium">
              {itemToRestore.quantity} {itemToRestore.unit} · {formatCurrencyINR(total)}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
              Category: {itemToRestore.category}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-6 font-medium">
          Do you want to restore this item to your grocery list?
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setItemToRestore(null)}
            className="py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => restoreItem(itemToRestore.id)}
            className="py-3 rounded-xl btn-yellow-3d text-amber-950 font-extrabold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore</span>
          </button>
        </div>
      </div>
    </div>
  );
};
