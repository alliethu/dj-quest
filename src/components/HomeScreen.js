import React, { useState, useMemo } from 'react';
import { colors, fonts, shared } from '../styles';
import levels from '../data/levels';
import tips from '../data/tips';

export default function HomeScreen({ djName, setDjName, unlockedLevels, earnedBadges, onSelectLevel }) {
  const [nameInput, setNameInput] = useState(djName);
  const tip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

  const handleNameSave = () => {
    const trimmed = nameInput.trim();
    if (trimmed) setDjName(trimmed);
  };

  const containerStyle = {
    ...shared.container,
    justifyContent: 'flex-start',
    paddingTop: '40px',
    gap: '20px',
  };

  const inputRowStyle = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const inputStyle = {
    fontFamily: fonts.body,
    fontSize: '1.1rem',
    padding: '12px 20px',
    borderRadius: '50px',
    border: `2px solid ${colors.purple}`,
    background: 'rgba(255, 255, 255, 0.08)',
    color: colors.white,
    outline: 'none',
    width: '220px',
    textAlign: 'center',
  };

  const saveButtonStyle = {
    ...shared.button,
    ...shared.primaryButton,
    fontSize: '0.95rem',
    padding: '12px 24px',
  };

  const djGreetingStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    color: colors.yellow,
    textShadow: `0 0 20px ${colors.yellow}44`,
  };

  const levelGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '14px',
    width: '100%',
    maxWidth: '600px',
  };

  const sectionTitleStyle = {
    fontFamily: fonts.display,
    fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
    color: colors.whiteAlpha6,
    letterSpacing: '2px',
    textTransform: 'uppercase',
  };

  const badgeRowStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const tipStyle = {
    fontFamily: fonts.body,
    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
    color: colors.whiteAlpha6,
    fontStyle: 'italic',
    maxWidth: '500px',
    textAlign: 'center',
    lineHeight: 1.5,
    padding: '0 10px',
  };

  return (
    <div style={{ ...containerStyle, ...shared.screenAnimation }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed', top: '10%', left: '10%', width: '300px', height: '300px',
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.purple}15, transparent)`,
        animation: 'glow 4s ease infinite', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '10%', width: '250px', height: '250px',
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.pink}12, transparent)`,
        animation: 'glow 5s ease infinite 1s', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
        <h1 style={shared.title}>🎧 DJ QUEST 🎧</h1>

        {!djName ? (
          <>
            <p style={{ fontFamily: fonts.display, fontSize: 'clamp(1rem, 3vw, 1.3rem)', color: colors.white }}>
              What's your DJ name?
            </p>
            <div style={inputRowStyle}>
              <input
                style={inputStyle}
                type="text"
                placeholder="DJ ..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                maxLength={20}
                autoFocus
              />
              <button style={saveButtonStyle} onClick={handleNameSave}>LET'S GO!</button>
            </div>
          </>
        ) : (
          <p style={djGreetingStyle}>🎵 Welcome back, DJ {djName}! 🎵</p>
        )}

        {/* Badge collection */}
        {earnedBadges.length > 0 && (
          <>
            <p style={sectionTitleStyle}>🏆 Your Badges</p>
            <div style={badgeRowStyle}>
              {levels.map((level) => {
                const earned = earnedBadges.includes(level.id);
                return (
                  <div key={level.id} style={{
                    fontSize: '2rem',
                    opacity: earned ? 1 : 0.2,
                    filter: earned ? 'none' : 'grayscale(1)',
                    transition: 'all 0.3s ease',
                    animation: earned ? 'float 3s ease infinite' : 'none',
                    animationDelay: `${level.id * 0.3}s`,
                  }}>
                    {level.badge}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Levels */}
        {djName && (
          <>
            <p style={sectionTitleStyle}>Choose Your Stage</p>
            <div style={levelGridStyle}>
              {levels.map((level) => {
                const unlocked = unlockedLevels.includes(level.id);
                const earned = earnedBadges.includes(level.id);
                return (
                  <button
                    key={level.id}
                    onClick={() => unlocked && onSelectLevel(level.id)}
                    disabled={!unlocked}
                    style={{
                      ...shared.card,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.4,
                      textAlign: 'center',
                      border: earned
                        ? `2px solid ${colors.green}`
                        : unlocked
                          ? `1px solid ${colors.purple}55`
                          : '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.2s ease',
                      animation: 'slideIn 0.4s ease both',
                      animationDelay: `${level.id * 0.1}s`,
                      background: unlocked
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '6px' }}>
                      {unlocked ? level.emoji : '🔒'}
                    </div>
                    <div style={{
                      fontFamily: fonts.display,
                      fontSize: 'clamp(0.75rem, 2.5vw, 0.95rem)',
                      color: unlocked ? colors.white : colors.whiteAlpha6,
                    }}>
                      {level.name}
                    </div>
                    {unlocked && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: colors.whiteAlpha6,
                        marginTop: '4px',
                      }}>
                        {level.target} beats {earned ? '✅' : ''}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* DJ Tip */}
        <div style={tipStyle}>
          💡 DJ Tip: {tip}
        </div>
      </div>
    </div>
  );
}
