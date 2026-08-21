import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  RotateCcw, ShieldCheck, ArrowLeft, Clock, 
  AlertCircle, CheckCircle2, RefreshCw, ChevronRight, X 
} from 'lucide-react';

export const CustomerReturnsView: React.FC = () => {
  const { setActiveScreen, showNotification } = useApp();

  const [returnsList, setReturnsList] = useState([
    {
      id: 'RET-00123',
      orderId: 'LK-2026-000123',
      productName: 'Handmade Wooden Lamp',
      sellerName: 'Patna Woodcrafts',
      reason: 'Product damaged on arrival',
      details: 'Lamp glass was cracked during transit.',
      status: 'UNDER_REVIEW',
      refundStatus: 'PENDING',
      refundAmount: 799,
      date: 'Aug 21, 2026',
      photos: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80']
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-rose-400" /> My Returns & Refunds
            </h1>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
          {returnsList.length} Active Returns
        </span>
      </div>

      {/* Returns List */}
      {returnsList.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <RotateCcw className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No return requests filed</h3>
          <p className="text-xs text-slate-400">All your delivered orders are in good standing.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {returnsList.map((ret) => (
            <div key={ret.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono font-black text-rose-400 text-sm">{ret.id}</span>
                  <p className="text-xs text-slate-400">Order: <strong className="text-slate-200">{ret.orderId}</strong> • {ret.date}</p>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                  {ret.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <strong className="text-white">{ret.productName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller:</span>
                  <strong className="text-slate-200">{ret.sellerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reason:</span>
                  <span className="text-rose-400 font-semibold">{ret.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Refund Amount:</span>
                  <strong className="text-emerald-400 text-sm">₹{ret.refundAmount}</strong>
                </div>
              </div>

              {/* Evidence Preview */}
              {ret.photos && ret.photos.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Uploaded Evidence</span>
                  <div className="flex gap-2">
                    {ret.photos.map((img, idx) => (
                      <img key={idx} src={img} alt="Evidence" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
