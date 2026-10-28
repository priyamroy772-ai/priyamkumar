import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import {
  Menu,
  ArrowLeft,
  Bell,
  RotateCw,
  User,
  ChevronDown,
} from 'lucide-react';
import { GroceryVisual } from './GroceryVisual';

interface TopAppBarProps {
  onBack?: () => void;
  showBack?: boolean;
  title?: string;
  rightAction?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onBack,
  showBack = false,
  title,
  rightAction,
}) => {
  const { activeTab, setActiveTab, setIsMenuOpen, showToast, settings } = useGrocery();

  return (
    <header className="sticky top-0 z-30 bg-[#FFFEF8] border-b border-amber-950/[0.04] px-3.5 py-2.5 flex items-center justify-between min-h-[58px] transition-all">
      {/* Left Area: Hamburger Menu or Back Arrow */}
      <div className="flex items-center gap-2.5">
        {showBack ? (
          <button
            onClick={onBack || (() => setActiveTab('home'))}
            className="w-10 h-10 rounded-2xl bg-amber-50/80 border border-amber-200/70 shadow-xs flex items-center justify-center text-slate-800 hover:bg-amber-100/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800 stroke-[2.4]" />
          </button>
        ) : (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-2xl bg-amber-50/80 border border-amber-200/70 shadow-xs flex items-center justify-center text-slate-800 hover:bg-amber-100/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-800 stroke-[2.4]" />
          </button>
        )}

        {/* Center Title or Priyam PRO Grocery Manager Branding */}
        {title ? (
          <h1 className="text-base font-extrabold text-slate-900 truncate tracking-tight font-display">
            {title}
          </h1>
        ) : (
          <div className="flex items-center gap-2">
            {/* 3D Basket Logo */}
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <GroceryVisual name="basket" size="sm" className="w-9 h-9" />
            </div>

            {/* Priyam PRO Branding */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black text-slate-900 tracking-tight font-display">
                  Priyam
                </span>
                <span className="bg-[#00B050] text-white font-black text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                  PRO
                </span>
              </div>
              <span className="text-[8.5px] font-extrabold text-slate-500 tracking-[0.14em] uppercase mt-0.5">
                GROCERY MANAGER
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Right Icons matching reference screenshot: Bell with notification, Sync, Profile */}
      <div className="flex items-center gap-1.5">
        {rightAction}

        {/* Notification Bell with red indicator dot */}
        <button
          type="button"
          onClick={() => showToast('You have 2 items running low on stock!', 'info')}
          className="w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all relative cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-800 fill-slate-800/10 stroke-[2.2]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Sync / Refresh Button */}
        <button
          type="button"
          onClick={() => showToast('Synced checklist with local database', 'success')}
          className="w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          title="Sync & Refresh"
          aria-label="Sync"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-800 stroke-[2.3]" />
        </button>

        {/* Profile Pill with Avatar & Name */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          title="User Profile"
          aria-label="User Profile"
        >
          <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 tracking-tight hidden xxs:inline">
            {settings.user.name.split(' ')[0] || 'Priyam'}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </header>
  );
};
