import React, { useMemo, useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryCategory, GroceryItem } from '../types';
import { GroceryVisual } from './GroceryVisual';
import { SwipeableGroceryItem } from './SwipeableGroceryItem';
import { formatCurrencyINR, calculateLineTotal } from '../data/initialData';
import {
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  X,
  ShoppingBag,
  SlidersHorizontal,
  Camera,
} from 'lucide-react';

export const GroceryListScreen: React.FC = () => {
  const {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    openAddModal,
    openEditModal,
    openQuickAddModal,
    deleteItem,
    togglePurchased,
  } = useGrocery();

  const filterCategories = [
    'All',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Snacks',
    'Grains',
    'Beverages',
    'Household',
    'Others',
  ];

  // Item counts per category for badge indicators
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: items.length };
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.notes && item.notes.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategoryFilter, searchQuery]);

  return (
    <div className="space-y-3.5 pb-20 relative">
      {/* Title & Search Bar matching Phone 4 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
              My Grocery List
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}{' '}
              {selectedCategoryFilter !== 'All' ? `in ${selectedCategoryFilter}` : 'total'}
            </p>
          </div>
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Search & Quick Add Camera Toolbar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or filter items..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-200 focus:border-amber-400 focus:ring-amber-200 text-sm font-medium focus:outline-none focus:ring-2 shadow-sm text-slate-900 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Add with Camera & Receipt Parsing Button */}
          <button
            type="button"
            onClick={openQuickAddModal}
            className="h-10 px-3.5 sm:px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-[#FFD21F] to-[#F5AE00] hover:brightness-105 active:scale-95 text-slate-950 flex items-center gap-1.5 shadow-sm border border-amber-300 font-extrabold text-xs shrink-0 cursor-pointer transition-all group"
            title="Quick Add with Camera or Receipt Scan"
            aria-label="Quick Add with Camera"
          >
            <div className="w-6 h-6 rounded-full bg-slate-950 text-[#FFD21F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-display font-extrabold text-xs">Quick Add</span>
          </button>
        </div>

        {/* Category Filter Chips Carousel with Green Gradient Wave & Shimmer */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
          {filterCategories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`relative group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'chip-green-active scale-105'
                    : 'chip-green-inactive'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold transition-colors ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grocery Items List matching Phone 4 */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-dashed border-amber-200 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No items found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {searchQuery
              ? `No grocery items match "${searchQuery}". Try a different keyword.`
              : `No items in ${selectedCategoryFilter}. Tap the + button to add one!`}
          </p>
          <button
            onClick={() => openAddModal(selectedCategoryFilter !== 'All' ? (selectedCategoryFilter as GroceryCategory) : undefined)}
            className="px-4 py-2 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add to {selectedCategoryFilter !== 'All' ? selectedCategoryFilter : 'List'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Subtle Mobile Gesture Hint */}
          <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-slate-400">
            <span>Swipe left to delete</span>
            <span>Tap circle for haptic feedback</span>
          </div>

          <div className="space-y-2.5">
            {filteredItems.map((item) => (
              <SwipeableGroceryItem
                key={item.id}
                item={item}
                onEdit={openEditModal}
                onDelete={deleteItem}
                onTogglePurchased={togglePurchased}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) matching Phone 4 */}
      <button
        onClick={() => openAddModal()}
        className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full btn-yellow-3d text-amber-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-amber-300"
        title="Add New Grocery Item"
        aria-label="Add New Grocery Item"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </button>
    </div>
  );
};
