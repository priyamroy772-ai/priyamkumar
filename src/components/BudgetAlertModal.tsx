import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { formatCurrencyINR } from '../data/initialData';
import {
  AlertTriangle,
  X,
  Edit2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react';

export const BudgetAlertModal: React.FC = () => {
  const {
    isBudgetAlertModalOpen,
    setIsBudgetAlertModalOpen,
    settings,
    spentTotal,
    remainingBudget,
    isOverBudget,
    rawBudgetUsedPercent,
    setIsBudgetModalOpen,
    setActiveTab,
    expensesByCategory,
  } = useGrocery();

  if (!isBudgetAlertModalOpen) return null;

  const overAmount = Math.abs(remainingBudget);
  const highestCategory = expensesByCategory.length > 0 ? expensesByCategory[0] : null;

  const handleEditBudget = () => {
    setIsBudgetAlertModalOpen(false);
    setIsBudgetModalOpen(true);
  };

  const handleReviewPurchases = () => {
    setIsBudgetAlertModalOpen(false);
    setActiveTab('reports');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm rounded-[28px] bg-white shadow-2xl border border-rose-100 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-alert-title"
      >
        {/* Top Warning Banner with Pulsing Icon */}
        <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 p-5 text-white relative overflow-hidden">
          {/* Subtle background glow circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-rose-900/40 blur-xl pointer-events-none" />

          {/* Close X Button */}
          <button
            type="button"
            onClick={() => setIsBudgetAlertModalOpen(false)}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Alert"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-lg shrink-0 animate-pulse">
              <ShieldAlert className="w-7 h-7 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Limit Exceeded
                </span>
                <span className="text-xs font-bold text-rose-100 tabular-nums">
                  {rawBudgetUsedPercent}% Consumed
                </span>
              </div>
              <h3
                id="budget-alert-title"
                className="text-lg font-black tracking-tight font-display text-white mt-0.5"
              >
                Budget Alert!
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
            You have exceeded your monthly grocery budget limit of{' '}
            <strong className="text-slate-900 font-extrabold">
              {formatCurrencyINR(settings.monthlyBudget)}
            </strong>{' '}
            by{' '}
            <strong className="text-rose-600 font-extrabold">
              {formatCurrencyINR(overAmount)}
            </strong>
            .
          </p>

          {/* 3 Metric Comparison Badges */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                Target
              </span>
              <span className="text-xs font-extrabold text-slate-800 tabular-nums mt-0.5 block">
                {formatCurrencyINR(settings.monthlyBudget)}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                Spent
              </span>
              <span className="text-xs font-extrabold text-slate-900 tabular-nums mt-0.5 block">
                {formatCurrencyINR(spentTotal)}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">
                Over By
              </span>
              <span className="text-xs font-extrabold text-rose-600 tabular-nums mt-0.5 block">
                +{formatCurrencyINR(overAmount)}
              </span>
            </div>
          </div>

          {/* Top category expenditure insight if available */}
          {highestCategory && highestCategory.amount > 0 && (
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold text-amber-950">
                  Highest: {highestCategory.category}
                </span>
              </div>
              <span className="text-xs font-extrabold text-amber-900 tabular-nums">
                {formatCurrencyINR(highestCategory.amount)} ({highestCategory.percentage}%)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleEditBudget}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-[#FFD21F] text-amber-950 font-black text-xs shadow-md shadow-amber-300/40 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Increase Monthly Budget</span>
            </button>

            <button
              type="button"
              onClick={handleReviewPurchases}
              className="w-full py-2 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
              <span>Review Expense Trends</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() => setIsBudgetAlertModalOpen(false)}
              className="w-full py-1.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Dismiss for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
