import React, { useState } from 'react';
import { X, Trophy, Coins, CheckCircle2, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import { EventData, User } from '../types';
import { calculateOdds, formatNumber } from '../utils';

interface BettingDrawerProps {
  event: EventData;
  user: User;
  onClose: () => void;
  onPlaceBet: (eventId: string, side: 'A' | 'B', amount: number) => void;
  // Removed onNavigateToDetail prop
}

const BettingDrawer: React.FC<BettingDrawerProps> = ({ event, user, onClose, onPlaceBet }) => {
  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS'>('IDLE');

  const { oddsA, oddsB } = calculateOdds(event.poolA, event.poolB);

  const chips = [10, 50, 100, 'All-in'];

  const handleChipClick = (val: number | string) => {
    if (val === 'All-in') {
      setBetAmount(user.points);
    } else {
      setBetAmount((prev) => Math.min(prev + (val as number), user.points));
    }
  };

  const handleConfirm = () => {
    if (selectedSide && betAmount > 0) {
      setStatus('LOADING');
      // Simulate API call
      setTimeout(() => {
        onPlaceBet(event.id, selectedSide, betAmount);
        setStatus('SUCCESS');
      }, 1200);
    }
  };

  // --- Success View ---
  if (status === 'SUCCESS') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
         <div 
          className="w-[90%] max-w-sm bg-zinc-900 border border-zinc-700 rounded-3xl p-8 shadow-2xl animate-slide-up flex flex-col items-center text-center"
          onClick={(e) => e.stopPropagation()}
         >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Prediction Locked!</h3>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                You've backed <span className={selectedSide === 'A' ? 'text-red-500 font-bold' : 'text-blue-500 font-bold'}>{selectedSide === 'A' ? 'Option A' : 'Option B'}</span>. 
            </p>

            <div className="w-full space-y-3">
                <button 
                    onClick={onClose}
                    className="w-full py-3.5 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors"
                >
                    Keep Scrolling
                </button>
            </div>
         </div>
      </div>
    );
  }

  // --- Betting View ---
  const getButtonState = () => {
    if (status === 'LOADING') return { text: "PROCESSING...", disabled: true };
    if (!selectedSide) return { text: "Tap Option A or B above to Start", disabled: true };
    if (betAmount === 0) return { text: "Select Wager Amount", disabled: true };
    return { text: `CONFIRM ${selectedSide === 'A' ? 'RED' : 'BLUE'} PREDICTION`, disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-zinc-900 border-t border-zinc-700 rounded-t-3xl p-6 shadow-2xl animate-slide-up pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Place Your Prediction
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Side Selection Cards */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setSelectedSide('A')}
            disabled={status === 'LOADING'}
            className={`flex-1 p-4 rounded-xl border-2 text-left relative transition-all active:scale-95 duration-200 group ${
              selectedSide === 'A' 
                ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500 hover:bg-zinc-750'
            }`}
          >
            {selectedSide === 'A' && <div className="absolute top-2 right-2 text-red-500"><CheckCircle2 size={16} /></div>}
            <div className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Option A</div>
            <div className="font-bold text-lg mb-1 leading-tight text-white group-hover:text-red-400 transition-colors">{event.optionA}</div>
            <div className="text-red-500 font-mono font-bold text-xl">x{oddsA}</div>
          </button>

          <button 
            onClick={() => setSelectedSide('B')}
            disabled={status === 'LOADING'}
            className={`flex-1 p-4 rounded-xl border-2 text-left relative transition-all active:scale-95 duration-200 group ${
              selectedSide === 'B' 
                ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500 hover:bg-zinc-750'
            }`}
          >
             {selectedSide === 'B' && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle2 size={16} /></div>}
             <div className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Option B</div>
             <div className="font-bold text-lg mb-1 leading-tight text-white group-hover:text-blue-400 transition-colors">{event.optionB}</div>
             <div className="text-blue-500 font-mono font-bold text-xl">x{oddsB}</div>
          </button>
        </div>

        {/* Chip Selection */}
        <div className={`mb-8 transition-opacity duration-300 ${selectedSide ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'}`}>
          <div className="flex justify-between items-center mb-3">
             <span className="text-sm font-medium text-zinc-300">Wager Amount</span>
             <span className="text-sm text-yellow-500 font-mono flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded">
                <Coins size={14} /> Balance: {formatNumber(user.points)}
             </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {chips.map((chip) => (
              <button
                key={chip}
                disabled={status === 'LOADING'}
                onClick={() => handleChipClick(chip)}
                className="py-3 rounded-lg bg-zinc-800 border border-zinc-700 font-bold hover:bg-zinc-700 hover:border-zinc-500 active:scale-95 transition-all text-sm text-white shadow-sm disabled:opacity-50"
              >
                {chip === 'All-in' ? 'ALL' : `+${chip}`}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 text-sm font-medium">Total at Risk</span>
            <span className={`text-2xl font-bold font-mono ${betAmount > 0 ? 'text-white' : 'text-zinc-600'}`}>{betAmount}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={buttonState.disabled}
          onClick={handleConfirm}
          className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
            !buttonState.disabled
              ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-amber-500/20 active:scale-95 hover:brightness-110'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          {status === 'LOADING' ? <Loader2 className="animate-spin" /> : null}
          {buttonState.text}
        </button>
      </div>
    </div>
  );
};

export default BettingDrawer;