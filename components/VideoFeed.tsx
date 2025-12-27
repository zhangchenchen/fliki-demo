import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronsDown, Lock } from 'lucide-react';
import { EventData, Bet, User } from '../types';
import { calculateMultipliers, triggerFeedback } from '../utils';
import { trackVideoViewDuration, trackVoteClicked } from '../utils/analytics';
import PredictionSuccessModal from './PredictionSuccessModal';

interface VideoFeedProps {
  events: EventData[];
  userBets: Bet[];
  user: User;
  onVote: (eventId: string, side: 'A' | 'B', amount: number) => void;
  onAddPoints: (amount: number) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ events, userBets, user, onVote, onAddPoints }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string>(events[0]?.id || '');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // 存储每个视频的开始观看时间（用于计算停留时长）
  const videoStartTimes = useRef<Map<string, number>>(new Map());
  // 存储每个视频是否已经投过票（用于 is_first_vote）
  const videoVoteStatus = useRef<Map<string, boolean>>(new Map());

  // Observer to track which video is in view for Autoplay
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6, // Video must be 60% visible to be considered active
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          if (id) setActiveVideoId(id);
        }
      });
    }, options);

    const elements = document.querySelectorAll('.video-snap-item');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [events]);

  // Effect to track video view duration and manage play/pause
  useEffect(() => {
    const previousVideoId = videoStartTimes.current.size > 0
      ? Array.from(videoStartTimes.current.keys())[videoStartTimes.current.size - 1]
      : null;

    // 如果切换了视频，追踪上一个视频的停留时长
    if (previousVideoId && previousVideoId !== activeVideoId) {
      const startTime = videoStartTimes.current.get(previousVideoId);
      if (startTime) {
        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

        // 只追踪 >= 1 秒的停留
        if (durationSeconds >= 1) {
          const previousEvent = events.find(e => e.id === previousVideoId);
          if (previousEvent) {
            trackVideoViewDuration(
              previousVideoId,
              previousEvent.title || '',
              durationSeconds
            );
          }
        }

        // 清除上一个视频的开始时间
        videoStartTimes.current.delete(previousVideoId);
      }
    }

    // 记录当前视频的开始时间
    if (activeVideoId && !videoStartTimes.current.has(activeVideoId)) {
      videoStartTimes.current.set(activeVideoId, Date.now());
    }

    // Effect to manage play/pause based on activeVideoId
    events.forEach((event) => {
      const videoEl = document.getElementById(`v-${event.id}`) as HTMLVideoElement;
      if (!videoEl) return;

      if (event.id === activeVideoId) {
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log('Autoplay prevented:', error);
          });
        }
      } else {
        videoEl.pause();
        videoEl.currentTime = 0; // Reset video to start
      }
    });
  }, [activeVideoId, events]);

  // 页面关闭或隐藏时，追踪当前视频的停留时长
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeVideoId) {
        const startTime = videoStartTimes.current.get(activeVideoId);
        if (startTime) {
          const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
          if (durationSeconds >= 1) {
            const currentEvent = events.find(e => e.id === activeVideoId);
            if (currentEvent) {
              // 使用 sendBeacon 确保数据发送成功（即使页面关闭）
              trackVideoViewDuration(
                activeVideoId,
                currentEvent.title,
                durationSeconds
              );
            }
          }
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && activeVideoId) {
        const startTime = videoStartTimes.current.get(activeVideoId);
        if (startTime) {
          const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
          if (durationSeconds >= 1) {
            const currentEvent = events.find(e => e.id === activeVideoId);
            if (currentEvent) {
              trackVideoViewDuration(
                activeVideoId,
                currentEvent.title,
                durationSeconds
              );
            }
          }
          // 重置开始时间（用户返回时会重新记录）
          videoStartTimes.current.set(activeVideoId, Date.now());
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeVideoId, events]);

  const handleVoteAction = (eventId: string, side: 'A' | 'B') => {
    triggerFeedback();

    // 获取事件信息用于追踪
    const event = events.find(e => e.id === eventId);
    if (event) {
      const { percentA, percentB } = calculateMultipliers(event.poolA, event.poolB);
      const isFirstVote = !videoVoteStatus.current.get(eventId);

      // 追踪投票事件
      trackVoteClicked(
        eventId,
        event.title,
        side,
        side === 'A' ? event.optionA : event.optionB,
        10, // Default bet amount
        percentA,
        percentB,
        isFirstVote
      );

      // 标记该视频已投票
      videoVoteStatus.current.set(eventId, true);
    }

    onVote(eventId, side, 10); // Default 10 points as per PRD
    setShowSuccessModal(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-60px)] w-full overflow-y-scroll snap-y-mandatory snap-always no-scrollbar bg-black"
    >
      {events.map((event) => {
        const { multA, multB, percentA, percentB } = calculateMultipliers(event.poolA, event.poolB);
        const userBet = userBets.find(b => b.eventId === event.id);
        const hasVoted = !!userBet;

        // Smart Preload Logic:
        // Preload "auto" for current video and the immediate next one.
        // Preload "none" for others to save bandwidth.
        const currentIndex = events.findIndex(e => e.id === activeVideoId);
        const eventIndex = events.findIndex(e => e.id === event.id);
        const shouldPreload = eventIndex === currentIndex || eventIndex === currentIndex + 1;

        return (
          <div
            key={event.id}
            data-id={event.id}
            className="video-snap-item relative w-full h-full snap-center flex items-center justify-center bg-zinc-900 overflow-hidden"
          >

            {/* Immersive Video Layer */}
            <video
              id={`v-${event.id}`}
              src={event.videoUrl}
              poster={event.posterUrl}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
              preload={shouldPreload ? "auto" : "none"}
            />

            {/* Mute Toggle Control & Hint */}
            <div className="absolute top-28 right-4 z-30 flex items-center gap-2">
              {isMuted && (
                <div className="animate-nudge flex items-center">
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-l-lg rounded-tr-lg border border-white/10 shadow-lg">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Tap for Sound
                    </span>
                  </div>
                  {/* Tiny triangle tip pointing to the button */}
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-black/50 border-b-[6px] border-b-transparent backdrop-blur-md" />
                </div>
              )}
              <button
                onClick={toggleMute}
                className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 text-white/90 active:scale-95 transition-all hover:bg-black/50"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

            {/* Instant VS Controls (PRD v4.0 Core Logic) */}
            <div className="absolute bottom-6 left-4 right-4 z-20">
              <div className="flex flex-col gap-4">
                <div className="flex items-end gap-3 px-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-black text-white leading-tight drop-shadow-md">{event.title}</h2>
                    <p className="text-xs text-zinc-300 mt-1 line-clamp-1">{event.description}</p>
                  </div>
                </div>

                {!hasVoted ? (
                  /* --- VOTING STATE --- */
                  <div className="flex h-20 bg-zinc-950/80 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden relative">
                    {/* Option A (Left Red) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleVoteAction(event.id, 'A'); }}
                      className="flex-1 bg-gradient-to-r from-red-600/40 to-transparent flex flex-col items-center justify-center active:scale-95 transition-transform"
                    >
                      <span className="text-[10px] font-black text-red-400 mb-1 uppercase italic">TEAM {event.optionA}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white italic">{percentA}%</span>
                      </div>
                    </button>

                    {/* Center VS Divider */}
                    <div className="w-px h-10 self-center bg-zinc-800" />

                    {/* Option B (Right Blue) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleVoteAction(event.id, 'B'); }}
                      className="flex-1 bg-gradient-to-l from-blue-600/40 to-transparent flex flex-col items-center justify-center active:scale-95 transition-transform"
                    >
                      <span className="text-[10px] font-black text-blue-400 mb-1 uppercase italic">TEAM {event.optionB}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white italic">{percentB}%</span>
                      </div>
                    </button>

                    {/* Bottom Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 flex">
                      <div className="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] transition-all duration-700" style={{ width: `${percentA}%` }} />
                      <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] transition-all duration-700" style={{ width: `${percentB}%` }} />
                    </div>
                  </div>
                ) : (
                  /* --- VOTED STATE (RESULT & SCROLL HINT) --- */
                  <div className="animate-fade-in space-y-4">
                    <div className={`
                                w-full p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between shadow-xl relative overflow-hidden
                                ${userBet.side === 'A' ? 'bg-red-950/80 border-red-500/50' : 'bg-blue-950/80 border-blue-500/50'}
                            `}>
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-2 rounded-full ${userBet.side === 'A' ? 'bg-red-600' : 'bg-blue-600'}`}>
                          <Lock size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold opacity-70 uppercase tracking-wider text-white">You Predicted</div>
                          <div className="text-lg font-black italic text-white leading-none">
                            {userBet.side === 'A' ? event.optionA : event.optionB}
                          </div>
                        </div>
                      </div>

                      <div className="text-right relative z-10">
                        <div className="text-[10px] font-bold opacity-70 uppercase tracking-wider text-white">Potential Win</div>
                        <div className="text-xl font-black text-yellow-400 font-mono">
                          {userBet.potentialWin || Math.floor(userBet.amount * (userBet.side === 'A' ? multA : multB))}
                        </div>
                      </div>

                      {/* Decorative Background Gradient */}
                      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-40 ${userBet.side === 'A' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    </div>

                    {/* Scroll Hint */}
                    <div className="flex flex-col items-center animate-bounce opacity-80">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80 mb-1 text-shadow-sm">Scroll for next battle</span>
                      <ChevronsDown className="text-white drop-shadow-md" size={24} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {showSuccessModal && (
        <PredictionSuccessModal
          onClose={() => setShowSuccessModal(false)}
          userBets={userBets}
          events={events}
          user={user}
          onAddPoints={onAddPoints}
        />
      )}
    </div>
  );
};

export default VideoFeed;