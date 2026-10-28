export type GroceryCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy'
  | 'Snacks'
  | 'Grains'
  | 'Beverages'
  | 'Household'
  | 'Others';

export type GroceryUnit =
  | 'kg'
  | 'g'
  | 'ltr'
  | 'ml'
  | 'piece'
  | 'pack'
  | 'dozen';

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: GroceryUnit;
  price: number; // Unit price in ₹
  category: GroceryCategory;
  notes?: string;
  purchased: boolean;
  purchaseEventId?: string; // Links active purchased state to purchase history
  createdAt: string;
  updatedAt: string;
  imageKey?: string;
  customImageUrl?: string;
}

export interface DeletedGroceryItem extends GroceryItem {
  deletedAt: string;
}

export interface PurchaseRecord {
  id: string;
  itemId?: string;
  itemName: string;
  itemsSummary?: string;
  quantity: number;
  unit: GroceryUnit | string;
  price: number;
  totalPrice: number;
  category: GroceryCategory;
  purchaseDate: string; // ISO string
  formattedDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isSignedIn: boolean;
  authMethod?: 'phone' | 'google' | 'guest' | 'biometric';
}

export interface AppSettings {
  monthlyBudget: number;
  currency: string;
  user: UserProfile;
  displayMode: 'mobile-frame' | 'responsive';
  showSplashOnFirstVisit: boolean;
}

export type NavigationTab =
  | 'home'
  | 'list'
  | 'budget'
  | 'history'
  | 'deleted'
  | 'categories'
  | 'settings'
  | 'reports';
