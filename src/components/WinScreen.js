import React from 'react';
import { colors, fonts, shared } from '../styles';
import levels from '../data/levels';

export default function WinScreen({ levelId, onNext, onHome }) {
  const level = levels[levelId];
  const isLastLevel = levelId >= levels.length - 1;

  const containerStyle = {
    ...shared.container,
    gap: '24px',
  };

  const badgeStyle = {
    fontSize: 'clamp(4rem, 15vw, 7rem)',
    animation: 'badgeBounce 0.6s ease both',
  };

  const titleStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
    color: colors.green,
    textShadow: `0 0 20px ${colors.green}44`,
    textAlign: 'center',
  };

  const subtitleStyle = {
    fontFamily: fonts.body,
    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    color: colors.whiteAlpha6,
    textAlign: 'center',
  };

  return (
    <div style={{ ...containerStyle, ...shared.screenAnimation }}>
      {/* Celebration particles */}
      {[colors.pink, colors.yellow, colors.green, colors.blue, colors.purple].map((c, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: `${15 + i * 18}%`,
          bottom: '30%',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: c,
          animation: `confetti 1.5s ease ${i * 0.2}s infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <div style={badgeStyle}>{level.badge}</div>
        <h2 style={titleStyle}>🎉 {level.name} Complete!</h2>
        <p style={subtitleStyle}>You earned the {level.badge} badge!</p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          {!isLastLevel ? (
            <button style={{ ...shared.button, ...shared.primaryButton }} onClick={onNext}>
              ▶️ Next Stage
            </button>
          ) : (
            <button style={{ ...shared.button, ...shared.primaryButton }} onClick={onNext}>
              👑 Festival Champion!
            </button>
          )}
          <button
            style={{ ...shared.button, border: `1px solid ${colors.whiteAlpha2}`, background: 'transparent' }}
            onClick={onHome}
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
