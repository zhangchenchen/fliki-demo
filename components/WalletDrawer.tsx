import React from 'react';
import { X, Wallet, Gift, PlayCircle, CreditCard, Coins, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { formatNumber } from '../utils';

interface WalletDrawerProps {
  user: User;
  onClose: () => void;
  onAddPoints: (amount: number) => void;
}

const WalletDrawer: React.FC<WalletDrawerProps> = ({ user, onClose, onAddPoints }) => {
  const [claimed, setClaimed] = React.useState<string | null>(null);

  const handleClaim = (id: string, amount: number) => {
    setClaimed(id);
    onAddPoints(amount);
    // Reset claim state after animation if needed, but for MVP we keep it marked
  };

  const options = [
    { id: 'daily', title: 'Daily Login Bonus', amount: 500, icon: Gift, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'ad', title: 'Watch Video Ad', amount: 200, icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'buy', title: 'Buy 5,000 Points', amount: 5000, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10', isPaid: true },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-md bg-zinc-900 border-t border-zinc-700 rounded-t-3xl p-6 shadow-2xl animate-slide-up pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-500" />
            My Wallet
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl p-6 mb-8 text-black shadow-lg shadow-amber-500/20 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-20">
                <Coins size={100} />
            </div>
            <div className="text-sm font-bold opacity-80 mb-1">Current Balance</div>
            <div className="text-4xl font-mono font-black tracking-tight">{formatNumber(user.points)}</div>
            <div className="text-xs font-bold mt-2 opacity-70">Points available for betting</div>
        </div>

        {/* Top Up Options */}
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-zinc-400 mb-2">Top Up Options</h4>
            
            {options.map((opt) => (
                <button
                    key={opt.id}
                    disabled={claimed === opt.id}
                    onClick={() => handleClaim(opt.id, opt.amount)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all active:scale-95 ${
                        claimed === opt.id 
                            ? 'bg-zinc-800/50 border-zinc-800 opacity-50 cursor-default' 
                            : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750 hover:border-zinc-600'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${opt.bg} ${opt.color}`}>
                            {claimed === opt.id ? <CheckCircle2 size={20} /> : <opt.icon size={20} />}
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-sm">{opt.title}</div>
                            {opt.isPaid ? (
                                <div className="text-xs text-zinc-500">$0.99 USD</div>
                            ) : (
                                <div className="text-xs text-zinc-500">Free</div>
                            )}
                        </div>
                    </div>
                    
                    <div className={`font-mono font-bold ${claimed === opt.id ? 'text-zinc-500' : 'text-yellow-500'}`}>
                        +{formatNumber(opt.amount)}
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WalletDrawer;