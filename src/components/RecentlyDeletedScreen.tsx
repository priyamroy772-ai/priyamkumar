import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryVisual } from './GroceryVisual';
import {
  formatCurrencyINR,
  calculateLineTotal,
  getRelativeTimeString,
} from '../data/initialData';
import {
  RotateCcw,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  Sparkles,
} from 'lucide-react';

export const RecentlyDeletedScreen: React.FC = () => {
  const {
    deletedItems,
    setItemToRestore,
    setItemToDeletePermanent,
    clearAllDeleted,
    restoreItem,
  } = useGrocery();

  const [showClearAllModal, setShowClearAllModal] = useState(false);

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header matching Phone 9 */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
            Recently Deleted
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            {deletedItems.length} {deletedItems.length === 1 ? 'item' : 'items'} in trash
          </p>
        </div>

        {deletedItems.length > 0 && (
          <button
            onClick={() => setShowClearAllModal(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Yellow Notice Banner matching Phone 9 */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200/90 text-amber-950 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-amber-300 text-amber-900 flex items-center justify-center shrink-0 shadow-inner">
          <RotateCcw className="w-5 h-5 stroke-[2.4]" />
        </div>
        <p className="text-xs font-semibold leading-relaxed">
          Items are kept for 7 days. You can restore them anytime back to your active list.
        </p>
      </div>

      {/* Deleted Items List matching Phone 9 */}
      {deletedItems.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Trash2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Trash is empty</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            When you delete an item from your grocery checklist, it is safely preserved here instead of being immediately lost.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {deletedItems.map((item) => {
            const lineTotal = calculateLineTotal(item.quantity, item.price);
            const timeAgo = getRelativeTimeString(item.deletedAt);

            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-amber-100 shadow-sm flex items-center justify-between hover:border-amber-200 transition-all"
              >
                {/* Left: Produce icon & details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <GroceryVisual
                    name={item.name}
                    category={item.category}
                    customImageUrl={item.customImageUrl}
                    size="md"
                    className="w-12 h-12"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.quantity} {item.unit} · {formatCurrencyINR(lineTotal)}
                    </p>
                    <p className="text-[11px] text-amber-700/80 font-semibold mt-0.5">
                      {timeAgo}
                    </p>
                  </div>
                </div>

                {/* Right: Prominent Yellow Restore Button + Trash Icon */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <button
                    onClick={() => setItemToRestore(item)}
                    className="px-3.5 py-1.5 rounded-xl btn-yellow-3d text-amber-950 font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    title={`Restore ${item.name} to grocery list`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => setItemToDeletePermanent(item)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Permanently remove"
                    aria-label="Permanently delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Empty Trash?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will permanently delete all {deletedItems.length} items from trash. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllDeleted();
                  setShowClearAllModal(false);
                }}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
              >
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
