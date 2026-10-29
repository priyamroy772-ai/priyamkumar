import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  RotateCw,
  Heart,
  Share2,
  Calendar,
  BookmarkCheck,
} from 'lucide-react';

export interface ShoppingTip {
  id: number;
  category: 'Budget Saver' | 'Freshness & Storage' | 'Smart Buying' | 'Zero Waste';
  title: string;
  tip: string;
  actionItem: string;
  badgeColor: string;
  icon: string;
}

export const SHOPPING_TIPS: ShoppingTip[] = [
  {
    id: 1,
    category: 'Budget Saver',
    icon: '💰',
    title: 'Never Shop on an Empty Stomach',
    tip: 'Shopping hungry activates impulse reward centers in the brain, causing shoppers to buy up to 30% more high-calorie snacks and unplanned packaged foods.',
    actionItem: 'Have a fruit, water, or small snack before leaving for the market.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 2,
    category: 'Freshness & Storage',
    icon: '🧅',
    title: 'Keep Onions & Potatoes in Separate Baskets',
    tip: 'Onions release ethylene gas and moisture which triggers early sprouting and rot in nearby potatoes. Store both in dry, well-ventilated, separate dark corners.',
    actionItem: 'Use two separate wire or wicker baskets at least 3 feet apart.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 3,
    category: 'Budget Saver',
    icon: '🔍',
    title: 'Scan the Bottom and Top Shelves First',
    tip: 'Supermarkets pay premium slotting fees to place expensive brands at direct eye level. Cheaper staples, local mill flours, and bulk packs are almost always placed on the lowest shelves.',
    actionItem: 'Look down before reaching out — you can save ₹40–₹80 per staple item.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 4,
    category: 'Freshness & Storage',
    icon: '🌿',
    title: 'Water Jar Trick for Coriander & Mint',
    tip: 'Do not store fresh herbs in tight plastic bags where moisture turns them slimy. Trim 1/2 inch off stems and stand them upright in a jar with 1 inch of fresh water covered loosely with a clean cloth or bag.',
    actionItem: 'Keep stems in water in the fridge door; fresh for up to 18 days.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 5,
    category: 'Smart Buying',
    icon: '📅',
    title: 'Buy Seasonal Produce for 40% Savings',
    tip: 'Off-season fruits and veggies travel long cold-chains, driving up transport costs while losing flavour and vitamin content. Seasonal produce is abundant, sweet, and priced significantly lower.',
    actionItem: 'Prioritize in-season greens, gourds, and fruits for peak nutrition and savings.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 6,
    category: 'Zero Waste',
    icon: '🍌',
    title: 'Freeze Overripe Bananas for Smoothies',
    tip: 'Never discard brown bananas! Peel and chop them into 1-inch discs, then freeze them inside an airtight box or pouch. They blend directly into rich natural smoothies without needing added sugar.',
    actionItem: 'Peel and freeze spotted bananas immediately for weekend pancakes or shakes.',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    id: 7,
    category: 'Budget Saver',
    icon: '⚖️',
    title: 'Compare Unit Price (₹/kg), Not Box Price',
    tip: 'Snack and cereal manufacturers frequently shrink package sizes (shrinkflation) while keeping box price constant. Always check the per 100g or per kg rate printed on the back.',
    actionItem: 'Divide price by weight to see if the "Family Saver Pack" is genuinely cheaper.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 8,
    category: 'Freshness & Storage',
    icon: '🍅',
    title: 'Store Ripe Tomatoes Stem-Down on the Counter',
    tip: 'Refrigerating fresh tomatoes halts chemical ripening and degrades their texture into a mealy consistency. Keep ripe tomatoes at room temperature with the stem scar facing downward.',
    actionItem: 'Keeps tomatoes firm, juicy, and aromatic for 5–7 days without chilling.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 9,
    category: 'Smart Buying',
    icon: '🧾',
    title: 'Audit Your Bill Before Leaving the Counter',
    tip: 'Scanner and price tag mismatch rates in large grocery stores average 2–4%. Cashiers occasionally double-scan barcode items or miss store discount stickers.',
    actionItem: 'Take 20 seconds at the packing table to glance over totals and item counts.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 10,
    category: 'Zero Waste',
    icon: '🥬',
    title: 'Ice Bath Revival for Wilted Greens',
    tip: 'Limp spinach, coriander, or celery are merely dehydrated, not spoiled. Submerge them completely in a bowl of ice water with a few ice cubes for 15 minutes to restore crisp cellular turgor.',
    actionItem: 'Drain in a colander and they will be crisp as newly harvested greens.',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    id: 11,
    category: 'Budget Saver',
    icon: '🛒',
    title: 'Check Your Pantry Checklist Before Stepping Out',
    tip: 'Duplicate buying of pulses, mustard oil, and spice boxes accounts for over ₹1,200/month in idle pantry stock that expires before being opened.',
    actionItem: 'Glance at your Priyam checklist to verify what is actually needed.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 12,
    category: 'Freshness & Storage',
    icon: '🧻',
    title: 'Paper Towel in Salad & Greens Containers',
    tip: 'Condensation inside plastic boxes accelerates decay and turns leafy greens dark and soggy. Placing one folded dry paper towel inside absorbs residual humidity.',
    actionItem: 'Replace the paper towel every 3 days; your greens will stay fresh for 10+ days.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 13,
    category: 'Smart Buying',
    icon: '🌙',
    title: 'Evening Sabzi Mandi Bargains',
    tip: 'Local vegetable vendors and mandi sellers discount remaining fresh stocks in the evening (after 7 PM) to avoid overnight spoilage and transport costs.',
    actionItem: 'Shop evening mandis for great deals on tomatoes, carrots, and gourds.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 14,
    category: 'Zero Waste',
    icon: '🍲',
    title: 'Save Clean Vegetable Trimmings for Stock',
    tip: 'Clean ends of carrots, bottle gourd peels, celery bases, and coriander roots pack concentrated flavor and potassium. Collect them in a freezer bag throughout the week.',
    actionItem: 'Boil with water, black pepper, and ginger for 25 mins for delicious soup base.',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    id: 15,
    category: 'Budget Saver',
    icon: '🏷️',
    title: 'Switch to Quality Store-Brand Staples',
    tip: 'Basic pantry staples like iodized salt, brown sugar, cumin seeds, and wheat flour are manufactured in identical mills to premium branded equivalents at 25% lower prices.',
    actionItem: 'Try supermarket private-label lentils and flour — you will notice zero difference.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 16,
    category: 'Freshness & Storage',
    icon: '🧄',
    title: 'Store Garlic in an Open Mesh Bag, Never in Plastic',
    tip: 'Garlic bulbs need constant airflow to stay dry and pungent. Sealing garlic in plastic baggies traps moisture, inducing mold and premature green bitter shoots.',
    actionItem: 'Hang garlic in an airy mesh bag or terracotta pot in a shaded corner.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 17,
    category: 'Smart Buying',
    icon: '❄️',
    title: 'Frozen Veggies are Often More Nutritious',
    tip: 'Commercial frozen peas and corn are flash-frozen within 2 hours of harvest at their nutritional peak, whereas "fresh" pods sitting in open crates lose vitamin C rapidly over days.',
    actionItem: 'Keep a 500g pouch of frozen green peas in the freezer for quick, zero-waste curries.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  {
    id: 18,
    category: 'Zero Waste',
    icon: '🍞',
    title: 'Make Homemade Breadcrumbs from Stale Bread Slices',
    tip: 'The crusty ends and slightly dry slices of sandwich bread can be toasted lightly and pulsed in a blender with oregano and chili flakes for crunchy cutlet coatings.',
    actionItem: 'Pulse and store in a glass jar in the freezer; ready whenever you fry cutlets.',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    id: 19,
    category: 'Budget Saver',
    icon: '💳',
    title: 'Set a Budget Alert Before You Shop',
    tip: 'Shoppers who keep their remaining monthly balance visible spend on average 22% less on unnecessary items. The visual progress bar keeps you accountable.',
    actionItem: 'Check Priyam’s Remaining Budget tracker right as you push your shopping cart.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 20,
    category: 'Freshness & Storage',
    icon: '🍎',
    title: 'Isolate Apples in Your Fruit Bowl',
    tip: 'Apples are powerhouse ethylene producers. Storing them next to oranges, watermelons, or leafy vegetables causes the other produce to soften and rot rapidly.',
    actionItem: 'Keep apples in their own separate fruit bowl or inside the crisper drawer.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
];

export const SmartShoppingTips: React.FC = () => {
  // Compute deterministic day index based on the current calendar date
  const todayDayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  const defaultTipIndex = todayDayOfYear % SHOPPING_TIPS.length;

  const [currentIndex, setCurrentIndex] = useState<number>(defaultTipIndex);
  const [copied, setCopied] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('priyam_saved_tips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentTip = SHOPPING_TIPS[currentIndex];
  const isTodayTip = currentIndex === defaultTipIndex;
  const isFavorited = favorites.includes(currentTip.id);

  // Date label formatting: "Thursday, Oct 29"
  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const handleNextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOPPING_TIPS.length);
  };

  const handlePrevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOPPING_TIPS.length) % SHOPPING_TIPS.length);
  };

  const handleResetToToday = () => {
    setCurrentIndex(defaultTipIndex);
  };

  const handleCopyTip = async () => {
    const shareText = `💡 ${currentTip.title}\n\n${currentTip.tip}\n\n✅ Pro Tip: ${currentTip.actionItem}\n— Priyam Grocery Manager`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFavorite = () => {
    setFavorites((prev) => {
      const next = prev.includes(currentTip.id)
        ? prev.filter((id) => id !== currentTip.id)
        : [...prev, currentTip.id];
      try {
        localStorage.setItem('priyam_saved_tips', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <section className="space-y-2 pt-1" aria-label="Smart Shopping Tips">
      {/* Header with Title and Day Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-600" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight font-display">
            Smart Shopping Tips
          </h3>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Daily
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>{formattedToday}</span>
        </div>
      </div>

      {/* Main Tip Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFFBEA] via-white to-[#FEF3C7]/40 border border-amber-200/80 shadow-xs p-3.5 transition-all">
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

        {/* Top Meta Row: Category Badge + "Tip of the Day" indicator + Actions */}
        <div className="relative flex items-center justify-between gap-2 pb-2 border-b border-amber-100/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${currentTip.badgeColor}`}
            >
              <span>{currentTip.icon}</span>
              <span>{currentTip.category}</span>
            </span>

            {isTodayTip ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-2xs">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                Today's Tip
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResetToToday}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors cursor-pointer"
                title="Return to today's scheduled tip"
              >
                Back to Today's Tip
              </button>
            )}
          </div>

          {/* Quick interactive buttons: Bookmark & Copy */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleFavorite}
              title={isFavorited ? 'Remove bookmark' : 'Bookmark this tip'}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
                  : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleCopyTip}
              title="Copy tip text"
              className="p-1.5 rounded-lg bg-white/80 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 text-[10px]">Copied</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Tip Body */}
        <div className="pt-2.5 space-y-2">
          <h4 className="text-[13.5px] font-black text-slate-900 tracking-tight leading-snug">
            {currentTip.title}
          </h4>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {currentTip.tip}
          </p>

          {/* Actionable Pro Tip pill */}
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-300/40 flex items-start gap-2">
            <span className="text-xs leading-none select-none mt-0.5">💡</span>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mr-1">
                Action:
              </span>
              <span className="text-[11px] font-semibold text-amber-950">
                {currentTip.actionItem}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & Index Indicator */}
        <div className="mt-3 pt-2 flex items-center justify-between border-t border-amber-100/60 text-[11px] text-slate-500 font-semibold">
          <div className="flex items-center gap-1">
            <span>Tip {currentIndex + 1} of {SHOPPING_TIPS.length}</span>
            {favorites.length > 0 && (
              <span className="text-slate-400 ml-1">
                ({favorites.length} saved)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevTip}
              className="px-2 py-0.5 rounded-md bg-white border border-amber-200/80 text-slate-700 text-[10px] font-bold hover:bg-amber-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={handleNextTip}
              className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-2xs flex items-center gap-0.5"
            >
              <span>Next Tip</span>
              <RotateCw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
