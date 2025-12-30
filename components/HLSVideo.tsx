import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Hls from 'hls.js';

interface HLSVideoProps {
    streamId: string;
    poster?: string;
    muted: boolean;
    autoplay: boolean;
    loop?: boolean;
    className?: string;
    shouldLoad?: boolean;
    onReady?: () => void;
}

export interface HLSVideoHandle {
    play: () => Promise<void>;
    pause: () => void;
    setMuted: (muted: boolean) => void;
    setVolume: (volume: number) => void;
    getVideoElement: () => HTMLVideoElement | null;
}

const CUSTOMER_ID = 'edk1yimvl6deo1m0';

const HLSVideo = forwardRef<HLSVideoHandle, HLSVideoProps>(({
    streamId,
    poster,
    muted,
    autoplay,
    loop = true,
    className = '',
    shouldLoad = false,
    onReady
}, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    // Expose control methods to parent component
    useImperativeHandle(ref, () => ({
        play: async () => {
            if (videoRef.current) {
                try {
                    await videoRef.current.play();
                } catch (e) {
                    // Ignore play errors (AbortError, etc)
                }
            }
        },
        pause: () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        },
        setMuted: (m: boolean) => {
            if (videoRef.current) {
                videoRef.current.muted = m;
                videoRef.current.volume = m ? 0 : 1;
            }
        },
        setVolume: (v: number) => {
            if (videoRef.current) {
                videoRef.current.volume = v;
            }
        },
        getVideoElement: () => videoRef.current
    }));

    // Store autoplay value to handle cleanup/re-init correctly
    const initialAutoplayRef = useRef(autoplay);
    // Update ref when prop changes
    useEffect(() => {
        initialAutoplayRef.current = autoplay;
    }, [autoplay]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !streamId || !shouldLoad) return;

        const hlsUrl = `https://customer-${CUSTOMER_ID}.cloudflarestream.com/${streamId}/manifest/video.m3u8`;
        let hls: Hls | null = null;

        // Check if HLS is supported natively (Safari)
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
            const handleLoadedMetadata = () => {
                if (initialAutoplayRef.current) {
                    video.play().catch(() => { });
                }
                onReady?.();
            };
            video.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                // Don't clear src here to keep the last frame if used as poster substitute? 
                // Actually clearing src might be safer to stop buffering.
                video.pause();
                video.src = '';
                video.load();
            };
        } else if (Hls.isSupported()) {
            // Use HLS.js for other browsers
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                // Optimize for mobile networks
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
            });

            hlsRef.current = hls;
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (initialAutoplayRef.current) {
                    video.play().catch(() => { });
                }
                onReady?.();
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('HLS fatal error:', data);
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hls?.startLoad();
                    } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hls?.recoverMediaError();
                    }
                }
            });
        } else {
            console.error('HLS is not supported in this browser');
        }

        return () => {
            if (hls) {
                hls.destroy();
                hlsRef.current = null;
            }
        };
    }, [streamId, onReady, shouldLoad]);

    // Sync muted state
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = muted;
            videoRef.current.volume = muted ? 0 : 1;
        }
    }, [muted]);

    // Manual loop fallback - HLS.js may not always respect the loop attribute
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !loop) return;

        const handleEnded = () => {
            video.currentTime = 0;
            video.play().catch(() => { });
        };

        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, [loop]);

    return (
        <video
            ref={videoRef}
            poster={poster}
            className={className}
            muted={muted}
            loop={loop}
            playsInline
            preload="none" // Controlled by HLS init
        />
    );
});

HLSVideo.displayName = 'HLSVideo';

export default HLSVideo;
