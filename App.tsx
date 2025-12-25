import React, { useState, useEffect } from 'react';
import { Home, User as UserIcon } from 'lucide-react';

import VideoFeed from './components/VideoFeed';
import Profile from './components/Profile';
import WalletDrawer from './components/WalletDrawer';

import { INITIAL_USER, INITIAL_EVENTS, MOCK_COMMENTS } from './constants';
import { User, EventData, Bet, ViewState, Comment } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [bets, setBets] = useState<Bet[]>([]);
  // Comments state kept if needed for other features, but detail view is gone
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  
  const [view, setView] = useState<ViewState>('HOME');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  
  // Instant Vote Handler (PRD v4.0 Instant VS Logic)
  const handleInstantVote = (eventId: string, side: 'A' | 'B', amount: number) => {
    if (user.points < amount) {
        alert("Not enough Points! Paki-reload sa wallet.");
        return;
    }

    // 1. Update State
    setUser(prev => ({ ...prev, points: prev.points - amount }));
    setEvents(prev => prev.map(e => {
        if (e.id === eventId) {
            return {
                ...e,
                poolA: side === 'A' ? e.poolA + amount : e.poolA,
                poolB: side === 'B' ? e.poolB + amount : e.poolB
            };
        }
        return e;
    }));

    const newBet: Bet = {
        id: `b${Date.now()}`,
        eventId,
        side,
        amount,
        timestamp: new Date().toISOString()
    };
    setBets(prev => [newBet, ...prev]);
  };

  const handleAddPoints = (amount: number) => {
      setUser(prev => ({ ...prev, points: prev.points + amount }));
  };

  return (
    <div className="h-screen w-full bg-black text-white relative max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col font-sans">
      
      <div className="flex-1 overflow-hidden relative">
        {view === 'HOME' && (
          <VideoFeed 
            events={events} 
            userBets={bets}
            onVote={handleInstantVote}
          />
        )}
        
        {view === 'PROFILE' && (
          <Profile 
            user={user} 
            betHistory={bets} 
            events={events}
          />
        )}
      </div>

      <div className="h-[60px] bg-black border-t border-zinc-900 flex justify-around items-center px-6 z-40">
           <button 
             onClick={() => setView('HOME')}
             className={`flex flex-col items-center gap-1 ${view === 'HOME' ? 'text-white' : 'text-zinc-600'}`}
           >
             <Home size={22} strokeWidth={view === 'HOME' ? 3 : 2} />
             <span className="text-[9px] font-black uppercase italic">Feed</span>
           </button>

           <button 
             onClick={() => setView('PROFILE')}
             className={`flex flex-col items-center gap-1 ${view === 'PROFILE' ? 'text-white' : 'text-zinc-600'}`}
           >
             <UserIcon size={22} strokeWidth={view === 'PROFILE' ? 3 : 2} />
             <span className="text-[9px] font-black uppercase italic">Hub</span>
           </button>
      </div>
      
      {isWalletOpen && (
          <WalletDrawer 
            user={user}
            onClose={() => setIsWalletOpen(false)}
            onAddPoints={handleAddPoints}
          />
      )}
      
    </div>
  );
};

export default App;