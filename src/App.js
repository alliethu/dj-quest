import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import PlayingScreen from './components/PlayingScreen';
import WinScreen from './components/WinScreen';
import FinalScreen from './components/FinalScreen';
import levels from './data/levels';

const STORAGE_KEY = 'dj-quest-save';

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        djName: data.djName || '',
        unlockedLevels: data.unlockedLevels || [0],
        earnedBadges: data.earnedBadges || [],
      };
    }
  } catch (e) {
    // ignore corrupt save
  }
  return { djName: '', unlockedLevels: [0], earnedBadges: [] };
}

function writeSave(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore storage errors
  }
}

function App() {
  const [screen, setScreen] = useState('home'); // home | playing | win | final
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [djName, setDjName] = useState('');
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const [earnedBadges, setEarnedBadges] = useState([]);

  // Load save on mount
  useEffect(() => {
    const save = loadSave();
    setDjName(save.djName);
    setUnlockedLevels(save.unlockedLevels);
    setEarnedBadges(save.earnedBadges);
  }, []);

  // Persist on change
  useEffect(() => {
    if (djName) {
      writeSave({ djName, unlockedLevels, earnedBadges });
    }
  }, [djName, unlockedLevels, earnedBadges]);

  const handleSetDjName = useCallback((name) => {
    setDjName(name);
  }, []);

  const handleSelectLevel = useCallback((levelId) => {
    setSelectedLevel(levelId);
    setScreen('playing');
  }, []);

  const handleWin = useCallback(() => {
    const levelId = selectedLevel;
    setEarnedBadges((prev) => {
      if (prev.includes(levelId)) return prev;
      return [...prev, levelId];
    });
    // Unlock next level
    const nextId = levelId + 1;
    if (nextId < levels.length) {
      setUnlockedLevels((prev) => {
        if (prev.includes(nextId)) return prev;
        return [...prev, nextId];
      });
    }
    setScreen('win');
  }, [selectedLevel]);

  const handleNextFromWin = useCallback(() => {
    const nextId = selectedLevel + 1;
    if (nextId >= levels.length) {
      setScreen('final');
    } else {
      setSelectedLevel(nextId);
      setScreen('playing');
    }
  }, [selectedLevel]);

  const handleGoHome = useCallback(() => {
    setScreen('home');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen('home');
  }, []);

  const handleQuit = useCallback(() => {
    setScreen('home');
  }, []);

  switch (screen) {
    case 'playing':
      return (
        <PlayingScreen
          levelId={selectedLevel}
          onWin={handleWin}
          onLose={() => {}}
          onQuit={handleQuit}
        />
      );
    case 'win':
      return (
        <WinScreen
          levelId={selectedLevel}
          onNext={handleNextFromWin}
          onHome={handleGoHome}
        />
      );
    case 'final':
      return (
        <FinalScreen
          djName={djName}
          onPlayAgain={handlePlayAgain}
        />
      );
    default:
      return (
        <HomeScreen
          djName={djName}
          setDjName={handleSetDjName}
          unlockedLevels={unlockedLevels}
          earnedBadges={earnedBadges}
          onSelectLevel={handleSelectLevel}
        />
      );
  }
}

export default App;
