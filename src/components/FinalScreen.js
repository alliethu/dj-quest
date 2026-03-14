import React from 'react';
import { colors, fonts, shared } from '../styles';
import levels from '../data/levels';

export default function FinalScreen({ djName, onPlayAgain }) {
  const containerStyle = {
    ...shared.container,
    gap: '24px',
  };

  const championTitleStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1.8rem, 7vw, 3rem)',
    background: `linear-gradient(135deg, ${colors.pink}, ${colors.yellow}, ${colors.green}, ${colors.blue}, ${colors.purple})`,
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'rainbow 3s ease infinite',
    textAlign: 'center',
    lineHeight: 1.3,
  };

  const nameStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    color: colors.yellow,
    textShadow: `0 0 20px ${colors.yellow}66`,
    textAlign: 'center',
  };

  const badgeRowStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const badgeItemStyle = (i) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    animation: 'badgeBounce 0.6s ease both',
    animationDelay: `${i * 0.15}s`,
  });

  const badgeEmojiStyle = {
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    animation: 'float 3s ease infinite',
  };

  const badgeLabelStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(0.6rem, 2vw, 0.8rem)',
    color: colors.whiteAlpha6,
    textAlign: 'center',
  };

  return (
    <div style={{ ...containerStyle, ...shared.screenAnimation }}>
      {/* Big celebration orbs */}
      {[colors.pink, colors.yellow, colors.green, colors.blue, colors.purple].map((c, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: `${10 + i * 20}%`,
          top: `${20 + (i % 3) * 20}%`,
          width: `${150 + i * 30}px`,
          height: `${150 + i * 30}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${c}18, transparent)`,
          animation: `glow ${3 + i}s ease infinite ${i * 0.5}s`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      {/* Confetti particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`c${i}`} style={{
          position: 'fixed',
          left: `${5 + i * 12}%`,
          bottom: '20%',
          width: '8px',
          height: '8px',
          borderRadius: i % 2 === 0 ? '50%' : '2px',
          background: [colors.pink, colors.yellow, colors.green, colors.blue, colors.purple][i % 5],
          animation: `confetti 2s ease ${i * 0.15}s infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <div style={{ fontSize: '4rem' }}>👑</div>
        <h1 style={championTitleStyle}>🎤 FESTIVAL CHAMPION 🎤</h1>
        <p style={nameStyle}>DJ {djName}</p>

        <div style={badgeRowStyle}>
          {levels.map((level, i) => (
            <div key={level.id} style={badgeItemStyle(i)}>
              <div style={{ ...badgeEmojiStyle, animationDelay: `${i * 0.4}s` }}>
                {level.badge}
              </div>
              <span style={badgeLabelStyle}>{level.name}</span>
            </div>
          ))}
        </div>

        <button
          style={{ ...shared.button, ...shared.primaryButton, marginTop: '16px' }}
          onClick={onPlayAgain}
        >
          🎧 Play Again
        </button>
      </div>
    </div>
  );
}
