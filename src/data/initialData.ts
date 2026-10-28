import { GroceryItem, DeletedGroceryItem, PurchaseRecord, AppSettings, GroceryCategory } from '../types';

export const STORAGE_KEYS = {
  ACTIVE_ITEMS: 'priyam_grocery_active_items_v1',
  DELETED_ITEMS: 'priyam_grocery_deleted_items_v1',
  PURCHASE_HISTORY: 'priyam_grocery_purchase_history_v1',
  APP_SETTINGS: 'priyam_grocery_app_settings_v1',
  HAS_SEEN_SPLASH: 'priyam_grocery_has_seen_splash_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  monthlyBudget: 5000,
  currency: '₹',
  user: {
    name: 'Priyam Roy',
    email: 'priyamroy772@gmail.com',
    phone: '+91 98765 43210',
    isSignedIn: false,
    authMethod: 'phone',
  },
  displayMode: 'mobile-frame',
  showSplashOnFirstVisit: true,
};

export const INITIAL_ACTIVE_ITEMS: GroceryItem[] = [
  {
    id: 'item_1',
    name: 'Tomato',
    quantity: 2,
    unit: 'kg',
    price: 40,
    category: 'Vegetables',
    notes: 'Fresh red ripe tomatoes for salads and curry',
    purchased: true,
    purchaseEventId: 'hist_1',
    createdAt: '2026-10-18T08:00:00Z',
    updatedAt: '2026-10-18T09:30:00Z',
  },
  {
    id: 'item_2',
    name: 'Potato',
    quantity: 3,
    unit: 'kg',
    price: 45,
    category: 'Vegetables',
    notes: 'Medium sized baking potatoes',
    purchased: false,
    createdAt: '2026-10-18T08:05:00Z',
    updatedAt: '2026-10-18T08:05:00Z',
  },
  {
    id: 'item_3',
    name: 'Onion',
    quantity: 2,
    unit: 'kg',
    price: 36,
    category: 'Vegetables',
    notes: 'Pink onions',
    purchased: false,
    createdAt: '2026-10-18T08:10:00Z',
    updatedAt: '2026-10-18T08:10:00Z',
  },
  {
    id: 'item_4',
    name: 'Banana',
    quantity: 1,
    unit: 'dozen',
    price: 60,
    category: 'Fruits',
    notes: 'Ripe yellow Robusta bananas',
    purchased: true,
    purchaseEventId: 'hist_3',
    createdAt: '2026-10-17T11:00:00Z',
    updatedAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'item_5',
    name: 'Milk',
    quantity: 1,
    unit: 'ltr',
    price: 52,
    category: 'Dairy',
    notes: 'Full cream homogenized cow milk',
    purchased: true,
    purchaseEventId: 'hist_2',
    createdAt: '2026-10-16T07:30:00Z',
    updatedAt: '2026-10-16T08:00:00Z',
  },
  {
    id: 'item_6',
    name: 'Bread',
    quantity: 1,
    unit: 'pack',
    price: 35,
    category: 'Snacks',
    notes: 'Whole wheat sliced bread',
    purchased: false,
    createdAt: '2026-10-16T07:35:00Z',
    updatedAt: '2026-10-16T07:35:00Z',
  },
  {
    id: 'item_7',
    name: 'Rice',
    quantity: 5,
    unit: 'kg',
    price: 320,
    category: 'Grains',
    notes: 'Aromatic aged Basmati rice',
    purchased: false,
    createdAt: '2026-10-15T14:00:00Z',
    updatedAt: '2026-10-15T14:00:00Z',
  },
  {
    id: 'item_8',
    name: 'Cooking Oil',
    quantity: 1,
    unit: 'ltr',
    price: 165,
    category: 'Household',
    notes: 'Refined sunflower cooking oil',
    purchased: true,
    purchaseEventId: 'hist_4',
    createdAt: '2026-10-12T10:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z',
  },
  {
    id: 'item_9',
    name: 'Fresh Apples',
    quantity: 1,
    unit: 'kg',
    price: 140,
    category: 'Fruits',
    notes: 'Sweet crisp red Fuji apples',
    purchased: true,
    purchaseEventId: 'hist_5',
    createdAt: '2026-10-14T09:00:00Z',
    updatedAt: '2026-10-14T10:30:00Z',
  },
  {
    id: 'item_10',
    name: 'Green Tea',
    quantity: 1,
    unit: 'pack',
    price: 125,
    category: 'Beverages',
    notes: 'Organic jasmine green tea',
    purchased: true,
    purchaseEventId: 'hist_6',
    createdAt: '2026-10-13T16:00:00Z',
    updatedAt: '2026-10-13T17:00:00Z',
  },
  {
    id: 'item_11',
    name: 'Mixed Dry Fruits',
    quantity: 1,
    unit: 'pack',
    price: 250,
    category: 'Snacks',
    notes: 'Almonds, cashews, and raisins',
    purchased: true,
    purchaseEventId: 'hist_7',
    createdAt: '2026-10-11T12:00:00Z',
    updatedAt: '2026-10-11T12:30:00Z',
  },
  {
    id: 'item_12',
    name: 'Dishwashing Liquid',
    quantity: 1,
    unit: 'ltr',
    price: 110,
    category: 'Household',
    notes: 'Lemon antibacterial gel',
    purchased: true,
    purchaseEventId: 'hist_8',
    createdAt: '2026-10-10T15:00:00Z',
    updatedAt: '2026-10-10T15:30:00Z',
  },
];

export const INITIAL_DELETED_ITEMS: DeletedGroceryItem[] = [
  {
    id: 'del_1',
    name: 'Carrot',
    quantity: 2,
    unit: 'kg',
    price: 60,
    category: 'Vegetables',
    notes: 'Sweet crunchy orange carrots',
    purchased: false,
    createdAt: '2026-10-20T10:00:00Z',
    updatedAt: '2026-10-24T14:00:00Z',
    deletedAt: '2026-10-24T14:30:00Z', // 2 days ago
  },
  {
    id: 'del_2',
    name: 'Broccoli',
    quantity: 1,
    unit: 'kg',
    price: 80,
    category: 'Vegetables',
    notes: 'Fresh green florets',
    purchased: false,
    createdAt: '2026-10-19T09:00:00Z',
    updatedAt: '2026-10-23T11:00:00Z',
    deletedAt: '2026-10-23T11:15:00Z', // 3 days ago
  },
  {
    id: 'del_3',
    name: 'Apple',
    quantity: 1,
    unit: 'kg',
    price: 120,
    category: 'Fruits',
    notes: 'Royal gala apples',
    purchased: false,
    createdAt: '2026-10-18T16:00:00Z',
    updatedAt: '2026-10-22T08:00:00Z',
    deletedAt: '2026-10-22T08:45:00Z', // 4 days ago
  },
  {
    id: 'del_4',
    name: 'Cheese',
    quantity: 1,
    unit: 'pack',
    price: 90,
    category: 'Dairy',
    notes: 'Processed cheddar slices',
    purchased: false,
    createdAt: '2026-10-17T13:00:00Z',
    updatedAt: '2026-10-21T18:00:00Z',
    deletedAt: '2026-10-21T18:20:00Z', // 5 days ago
  },
  {
    id: 'del_5',
    name: 'Paneer',
    quantity: 500,
    unit: 'g',
    price: 100,
    category: 'Dairy',
    notes: 'Fresh soft cottage cheese',
    purchased: false,
    createdAt: '2026-10-16T12:00:00Z',
    updatedAt: '2026-10-20T17:00:00Z',
    deletedAt: '2026-10-20T17:10:00Z', // 6 days ago
  },
];

export const INITIAL_PURCHASE_HISTORY: PurchaseRecord[] = [
  {
    id: 'hist_1',
    itemId: 'item_1',
    itemName: 'Tomato, Potato, Onion',
    itemsSummary: 'Tomato (2 kg), Potato (1 kg)',
    quantity: 2,
    unit: 'kg',
    price: 40,
    totalPrice: 121,
    category: 'Vegetables',
    purchaseDate: '2026-10-18T10:15:00Z',
    formattedDate: '18 Oct 2026',
  },
  {
    id: 'hist_2',
    itemId: 'item_5',
    itemName: 'Milk, Bread',
    itemsSummary: 'Milk (1 ltr), Bread (1 pack)',
    quantity: 1,
    unit: 'ltr',
    price: 52,
    totalPrice: 87,
    category: 'Dairy',
    purchaseDate: '2026-10-16T08:30:00Z',
    formattedDate: '16 Oct 2026',
  },
  {
    id: 'hist_3',
    itemId: 'item_4',
    itemName: 'Banana, Apple',
    itemsSummary: 'Banana (1 dozen), Apple (500 g)',
    quantity: 1,
    unit: 'dozen',
    price: 60,
    totalPrice: 142,
    category: 'Fruits',
    purchaseDate: '2026-10-14T11:45:00Z',
    formattedDate: '14 Oct 2026',
  },
  {
    id: 'hist_4',
    itemId: 'item_7',
    itemName: 'Rice, Oil',
    itemsSummary: 'Rice (5 kg), Sunflower Oil (1 ltr)',
    quantity: 5,
    unit: 'kg',
    price: 320,
    totalPrice: 360,
    category: 'Grains',
    purchaseDate: '2026-10-12T14:20:00Z',
    formattedDate: '12 Oct 2026',
  },
  {
    id: 'hist_5',
    itemId: 'item_1',
    itemName: 'Tomato, Potato',
    itemsSummary: 'Tomato (1.5 kg), Potato (2 kg)',
    quantity: 2,
    unit: 'kg',
    price: 40,
    totalPrice: 98,
    category: 'Vegetables',
    purchaseDate: '2026-10-10T16:00:00Z',
    formattedDate: '10 Oct 2026',
  },
];

export const CATEGORIES_CONFIG: {
  name: GroceryCategory;
  description: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
}[] = [
  {
    name: 'Vegetables',
    description: 'Fresh organic leafy & roots',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    iconBg: 'bg-emerald-100',
  },
  {
    name: 'Fruits',
    description: 'Fresh, dried & seasonal',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    iconBg: 'bg-amber-100',
  },
  {
    name: 'Dairy',
    description: 'Milk, cheese, yogurt & eggs',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    iconBg: 'bg-blue-100',
  },
  {
    name: 'Snacks',
    description: 'Bakery, nuts & savory',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    iconBg: 'bg-orange-100',
  },
  {
    name: 'Grains',
    description: 'Rice, flour, pulses & oats',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-800',
    iconBg: 'bg-yellow-100',
  },
  {
    name: 'Beverages',
    description: 'Juices, tea, coffee & sodas',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    iconBg: 'bg-rose-100',
  },
  {
    name: 'Household',
    description: 'Cleaning, hygiene & supplies',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700',
    iconBg: 'bg-cyan-100',
  },
  {
    name: 'Others',
    description: 'Spices, miscellaneous & more',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    iconBg: 'bg-purple-100',
  },
];

export function formatCurrencyINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function calculateLineTotal(quantity: number, price: number): number {
  if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) return 0;
  return Math.round(quantity * price);
}

export function getRelativeTimeString(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? 'Deleted yesterday' : `Deleted ${diffDays} days ago`;
    }
    if (diffHours > 0) {
      return `Deleted ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffMinutes > 1) {
      return `Deleted ${diffMinutes} minutes ago`;
    }
    return 'Deleted just now';
  } catch {
    return 'Deleted recently';
  }
}
