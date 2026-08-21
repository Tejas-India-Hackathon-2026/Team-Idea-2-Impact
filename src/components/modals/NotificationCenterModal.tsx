import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, X, ShoppingBag, Truck, MessageSquare, Star, ShieldCheck, AlertCircle } from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const { showNotification } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');

  const [notifList, setNotifList] = useState([
    {
      id: 'n1',
      title: 'Order Confirmed',
      message: 'Your order #LK-2026-000123 has been confirmed by Patna Woodcrafts.',
      type: 'ORDER',
      time: '10 mins ago',
      read: false
    },
    {
      id: 'n2',
      title: 'New Message Received',
      message: 'Patna Woodcrafts: "Your name engraving is ready for dispatch!"',
      type: 'CHAT',
      time: '25 mins ago',
      read: false
    },
    {
      id: 'n3',
      title: 'Out for Delivery',
      message: 'Delivery partner Rahul Kumar is on route to your location.',
      type: 'DELIVERY',
      time: '1 hour ago',
      read: true
    },
    {
      id: 'n4',
      title: 'Return Request Approved',
      message: 'Return request #RET-00123 approved. Refund of ₹799 pending.',
      type: 'RETURN',
      time: 'Yesterday',
      read: true
    }
  ]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifList(prev => prev.map(n => ({ ...n, read: true })));
    showNotification('✓ All notifications marked as read!');
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifs = notifList.filter(n => filterType === 'ALL' || n.type === filterType);
  const unreadCount = notifList.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-sans text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">Notifications Center</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'ORDER', 'CHAT', 'DELIVERY', 'RETURN'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all shrink-0 ${
                filterType === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-1">
              <Bell className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-bold">No notifications found</p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkSingleRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read 
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' 
                    : 'bg-slate-950 border-amber-500/30 text-white shadow-md'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {n.type === 'ORDER' && <ShoppingBag className="w-4 h-4 text-emerald-400" />}
                  {n.type === 'CHAT' && <MessageSquare className="w-4 h-4 text-blue-400" />}
                  {n.type === 'DELIVERY' && <Truck className="w-4 h-4 text-amber-400" />}
                  {n.type === 'RETURN' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
