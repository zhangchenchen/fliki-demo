import React, { useState, useEffect } from 'react';
import { X, Package, Check, Loader2 } from 'lucide-react';
import { saveToWaitlist, calculateMultipliers } from '../utils';
import { trackEmailSubmitted } from '../utils/analytics';
import { User, Bet, EventData } from '../types';
import Toast from './Toast';

interface PredictionSuccessModalProps {
  onClose: () => void;
  userBets: Bet[];
  events: EventData[];
  user: User;
  onAddPoints: (amount: number) => void;
}

const PredictionSuccessModal: React.FC<PredictionSuccessModalProps> = ({ onClose, userBets, events, user, onAddPoints }) => {
  const [showEffects, setShowEffects] = useState(true);

  // Input Handling
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calculate pending winnings and total asset value
  const pendingWinnings = userBets.reduce((acc, bet) => {
    const event = events.find(e => e.id === bet.eventId);
    if (!event || event.status === 'settled') return acc;
    const { multA, multB } = calculateMultipliers(event.poolA, event.poolB);
    const multiplier = bet.side === 'A' ? multA : multB;
    return acc + Math.floor(bet.amount * multiplier);
  }, 0);
  const totalAssetValue = user.points + pendingWinnings;

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Stop effects after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEffects(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleJoinWaitlist = async () => {
    // 1. Validation
    if (!email || !email.includes('@')) {
      setToast({ show: true, message: "Please enter a valid email address.", type: 'error' });
      return;
    }

    // 检查是否已经提交过（只追踪首次）
    const hasSubmittedBefore = localStorage.getItem('battle_waitlist_email_tracked') === 'true';
    const isReturningUser = !!localStorage.getItem('battle_waitlist_joined');

    setIsSubmitting(true);

    // 2. Artificial Delay (UX): Ensure spinner shows for at least 1 second
    const minDelay = new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Perform Save (500 bonus points)
    const savePromise = saveToWaitlist(email, 'Win Modal Bonus', 500);

    // ADDED: Immediately update local points for better UX
    onAddPoints(500);

    await Promise.all([minDelay, savePromise]);

    setIsSubmitting(false);
    setIsSuccess(true);

    // 追踪邮箱提交（只追踪首次）
    if (!hasSubmittedBefore) {
      trackEmailSubmitted(
        'Win Modal Bonus',
        totalAssetValue,
        pendingWinnings,
        userBets.length,
        isReturningUser
      );
      // 标记已追踪
      localStorage.setItem('battle_waitlist_email_tracked', 'true');
    }

    setToast({ show: true, message: "Points Locked! You're on the list.", type: 'success' });

    // Close modal automatically after a moment of showing success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Generate random confetti particles
  const confetti = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4
  }));

  // Generate random stars
  const stars = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
  }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-6 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      <div className="relative w-full max-w-sm bg-white rounded-[2rem] p-6 pt-10 text-center shadow-2xl animate-slide-up overflow-hidden border-4 border-white/50">

        {/* --- Background Effects (Limited to 3s) --- */}
        {showEffects && (
          <>
            {/* Confetti */}
            {confetti.map((c) => (
              <div
                key={c.id}
                className="absolute -top-4 animate-confetti z-0 pointer-events-none"
                style={{
                  left: c.left,
                  animationDelay: c.delay,
                  backgroundColor: c.color,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0'
                }}
              />
            ))}

            {/* Twinkling Stars */}
            {stars.map((s) => (
              <div
                key={s.id}
                className="absolute text-yellow-400 animate-twinkle z-0 pointer-events-none"
                style={{ top: s.top, left: s.left, animationDelay: s.delay, fontSize: '10px' }}
              >
                ✦
              </div>
            ))}
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Festive Visual (Glow sticks removed) */}
        <div className="mb-4 flex justify-center relative z-10">
          <div className="text-7xl animate-bounce drop-shadow-md relative">
            🥳
          </div>
        </div>

        <h2 className="relative z-10 text-2xl font-black text-orange-500 italic uppercase mb-1 tracking-tight drop-shadow-sm">CONGRATULATIONS!</h2>

        {/* Prize Pool Chest */}
        <div className="relative z-10 flex items-center justify-center gap-2 mb-2 text-orange-500">
          <Package size={28} className="animate-wiggle text-yellow-500 fill-yellow-200" strokeWidth={2.5} />
          <div className="text-xl font-bold">+500 Points</div>
        </div>

        <div className="relative z-10 text-sm font-bold text-zinc-800 mb-6">Prediction Locked</div>

        <p className="relative z-10 text-xs text-zinc-500 mb-6 px-4 leading-relaxed">
          You are early! We have reserved 500 Points for you.
        </p>

        {!isSuccess ? (
          <div className="relative z-10 space-y-3 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email to secure points"
              disabled={isSubmitting}
              className="w-full h-12 px-4 rounded-xl bg-zinc-100 border border-zinc-200 text-sm font-bold text-zinc-800 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            <button
              onClick={handleJoinWaitlist}
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 active:scale-95 transition-transform hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                'Join Waitlist & Lock Points'
              )}
            </button>
          </div>
        ) : (
          <div className="relative z-10 mb-4 bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col items-center animate-fade-in">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <Check className="text-white" size={16} strokeWidth={4} />
            </div>
            <div className="text-sm font-black text-green-600 uppercase">Points Locked!</div>
            <div className="text-xs text-green-700">Check your email soon.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionSuccessModal;