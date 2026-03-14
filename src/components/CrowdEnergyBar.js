import React from 'react';
import { colors, fonts } from '../styles';

const labels = [
  { min: 0, max: 25, text: '😴 WAKE EM UP', color: colors.blue },
  { min: 25, max: 50, text: '👍 WARMING UP', color: colors.yellow },
  { min: 50, max: 75, text: '🎉 VIBING!', color: colors.green },
  { min: 75, max: 101, text: '🔥 ON FIRE!', color: colors.pink },
];

export default function CrowdEnergyBar({ energy }) {
  const label = labels.find((l) => energy >= l.min && energy < l.max) || labels[0];

  const containerStyle = {
    width: '100%',
    maxWidth: '400px',
    marginBottom: '16px',
  };

  const labelRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    fontFamily: fonts.display,
    fontSize: 'clamp(0.7rem, 2.5vw, 0.95rem)',
  };

  const barOuterStyle = {
    width: '100%',
    height: '24px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  };

  const barInnerStyle = {
    width: `${Math.max(0, Math.min(100, energy))}%`,
    height: '100%',
    borderRadius: '12px',
    background: `linear-gradient(90deg, ${colors.blue}, ${label.color})`,
    transition: 'width 0.4s ease, background 0.4s ease',
    boxShadow: `0 0 10px ${label.color}66`,
  };

  return (
    <div style={containerStyle}>
      <div style={labelRowStyle}>
        <span style={{ color: label.color }}>{label.text}</span>
        <span style={{ color: colors.whiteAlpha6 }}>{Math.round(energy)}%</span>
      </div>
      <div style={barOuterStyle}>
        <div style={barInnerStyle} />
      </div>
    </div>
  );
}
