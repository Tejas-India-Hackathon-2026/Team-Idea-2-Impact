import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Apple, Shirt, Utensils, Home, Factory } from 'lucide-react';

export const CustomerCategoriesView: React.FC = () => {
  const { setFilterState, setActiveScreen } = useApp();

  const categoryList = [
    { name: 'Handmade', icon: <Sparkles className="w-8 h-8 text-amber-400" />, desc: 'Terracotta pottery, bamboo crafts & artisan decor', count: '48 items' },
    { name: 'Farm Products', icon: <Apple className="w-8 h-8 text-emerald-400" />, desc: 'Fresh organic veggies & honey straight from farm', count: '32 items' },
    { name: 'Food', icon: <Utensils className="w-8 h-8 text-rose-400" />, desc: 'Homemade pickles, bakery goods & authentic achaar', count: '64 items' },
    { name: 'Clothing', icon: <Shirt className="w-8 h-8 text-purple-400" />, desc: 'Handloom sarees, cotton kurtis & local tailoring', count: '29 items' },
    { name: 'Home Products', icon: <Home className="w-8 h-8 text-blue-400" />, desc: 'Natural cleaning essentials, diyas & wooden tools', count: '50 items' },
    { name: 'Local Manufacturing', icon: <Factory className="w-8 h-8 text-teal-400" />, desc: 'Small-batch goods made in Indian neighborhood units', count: '18 items' }
  ];

  const handleSelect = (cat: string) => {
    setFilterState(prev => ({ ...prev, category: cat }));
    setActiveScreen('search');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-white pb-24">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white mb-1">Local Categories</h2>
        <p className="text-xs text-slate-400">Explore authentic products from neighborhood makers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryList.map(cat => (
          <div
            key={cat.name}
            onClick={() => handleSelect(cat.name)}
            className="p-5 bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all flex items-start gap-4 shadow-lg group"
          >
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/50 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{cat.count}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
