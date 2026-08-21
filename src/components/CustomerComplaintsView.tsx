import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, ShieldCheck, ArrowLeft, Plus, 
  Send, AlertCircle, CheckCircle2, Clock, X 
} from 'lucide-react';

export const CustomerComplaintsView: React.FC = () => {
  const { setActiveScreen, showNotification } = useApp();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [issueType, setIssueType] = useState<string>('Delivery');
  const [description, setDescription] = useState<string>('');

  const [complaintsList, setComplaintsList] = useState([
    {
      id: 'CMP-00123',
      category: 'Delivery',
      description: 'Delivery partner arrived late by 45 minutes.',
      status: 'OPEN',
      date: 'Aug 21, 2026'
    }
  ]);

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newCmp = {
      id: `CMP-${Math.floor(10000 + Math.random() * 90000)}`,
      category: issueType,
      description: description.trim(),
      status: 'OPEN',
      date: 'Just now'
    };

    setComplaintsList(prev => [newCmp, ...prev]);
    setIsModalOpen(false);
    setDescription('');
    showNotification('✓ Support ticket created successfully!');
  };

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
              <MessageSquare className="w-6 h-6 text-blue-400" /> Customer Support & Complaints
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Raise Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {complaintsList.map((cmp) => (
          <div key={cmp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-black text-blue-400 text-sm">{cmp.id}</span>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 ml-2">
                  Category: {cmp.category}
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
                {cmp.status}
              </span>
            </div>

            <p className="text-xs text-slate-300">{cmp.description}</p>
            <span className="text-[10px] text-slate-500 block">Filed on {cmp.date}</span>
          </div>
        ))}
      </div>

      {/* NEW TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Raise Support Ticket
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Delivery">Delivery Issue</option>
                  <option value="Product">Product Quality Issue</option>
                  <option value="Seller">Seller Behavior</option>
                  <option value="Payment">Payment & Charges</option>
                  <option value="Return">Return & Refund Delay</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-blue-400"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
