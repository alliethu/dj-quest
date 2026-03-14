import { useState, useRef, useCallback, useEffect } from 'react';

const BEAT_WINDOW_MS = 1500;
const ENERGY_HIT = 5;
const ENERGY_MISS = 10;
const STARTING_ENERGY = 50;

export default function useGame(level, onWin, onLose) {
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [crowdEnergy, setCrowdEnergy] = useState(STARTING_ENERGY);
  const [activePad, setActivePad] = useState(null);
  const [gameStatus, setGameStatus] = useState('idle'); // idle | playing | won | lost
  const [comboPopKey, setComboPopKey] = useState(0);

  const timerRef = useRef(null);
  const gameStatusRef = useRef(gameStatus);
  const hitsRef = useRef(hits);
  const crowdEnergyRef = useRef(crowdEnergy);

  // Keep refs in sync
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);
  useEffect(() => { hitsRef.current = hits; }, [hits]);
  useEffect(() => { crowdEnergyRef.current = crowdEnergy; }, [crowdEnergy]);

  const pickNextPad = useCallback(() => {
    if (!level) return null;
    const pads = level.padTypes;
    return pads[Math.floor(Math.random() * pads.length)];
  }, [level]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextBeat = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;
    const next = pickNextPad();
    setActivePad(next);
    timerRef.current = setTimeout(() => {
      if (gameStatusRef.current !== 'playing') return;
      // Player missed this beat
      setMisses((m) => m + 1);
      setCombo(0);
      setCrowdEnergy((e) => {
        const newE = Math.max(0, e - ENERGY_MISS);
        if (newE <= 0) {
          setGameStatus('lost');
          setActivePad(null);
          if (onLose) onLose();
          return 0;
        }
        return newE;
      });
      nextBeat();
    }, BEAT_WINDOW_MS);
  }, [pickNextPad, onLose]);

  const startGame = useCallback(() => {
    setHits(0);
    setMisses(0);
    setCombo(0);
    setCrowdEnergy(STARTING_ENERGY);
    setActivePad(null);
    setGameStatus('playing');
    // Small delay before first beat
    setTimeout(() => {
      if (gameStatusRef.current === 'playing') {
        nextBeat();
      }
    }, 500);
  }, [nextBeat]);

  const tapPad = useCallback((padType) => {
    if (gameStatus !== 'playing' || activePad === null) return;

    if (padType === activePad) {
      // Correct hit
      clearTimer();
      const newCombo = combo + 1;
      setCombo(newCombo);

      // Trigger combo pop animation on threshold crossings
      if (newCombo === 3 || newCombo === 5 || newCombo === 7) {
        setComboPopKey((k) => k + 1);
      }

      const comboMultiplier = newCombo >= 7 ? 3 : newCombo >= 5 ? 2.5 : newCombo >= 3 ? 2 : 1;
      const energyGain = Math.round(ENERGY_HIT * comboMultiplier);

      setCrowdEnergy((e) => Math.min(100, e + energyGain));
      const newHits = hits + 1;
      setHits(newHits);

      if (level && newHits >= level.target) {
        setGameStatus('won');
        setActivePad(null);
        if (onWin) onWin();
        return;
      }

      setActivePad(null);
      setTimeout(() => {
        if (gameStatusRef.current === 'playing') {
          nextBeat();
        }
      }, 300);
    } else {
      // Wrong pad
      clearTimer();
      setMisses((m) => m + 1);
      setCombo(0);
      setCrowdEnergy((e) => {
        const newE = Math.max(0, e - ENERGY_MISS);
        if (newE <= 0) {
          setGameStatus('lost');
          setActivePad(null);
          if (onLose) onLose();
          return 0;
        }
        return newE;
      });
      setActivePad(null);
      setTimeout(() => {
        if (gameStatusRef.current === 'playing') {
          nextBeat();
        }
      }, 300);
    }
  }, [gameStatus, activePad, combo, hits, level, clearTimer, nextBeat, onWin, onLose]);

  const resetGame = useCallback(() => {
    clearTimer();
    setHits(0);
    setMisses(0);
    setCombo(0);
    setCrowdEnergy(STARTING_ENERGY);
    setActivePad(null);
    setGameStatus('idle');
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    hits,
    misses,
    combo,
    crowdEnergy,
    activePad,
    gameStatus,
    comboPopKey,
    startGame,
    tapPad,
    resetGame,
  };
}
