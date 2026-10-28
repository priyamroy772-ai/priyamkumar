import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { PurchaseRecord, GroceryCategory } from '../types';
import { formatCurrencyINR } from '../data/initialData';
import { GroceryVisual } from './GroceryVisual';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Filter,
} from 'lucide-react';

interface PriceTrendAnalysisProps {
  purchaseHistory: PurchaseRecord[];
}

interface MonthlyDataPoint {
  month: string; // e.g. 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'
  fullMonth: string;
  price: number;
  volume?: number;
  benchmark?: number;
}

interface ItemPriceProfile {
  id: string;
  name: string;
  hindiName: string;
  category: GroceryCategory;
  unit: string;
  currentPrice: number;
  color: string;
  gradientId: string;
  monthlyTrend: MonthlyDataPoint[];
  volatility: 'Low' | 'Moderate' | 'Seasonal' | 'High';
  note: string;
}

// Multi-month realistic price fluctuation data for staple Indian grocery items
const FREQUENT_GROCERY_PROFILES: ItemPriceProfile[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    hindiName: 'टमाटर (Tomato)',
    category: 'Vegetables',
    unit: 'kg',
    currentPrice: 40,
    color: '#EF4444',
    gradientId: 'gradTomato',
    volatility: 'Seasonal',
    note: 'Monsoon supply disruptions in July peaked prices up to ₹80/kg, now stabilizing at ₹40/kg.',
    monthlyTrend: [
      { month: 'May', fullMonth: 'May 2026', price: 30, benchmark: 42 },
      { month: 'Jun', fullMonth: 'June 2026', price: 55, benchmark: 42 },
      { month: 'Jul', fullMonth: 'July 2026', price: 80, benchmark: 42 },
      { month: 'Aug', fullMonth: 'August 2026', price: 60, benchmark: 42 },
      { month: 'Sep', fullMonth: 'September 2026', price: 45, benchmark: 42 },
      { month: 'Oct', fullMonth: 'October 2026', price: 40, benchmark: 42 },
    ],
  },
  {
    id: 'milk',
    name: 'Milk',
    hindiName: 'दूध (Milk)',
    category: 'Dairy',
    unit: 'ltr',
    currentPrice: 56,
    color: '#3B82F6',
    gradientId: 'gradMilk',
    volatility: 'Low',
    note: 'Steady upward trend reflecting annual dairy procurement adjustments (+₹8/ltr over 6 months).',
    monthlyTrend: [
      { month: 'May', fullMonth: 'May 2026', price: 48, benchmark: 52 },
      { month: 'Jun', fullMonth: 'June 2026', price: 50, benchmark: 52 },
      { month: 'Jul', fullMonth: 'July 2026', price: 52, benchmark: 52 },
      { month: 'Aug', fullMonth: 'August 2026', price: 52, benchmark: 52 },
      { month: 'Sep', fullMonth: 'September 2026', price: 54, benchmark: 52 },
      { month: 'Oct', fullMonth: 'October 2026', price: 56, benchmark: 52 },
    ],
  },
  {
    id: 'sugar',
    name: 'Sugar',
    hindiName: 'चीनी (Sugar)',
    category: 'Grains',
    unit: 'kg',
    currentPrice: 44,
    color: '#D97706',
    gradientId: 'gradSugar',
    volatility: 'Low',
    note: 'Gradual increase leading into the festive season demand (Dussehra and Diwali).',
    monthlyTrend: [
      { month: 'May', fullMonth: 'May 2026', price: 38, benchmark: 41 },
      { month: 'Jun', fullMonth: 'June 2026', price: 40, benchmark: 41 },
      { month: 'Jul', fullMonth: 'July 2026', price: 41, benchmark: 41 },
      { month: 'Aug', fullMonth: 'August 2026', price: 42, benchmark: 41 },
      { month: 'Sep', fullMonth: 'September 2026', price: 43, benchmark: 41 },
      { month: 'Oct', fullMonth: 'October 2026', price: 44, benchmark: 41 },
    ],
  },
  {
    id: 'onion',
    name: 'Onion',
    hindiName: 'प्याज (Onion)',
    category: 'Vegetables',
    unit: 'kg',
    currentPrice: 38,
    color: '#A855F7',
    gradientId: 'gradOnion',
    volatility: 'Moderate',
    note: 'Gradual rise due to post-monsoon crop cycles from Nashik and Rajasthan mandis.',
    monthlyTrend: [
      { month: 'May', fullMonth: 'May 2026', price: 25, benchmark: 31 },
      { month: 'Jun', fullMonth: 'June 2026', price: 28, benchmark: 31 },
      { month: 'Jul', fullMonth: 'July 2026', price: 32, benchmark: 31 },
      { month: 'Aug', fullMonth: 'August 2026', price: 35, benchmark: 31 },
      { month: 'Sep', fullMonth: 'September 2026', price: 36, benchmark: 31 },
      { month: 'Oct', fullMonth: 'October 2026', price: 38, benchmark: 31 },
    ],
  },
  {
    id: 'cooking_oil',
    name: 'Cooking Oil',
    hindiName: 'तेल (Cooking Oil)',
    category: 'Household',
    unit: 'ltr',
    currentPrice: 155,
    color: '#F59E0B',
    gradientId: 'gradOil',
    volatility: 'Moderate',
    note: 'Global palm & sunflower edible oil import prices stabilized around ₹155/ltr.',
    monthlyTrend: [
      { month: 'May', fullMonth: 'May 2026', price: 140, benchmark: 149 },
      { month: 'Jun', fullMonth: 'June 2026', price: 145, benchmark: 149 },
      { month: 'Jul', fullMonth: 'July 2026', price: 150, benchmark: 149 },
      { month: 'Aug', fullMonth: 'August 2026', price: 152, benchmark: 149 },
      { month: 'Sep', fullMonth: 'September 2026', price: 155, benchmark: 149 },
      { month: 'Oct', fullMonth: 'October 2026', price: 155, benchmark: 149 },
    ],
  },
  {
    id: 'potato',
    name: 'Potato',
    hindiName: 'आलू (Potato)',
    category: 'Vegetables',
    unit: 'kg',
    currentPrice: 35,
    color: '#10B981',
    gradientId: 'gradPotato',
    volatility: 'Low',
    note: 'Cold storage stocks kept potato prices relatively affordable with modest festival uptick.',
    monthlyTrend: [
      { month: 'May', fullMonth: 'May 2026', price: 28, benchmark: 31 },
      { month: 'Jun', fullMonth: 'June 2026', price: 30, benchmark: 31 },
      { month: 'Jul', fullMonth: 'July 2026', price: 32, benchmark: 31 },
      { month: 'Aug', fullMonth: 'August 2026', price: 32, benchmark: 31 },
      { month: 'Sep', fullMonth: 'September 2026', price: 34, benchmark: 31 },
      { month: 'Oct', fullMonth: 'October 2026', price: 35, benchmark: 31 },
    ],
  },
];

export const PriceTrendAnalysis: React.FC<PriceTrendAnalysisProps> = ({ purchaseHistory }) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('tomato');
  const [timeframe, setTimeframe] = useState<'3m' | '6m'>('6m');
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  // Currently selected item profile
  const currentProfile = useMemo(() => {
    return FREQUENT_GROCERY_PROFILES.find((p) => p.id === selectedItemId) || FREQUENT_GROCERY_PROFILES[0];
  }, [selectedItemId]);

  // Filtered monthly data based on timeframe
  const displayData = useMemo(() => {
    const raw = currentProfile.monthlyTrend;
    if (timeframe === '3m') {
      return raw.slice(-3);
    }
    return raw;
  }, [currentProfile, timeframe]);

  // Statistics for the selected item
  const stats = useMemo(() => {
    const prices = displayData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const diff = lastPrice - firstPrice;
    const percentChange = firstPrice > 0 ? ((diff / firstPrice) * 100).toFixed(1) : '0';

    return {
      minPrice,
      maxPrice,
      avgPrice,
      diff,
      percentChange,
      isIncrease: diff >= 0,
    };
  }, [displayData]);

  // Comparison dataset matching across all 6 months for top 3 staples (Tomato, Milk, Sugar)
  const comparisonData = useMemo(() => {
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const sliceCount = timeframe === '3m' ? 3 : 6;
    const targetMonths = months.slice(-sliceCount);

    return targetMonths.map((m) => {
      const point: any = { month: m };
      FREQUENT_GROCERY_PROFILES.slice(0, 4).forEach((p) => {
        const found = p.monthlyTrend.find((t) => t.month === m);
        point[p.name] = found ? found.price : p.currentPrice;
      });
      return point;
    });
  }, [timeframe]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
          <p className="font-extrabold text-amber-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-amber-300" />
            <span>{label} 2026</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color || entry.stroke || '#FFD21F' }}
                />
                {entry.name}:
              </span>
              <span className="font-black text-white tabular-nums font-display">
                ₹{entry.value} / {currentProfile.unit}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 rounded-3xl bg-white border border-amber-200/90 shadow-sm space-y-3.5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD21F] to-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight font-display">
              Price Trend Analysis
            </h3>
            <p className="text-[10px] font-semibold text-slate-500">
              Monthly cost fluctuation of frequent groceries
            </p>
          </div>
        </div>

        {/* View mode toggle: Single Item vs Compare */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setViewMode('single')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setViewMode('compare')}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      {/* Item Selection Carousel (if single item mode) */}
      {viewMode === 'single' ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
            {FREQUENT_GROCERY_PROFILES.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-950 border-amber-400 shadow-xs scale-102 font-black'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <GroceryVisual
                    name={item.name}
                    category={item.category}
                    size="sm"
                    className="w-5 h-5 rounded-md"
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Metrics Bar for Selected Item */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Current
              </span>
              <span className="text-xs font-black text-slate-900 tabular-nums font-display">
                ₹{currentProfile.currentPrice}/{currentProfile.unit}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Average
              </span>
              <span className="text-xs font-black text-slate-800 tabular-nums font-display">
                ₹{stats.avgPrice}/{currentProfile.unit}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Min / Max
              </span>
              <span className="text-xs font-bold text-slate-700 tabular-nums">
                ₹{stats.minPrice} - ₹{stats.maxPrice}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                6M Trend
              </span>
              <span
                className={`text-xs font-black tabular-nums flex items-center justify-center gap-0.5 ${
                  stats.isIncrease ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {stats.isIncrease ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stats.isIncrease ? `+${stats.percentChange}%` : `${stats.percentChange}%`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs text-amber-950 font-bold">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Comparing 4 Essential Staples (Tomato, Milk, Sugar, Onion)</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-500">
            May - Oct 2026
          </span>
        </div>
      )}

      {/* Timeframe Filter Buttons */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Price Curve (₹ / unit)
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setTimeframe('3m')}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
              timeframe === '3m'
                ? 'bg-amber-400 text-amber-950 font-black'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Last 3M
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('6m')}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
              timeframe === '6m'
                ? 'bg-amber-400 text-amber-950 font-black'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Full 6M
          </button>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="w-full h-56 relative bg-gradient-to-b from-amber-50/20 to-transparent rounded-2xl p-1 border border-amber-100/60">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'single' ? (
            <AreaChart data={displayData} margin={{ top: 12, right: 12, left: -22, bottom: 4 }}>
              <defs>
                <linearGradient id={currentProfile.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentProfile.color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={currentProfile.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                tickFormatter={(val) => `₹${val}`}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stats.avgPrice}
                stroke="#94A3B8"
                strokeDasharray="4 4"
                label={{
                  value: `Avg: ₹${stats.avgPrice}`,
                  position: 'insideTopRight',
                  fill: '#64748B',
                  fontSize: 9,
                  fontWeight: 700,
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                name={currentProfile.name}
                stroke={currentProfile.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${currentProfile.gradientId})`}
                dot={{ r: 4, stroke: currentProfile.color, strokeWidth: 2, fill: '#FFFFFF' }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: currentProfile.color }}
              />
            </AreaChart>
          ) : (
            <LineChart data={comparisonData} margin={{ top: 12, right: 12, left: -22, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={28}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 700 }}
              />
              <Line
                type="monotone"
                dataKey="Tomato"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Milk"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Sugar"
                stroke="#D97706"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="Onion"
                stroke="#A855F7"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Analytical Observation & Insights Footer */}
      {viewMode === 'single' && (
        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2 text-left">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-amber-950 leading-tight">
              {currentProfile.note}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
              <span>Volatility: <strong>{currentProfile.volatility}</strong></span>
              <span>•</span>
              <span>Unit: <strong>{currentProfile.unit}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
