import React, { useState } from 'react';
import { ArrowLeft, Share2, TrendingUp, Ticket, Info, Send, Smile, Zap } from 'lucide-react';
import { EventData, Bet, User, Comment } from '../types';
import { calculateMultipliers, formatNumber } from '../utils';

interface EventDetailProps {
  event: EventData;
  user: User;
  userBet: Bet | undefined;
  comments: Comment[];
  onBack: () => void;
  onPlaceVote: (eventId: string, side: 'A' | 'B', amount: number) => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, user, userBet, comments, onBack, onPlaceVote }) => {
  const [activeTab, setActiveTab] = useState<'ARENA' | 'INTEL'>('ARENA');
  const [msg, setMsg] = useState('');

  const { multA, multB, percentA, percentB, total } = calculateMultipliers(event.poolA, event.poolB);

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-20 no-scrollbar animate-fade-in">
      
      {/* 1. VS Visual Panel (Static for better performance per PRD) */}
      <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
        <img src={event.posterUrl} className="w-full h-full object-cover opacity-60 grayscale-[50%]" alt="Battle" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        
        {/* Navigation */}
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft size={24} />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center">
            <Share2 size={20} />
        </button>

        {/* Huge VS Poster Elements */}
        <div className="absolute inset-0 flex items-center justify-around px-8">
            <div className="flex flex-col items-center gap-2 group animate-slide-up">
                 <div className="w-24 h-24 rounded-full border-4 border-red-500 overflow-hidden shadow-2xl shadow-red-500/20">
                    <img src={`https://picsum.photos/seed/${event.optionA}/200`} className="w-full h-full object-cover" />
                 </div>
                 <div className="text-xs font-black bg-red-600 px-3 py-1 rounded italic uppercase tracking-widest">{event.optionA}</div>
            </div>

            <div className="text-6xl font-black italic text-zinc-700/50 animate-pulse">VS</div>

            <div className="flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                 <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden shadow-2xl shadow-blue-500/20">
                    <img src={`https://picsum.photos/seed/${event.optionB}/200`} className="w-full h-full object-cover" />
                 </div>
                 <div className="text-xs font-black bg-blue-600 px-3 py-1 rounded italic uppercase tracking-widest">{event.optionB}</div>
            </div>
        </div>
      </div>

      {/* 2. Brand Banner Slot (Commercial Core per PRD) */}
      {event.brandName && (
          <div className="px-4 -mt-6 relative z-10">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-4 rounded-2xl flex items-center justify-between shadow-xl border border-white/20">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-black italic">PH</div>
                      <div>
                          <div className="text-[10px] font-black text-black/60 uppercase">Sponsored by {event.brandName}</div>
                          <div className="text-sm font-black text-black uppercase italic">Claim ₱100 Chickenjoy Voucher</div>
                      </div>
                  </div>
                  <button className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase italic hover:scale-105 transition-transform">Get Voucher</button>
              </div>
          </div>
      )}

      {/* 3. Stats & Voting Arena */}
      <div className="p-4 space-y-4">
          <div className="flex gap-4">
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[10px] text-zinc-500 font-black uppercase mb-1">Total Support</div>
                  <div className="text-2xl font-black font-mono">{formatNumber(total)}</div>
              </div>
              <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[10px] text-zinc-500 font-black uppercase mb-1">My Status</div>
                  <div className={`text-sm font-black italic ${userBet ? 'text-yellow-500' : 'text-zinc-500'}`}>
                      {userBet ? `PICKED ${userBet.side === 'A' ? event.optionA : event.optionB}` : 'NO VOTE YET'}
                  </div>
              </div>
          </div>

          {/* Sticker War / Comments */}
          <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black italic uppercase tracking-wider flex items-center gap-2">
                    <Zap className="text-yellow-500 fill-yellow-500" size={18} />
                    Sticker War
                  </h3>
                  <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Active Chat</div>
              </div>

              <div className="space-y-3">
                  {comments.map(c => (
                      <div key={c.id} className={`flex gap-3 ${c.side === 'B' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-10 h-10 rounded-full border-2 p-0.5 shrink-0 ${c.side === 'A' ? 'border-red-500' : 'border-blue-500'}`}>
                              <img src={`https://i.pravatar.cc/100?u=${c.userId}`} className="w-full h-full rounded-full" />
                          </div>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-bold ${
                              c.side === 'A' ? 'bg-red-500/10 text-red-100 border border-red-500/20' : 'bg-blue-500/10 text-blue-100 border border-blue-500/20'
                          }`}>
                              <div className="text-[10px] font-black uppercase opacity-60 mb-1">{c.userName}</div>
                              {c.text}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 4. Social Card Generator (PRD 3.3) */}
      <div className="fixed bottom-20 left-4 right-4 z-40">
           <button className="w-full py-4 bg-zinc-800 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors shadow-2xl">
                <Share2 size={18} className="text-yellow-500" />
                <span className="text-xs font-black uppercase italic tracking-widest text-white">Generate My Battle Card</span>
           </button>
      </div>

      {/* Sticky Bottom Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-zinc-800 flex gap-2">
          <button className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Smile size={24} />
          </button>
          <input 
            type="text" 
            placeholder="Sino lalaban? (Who's fighting?)" 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:border-yellow-500"
          />
          <button className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-black">
              <Send size={24} />
          </button>
      </div>
    </div>
  );
};

export default EventDetail;