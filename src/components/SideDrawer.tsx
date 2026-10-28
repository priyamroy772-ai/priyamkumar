import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { NavigationTab } from '../types';
import { GroceryVisual } from './GroceryVisual';
import {
  Home,
  ClipboardList,
  Grid,
  Wallet,
  Clock,
  Trash2,
  Database,
  X,
  ChevronRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export const SideDrawer: React.FC = () => {
  const {
    isMenuOpen,
    setIsMenuOpen,
    isApkModalOpen,
    setIsApkModalOpen,
    activeTab,
    setActiveTab,
    deletedItems,
    totalActiveItems,
    settings,
    logout,
  } = useGrocery();

  if (!isMenuOpen) return null;

  const navItems: {
    key: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { key: 'home', label: 'Dashboard', icon: Home },
    { key: 'list', label: 'My Grocery List', icon: ClipboardList, badge: totalActiveItems },
    { key: 'categories', label: 'Categories', icon: Grid },
    { key: 'budget', label: 'Budget & Expenses', icon: Wallet },
    { key: 'history', label: 'Purchase History', icon: Clock },
    {
      key: 'deleted',
      label: 'Recently Deleted',
      icon: Trash2,
      badge: deletedItems.length > 0 ? deletedItems.length : undefined,
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    { key: 'settings', label: 'Data & Backup', icon: Database },
  ];

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-amber-100 bg-[#FFFEF8] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GroceryVisual name="basket" size="sm" className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-black text-[#D97706] tracking-tight font-display leading-tight">
                  Priyam
                </h2>
                <p className="text-xs font-semibold text-slate-500">Grocery Manager</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-3.5 mx-3 my-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFD21F] to-amber-500 flex items-center justify-center text-amber-950 font-extrabold text-sm shadow-sm shrink-0">
                {settings.user.name.split(' ').map((n) => n[0]).join('') || 'PR'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {settings.user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {settings.user.phone || settings.user.email}
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-amber-200/50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                {settings.user.authMethod === 'google'
                  ? 'Google Auth'
                  : settings.user.authMethod === 'guest'
                  ? 'Guest Mode'
                  : 'Phone Verified'}
              </span>
              <button
                onClick={logout}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Switch Account
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  onClick={() => handleSelectTab(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100/90 text-amber-950 font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-800' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          item.badgeColor || 'bg-amber-200 text-amber-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </button>
              );
            })}

            {/* Direct APK / Android App Install button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsApkModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-400/25 to-yellow-400/20 text-amber-950 border border-amber-300 hover:bg-amber-100 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>Download APK / Install App</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Android
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Smart Shopping • Better Living
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Local Storage Safe • Version 1.0
          </p>
        </div>
      </div>
    </div>
  );
};
