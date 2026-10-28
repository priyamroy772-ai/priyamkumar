import React from 'react';
import { useGrocery } from '../context/GroceryContext';
import { NavigationTab } from '../types';
import { Home, FileText, LayoutGrid, BarChart2 } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, totalActiveItems } = useGrocery();

  const tabs: { key: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'list', label: 'My List', icon: FileText },
    { key: 'categories', label: 'Categories', icon: LayoutGrid },
    { key: 'reports', label: 'Reports', icon: BarChart2 },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-amber-950/[0.05] shadow-[0_-4px_16px_rgba(0,0,0,0.03)] px-3 py-2 w-full mt-auto">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center gap-1">
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.key ||
            (tab.key === 'reports' && (activeTab === 'budget' || activeTab === 'history'));
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-150 select-none cursor-pointer ${
                isActive ? 'text-slate-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FFD21F] text-slate-950 font-bold px-4 py-1 rounded-2xl shadow-xs scale-102'
                    : 'px-2 py-1'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.6] text-slate-950' : 'stroke-[2] text-slate-500'}`} />
                  {tab.key === 'list' && totalActiveItems > 0 && !isActive && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 bg-amber-400 text-amber-950 font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-xs">
                      {totalActiveItems}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-slate-950' : 'font-semibold text-slate-500'}`}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
