import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import PlayingScreen from './components/PlayingScreen';
import WinScreen from './components/WinScreen';
import FinalScreen from './components/FinalScreen';
import BeatMakerScreen from './components/BeatMakerScreen';
import levels from './data/levels';

const STORAGE_KEY = 'dj-quest-save';
const BEATS_KEY = 'dj-quest-beats';

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

function loadBeats() {
  try {
    const raw = localStorage.getItem(BEATS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeBeats(beats) {
  try {
    localStorage.setItem(BEATS_KEY, JSON.stringify(beats));
  } catch (e) {
    // ignore storage errors
  }
}

function encodeBeat(beat) {
  try {
    const payload = { n: beat.name, b: beat.beats, d: beat.duration };
    return btoa(JSON.stringify(payload));
  } catch (e) {
    return '';
  }
}

function decodeBeat(encoded) {
  try {
    const payload = JSON.parse(atob(encoded));
    if (payload.n && Array.isArray(payload.b) && payload.b.length > 0) {
      return {
        id: Date.now().toString(36),
        name: payload.n,
        beats: payload.b,
        duration: payload.d || 0,
        createdAt: Date.now(),
      };
    }
  } catch (e) {
    // invalid share data
  }
  return null;
}

function App() {
  const [screen, setScreen] = useState('home'); // home | playing | win | final | beatmaker
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [djName, setDjName] = useState('');
  const [unlockedLevels, setUnlockedLevels] = useState([0]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [savedBeats, setSavedBeats] = useState([]);

  // Load save on mount + check for shared beat in URL
  useEffect(() => {
    const save = loadSave();
    setDjName(save.djName);
    setUnlockedLevels(save.unlockedLevels);
    setEarnedBadges(save.earnedBadges);
    setSavedBeats(loadBeats());

    // Check for shared beat in URL params
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('beat');
    if (sharedData) {
      const beat = decodeBeat(sharedData);
      if (beat) {
        setSavedBeats((prev) => {
          const updated = [beat, ...prev];
          writeBeats(updated);
          return updated;
        });
        setScreen('beatmaker');
      }
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Persist game progress on change
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

  const handleOpenBeatMaker = useCallback(() => {
    setScreen('beatmaker');
  }, []);

  const handleSaveBeat = useCallback((beat) => {
    setSavedBeats((prev) => {
      const updated = [beat, ...prev];
      writeBeats(updated);
      return updated;
    });
  }, []);

  const handleDeleteBeat = useCallback((beatId) => {
    setSavedBeats((prev) => {
      const updated = prev.filter((b) => b.id !== beatId);
      writeBeats(updated);
      return updated;
    });
  }, []);

  const handleShareBeat = useCallback((beat) => {
    const encoded = encodeBeat(beat);
    const base = window.location.origin + window.location.pathname;
    return `${base}?beat=${encoded}`;
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
    case 'beatmaker':
      return (
        <BeatMakerScreen
          savedBeats={savedBeats}
          onSaveBeat={handleSaveBeat}
          onDeleteBeat={handleDeleteBeat}
          onGoHome={handleGoHome}
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
          onOpenBeatMaker={handleOpenBeatMaker}
          savedBeatsCount={savedBeats.length}
        />
      );
  }
}

export default App;
