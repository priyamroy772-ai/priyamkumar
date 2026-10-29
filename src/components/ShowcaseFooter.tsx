import React from 'react';
import { GroceryVisual } from './GroceryVisual';

export const ShowcaseFooter: React.FC = () => {
  return (
    <footer className="mt-2 pt-3 pb-4 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
        <GroceryVisual name="basket" size="sm" className="w-5 h-5 opacity-70" />
        <span className="font-semibold text-slate-500">Priyam Grocery Manager</span>
        <span>•</span>
        <span>Smart Family Checklist</span>
      </div>
    </footer>
  );
};
