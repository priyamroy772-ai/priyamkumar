import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  GroceryItem,
  DeletedGroceryItem,
  PurchaseRecord,
  AppSettings,
  NavigationTab,
  GroceryCategory,
} from '../types';
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  INITIAL_ACTIVE_ITEMS,
  INITIAL_DELETED_ITEMS,
  INITIAL_PURCHASE_HISTORY,
  calculateLineTotal,
  CATEGORIES_CONFIG,
} from '../data/initialData';
import { autoMatchGrocery, getCategoryFallbackImage } from '../utils/groceryAutoMatcher';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface GroceryContextType {
  // Data
  items: GroceryItem[];
  deletedItems: DeletedGroceryItem[];
  purchaseHistory: PurchaseRecord[];
  settings: AppSettings;
  
  // Navigation & Filters
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Active Modals & Dialogs
  isAddEditModalOpen: boolean;
  setIsAddEditModalOpen: (open: boolean) => void;
  editingItem: GroceryItem | null;
  openAddModal: (prefill?: GroceryCategory | Partial<GroceryItem>) => void;
  openEditModal: (item: GroceryItem) => void;
  closeAddEditModal: () => void;

  itemToRestore: DeletedGroceryItem | null;
  setItemToRestore: (item: DeletedGroceryItem | null) => void;
  
  itemToDeletePermanent: DeletedGroceryItem | null;
  setItemToDeletePermanent: (item: DeletedGroceryItem | null) => void;

  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;

  isBudgetAlertModalOpen: boolean;
  setIsBudgetAlertModalOpen: (open: boolean) => void;
  openBudgetAlert: () => void;

  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;

  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;

  isQuickAddModalOpen: boolean;
  setIsQuickAddModalOpen: (open: boolean) => void;
  openQuickAddModal: () => void;

  // CRUD Actions
  addItem: (itemData: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt' | 'purchased'>) => void;
  addBatchItems: (itemsData: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt' | 'purchased'>[]) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  deleteItem: (id: string) => void;
  restoreItem: (id: string) => void;
  permanentlyDeleteItem: (id: string) => void;
  clearAllDeleted: () => void;
  togglePurchased: (id: string) => void;
  updateMonthlyBudget: (amount: number) => void;
  addBackToGroceryList: (historyItem: PurchaseRecord) => void;
  clearPurchaseHistory: () => void;

  // Auth Actions
  loginWithPhone: (phone: string, name?: string) => void;
  loginWithGoogle: () => void;
  loginWithBiometrics: () => void;
  continueAsGuest: () => void;
  logout: () => void;
  showLoginScreen: boolean;
  setShowLoginScreen: (show: boolean) => void;

  // Settings & Utilities
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  exportBackupJson: () => void;
  importBackupJson: (file: File) => Promise<{ success: boolean; message: string }>;
  resetToDefaultData: () => void;

  // Computed Metrics
  totalActiveItems: number;
  purchasedItemsCount: number;
  spentTotal: number;
  remainingBudget: number;
  budgetUsedPercent: number;
  rawBudgetUsedPercent: number;
  isOverBudget: boolean;
  expensesByCategory: { category: GroceryCategory; amount: number; percentage: number }[];

  // Toast
  toast: Toast | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Load Initial State with Local Storage Fallback
  const [items, setItems] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load active items from localStorage', e);
    }
    return INITIAL_ACTIVE_ITEMS;
  });

  const [deletedItems, setDeletedItems] = useState<DeletedGroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELETED_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load deleted items from localStorage', e);
    }
    return INITIAL_DELETED_ITEMS;
  });

  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASE_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load purchase history from localStorage', e);
    }
    return INITIAL_PURCHASE_HISTORY;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load app settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const [itemToRestore, setItemToRestore] = useState<DeletedGroceryItem | null>(null);
  const [itemToDeletePermanent, setItemToDeletePermanent] = useState<DeletedGroceryItem | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isBudgetAlertModalOpen, setIsBudgetAlertModalOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<Toast | null>(null);
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(!settings.user.isSignedIn);

  const openBudgetAlert = useCallback(() => {
    setIsBudgetAlertModalOpen(true);
  }, []);

  const openQuickAddModal = useCallback(() => {
    setIsQuickAddModalOpen(true);
  }, []);

  // 2. Local Storage Sync Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ITEMS, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save active items to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELETED_ITEMS, JSON.stringify(deletedItems));
    } catch (e) {
      console.error('Failed to save deleted items to localStorage', e);
    }
  }, [deletedItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASE_HISTORY, JSON.stringify(purchaseHistory));
    } catch (e) {
      console.error('Failed to save purchase history to localStorage', e);
    }
  }, [purchaseHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Toast Helper
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, text, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  }, []);

  // Modal Handlers
  const openAddModal = useCallback((prefill?: GroceryCategory | Partial<GroceryItem>) => {
    if (!prefill) {
      setEditingItem(null);
    } else if (typeof prefill === 'string') {
      setEditingItem({
        id: '',
        name: '',
        quantity: 1,
        unit: 'kg',
        price: 0,
        category: prefill,
        notes: '',
        purchased: false,
        createdAt: '',
        updatedAt: '',
      } as GroceryItem);
    } else {
      setEditingItem({
        id: '',
        name: prefill.name || '',
        quantity: prefill.quantity || 1,
        unit: prefill.unit || 'kg',
        price: prefill.price ?? 0,
        category: prefill.category || 'Vegetables',
        notes: prefill.notes || '',
        customImageUrl: prefill.customImageUrl || '',
        purchased: false,
        createdAt: '',
        updatedAt: '',
      } as GroceryItem);
    }
    setIsAddEditModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: GroceryItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  }, []);

  const closeAddEditModal = useCallback(() => {
    setEditingItem(null);
    setIsAddEditModalOpen(false);
  }, []);

  // CRUD Implementations
  const addItem = useCallback(
    (itemData: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt' | 'purchased'>) => {
      const now = new Date().toISOString();
      const newItem: GroceryItem = {
        ...itemData,
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        purchased: false,
        createdAt: now,
        updatedAt: now,
      };

      setItems((prev) => [newItem, ...prev]);
      showToast(`"${newItem.name}" added to grocery list`);
      closeAddEditModal();
    },
    [closeAddEditModal, showToast]
  );

  const addBatchItems = useCallback(
    (itemsData: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt' | 'purchased'>[]) => {
      if (!itemsData || itemsData.length === 0) return;
      const now = new Date().toISOString();
      const newItems: GroceryItem[] = itemsData.map((itemData, idx) => {
        const auto = autoMatchGrocery(itemData.name);
        const resolvedImage =
          itemData.customImageUrl || auto?.imageUrl || getCategoryFallbackImage(itemData.category);
        return {
          ...itemData,
          id: `item_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          purchased: false,
          createdAt: now,
          updatedAt: now,
          customImageUrl: resolvedImage,
        };
      });

      setItems((prev) => [...newItems, ...prev]);
      showToast(`Added ${newItems.length} items to your grocery list!`, 'success');
      setIsQuickAddModalOpen(false);
    },
    [showToast]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<GroceryItem>) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const updated = {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            return updated;
          }
          return item;
        })
      );
      showToast('Item updated successfully');
      closeAddEditModal();
    },
    [closeAddEditModal, showToast]
  );

  const deleteItem = useCallback(
    (id: string) => {
      const target = items.find((i) => i.id === id);
      if (!target) return;

      const deletedItem: DeletedGroceryItem = {
        ...target,
        deletedAt: new Date().toISOString(),
      };

      // 1. Remove from active items
      setItems((prev) => prev.filter((i) => i.id !== id));
      // 2. Add to deletedItems
      setDeletedItems((prev) => [deletedItem, ...prev]);

      showToast(`"${target.name}" moved to Recently Deleted`, 'info');
    },
    [items, showToast]
  );

  const restoreItem = useCallback(
    (id: string) => {
      const target = deletedItems.find((d) => d.id === id);
      if (!target) return;

      // Ensure no duplicate in active items
      const alreadyInList = items.some((i) => i.id === target.id);
      if (alreadyInList) {
        showToast('Item is already in your grocery list', 'error');
        setDeletedItems((prev) => prev.filter((d) => d.id !== id));
        setItemToRestore(null);
        return;
      }

      // Reconstruct original active item
      const restoredItem: GroceryItem = {
        id: target.id,
        name: target.name,
        quantity: target.quantity,
        unit: target.unit,
        price: target.price,
        category: target.category,
        notes: target.notes,
        purchased: target.purchased,
        purchaseEventId: target.purchaseEventId,
        createdAt: target.createdAt,
        updatedAt: new Date().toISOString(),
        imageKey: target.imageKey,
        customImageUrl: target.customImageUrl,
      };

      setItems((prev) => [restoredItem, ...prev]);
      setDeletedItems((prev) => prev.filter((d) => d.id !== id));
      setItemToRestore(null);
      showToast(`"${target.name}" restored to grocery list!`);
    },
    [deletedItems, items, showToast]
  );

  const permanentlyDeleteItem = useCallback(
    (id: string) => {
      setDeletedItems((prev) => prev.filter((d) => d.id !== id));
      setItemToDeletePermanent(null);
      showToast('Item permanently removed from trash');
    },
    [showToast]
  );

  const clearAllDeleted = useCallback(() => {
    if (deletedItems.length === 0) return;
    setDeletedItems([]);
    showToast('Trash emptied successfully');
  }, [deletedItems.length, showToast]);

  const togglePurchased = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const willBePurchased = !item.purchased;
            const now = new Date();

            if (willBePurchased) {
              // Create a linked purchase record in Purchase History
              const eventId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
              const lineTotal = calculateLineTotal(item.quantity, item.price);
              
              const newRecord: PurchaseRecord = {
                id: eventId,
                itemId: item.id,
                itemName: item.name,
                itemsSummary: `${item.name} (${item.quantity} ${item.unit})`,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                totalPrice: lineTotal,
                category: item.category,
                purchaseDate: now.toISOString(),
                formattedDate: now.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }),
              };

              setPurchaseHistory((hPrev) => [newRecord, ...hPrev]);
              showToast(`Marked "${item.name}" as purchased!`);

              return {
                ...item,
                purchased: true,
                purchaseEventId: eventId,
                updatedAt: now.toISOString(),
              };
            } else {
              // Unmarked purchased: clean linked purchase event if present
              if (item.purchaseEventId) {
                setPurchaseHistory((hPrev) =>
                  hPrev.filter((rec) => rec.id !== item.purchaseEventId)
                );
              }
              showToast(`Returned "${item.name}" to shopping list`);

              return {
                ...item,
                purchased: false,
                purchaseEventId: undefined,
                updatedAt: now.toISOString(),
              };
            }
          }
          return item;
        })
      );
    },
    [showToast]
  );

  const updateMonthlyBudget = useCallback(
    (amount: number) => {
      setSettings((prev) => ({
        ...prev,
        monthlyBudget: Math.max(0, amount),
      }));
      setIsBudgetModalOpen(false);
      showToast('Monthly budget updated!');
    },
    [showToast]
  );

  const addBackToGroceryList = useCallback(
    (historyItem: PurchaseRecord) => {
      const now = new Date().toISOString();
      const newItem: GroceryItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: historyItem.itemName.split(',')[0].trim(),
        quantity: historyItem.quantity || 1,
        unit: (historyItem.unit as any) || 'kg',
        price: historyItem.price || Math.round(historyItem.totalPrice / (historyItem.quantity || 1)),
        category: historyItem.category || 'Vegetables',
        notes: `Re-added from purchase on ${historyItem.formattedDate}`,
        purchased: false,
        createdAt: now,
        updatedAt: now,
      };

      setItems((prev) => [newItem, ...prev]);
      showToast(`Added "${newItem.name}" back to grocery list!`);
    },
    [showToast]
  );

  const clearPurchaseHistory = useCallback(() => {
    setPurchaseHistory([]);
    showToast('Purchase history cleared');
  }, [showToast]);

  const loginWithPhone = useCallback(
    (phone: string, name?: string) => {
      setSettings((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: name || prev.user.name || 'Priyam Roy',
          phone,
          isSignedIn: true,
          authMethod: 'phone',
        },
      }));
      setShowLoginScreen(false);
      showToast('Logged in successfully with mobile number!');
    },
    [showToast]
  );

  const loginWithGoogle = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        name: 'Priyam Roy',
        email: 'priyamroy772@gmail.com',
        isSignedIn: true,
        authMethod: 'google',
      },
    }));
    setShowLoginScreen(false);
    showToast('Signed in with Google!');
  }, [showToast]);

  const loginWithBiometrics = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        name: 'Priyam Roy',
        email: 'priyamroy772@gmail.com',
        phone: '+91 98765 43210',
        isSignedIn: true,
        authMethod: 'biometric',
      },
    }));
    setShowLoginScreen(false);
    showToast('Biometric authentication verified!', 'success');
  }, [showToast]);

  const continueAsGuest = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        name: 'Guest Shopper',
        email: 'guest@priyamgrocery.app',
        phone: '+91 99999 00000',
        isSignedIn: true,
        authMethod: 'guest',
      },
    }));
    setShowLoginScreen(false);
    showToast('Welcome, Guest Shopper!');
  }, [showToast]);

  const logout = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        isSignedIn: false,
      },
    }));
    setShowLoginScreen(true);
    setIsMenuOpen(false);
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const exportBackupJson = useCallback(() => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      activeItems: items,
      deletedItems: deletedItems,
      purchaseHistory: purchaseHistory,
      settings: settings,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `priyam_grocery_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded successfully');
  }, [items, deletedItems, purchaseHistory, settings, showToast]);

  const importBackupJson = useCallback(
    async (file: File): Promise<{ success: boolean; message: string }> => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure');
        }

        if (Array.isArray(parsed.activeItems)) {
          setItems(parsed.activeItems);
        }
        if (Array.isArray(parsed.deletedItems)) {
          setDeletedItems(parsed.deletedItems);
        }
        if (Array.isArray(parsed.purchaseHistory)) {
          setPurchaseHistory(parsed.purchaseHistory);
        }
        if (parsed.settings && typeof parsed.settings.monthlyBudget === 'number') {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
        }

        showToast('Data imported successfully!');
        return { success: true, message: 'Data imported successfully' };
      } catch (err: any) {
        showToast('Failed to import backup file. Invalid format.', 'error');
        return { success: false, message: err.message || 'Import failed' };
      }
    },
    [showToast]
  );

  const resetToDefaultData = useCallback(() => {
    setItems(INITIAL_ACTIVE_ITEMS);
    setDeletedItems(INITIAL_DELETED_ITEMS);
    setPurchaseHistory(INITIAL_PURCHASE_HISTORY);
    setSettings(DEFAULT_SETTINGS);
    showToast('Reset to original demo data');
  }, [showToast]);

  // Computed Values
  const totalActiveItems = items.length;
  const purchasedItems = useMemo(() => items.filter((i) => i.purchased), [items]);
  const purchasedItemsCount = purchasedItems.length;

  const spentTotal = useMemo(() => {
    return purchasedItems.reduce(
      (sum, item) => sum + calculateLineTotal(item.quantity, item.price),
      0
    );
  }, [purchasedItems]);

  const remainingBudget = useMemo(() => {
    return settings.monthlyBudget - spentTotal;
  }, [settings.monthlyBudget, spentTotal]);

  const isOverBudget = remainingBudget < 0;

  const budgetUsedPercent = useMemo(() => {
    if (settings.monthlyBudget <= 0) return spentTotal > 0 ? 100 : 0;
    return Math.min(100, Math.round((spentTotal / settings.monthlyBudget) * 100));
  }, [settings.monthlyBudget, spentTotal]);

  const rawBudgetUsedPercent = useMemo(() => {
    if (settings.monthlyBudget <= 0) return spentTotal > 0 ? 100 : 0;
    return Math.round((spentTotal / settings.monthlyBudget) * 100);
  }, [settings.monthlyBudget, spentTotal]);

  // Track over-budget transition to trigger alert popup
  const prevIsOverBudgetRef = useRef<boolean>(false);
  useEffect(() => {
    if (isOverBudget && !prevIsOverBudgetRef.current && settings.monthlyBudget > 0) {
      setIsBudgetAlertModalOpen(true);
    }
    prevIsOverBudgetRef.current = isOverBudget;
  }, [isOverBudget, settings.monthlyBudget]);

  const expensesByCategory = useMemo(() => {
    const categoryTotals: Record<GroceryCategory, number> = {
      Vegetables: 0,
      Fruits: 0,
      Dairy: 0,
      Snacks: 0,
      Grains: 0,
      Beverages: 0,
      Household: 0,
      Others: 0,
    };

    purchasedItems.forEach((item) => {
      const line = calculateLineTotal(item.quantity, item.price);
      if (categoryTotals[item.category] !== undefined) {
        categoryTotals[item.category] += line;
      } else {
        categoryTotals.Others += line;
      }
    });

    return CATEGORIES_CONFIG.map((cat) => {
      const amt = categoryTotals[cat.name] || 0;
      const pct = spentTotal > 0 ? Math.round((amt / spentTotal) * 100) : 0;
      return {
        category: cat.name,
        amount: amt,
        percentage: pct,
      };
    }).filter((c) => c.amount > 0 || c.category === 'Vegetables' || c.category === 'Fruits' || c.category === 'Dairy' || c.category === 'Snacks');
  }, [purchasedItems, spentTotal]);

  return (
    <GroceryContext.Provider
      value={{
        items,
        deletedItems,
        purchaseHistory,
        settings,
        activeTab,
        setActiveTab,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        isAddEditModalOpen,
        setIsAddEditModalOpen,
        editingItem,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        itemToRestore,
        setItemToRestore,
        itemToDeletePermanent,
        setItemToDeletePermanent,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isBudgetAlertModalOpen,
        setIsBudgetAlertModalOpen,
        openBudgetAlert,
        isMenuOpen,
        setIsMenuOpen,
        isApkModalOpen,
        setIsApkModalOpen,
        isQuickAddModalOpen,
        setIsQuickAddModalOpen,
        openQuickAddModal,
        addItem,
        addBatchItems,
        updateItem,
        deleteItem,
        restoreItem,
        permanentlyDeleteItem,
        clearAllDeleted,
        togglePurchased,
        updateMonthlyBudget,
        addBackToGroceryList,
        clearPurchaseHistory,
        loginWithPhone,
        loginWithGoogle,
        loginWithBiometrics,
        continueAsGuest,
        logout,
        showLoginScreen,
        setShowLoginScreen,
        updateSettings,
        exportBackupJson,
        importBackupJson,
        resetToDefaultData,
        totalActiveItems,
        purchasedItemsCount,
        spentTotal,
        remainingBudget,
        budgetUsedPercent,
        rawBudgetUsedPercent,
        isOverBudget,
        expensesByCategory,
        toast,
        showToast,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
