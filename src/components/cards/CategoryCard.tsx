import React from 'react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all active:scale-95 group ${
        isSelected
          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/50'
          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      <span className="text-2xl sm:text-3xl mb-1.5 group-hover:scale-110 transition-transform duration-200">
        {category.icon}
      </span>
      <span className="text-xs sm:text-sm font-extrabold leading-tight tracking-tight">
        {category.name}
      </span>
      <span className="text-[10px] text-slate-400 mt-1 font-medium">
        {category.count} Items
      </span>
    </button>
  );
};
