import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, Send, Image as ImageIcon, Video, Search, 
  ArrowLeft, ShieldCheck, Check, CheckCheck, Store, Flag, 
  ShoppingBag, ExternalLink, Sparkles, X, Plus 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'seller';
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  imageUrl?: string;
  videoUrl?: string;
  productContext?: { title: string; price: number; image: string };
  orderContext?: { orderId: string; total: number; status: string };
}

interface Conversation {
  id: string;
  sellerName: string;
  sellerAvatar: string;
  verified: boolean;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export const CustomerChatView: React.FC = () => {
  const { setActiveScreen, showNotification } = useApp();

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_1',
      sellerName: 'Patna Woodcrafts & Artisans',
      sellerAvatar: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&auto=format&fit=crop&q=80',
      verified: true,
      online: true,
      lastMessage: 'Your custom name engraving is ready for dispatch!',
      lastTime: '2:45 PM',
      unread: 2
    },
    {
      id: 'conv_2',
      sellerName: 'Boring Road Mithai & Sweets',
      sellerAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
      verified: true,
      online: false,
      lastMessage: 'Thank you for ordering fresh Kaju Katli.',
      lastTime: 'Yesterday',
      unread: 0
    }
  ]);

  const [selectedConvId, setSelectedConvId] = useState<string>('conv_1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    conv_1: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Hi! Can you engrave the name "Anushka" on the handmade wooden lamp?',
        time: '2:30 PM',
        status: 'read',
        productContext: {
          title: 'Handmade Wooden Carved Lamp',
          price: 799,
          image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=400&auto=format&fit=crop&q=80'
        }
      },
      {
        id: 'm2',
        sender: 'seller',
        text: 'Hello! Yes, we offer free custom name engraving for local Patna orders.',
        time: '2:35 PM',
        status: 'read'
      },
      {
        id: 'm3',
        sender: 'seller',
        text: 'Your custom name engraving is ready for dispatch!',
        time: '2:45 PM',
        status: 'delivered',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
      }
    ],
    conv_2: [
      {
        id: 'm10',
        sender: 'seller',
        text: 'Thank you for ordering fresh Kaju Katli.',
        time: 'Yesterday',
        status: 'read'
      }
    ]
  });

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
  const activeMessages = messages[selectedConvId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedPhoto && !attachedVideo) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      text: inputText.trim(),
      time: 'Just now',
      status: 'sent',
      imageUrl: attachedPhoto || undefined,
      videoUrl: attachedVideo || undefined
    };

    setMessages(prev => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), newMsg]
    }));

    // Update conversation last message
    setConversations(prev => prev.map(c => c.id === selectedConvId ? { ...c, lastMessage: inputText.trim() || 'Sent attachment', lastTime: 'Just now', unread: 0 } : c));

    setInputText('');
    setAttachedPhoto(null);
    setAttachedVideo(null);
  };

  const handleAddSamplePhoto = () => {
    setAttachedPhoto('https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop&q=80');
    showNotification('✓ Photo attached to message!');
  };

  const handleAddSampleVideo = () => {
    setAttachedVideo('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-craft-box-43093-large.mp4');
    showNotification('✓ Video attached to message!');
  };

  const handleReportMessage = (msgId: string) => {
    showNotification(`Message #${msgId} reported for moderation.`);
  };

  const filteredConversations = conversations.filter(c => 
    c.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4 font-sans text-white pb-28 min-h-screen">
      
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
              <MessageSquare className="w-6 h-6 text-blue-400" /> Customer ↔ Seller Messaging
            </h1>
          </div>
        </div>
      </div>

      {/* DUAL-PANE CHAT CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* LEFT SIDEBAR: Conversations List (4 Cols) */}
        <div className="md:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/60">
          
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sellers or chats..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Conversations Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConversations.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedConvId(c.id);
                  setConversations(prev => prev.map(conv => conv.id === c.id ? { ...conv, unread: 0 } : conv));
                }}
                className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 hover:bg-slate-900/80 ${
                  selectedConvId === c.id ? 'bg-slate-900 border-l-4 border-blue-400' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img src={c.sellerAvatar} alt={c.sellerName} className="w-11 h-11 rounded-xl object-cover border border-slate-700" />
                  {c.online && (
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{c.sellerName}</h4>
                      {c.verified && <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{c.lastTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-400 truncate">{c.lastMessage}</p>
                    {c.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL: Active Chat Thread (8 Cols) */}
        <div className="md:col-span-8 flex flex-col bg-slate-900">
          
          {/* Active Seller Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-3">
              <img src={activeConv.sellerAvatar} alt={activeConv.sellerName} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">{activeConv.sellerName}</h3>
                  {activeConv.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeConv.online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  {activeConv.online ? 'Online now' : 'Offline • Replies in ~15 mins'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[450px]">
            {activeMessages.map((m) => {
              const isCustomer = m.sender === 'customer';

              return (
                <div key={m.id} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} space-y-1`}>
                  
                  {/* Shared Product Context Card */}
                  {m.productContext && (
                    <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-2xl max-w-xs space-y-2 mb-1">
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Discussing Product
                      </span>
                      <div className="flex items-center gap-2.5">
                        <img src={m.productContext.image} alt={m.productContext.title} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                        <div>
                          <h5 className="text-xs font-bold text-white truncate">{m.productContext.title}</h5>
                          <span className="text-xs font-extrabold text-emerald-400">₹{m.productContext.price}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shared Order Context Card */}
                  {m.orderContext && (
                    <div className="p-3 bg-slate-950 border border-blue-500/30 rounded-2xl max-w-xs space-y-1 mb-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        Order #{m.orderContext.orderId}
                      </span>
                      <p className="text-xs font-bold text-white">Status: {m.orderContext.status}</p>
                    </div>
                  )}

                  {/* Chat Bubble */}
                  <div className={`p-3.5 rounded-2xl max-w-sm text-xs space-y-2 shadow-md ${
                    isCustomer 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed">{m.text}</p>

                    {/* Image Attachment */}
                    {m.imageUrl && (
                      <img src={m.imageUrl} alt="Attached photo" className="w-48 h-32 rounded-xl object-cover border border-slate-700" />
                    )}

                    {/* Video Attachment */}
                    {m.videoUrl && (
                      <div className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-[11px] text-blue-300 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" /> Video attachment shared
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Delivery Ticks */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 px-1">
                    <span>{m.time}</span>
                    {isCustomer && (
                      <span>
                        {m.status === 'read' ? <CheckCheck className="w-3 h-3 text-emerald-400 inline" /> : <Check className="w-3 h-3 text-slate-400 inline" />}
                      </span>
                    )}
                    <button onClick={() => handleReportMessage(m.id)} className="hover:text-slate-300 ml-2">
                      <Flag className="w-2.5 h-2.5 inline" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Attachment Previews */}
          {(attachedPhoto || attachedVideo) && (
            <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              {attachedPhoto && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700">
                  <img src={attachedPhoto} alt="Pre-send attachment" className="w-full h-full object-cover" />
                  <button onClick={() => setAttachedPhoto(null)} className="absolute top-0 right-0 bg-slate-950 text-white p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {attachedVideo && (
                <div className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] text-blue-400 flex items-center gap-1">
                  <Video className="w-3 h-3" /> Attached Video
                  <button onClick={() => setAttachedVideo(null)} className="text-slate-400 hover:text-white ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddSamplePhoto}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Attach Photo"
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              type="button"
              onClick={handleAddSampleVideo}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Attach Video"
            >
              <Video className="w-4 h-4 text-blue-400" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to seller..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-400"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
