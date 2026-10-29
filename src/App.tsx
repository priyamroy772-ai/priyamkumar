import React, { useState } from 'react';
import { GroceryProvider, useGrocery } from './context/GroceryContext';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardScreen } from './components/DashboardScreen';
import { GroceryListScreen } from './components/GroceryListScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { BudgetScreen } from './components/BudgetScreen';
import { PurchaseHistoryScreen } from './components/PurchaseHistoryScreen';
import { RecentlyDeletedScreen } from './components/RecentlyDeletedScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PhoneLoginScreen } from './components/PhoneLoginScreen';
import { AddEditItemModal } from './components/AddEditItemModal';
import { RestoreModal } from './components/RestoreModal';
import { PermanentDeleteModal } from './components/PermanentDeleteModal';
import { BudgetEditModal } from './components/BudgetEditModal';
import { BudgetAlertModal } from './components/BudgetAlertModal';
import { QuickAddCameraModal } from './components/QuickAddCameraModal';
import { SideDrawer } from './components/SideDrawer';
import { SplashScreen } from './components/SplashScreen';
import { ApkInstallModal } from './components/ApkInstallModal';
import { STORAGE_KEYS } from './data/initialData';
import { playPriyamGreeting, preloadPriyamGreeting } from './utils/priyamVoiceGreeter';
import {
  Smartphone,
  Monitor,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    toast,
    showLoginScreen,
    isApkModalOpen,
    setIsApkModalOpen,
  } = useGrocery();

  // On initial app launch, preload and greet Priyam with a sweet female voice if enabled
  React.useEffect(() => {
    preloadPriyamGreeting();
    if (settings.voiceGreetingEnabled !== false) {
      playPriyamGreeting();
    }
  }, [settings.voiceGreetingEnabled]);

  // Show splash on initial load if not dismissed
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEYS.HAS_SEEN_SPLASH);
      return !seen;
    } catch {
      return true;
    }
  });

  const handleCompleteSplash = () => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.HAS_SEEN_SPLASH, 'true');
    } catch {}
    setShowSplash(false);
  };

  // Render the active main screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen />;
      case 'list':
        return <GroceryListScreen />;
      case 'categories':
        return <CategoriesScreen />;
      case 'budget':
        return <BudgetScreen />;
      case 'history':
        return <PurchaseHistoryScreen />;
      case 'deleted':
        return <RecentlyDeletedScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'reports':
        return <PurchaseHistoryScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Screen title for top navigation
  const getScreenTitle = () => {
    switch (activeTab) {
      case 'list':
        return 'My Grocery List';
      case 'categories':
        return 'Categories';
      case 'budget':
        return 'Budget & Expenses';
      case 'history':
        return 'Purchase History';
      case 'reports':
        return 'Price Trends & Reports';
      case 'deleted':
        return 'Recently Deleted';
      case 'settings':
        return 'My Profile & Preferences';
      default:
        return undefined;
    }
  };

  const isSubScreen = activeTab !== 'home';

  return (
    <>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleCompleteSplash} />}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 animate-in slide-in-from-top duration-200 pointer-events-none">
          <div
            className={`p-3.5 rounded-2xl shadow-xl border flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-700'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-white border-slate-700'
                : 'bg-emerald-950/90 text-white border-emerald-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-amber-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <p className="text-xs font-semibold leading-snug">{toast.text}</p>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <SideDrawer />
      <AddEditItemModal />
      <RestoreModal />
      <PermanentDeleteModal />
      <BudgetEditModal />
      <BudgetAlertModal />
      <QuickAddCameraModal />
      <ApkInstallModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />

      {/* Main Container Layout - Phone format on desktop, native edge-to-edge on mobile */}
      <div className="min-h-screen bg-gradient-to-br from-[#FEF9EC] via-[#F8F5EC] to-[#F2EFE8] text-[#1E2022] flex flex-col justify-start">
        {/* Subtle Desktop Helper Bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-2 border-b border-amber-950/[0.05] bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD21F] shadow-xs" />
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider font-display">
              Priyam Grocery Manager · Mobile App Edition
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsApkModalOpen(true)}
              className="text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-[#FFD21F] hover:brightness-105 flex items-center gap-1.5 px-3 py-1 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Convert to APK / Install</span>
            </button>

            <button
              onClick={() => setShowSplash(true)}
              className="text-xs font-semibold text-slate-600 hover:text-amber-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Launch Splash</span>
            </button>
          </div>
        </header>

        {/* Smartphone Device Frame (Realistic phone format on desktop, responsive edge-to-edge on mobile) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center sm:p-4 md:p-6">
          <div className="w-full sm:max-w-[412px] flex-1 flex flex-col bg-[#FFFEF8] relative sm:rounded-[44px] sm:border-[8px] sm:border-slate-900 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_10px_25px_rgba(0,0,0,0.12)] sm:ring-1 sm:ring-slate-800/80 overflow-hidden sm:min-h-[820px] sm:max-h-[880px] min-h-screen">
            {/* Phone Screen Viewport */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative bg-[#FFFEF8]">
              {showLoginScreen ? (
                <div className="flex-1 flex flex-col bg-[#FFFEF8]">
                  <PhoneLoginScreen />
                </div>
              ) : (
                <>
                  {/* Top Navigation */}
                  <TopAppBar
                    showBack={isSubScreen}
                    onBack={() => setActiveTab('home')}
                    title={getScreenTitle()}
                  />

                  {/* Main Content Area */}
                  <main className="flex-1 px-3.5 py-2.5 bg-[#FFFEF8]">
                    {renderScreen()}
                  </main>

                  {/* Bottom Navigation inside the phone */}
                  <BottomNavBar />
                </>
              )}
            </div>

            {/* Phone Bottom Home Bar Pill */}
            <div className="w-full bg-white py-1 flex justify-center items-center z-40 border-t border-slate-100 select-none">
              <div className="w-28 h-1 bg-slate-400/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <GroceryProvider>
      <AppContent />
    </GroceryProvider>
  );
}
