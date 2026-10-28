import React, { useState, useMemo } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { PurchaseRecord } from '../types';
import { formatCurrencyINR } from '../data/initialData';
import { PriceTrendAnalysis } from './PriceTrendAnalysis';
import {
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  RotateCcw,
  Receipt,
  TrendingUp,
} from 'lucide-react';

export const PurchaseHistoryScreen: React.FC = () => {
  const {
    purchaseHistory,
    addBackToGroceryList,
    clearPurchaseHistory,
  } = useGrocery();

  const [activeTab, setActiveTab] = useState<'trends' | 'receipts'>('trends');
  const [dateFilter, setDateFilter] = useState<'all' | 'this_month' | 'last_3_months'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter purchases based on date
  const filteredHistory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return purchaseHistory.filter((rec) => {
      if (dateFilter === 'all') return true;

      const recDate = new Date(rec.purchaseDate);
      if (dateFilter === 'this_month') {
        return (
          recDate.getMonth() === currentMonth &&
          recDate.getFullYear() === currentYear
        );
      }

      if (dateFilter === 'last_3_months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return recDate >= threeMonthsAgo;
      }

      return true;
    });
  }, [purchaseHistory, dateFilter]);

  // Total historical spent
  const totalHistorySpend = useMemo(() => {
    return filteredHistory.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }, [filteredHistory]);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2">
            <span>Purchase History</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            {filteredHistory.length} recorded {filteredHistory.length === 1 ? 'receipt' : 'receipts'} · Total {formatCurrencyINR(totalHistorySpend)}
          </p>
        </div>

        {purchaseHistory.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Screen Sub-Tabs: Price Trends Analysis vs All Receipts */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-amber-100/60 border border-amber-200/70 text-xs font-bold shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('trends')}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-white text-amber-950 shadow-sm font-black'
              : 'text-amber-900/70 hover:text-amber-950'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
          <span>Price Trends</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts')}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'receipts'
              ? 'bg-white text-amber-950 shadow-sm font-black'
              : 'text-amber-900/70 hover:text-amber-950'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
          <span>Receipts ({filteredHistory.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'trends' ? (
        <div className="space-y-4">
          {/* Recharts Price Trend Analysis Component */}
          <PriceTrendAnalysis purchaseHistory={purchaseHistory} />

          {/* Quick Recent Transactions Preview right below the chart */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-600" />
                <span>Recent Transactions</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('receipts')}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {purchaseHistory.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-2xl bg-white border border-amber-100 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {rec.itemName}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {rec.formattedDate}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-slate-900 tabular-nums font-display">
                    {formatCurrencyINR(rec.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Date Filter Chips matching Phone 8 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-[#FFD21F] text-amber-950 shadow-sm border border-amber-400 font-black'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDateFilter('this_month')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                dateFilter === 'this_month'
                  ? 'bg-[#FFD21F] text-amber-950 shadow-sm border border-amber-400 font-black'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateFilter('last_3_months')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                dateFilter === 'last_3_months'
                  ? 'bg-[#FFD21F] text-amber-950 shadow-sm border border-amber-400 font-black'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Last 3 Months
            </button>
          </div>

          {/* History Records matching Phone 8 */}
          {filteredHistory.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-dashed border-amber-200 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No purchases found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Items marked as purchased in your grocery list will appear here in chronological order.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-white border border-amber-100/90 shadow-sm flex items-center justify-between hover:border-amber-200 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-slate-400">
                        {rec.formattedDate}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {rec.itemName}
                      </h4>
                      {rec.itemsSummary && (
                        <p className="text-[11px] text-slate-500 truncate">
                          {rec.itemsSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-base font-black text-slate-900 tabular-nums font-display">
                      {formatCurrencyINR(rec.totalPrice)}
                    </span>

                    <button
                      onClick={() => addBackToGroceryList(rec)}
                      className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center transition-colors cursor-pointer"
                      title="Add this item back to your active grocery checklist"
                      aria-label="Add back to grocery list"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-rose-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Clear Purchase History?</h3>
            <p className="text-xs text-slate-500">
              This will remove all historical purchase receipts. Your active grocery list will remain intact.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearPurchaseHistory();
                  setShowClearConfirm(false);
                }}
                className="py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
