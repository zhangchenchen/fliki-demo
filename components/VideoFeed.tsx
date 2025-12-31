import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EventData, Bet, User } from '../types';
import { calculateMultipliers, triggerFeedback } from '../utils';
import { trackVideoViewDuration, trackVoteClicked } from '../utils/analytics';
import PredictionSuccessModal from './PredictionSuccessModal';
import { HLSVideoHandle } from './HLSVideo';
import VideoFeedItem from './VideoFeedItem';

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
  const [isPaused, setIsPaused] = useState(false);
  const [showGuide, setShowGuide] = useState(false);


  const containerRef = useRef<HTMLDivElement>(null);
  // Store refs for all HLS video players
  const hlsVideoRefs = useRef<Map<string, HLSVideoHandle | null>>(new Map());
  // 存储每个视频的开始观看时间（用于计算停留时长）
  const videoStartTimes = useRef<Map<string, number>>(new Map());
  // 存储每个视频是否已经投过票（用于 is_first_vote）
  const videoVoteStatus = useRef<Map<string, boolean>>(new Map());

  const setHlsRef = useCallback((id: string, ref: HLSVideoHandle | null) => {
    if (ref) {
      hlsVideoRefs.current.set(id, ref);
    } else {
      hlsVideoRefs.current.delete(id);
    }
  }, []);

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

  // Reset pause state when video changes
  useEffect(() => {
    setIsPaused(false);
  }, [activeVideoId]);

  // Handle play/pause when activeVideoId changes
  useEffect(() => {
    // Pause all videos except the active one
    hlsVideoRefs.current.forEach((ref, id) => {
      if (id === activeVideoId) {
        ref?.play();
      } else {
        ref?.pause();
      }
    });

    // Handle native video elements
    events.forEach(event => {
      const videoEl = document.getElementById(`v-${event.id}`) as HTMLVideoElement;
      if (videoEl) {
        if (event.id === activeVideoId) {
          videoEl.play().catch(() => { });
        } else {
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      }
    });
  }, [activeVideoId, events]);

  // Sync mute state to all players
  useEffect(() => {
    hlsVideoRefs.current.forEach((ref) => {
      ref?.setMuted(isMuted);
      ref?.setVolume(isMuted ? 0 : 1);
    });

    events.forEach(event => {
      const videoEl = document.getElementById(`v-${event.id}`) as HTMLVideoElement;
      if (videoEl) {
        videoEl.muted = isMuted;
        videoEl.volume = isMuted ? 0 : 1;
      }
    });
  }, [isMuted, events]);

  // Handle isPaused state changes
  useEffect(() => {
    const activeRef = hlsVideoRefs.current.get(activeVideoId);
    const nativeVideo = document.getElementById(`v-${activeVideoId}`) as HTMLVideoElement;

    if (isPaused) {
      activeRef?.pause();
      nativeVideo?.pause();
    } else {
      activeRef?.play();
      nativeVideo?.play().catch(() => { });
    }
  }, [isPaused, activeVideoId]);

  // Effect to track video view duration
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
              previousVideoId as string,
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
  }, [activeVideoId, events]);

  // Check for first-time user guide
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('has_seen_guide');
    if (!hasSeenGuide) {
      // Mark as seen immediately so it doesn't show again on re-entry/refresh
      localStorage.setItem('has_seen_guide', 'true');
      setShowGuide(true);
    }
  }, []);


  const handleVoteAction = useCallback((eventId: string, side: 'A' | 'B') => {
    triggerFeedback();

    const event = events.find(e => e.id === eventId);
    if (event) {
      const { percentA, percentB } = calculateMultipliers(event.poolA, event.poolB);
      const isFirstVote = !videoVoteStatus.current.get(eventId);

      trackVoteClicked(
        eventId,
        event.title,
        side,
        side === 'A' ? event.optionA : event.optionB,
        10,
        percentA,
        percentB,
        isFirstVote
      );

      videoVoteStatus.current.set(eventId, true);
      setShowGuide(false);
    }

    onVote(eventId, side, 10);
    setShowSuccessModal(true);
  }, [events, onVote]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-60px)] w-full overflow-y-scroll snap-y-mandatory snap-always no-scrollbar bg-black"
    >
      {events.map((event) => {
        const userBet = userBets.find(b => b.eventId === event.id);
        const currentIndex = events.findIndex(e => e.id === activeVideoId);
        const eventIndex = events.findIndex(e => e.id === event.id);
        // Conservative preload: only current + next video (weak network friendly)
        const shouldPreload = eventIndex === currentIndex || eventIndex === currentIndex + 1;
        const isActive = event.id === activeVideoId;

        return (
          <VideoFeedItem
            key={event.id}
            event={event}
            userBet={userBet}
            isActive={isActive}
            isPaused={isPaused}
            isMuted={isMuted}
            shouldPreload={shouldPreload}
            onTogglePlay={handleTogglePlay}
            onToggleMute={toggleMute}
            onVoteAction={handleVoteAction}
            setHlsRef={setHlsRef}
            showGuide={showGuide && isActive}
          />
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