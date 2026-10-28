import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryVisual } from './GroceryVisual';
import { formatCurrencyINR } from '../data/initialData';
import {
  Edit2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const BudgetScreen: React.FC = () => {
  const {
    settings,
    spentTotal,
    remainingBudget,
    budgetUsedPercent,
    rawBudgetUsedPercent,
    isOverBudget,
    expensesByCategory,
    setIsBudgetModalOpen,
    openBudgetAlert,
  } = useGrocery();

  // Helper function to calculate smooth color theme from yellow to red based on percentage consumed
  const getProgressTheme = (percent: number) => {
    if (percent >= 100) {
      return {
        fillGradient: 'from-rose-500 via-red-600 to-red-700 animate-pulse',
        glow: 'shadow-[0_0_16px_rgba(220,38,38,0.75)]',
        statusLabel: 'Limit Exceeded!',
        statusBadgeBg: 'bg-red-500 text-white border-red-600',
        textColor: 'text-red-700',
        icon: Flame,
      };
    }
    if (percent >= 85) {
      return {
        fillGradient: 'from-orange-500 via-rose-500 to-red-600',
        glow: 'shadow-[0_0_14px_rgba(239,68,68,0.6)]',
        statusLabel: 'High Alert (Near Limit)',
        statusBadgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        textColor: 'text-rose-700',
        icon: AlertTriangle,
      };
    }
    if (percent >= 60) {
      return {
        fillGradient: 'from-amber-400 via-orange-400 to-orange-500',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.5)]',
        statusLabel: 'Moderate Consumption',
        statusBadgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
        textColor: 'text-orange-800',
        icon: TrendingUp,
      };
    }
    if (percent >= 30) {
      return {
        fillGradient: 'from-yellow-400 via-amber-400 to-amber-500',
        glow: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]',
        statusLabel: 'Steady Spending',
        statusBadgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        textColor: 'text-amber-800',
        icon: Sparkles,
      };
    }
    return {
      fillGradient: 'from-yellow-300 via-yellow-400 to-amber-400',
      glow: 'shadow-[0_0_10px_rgba(250,204,21,0.4)]',
      statusLabel: 'On Track & Healthy',
      statusBadgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      textColor: 'text-yellow-900',
      icon: CheckCircle,
    };
  };

  const theme = getProgressTheme(rawBudgetUsedPercent);
  const StatusIcon = theme.icon;

  return (
    <div className="space-y-3.5 pb-20">
      {/* Title */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
            Budget & Expenses
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Track spending against your monthly grocery budget
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOverBudget && (
            <button
              type="button"
              onClick={openBudgetAlert}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer animate-pulse"
              title="View Budget Alert"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Alert</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Budget</span>
          </button>
        </div>
      </div>

      {/* Main Budget Card with Visual Yellow-to-Red Progress Bar */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-[#FFE878] via-[#FFD21F] to-[#F5B800] text-amber-950 shadow-lg shadow-amber-500/20 border border-amber-300 relative overflow-hidden">
        {/* Monthly Budget Top */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
          <div>
            <span className="text-xs font-bold text-amber-900/80 uppercase tracking-wide">
              Monthly Budget
            </span>
            <div className="text-3xl font-black text-amber-950 font-display mt-0.5 tabular-nums">
              {formatCurrencyINR(settings.monthlyBudget)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="w-10 h-10 rounded-2xl bg-white/70 hover:bg-white text-amber-900 flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Edit monthly budget"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Spent & Remaining Row */}
        <div className="grid grid-cols-2 gap-4 py-3.5">
          <div>
            <span className="text-[11px] font-bold text-amber-900/80 uppercase tracking-wide">
              Spent
            </span>
            <div className="text-2xl font-black text-amber-950 font-display mt-0.5 tabular-nums">
              {formatCurrencyINR(spentTotal)}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-amber-900/80 uppercase tracking-wide">
              Remaining
            </span>
            <div
              className={`text-2xl font-black font-display mt-0.5 tabular-nums ${
                isOverBudget ? 'text-rose-900' : 'text-amber-950'
              }`}
            >
              {formatCurrencyINR(remainingBudget)}
            </div>
          </div>
        </div>

        {/* Dynamic Visual Progress Bar Section (Yellow to Red based on % consumed) */}
        <div className="space-y-2 pt-2 border-t border-amber-900/10">
          {/* Status Label & Consumed % */}
          <div className="flex items-center justify-between text-xs font-extrabold text-amber-950">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${theme.statusBadgeBg}`}
              >
                <StatusIcon className="w-3 h-3 stroke-[2.5]" />
                <span>{theme.statusLabel}</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-amber-900/80">Consumed:</span>
              <span className="text-sm font-black text-amber-950 tabular-nums">
                {rawBudgetUsedPercent}%
              </span>
            </div>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="relative w-full h-4.5 bg-black/15 rounded-full p-0.5 overflow-hidden shadow-inner cursor-pointer"
               onClick={() => {
                 if (isOverBudget) openBudgetAlert();
               }}
               title={isOverBudget ? 'Budget limit exceeded! Click to view alert.' : `${rawBudgetUsedPercent}% consumed`}
          >
            {/* Background subtle milestone lines */}
            <div className="absolute inset-0 flex justify-between px-3 pointer-events-none z-10 opacity-30">
              <div className="w-px h-full bg-white" />
              <div className="w-px h-full bg-white" />
              <div className="w-px h-full bg-white" />
            </div>

            {/* Filled Progress Bar with Dynamic Yellow-to-Red Gradient */}
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${theme.fillGradient} ${theme.glow} relative`}
              style={{ width: `${Math.min(100, Math.max(3, rawBudgetUsedPercent))}%` }}
            >
              {/* Glossy highlight stripe on the bar */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent rounded-full" />
            </div>
          </div>

          {/* Milestones beneath progress bar */}
          <div className="flex items-center justify-between text-[10px] font-bold text-amber-900/70 px-0.5">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span className={rawBudgetUsedPercent >= 100 ? 'text-red-900 font-black' : ''}>
              100% Limit
            </span>
          </div>

          {/* Remaining / Exceeded Helper Note */}
          <div className="flex items-center justify-between text-xs font-bold text-amber-950 pt-0.5">
            <span>
              {isOverBudget ? (
                <span className="text-rose-950 font-black flex items-center gap-1">
                  <span>🚨 Exceeded by {formatCurrencyINR(Math.abs(remainingBudget))}</span>
                </span>
              ) : (
                <span>{formatCurrencyINR(remainingBudget)} left to spend</span>
              )}
            </span>

            {isOverBudget && (
              <button
                type="button"
                onClick={openBudgetAlert}
                className="text-[11px] font-black text-rose-950 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Alert</span>
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prominent Over-Budget Alert Card if limit exceeded */}
      {isOverBudget && (
        <div
          onClick={openBudgetAlert}
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-300 shadow-sm text-rose-900 flex items-center justify-between gap-3 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
          role="alert"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-md">
                  Budget Alert
                </span>
                <span className="text-xs font-bold text-rose-700">
                  {rawBudgetUsedPercent}% of limit
                </span>
              </div>
              <p className="text-xs font-semibold text-rose-950 mt-1 leading-snug">
                You have exceeded your monthly limit by{' '}
                <strong className="font-extrabold text-red-700">
                  {formatCurrencyINR(Math.abs(remainingBudget))}
                </strong>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-rose-800 shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span className="hidden xxs:inline">Details</span>
            <ChevronRight className="w-4 h-4 stroke-[2.8]" />
          </div>
        </div>
      )}

      {/* Expenses by Category */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 tracking-tight px-1">
          Expenses by Category
        </h3>

        {expensesByCategory.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center">
            <p className="text-xs font-medium text-slate-500">
              No purchase expenses recorded yet. Mark items as purchased to track your category spending.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {expensesByCategory.map((item) => (
              <div
                key={item.category}
                className="p-3.5 rounded-2xl bg-white border border-amber-100 shadow-sm flex flex-col gap-2 hover:border-amber-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GroceryVisual
                      category={item.category}
                      name={item.category}
                      size="sm"
                      className="w-9 h-9"
                    />
                    <span className="text-sm font-bold text-slate-900">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className="text-sm font-black text-slate-900 tabular-nums">
                      {formatCurrencyINR(item.amount)}
                    </span>
                    <span className="text-xs font-bold text-amber-800 tabular-nums bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 min-w-[42px] text-center">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Micro progress bar for each category */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FFD21F] rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
