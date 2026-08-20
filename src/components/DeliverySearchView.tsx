import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UnifiedSearchBar } from './UnifiedSearchBar';
import { Truck, MapPin, Search, CheckCircle2 } from 'lucide-react';

export const DeliverySearchView: React.FC = () => {
  const { orders } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const deliveryTasks = [
    { id: 'DEL-101', orderId: 'LK1024', pickup: 'Artisan Handicrafts Studio (Local Market)', drop: 'Customer Address, Neighborhood', status: 'Assigned', fee: 35.0 },
    { id: 'DEL-102', orderId: 'LK1025', pickup: 'Maa Shakti Foods (Indiranagar)', drop: 'Ananya Roy, Indiranagar', status: 'Picked Up', fee: 40.0 },
    { id: 'DEL-103', orderId: 'LK1001', pickup: 'Green Valley Farm (HSR Layout)', drop: 'Rahul Verma, HSR Sector 1', status: 'Delivered', fee: 30.0 }
  ];

  const filteredTasks = deliveryTasks.filter(t => 
    !searchQuery || t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-white pb-24">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-blue-400" />
          <h2 className="text-2xl font-black text-white">Delivery Partner Search</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">Search assigned delivery IDs, order numbers (#LK1024), or status</p>

        <UnifiedSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search deliveries & orders"
        />

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="text-slate-400 font-semibold">Try:</span>
          <button onClick={() => setSearchQuery('LK1024')} className="px-2.5 py-1 rounded-lg bg-slate-800 text-blue-300 font-mono">
            LK1024
          </button>
          <button onClick={() => setSearchQuery('Assigned')} className="px-2.5 py-1 rounded-lg bg-slate-800 text-blue-300">
            Assigned
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3">
          Delivery Tasks ({filteredTasks.length})
        </h3>

        {filteredTasks.map(task => (
          <div key={task.id} className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-blue-400 text-sm">{task.id}</span>
                <span className="text-xs font-semibold text-slate-300">Order #{task.orderId}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-500/30 font-bold">{task.status}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Pickup: {task.pickup}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Drop: {task.drop}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-black text-emerald-400 text-base">₹{task.fee}</span>
              <p className="text-[10px] text-slate-400">Trip Earnings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
