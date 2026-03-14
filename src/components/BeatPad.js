import React, { useState } from 'react';
import { padColors, fonts } from '../styles';

const padLabels = {
  KICK: '🥁',
  SNARE: '👏',
  'HI-HAT': '🎩',
  FX: '✨',
};

export default function BeatPad({ padType, isActive, onTap }) {
  const [tapped, setTapped] = useState(false);
  const color = padColors[padType] || '#ffffff';

  const handleTap = () => {
    setTapped(true);
    onTap(padType);
    setTimeout(() => setTapped(false), 150);
  };

  const style = {
    width: 'clamp(80px, 20vw, 130px)',
    height: 'clamp(80px, 20vw, 130px)',
    borderRadius: '50%',
    border: `3px solid ${color}`,
    background: isActive
      ? `radial-gradient(circle, ${color}66 0%, ${color}22 70%)`
      : `radial-gradient(circle, ${color}22 0%, ${color}0a 70%)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    animation: isActive ? 'padPulse 0.8s ease-in-out infinite' : 'none',
    color: color,
    boxShadow: isActive
      ? `0 0 30px ${color}88, 0 0 60px ${color}44`
      : `0 0 10px ${color}22`,
    transform: tapped ? 'scale(0.9)' : 'scale(1)',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const labelStyle = {
    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
    lineHeight: 1,
  };

  const nameStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(0.6rem, 2vw, 0.85rem)',
    marginTop: '4px',
    opacity: 0.9,
    letterSpacing: '1px',
  };

  return (
    <button style={style} onClick={handleTap} aria-label={`${padType} pad`}>
      <span style={labelStyle}>{padLabels[padType]}</span>
      <span style={nameStyle}>{padType}</span>
    </button>
  );
}
