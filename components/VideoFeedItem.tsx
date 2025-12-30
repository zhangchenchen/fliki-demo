import React, { memo } from 'react';
import { Volume2, VolumeX, ChevronsDown, Lock, Play } from 'lucide-react';
import { EventData, Bet } from '../types';
import { calculateMultipliers } from '../utils';
import HLSVideo, { HLSVideoHandle } from './HLSVideo';

interface VideoFeedItemProps {
    event: EventData;
    userBet?: Bet;
    isActive: boolean;
    isPaused: boolean;
    isMuted: boolean;
    shouldPreload: boolean;
    showVoteTooltip: boolean;
    onTogglePlay: () => void;
    onToggleMute: (e: React.MouseEvent) => void;
    onVoteAction: (eventId: string, side: 'A' | 'B') => void;
    setHlsRef: (id: string, ref: HLSVideoHandle | null) => void;
}

const VideoFeedItem: React.FC<VideoFeedItemProps> = memo(({
    event,
    userBet,
    isActive,
    isPaused,
    isMuted,
    shouldPreload,
    showVoteTooltip,
    onTogglePlay,
    onToggleMute,
    onVoteAction,
    setHlsRef
}) => {
    const { multA, multB, percentA, percentB } = calculateMultipliers(event.poolA, event.poolB);
    const hasVoted = !!userBet;

    // Check if the video is from Cloudflare Stream
    const isStreamVideo = event.videoUrl.startsWith('stream://') || (!event.videoUrl.startsWith('http') && event.videoUrl.length > 20);
    const streamSrc = isStreamVideo ? event.videoUrl.replace('stream://', '') : '';

    // Determine if this specific card should show the tooltip
    const shouldShowTooltip = showVoteTooltip && isActive && !hasVoted;

    return (
        <div
            data-id={event.id}
            onClick={onTogglePlay}
            className="video-snap-item relative w-full h-full snap-center flex items-center justify-center bg-zinc-900 overflow-hidden cursor-pointer"
        >
            {/* Immersive Video Layer */}
            {isStreamVideo ? (
                <HLSVideo
                    ref={(ref) => setHlsRef(event.id, ref)}
                    streamId={streamSrc}
                    poster={event.posterUrl}
                    muted={isMuted}
                    autoplay={isActive && !isPaused}
                    loop={true}
                    className="w-full h-full object-cover pointer-events-none"
                    shouldLoad={shouldPreload}
                />
            ) : (
                <video
                    id={`v-${event.id}`}
                    src={event.videoUrl}
                    poster={event.posterUrl}
                    className="w-full h-full object-cover pointer-events-none"
                    loop
                    playsInline
                    muted={isMuted}
                    preload={shouldPreload ? "auto" : "none"}
                />
            )}

            {/* Play Icon Overlay */}
            {isPaused && isActive && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                        <Play size={40} className="text-white fill-white ml-1" />
                    </div>
                </div>
            )}

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
                    onClick={onToggleMute}
                    className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 text-white/90 active:scale-95 transition-all hover:bg-black/50"
                >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

            {/* Instant VS Controls (PRD v4.0 Core Logic) */}
            <div className="absolute bottom-6 left-4 right-4 z-20">
                {/* Tooltip Guide */}
                {shouldShowTooltip && (
                    <div className="absolute -top-16 left-0 right-0 z-50 flex flex-col items-center animate-bounce pointer-events-none">
                        <div className="bg-white text-black px-4 py-2 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider">Click to Predict & Win</span>
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mt-[1px]" />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <div className="flex items-end gap-3 px-2">
                        <div className="flex-1">
                            <h2 className="text-lg font-black text-white leading-tight drop-shadow-md">{event.title}</h2>
                            <p className="text-xs text-zinc-300 mt-1 line-clamp-1">{event.description}</p>
                        </div>
                    </div>

                    {!hasVoted ? (
                        /* --- VOTING STATE --- */
                        <div className={`
                flex h-20 bg-zinc-950/80 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden relative transition-all duration-500
                ${shouldShowTooltip ? 'ring-4 ring-white/60 shadow-[0_0_50px_rgba(255,255,255,0.4)]' : ''}
              `}>
                            {/* Pulse Overlay for Guide */}
                            {shouldShowTooltip && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none z-0" />
                            )}

                            {/* Option A (Left Red) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onVoteAction(event.id, 'A'); }}
                                className="flex-1 bg-gradient-to-r from-red-600/40 to-transparent flex flex-col items-center justify-center active:scale-95 transition-transform z-10"
                            >
                                <span className="text-[10px] font-black text-red-400 mb-1 uppercase italic">TEAM {event.optionA}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white italic">{percentA}%</span>
                                </div>
                            </button>

                            {/* Center VS Divider */}
                            <div className="w-px h-10 self-center bg-zinc-800 z-10" />

                            {/* Option B (Right Blue) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onVoteAction(event.id, 'B'); }}
                                className="flex-1 bg-gradient-to-l from-blue-600/40 to-transparent flex flex-col items-center justify-center active:scale-95 transition-transform z-10"
                            >
                                <span className="text-[10px] font-black text-blue-400 mb-1 uppercase italic">TEAM {event.optionB}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-white italic">{percentB}%</span>
                                </div>
                            </button>

                            {/* Bottom Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800 flex z-10">
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
});

VideoFeedItem.displayName = 'VideoFeedItem';

export default VideoFeedItem;
