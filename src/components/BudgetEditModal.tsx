import React, { useState, useEffect } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { formatCurrencyINR } from '../data/initialData';
import { Wallet, X, Check } from 'lucide-react';

export const BudgetEditModal: React.FC = () => {
  const { isBudgetModalOpen, setIsBudgetModalOpen, settings, updateMonthlyBudget } = useGrocery();
  const [budgetVal, setBudgetVal] = useState<number | ''>(settings.monthlyBudget);

  useEffect(() => {
    setBudgetVal(settings.monthlyBudget);
  }, [settings.monthlyBudget, isBudgetModalOpen]);

  if (!isBudgetModalOpen) return null;

  const presets = [3000, 5000, 8000, 10000, 15000];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = typeof budgetVal === 'number' ? budgetVal : parseFloat(budgetVal) || 0;
    updateMonthlyBudget(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden p-6 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={() => setIsBudgetModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
          <Wallet className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-center text-slate-900 tracking-tight font-display mb-1">
          Set Monthly Budget
        </h3>
        <p className="text-xs text-center text-slate-500 mb-5">
          Track expenses and monitor remaining grocery funds
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="100"
              value={budgetVal}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                setBudgetVal(val as any);
              }}
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-400 focus:ring-amber-200 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 tabular-nums shadow-inner"
              placeholder="5000"
              autoFocus
            />
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {presets.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setBudgetVal(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  budgetVal === preset
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {formatCurrencyINR(preset)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl btn-yellow-3d text-amber-950 font-bold text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
