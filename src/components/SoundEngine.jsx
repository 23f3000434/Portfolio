import { useEffect, useRef } from 'react';

const AUDIO_SLICES = [
  { start: 0.46, duration: 0.54 },
  { start: 1.12, duration: 0.63 },
  { start: 2.01, duration: 0.66 },
  { start: 3.05, duration: 0.30 },
  { start: 3.82, duration: 0.38 },
];

export default function SoundEngine({ enabled = true }) {
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const compressorRef = useRef(null);
  const lastScrollY = useRef(0);
  const sliceIndex = useRef(-1);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    let aborted = false;

    // Pre-fetch audio buffer
    fetch('/audio/scroll-sounds.mp3')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load audio');
        return res.arrayBuffer();
      })
      .then(async (arrayBuffer) => {
        if (aborted) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 12;
        compressor.ratio.value = 8;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.12;
        compressor.connect(ctx.destination);
        compressorRef.current = compressor;

        try {
          const decoded = await ctx.decodeAudioData(arrayBuffer);
          if (!aborted) audioBufferRef.current = decoded;
        } catch (e) {
          console.warn('Audio decoding failed', e);
        }
      })
      .catch((err) => {
        console.warn('Scroll sounds could not be loaded:', err);
      });

    const ensureRunningContext = async () => {
      const ctx = audioContextRef.current;
      if (!ctx) return null;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      return ctx.state === 'running' ? ctx : null;
    };

    const playSlice = async (intensity) => {
      if (!enabledRef.current || document.visibilityState !== 'visible') return;

      const ctx = await ensureRunningContext();
      if (!ctx || !audioBufferRef.current || !compressorRef.current) return;

      const offset = 1 + Math.floor(Math.random() * (AUDIO_SLICES.length - 1));
      sliceIndex.current = (sliceIndex.current + offset) % AUDIO_SLICES.length;
      const slice = AUDIO_SLICES[sliceIndex.current];

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const now = ctx.currentTime;
      const endTime = now + slice.duration;
      const targetGain = (0.045 + 0.035 * intensity) * 0.85;

      source.buffer = audioBufferRef.current;
      source.playbackRate.value = 0.96 + 0.08 * Math.random();

      source.connect(gainNode);
      gainNode.connect(compressorRef.current);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(targetGain, now + 0.008);
      gainNode.gain.setValueAtTime(targetGain, endTime - 0.025);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

      source.start(now, slice.start, slice.duration);
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };
    };

    const handleScroll = () => {
      const currentY = window.scrollY || document.documentElement.scrollTop;
      const delta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;

      if (delta > 3) {
        playSlice(Math.min(delta / 25, 1));
      }
    };

    const handleInteraction = () => {
      ensureRunningContext();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      aborted = true;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return null;
}
