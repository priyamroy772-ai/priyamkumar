import React, { useRef, useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import {
  Download,
  Upload,
  RefreshCw,
  Database,
  ShieldCheck,
  Check,
  AlertTriangle,
  Smartphone,
  Info,
  User,
  Heart,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    items,
    deletedItems,
    purchaseHistory,
    settings,
    updateSettings,
    exportBackupJson,
    importBackupJson,
    resetToDefaultData,
    showToast,
    setIsApkModalOpen,
  } = useGrocery();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const result = await importBackupJson(file);
    setIsImporting(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
          Data & Storage
        </h2>
        <p className="text-xs font-semibold text-slate-500">
          Manage your local storage, JSON backups, and profile preferences
        </p>
      </div>

      {/* Android APK & Install Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-400 via-[#FFD21F] to-amber-300 text-slate-950 shadow-md border border-amber-300 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/90 p-2 shadow-xs flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight leading-tight">
                Android App & APK Convert
              </h3>
              <p className="text-[11px] font-semibold text-slate-800">
                Install as full mobile app or download .APK package
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase">
            Android
          </span>
        </div>

        <button
          onClick={() => setIsApkModalOpen(true)}
          className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Convert / Download APK Now</span>
        </button>
      </div>

      {/* User Profile Card */}
      <div className="p-4 rounded-3xl bg-white border border-amber-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD21F] to-amber-500 text-amber-950 font-black text-lg flex items-center justify-center shadow-md">
            PR
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {settings.user.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {settings.user.email}
            </p>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
              {settings.user.phone}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
          Active
        </span>
      </div>

      {/* Storage Health & Local Device notice */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>Local Storage Persistence</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          All your active items, recently deleted groceries, monthly budgets, and purchase histories are automatically saved in your browser's persistent Local Storage.
        </p>
        <div className="pt-2 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Active</span>
            <span className="text-base font-black text-slate-900">{items.length}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">In Trash</span>
            <span className="text-base font-black text-slate-900">{deletedItems.length}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-xl border border-amber-200/60">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">History</span>
            <span className="text-base font-black text-slate-900">{purchaseHistory.length}</span>
          </div>
        </div>
      </div>

      {/* Backup and Restore Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight px-1">
          Backup & Portability
        </h3>

        <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-sm space-y-3">
          {/* Export JSON Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Export Backup File</h4>
              <p className="text-xs text-slate-500">
                Download all groceries and history as a JSON file
              </p>
            </div>
            <button
              onClick={exportBackupJson}
              className="px-3.5 py-2 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON Button */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Import Backup File</h4>
              <p className="text-xs text-slate-500">
                Restore your grocery data from a saved JSON file
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                id="json-backup-upload"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isImporting ? 'Importing...' : 'Import'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset & Reset to Demo Data */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight px-1">
          Demo & Reset Options
        </h3>

        <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Reset to Demo Data</h4>
            <p className="text-xs text-slate-500">
              Restore the showcase dataset matching the reference image
            </p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-amber-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Reset to Demo Data?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will reset active items, deleted items, budget, and purchase history to the showcase items shown in the reference image.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="py-2.5 rounded-xl btn-yellow-3d text-amber-950 font-bold text-xs shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
