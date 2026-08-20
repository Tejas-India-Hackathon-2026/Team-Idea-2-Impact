import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, MapPin, CheckCircle } from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const { orders, setActiveScreen } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-white pb-24">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white mb-1">My Orders</h2>
        <p className="text-xs text-slate-400">Track and manage your local purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 border border-slate-700/40 rounded-3xl max-w-lg mx-auto">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Support local artisans and home bakers nearby!</p>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {orders.map(order => (
            <div key={order.id} className="p-5 bg-slate-800/90 border border-slate-700/60 rounded-2xl shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div>
                  <span className="font-black text-emerald-400 text-base">{order.id}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{order.createdAt} • from {order.sellerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium">{item.quantity}x {item.product.title}</span>
                    <span className="font-bold text-white">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                </div>
                <button
                  onClick={() => setActiveScreen('order_tracking')}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
