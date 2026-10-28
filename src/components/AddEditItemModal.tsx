import React, { useState, useEffect } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryCategory, GroceryUnit } from '../types';
import { GroceryVisual } from './GroceryVisual';
import { calculateLineTotal, formatCurrencyINR } from '../data/initialData';
import {
  autoMatchGrocery,
  getCategoryFallbackImage,
  getImageSuggestions,
  ImageSuggestion,
  POPULAR_HINDI_PRESETS,
  GroceryMatchResult,
} from '../utils/groceryAutoMatcher';
import {
  X,
  ArrowLeft,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Mic,
  Wand2,
  RefreshCw,
} from 'lucide-react';

export const AddEditItemModal: React.FC = () => {
  const {
    isAddEditModalOpen,
    closeAddEditModal,
    editingItem,
    addItem,
    updateItem,
    deleteItem,
  } = useGrocery();

  const isEditing = Boolean(editingItem && editingItem.id);

  // Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [unit, setUnit] = useState<GroceryUnit>('kg');
  const [price, setPrice] = useState<number | ''>(40);
  const [category, setCategory] = useState<GroceryCategory>('Vegetables');
  const [notes, setNotes] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [matchedInfo, setMatchedInfo] = useState<GroceryMatchResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Automated Image Suggestions & Prompt State
  const [suggestions, setSuggestions] = useState<ImageSuggestion[]>([]);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  useEffect(() => {
    if (!isAddEditModalOpen) return;

    if (editingItem && editingItem.id) {
      const initialName = editingItem.name || '';
      setName(initialName);
      setQuantity(editingItem.quantity || 1);
      setUnit(editingItem.unit || 'kg');
      setPrice(editingItem.price ?? 0);
      const initialCat = editingItem.category || 'Vegetables';
      setCategory(initialCat);
      setNotes(editingItem.notes || '');

      const match = autoMatchGrocery(initialName);
      setMatchedInfo(match);

      const sugResult = getImageSuggestions(initialName, initialCat);
      setSuggestions(sugResult.suggestions);
      setAiPrompt(sugResult.prompt);

      if (editingItem.customImageUrl) {
        setCustomImageUrl(editingItem.customImageUrl);
      } else {
        setCustomImageUrl(sugResult.primaryImage);
      }
    } else if (editingItem && !editingItem.id && editingItem.category) {
      setName('');
      setQuantity(1);
      setUnit('kg');
      setPrice('');
      const defaultCat = editingItem.category;
      setCategory(defaultCat);
      setNotes('');
      setMatchedInfo(null);
      const sugResult = getImageSuggestions('', defaultCat);
      setSuggestions(sugResult.suggestions);
      setAiPrompt(sugResult.prompt);
      setCustomImageUrl(sugResult.primaryImage);
    } else {
      setName('');
      setQuantity(1);
      setUnit('kg');
      setPrice('');
      setCategory('Vegetables');
      setNotes('');
      setMatchedInfo(null);
      const sugResult = getImageSuggestions('', 'Vegetables');
      setSuggestions(sugResult.suggestions);
      setAiPrompt(sugResult.prompt);
      setCustomImageUrl(sugResult.primaryImage);
    }
    setErrors({});
  }, [editingItem, isAddEditModalOpen]);

  // Handle typing in name input with automated image suggestions & auto-matching for terms like 'sugar', 'milk'
  const handleNameChange = (val: string) => {
    setName(val);
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));

    const trimmed = val.trim();
    const sugResult = getImageSuggestions(trimmed, category);
    setSuggestions(sugResult.suggestions);
    setAiPrompt(sugResult.prompt);

    if (trimmed) {
      const match = autoMatchGrocery(trimmed);
      if (match) {
        setMatchedInfo(match);
        setCustomImageUrl(sugResult.primaryImage);
        setCategory(match.category);
        if (!price || price === 40 || price === 0) {
          setPrice(match.suggestedPrice);
        }
        if (unit === 'kg' && match.defaultUnit) {
          setUnit(match.defaultUnit);
        }
      } else {
        setMatchedInfo(null);
        setCustomImageUrl(sugResult.primaryImage);
      }
    } else {
      setMatchedInfo(null);
      setCustomImageUrl(sugResult.primaryImage);
    }
  };

  const handleCategoryChange = (newCat: GroceryCategory) => {
    setCategory(newCat);
    const sugResult = getImageSuggestions(name.trim(), newCat);
    setSuggestions(sugResult.suggestions);
    setAiPrompt(sugResult.prompt);
    if (!matchedInfo) {
      setCustomImageUrl(sugResult.primaryImage);
    }
  };

  const handleSelectPreset = (preset: typeof POPULAR_HINDI_PRESETS[0]) => {
    handleNameChange(preset.label);
  };

  const handleVoiceInputInModal = () => {
    if (typeof window === 'undefined' || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = 'en-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsVoiceListening(true);
      rec.onresult = (evt: any) => {
        const spoken = evt.results[0][0].transcript;
        if (spoken) {
          handleNameChange(spoken);
        }
        setIsVoiceListening(false);
      };
      rec.onerror = () => setIsVoiceListening(false);
      rec.onend = () => setIsVoiceListening(false);
      rec.start();
    } catch {
      setIsVoiceListening(false);
    }
  };

  if (!isAddEditModalOpen) return null;

  const numQuantity = typeof quantity === 'number' ? quantity : parseFloat(quantity) || 0;
  const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const lineTotal = calculateLineTotal(numQuantity, numPrice);

  const categories: GroceryCategory[] = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Snacks',
    'Grains',
    'Beverages',
    'Household',
    'Others',
  ];

  const units: { value: GroceryUnit; label: string }[] = [
    { value: 'kg', label: 'kg (Kilogram)' },
    { value: 'g', label: 'g (Gram)' },
    { value: 'ltr', label: 'ltr (Litre)' },
    { value: 'ml', label: 'ml (Millilitre)' },
    { value: 'piece', label: 'piece' },
    { value: 'pack', label: 'pack' },
    { value: 'dozen', label: 'dozen' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Please enter an item name';
    }
    if (!numQuantity || numQuantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }
    if (numPrice < 0 || isNaN(numPrice)) {
      newErrors.price = 'Price cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedName = name.trim();
    const match = autoMatchGrocery(trimmedName);
    const resolvedCategory = category || match?.category || 'Vegetables';
    const resolvedImageUrl = customImageUrl || match?.imageUrl || getCategoryFallbackImage(resolvedCategory);

    if (isEditing && editingItem) {
      updateItem(editingItem.id, {
        name: trimmedName,
        quantity: numQuantity,
        unit,
        price: numPrice,
        category: resolvedCategory,
        notes: notes.trim(),
        customImageUrl: resolvedImageUrl,
      });
    } else {
      addItem({
        name: trimmedName,
        quantity: numQuantity,
        unit,
        price: numPrice,
        category: resolvedCategory,
        notes: notes.trim(),
        customImageUrl: resolvedImageUrl,
      });
    }
  };

  const handleDeleteFromEdit = () => {
    if (isEditing && editingItem) {
      deleteItem(editingItem.id);
      closeAddEditModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between bg-[#FFFEF8]">
          <button
            type="button"
            onClick={closeAddEditModal}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:bg-amber-100/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Cancel and close"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">
            {isEditing ? 'Edit Item' : 'Add Item'}
          </h2>

          {isEditing ? (
            <button
              type="button"
              onClick={handleDeleteFromEdit}
              className="w-9 h-9 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
              title="Delete this item"
              aria-label="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={closeAddEditModal}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-slate-800">
          {/* Main Visual Display Card with live preview */}
          <div className="flex flex-col items-center justify-center py-1">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 flex items-center justify-center p-1 shadow-inner overflow-hidden">
                <GroceryVisual
                  name={name || category}
                  category={category}
                  customImageUrl={customImageUrl}
                  size="xl"
                  className="w-22 h-22 rounded-xl"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md border-2 border-white"
                title="Automatic Image Suggestion Active"
              >
                <Sparkles className="w-4 h-4 text-amber-950" />
              </div>
            </div>

            {/* Auto Match Notification Banner */}
            {matchedInfo ? (
              <div className="mt-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-xs animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Auto Image Set: <strong>{matchedInfo.hindiName}</strong></span>
              </div>
            ) : name.trim() ? (
              <div className="mt-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-1.5 shadow-xs">
                <ImageIcon className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Auto-suggested image set for {name}</span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 mt-1.5">
                Type grocery name (e.g. sugar, milk, bread) to auto-set image
              </span>
            )}

            {/* Automated Image Suggestions Carousel & AI Prompt Tool */}
            {suggestions.length > 0 && (
              <div className="w-full mt-3 pt-2.5 border-t border-amber-100">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Suggested Images ({suggestions.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPromptDetails(!showPromptDetails)}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showPromptDetails ? 'Hide AI Prompt' : 'View AI Prompt'}</span>
                  </button>
                </div>

                {/* AI Prompt Viewer Box */}
                {showPromptDetails && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/80 text-left mb-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold uppercase text-amber-900 tracking-wider">
                        Image Generation Prompt:
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-md">
                        Prompt Ready
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-700 font-mono leading-relaxed bg-white/90 p-2 rounded-lg border border-amber-200/50 shadow-inner">
                      "{aiPrompt}"
                    </p>
                  </div>
                )}

                {/* Horizontal Suggestion Cards */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {suggestions.map((sug) => {
                    const isSelected = customImageUrl === sug.imageUrl;
                    return (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => setCustomImageUrl(sug.imageUrl)}
                        className={`relative group shrink-0 flex flex-col items-center rounded-xl p-1 border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-300 scale-102'
                            : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
                        }`}
                        title={sug.label}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 relative">
                          <img
                            src={sug.imageUrl}
                            alt={sug.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-[9px] font-bold mt-1 max-w-[62px] truncate ${
                            isSelected ? 'text-amber-950 font-black' : 'text-slate-600'
                          }`}
                        >
                          {sug.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Item Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                Auto Image Suggestion On
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. sugar, milk, bread, tomato, oil, चाय..."
                className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-amber-400 focus:ring-amber-200'
                } text-sm font-medium focus:outline-none focus:ring-2 bg-white text-slate-900 shadow-sm transition-all`}
                autoFocus={!isEditing}
              />
              <button
                type="button"
                onClick={handleVoiceInputInModal}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all cursor-pointer ${
                  isVoiceListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-amber-800 hover:bg-amber-100/80 active:scale-95'
                }`}
                title={isVoiceListening ? 'Listening...' : 'Speak item name (बोलकर लिखें)'}
                aria-label="Speak item name"
              >
                <Mic className="w-4 h-4 stroke-[2.4]" />
              </button>
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}

            {/* Quick Auto-Match Preset Chips */}
            <div className="mt-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quick 1-Tap Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
                {POPULAR_HINDI_PRESETS.slice(0, 8).map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/70 active:scale-95 transition-all cursor-pointer shadow-xs"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Unit Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                  setQuantity(val as any);
                  if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.quantity
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-amber-400 focus:ring-amber-200'
                } text-sm font-semibold focus:outline-none focus:ring-2 bg-white text-slate-900 shadow-sm transition-all`}
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as GroceryUnit)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-amber-200 text-sm font-medium focus:outline-none focus:ring-2 bg-white text-slate-900 shadow-sm transition-all"
              >
                {units.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price per unit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Price (₹ per {unit}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={price}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                  setPrice(val as any);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                }}
                placeholder="0"
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border ${
                  errors.price
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-amber-400 focus:ring-amber-200'
                } text-sm font-semibold focus:outline-none focus:ring-2 bg-white text-slate-900 shadow-sm transition-all`}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as GroceryCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-amber-200 text-sm font-medium focus:outline-none focus:ring-2 bg-white text-slate-900 shadow-sm transition-all"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Brand preference, organic, ripe"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-amber-200 text-xs font-normal focus:outline-none focus:ring-2 bg-white text-slate-900 shadow-sm transition-all"
            />
          </div>

          {/* Line Total preview */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-950">
              Estimated Line Total:
            </span>
            <span className="text-base font-extrabold text-amber-950 tabular-nums font-display">
              {formatCurrencyINR(lineTotal)}
            </span>
          </div>

          {/* Buttons: Cancel and Update / Save */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={closeAddEditModal}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-yellow-3d text-amber-950 font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isEditing ? 'Update' : 'Save Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
