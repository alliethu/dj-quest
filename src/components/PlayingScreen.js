import React, { useEffect, useCallback } from 'react';
import { colors, fonts, shared } from '../styles';
import levels from '../data/levels';
import useGame from '../hooks/useGame';
import useAudio from '../hooks/useAudio';
import BeatPad from './BeatPad';
import CrowdEnergyBar from './CrowdEnergyBar';

export default function PlayingScreen({ levelId, onWin, onLose, onQuit }) {
  const level = levels[levelId];
  const { playSound } = useAudio();

  const handleWin = useCallback(() => {
    if (onWin) onWin();
  }, [onWin]);

  const handleLose = useCallback(() => {
    // handled in UI below
  }, []);

  const {
    hits, combo, crowdEnergy, activePad, gameStatus,
    comboPopKey, startGame, tapPad, resetGame,
  } = useGame(level, handleWin, handleLose);

  useEffect(() => {
    startGame();
    return () => resetGame();
  }, [levelId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTap = (padType) => {
    playSound(padType);
    tapPad(padType);
  };

  const comboLabel = combo >= 7 ? '7x+ 🔥🔥🔥' : combo >= 5 ? '5x 🔥🔥' : combo >= 3 ? '3x 🔥' : '';

  const containerStyle = {
    ...shared.container,
    justifyContent: 'flex-start',
    paddingTop: '30px',
    gap: '16px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
  };

  const levelTitleStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1rem, 3.5vw, 1.4rem)',
    color: colors.white,
  };

  const quitButtonStyle = {
    fontFamily: fonts.display,
    fontSize: '0.85rem',
    padding: '8px 18px',
    borderRadius: '50px',
    border: `1px solid ${colors.whiteAlpha2}`,
    background: 'transparent',
    color: colors.whiteAlpha6,
    cursor: 'pointer',
  };

  const statsRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const statStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
    color: colors.white,
    textAlign: 'center',
  };

  const comboStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    color: colors.yellow,
    textShadow: `0 0 20px ${colors.yellow}66`,
    minHeight: '2rem',
    animation: combo >= 3 ? 'bounce 0.5s ease' : 'none',
    key: comboPopKey,
  };

  const padContainerStyle = {
    display: 'flex',
    gap: 'clamp(12px, 3vw, 24px)',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '10px',
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(7, 0, 26, 0.9)',
    zIndex: 10,
    animation: 'fadeIn 0.3s ease',
    gap: '20px',
  };

  const overlayTitleStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
    textAlign: 'center',
  };

  return (
    <div style={{ ...containerStyle, ...shared.screenAnimation }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', top: '5%', right: '5%', width: '200px', height: '200px',
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.green}10, transparent)`,
        animation: 'glow 3s ease infinite', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
        <div style={headerStyle}>
          <span style={levelTitleStyle}>{level.emoji} {level.name}</span>
          <button style={quitButtonStyle} onClick={onQuit}>✕ Quit</button>
        </div>

        <CrowdEnergyBar energy={crowdEnergy} />

        <div style={statsRowStyle}>
          <div style={statStyle}>
            🎯 {hits} / {level.target}
          </div>
          <div style={{ ...comboStyle }} key={comboPopKey}>
            {comboLabel}
          </div>
        </div>

        <div style={padContainerStyle}>
          {level.padTypes.map((padType) => (
            <BeatPad
              key={padType}
              padType={padType}
              isActive={activePad === padType}
              onTap={handleTap}
            />
          ))}
        </div>
      </div>

      {/* Game Over overlay */}
      {gameStatus === 'lost' && (
        <div style={overlayStyle}>
          <div style={{ ...overlayTitleStyle, color: colors.pink }}>
            😵 The Crowd Left!
          </div>
          <p style={{ fontFamily: fonts.body, color: colors.whiteAlpha6, fontSize: '1.1rem' }}>
            You got {hits} / {level.target} beats
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              style={{ ...shared.button, ...shared.primaryButton }}
              onClick={() => { resetGame(); startGame(); }}
            >
              🔄 Try Again
            </button>
            <button
              style={{ ...shared.button, border: `1px solid ${colors.whiteAlpha2}`, background: 'transparent' }}
              onClick={onQuit}
            >
              🏠 Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
