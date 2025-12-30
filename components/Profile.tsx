import React, { useState, useEffect } from 'react';
import { User, Bet, EventData } from '../types';
import {
    Coins,
    Lock,
    ShieldAlert,
    ShieldCheck,
    Wallet,
    Trophy,
    ShoppingBag,
    CreditCard,
    Loader2
} from 'lucide-react';
import { calculateMultipliers, saveToWaitlist } from '../utils';
import { trackEmailSubmitted } from '../utils/analytics';
import Toast from './Toast';

interface ProfileProps {
    user: User;
    betHistory: Bet[];
    events: EventData[];
}

const Profile: React.FC<ProfileProps> = ({ user, betHistory, events }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    // Check LocalStorage on mount (Restore state if user refresh)
    useEffect(() => {
        const savedEmail = localStorage.getItem('battle_waitlist_email');
        const isJoined = localStorage.getItem('battle_waitlist_joined');

        if (isJoined === 'true' && savedEmail) {
            setEmail(savedEmail);
            setIsSaved(true);
        }
    }, []);

    // 1. Calculate Potential Value
    // Logic V5: Base 500 + 500 Reward if voted once (Ignore Pending Winnings)
    const hasVoted = betHistory.length > 0;
    const totalAssetValue = 500 + (hasVoted ? 500 : 0);

    const handleSaveProgress = async () => {
        // 1. Validation
        if (!email || !email.includes('@')) {
            setToast({ show: true, message: "Please enter a valid email address.", type: 'error' });
            return;
        }

        // 检查是否已经提交过（只追踪首次）
        const hasSubmittedBefore = localStorage.getItem('battle_waitlist_email_tracked') === 'true';
        const isReturningUser = !!localStorage.getItem('battle_waitlist_joined');

        setIsSubmitting(true);

        // 2. Artificial Delay (UX): Ensure spinner shows for at least 1 second so user sees activity
        const minDelay = new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Perform Save
        const savePromise = saveToWaitlist(email, 'Profile Page', totalAssetValue);

        await Promise.all([minDelay, savePromise]);

        setIsSubmitting(false);
        setIsSaved(true);

        // 追踪邮箱提交（只追踪首次）
        if (!hasSubmittedBefore) {
            trackEmailSubmitted(
                'Profile Page',
                totalAssetValue,
                0, // pendingWinnings no longer tracked for simplification
                betHistory.length,
                isReturningUser
            );
            // 标记已追踪
            localStorage.setItem('battle_waitlist_email_tracked', 'true');
        }

        setToast({ show: true, message: "You're on the list! Points secure.", type: 'success' });
    };

    return (
        <div className="h-full bg-black text-white flex flex-col items-center pt-8 pb-24 px-6 relative overflow-y-auto no-scrollbar font-sans">

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}

            {/* Background Ambient Glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-zinc-900/40 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/30 blur-[100px] rounded-full pointer-events-none" />

            {/* 1. Header */}
            <div className="flex flex-col items-center mb-6 z-10 shrink-0">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 p-1 mb-3 relative">
                    <img src="/logo.webp" className="w-full h-full rounded-full grayscale opacity-60 object-cover" alt="Avatar" />
                    <div className="absolute bottom-0 right-0 bg-black border border-zinc-700 rounded-full p-1.5">
                        <ShieldAlert size={12} className="text-zinc-500" />
                    </div>
                </div>
                <h1 className="text-lg font-black tracking-[0.2em] text-zinc-500 uppercase">GUEST_USER_8821</h1>
            </div>

            {/* 2. The BLACK CARD */}
            <div className="w-full aspect-[1.9/1] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl z-10 flex flex-col justify-between group mx-auto max-w-sm shrink-0">
                {/* Texture */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute -right-4 top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Row */}
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] mb-1">TOTAL ASSET VALUE</span>
                        <span className="text-5xl font-black text-white tracking-tighter tabular-nums">
                            {totalAssetValue.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-zinc-600 opacity-50">
                        <Coins size={32} strokeWidth={1} />
                    </div>
                </div>

                {/* Middle: EMV Chip Visual */}
                <div className="relative z-10 mt-2">
                    <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-600/20 to-yellow-800/10 border border-yellow-600/30 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 border border-yellow-500/20 rounded-[4px] m-[2px]" />
                        <div className="w-[1px] h-full bg-yellow-600/20" />
                        <div className="h-[1px] w-full bg-yellow-600/20" />
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="relative z-10 flex justify-end items-end mt-4">
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        PLATINUM GUEST
                    </div>
                </div>
            </div>

            {/* 3. Activation Section */}
            <div className="w-full max-w-sm mt-6 z-10 space-y-4 shrink-0">
                {!isSaved ? (
                    <>
                        <div className="space-y-3">
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ENTER EMAIL TO JOIN"
                                    className="w-full bg-zinc-900/80 border border-zinc-800 text-white font-mono text-xs p-4 rounded-xl focus:outline-none focus:border-zinc-500 transition-colors text-center placeholder:text-zinc-600 uppercase tracking-wider"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <button
                                onClick={handleSaveProgress}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.15em] text-xs rounded-xl hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-transparent flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        <span>JOINING...</span>
                                    </>
                                ) : (
                                    'JOIN THE WAITLIST'
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full py-8 border border-zinc-800 bg-zinc-900/50 rounded-xl flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                            <ShieldCheck size={20} className="text-green-500" />
                        </div>
                        <div className="text-xs font-black text-white tracking-widest uppercase mb-1">WAITLIST CONFIRMED</div>
                        <div className="text-[10px] text-zinc-500">YOU'RE ON THE LIST WITH {email}</div>
                    </div>
                )}
            </div>

            {/* 4. Locked Footer Icons */}
            <div className="mt-auto w-full max-w-sm flex justify-between items-center px-6 pt-6 opacity-30 pointer-events-none grayscale select-none shrink-0">
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <Wallet size={24} />
                        <div className="absolute -top-1 -right-1"><Lock size={10} /></div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">WALLET</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <Trophy size={24} />
                        <div className="absolute -top-1 -right-1"><Lock size={10} /></div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">RANK</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <ShoppingBag size={24} />
                        <div className="absolute -top-1 -right-1"><Lock size={10} /></div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest">SHOP</span>
                </div>

            </div>
        </div>
    );
};

export default Profile;