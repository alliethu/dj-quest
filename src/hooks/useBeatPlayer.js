import { useState, useRef, useCallback, useEffect } from 'react';

export default function useBeatPlayer(playSound) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const play = useCallback((beats) => {
    if (!beats || beats.length === 0) return;
    clearTimers();
    setIsPlaying(true);

    const timers = beats.map((beat, i) => {
      return setTimeout(() => {
        playSound(beat.padType);
        setActivePad(beat.padType);
        // Clear active pad highlight after 200ms
        const clearTimer = setTimeout(() => setActivePad(null), 200);
        timersRef.current.push(clearTimer);
      }, beat.timeOffset);
    });

    // End playback after last beat + buffer
    const lastTime = beats[beats.length - 1].timeOffset;
    const endTimer = setTimeout(() => {
      setIsPlaying(false);
      setActivePad(null);
    }, lastTime + 400);

    timersRef.current = [...timers, endTimer];
  }, [playSound, clearTimers]);

  const stop = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
    setActivePad(null);
  }, [clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return { isPlaying, activePad, play, stop };
}
