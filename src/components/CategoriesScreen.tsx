import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryCategory } from '../types';
import { GroceryVisual } from './GroceryVisual';
import { CATEGORIES_CONFIG, formatCurrencyINR, calculateLineTotal } from '../data/initialData';
import { autoMatchGrocery, POPULAR_HINDI_PRESETS } from '../utils/groceryAutoMatcher';
import { ChevronRight, Plus, Search, Sparkles, Check } from 'lucide-react';

export const CategoriesScreen: React.FC = () => {
  const {
    items,
    setActiveTab,
    setSelectedCategoryFilter,
    openAddModal,
  } = useGrocery();

  const [query, setQuery] = useState('');
  const matchedItem = query.trim() ? autoMatchGrocery(query) : null;

  // Calculate statistics per category
  const categoryStats = CATEGORIES_CONFIG.map((cat) => {
    const categoryItems = items.filter((i) => i.category === cat.name);
    const activeCount = categoryItems.length;
    const purchasedItems = categoryItems.filter((i) => i.purchased);
    const spentTotal = purchasedItems.reduce(
      (sum, item) => sum + calculateLineTotal(item.quantity, item.price),
      0
    );

    return {
      ...cat,
      activeCount,
      spentTotal,
    };
  });

  const handleSelectCategory = (catName: GroceryCategory) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('list');
  };

  return (
    <div className="space-y-3.5 pb-20">
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
            Categories
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Browse, search & auto-add items with photos
          </p>
        </div>
        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Item</span>
        </button>
      </div>

      {/* Smart Auto Image & Category Search Bar */}
      <div className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any item (e.g. चीनी, दूध, आटा, tea)..."
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 focus:outline-none bg-[#FFFEF8] text-slate-800"
          />
        </div>

        {/* Matched Result Card */}
        {matchedItem ? (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5 min-w-0">
              <GroceryVisual
                name={matchedItem.englishName}
                category={matchedItem.category}
                customImageUrl={matchedItem.imageUrl}
                size="sm"
                className="w-10 h-10 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-emerald-950 truncate">
                    {matchedItem.hindiName}
                  </h4>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {matchedItem.category}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-700">
                  Photo & category attached automatically!
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                openAddModal({
                  name: matchedItem.englishName,
                  category: matchedItem.category,
                  price: matchedItem.suggestedPrice,
                  unit: matchedItem.defaultUnit,
                  customImageUrl: matchedItem.imageUrl,
                })
              }
              className="px-3 py-1 text-xs font-extrabold rounded-lg btn-yellow-3d text-amber-950 shadow-xs shrink-0 cursor-pointer"
            >
              + Add
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Auto-add:
            </span>
            {POPULAR_HINDI_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.label}
                onClick={() => setQuery(preset.name)}
                className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/60 shrink-0 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Category Cards matching Phone 6 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {categoryStats.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleSelectCategory(cat.name)}
            className="p-4 rounded-3xl bg-white border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group relative overflow-hidden"
          >
            {/* 3D Illustration */}
            <div className="w-20 h-20 mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GroceryVisual
                category={cat.name}
                name={cat.name}
                size="lg"
                className="w-16 h-16"
              />
            </div>

            {/* Name */}
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              {cat.name}
            </h3>

            {/* Metadata */}
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{cat.activeCount} {cat.activeCount === 1 ? 'item' : 'items'}</span>
              {cat.spentTotal > 0 && (
                <>
                  <span>·</span>
                  <span className="text-amber-800 font-bold">
                    {formatCurrencyINR(cat.spentTotal)}
                  </span>
                </>
              )}
            </div>

            {/* Subtle View action prompt */}
            <div className="mt-2.5 text-[11px] font-bold text-amber-700/80 group-hover:text-amber-900 flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>View items</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
