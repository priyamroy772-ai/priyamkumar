import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const PermanentDeleteModal: React.FC = () => {
  const {
    itemToDeletePermanent,
    setItemToDeletePermanent,
    permanentlyDeleteItem,
  } = useGrocery();

  if (!itemToDeletePermanent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden text-center p-6 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={() => setItemToDeletePermanent(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm border border-rose-200">
          <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-display mb-1">
          Delete Permanently?
        </h3>

        <p className="text-xs text-slate-600 my-4 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <strong className="text-slate-900 font-bold">"{itemToDeletePermanent.name}"</strong>? This
          item cannot be recovered once removed.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={() => setItemToDeletePermanent(null)}
            className="py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => permanentlyDeleteItem(itemToDeletePermanent.id)}
            className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
