import React, { useState, useCallback } from 'react';
import { colors, fonts, shared } from '../styles';
import useAudio from '../hooks/useAudio';
import useRecorder from '../hooks/useRecorder';
import useBeatPlayer from '../hooks/useBeatPlayer';
import { shareBeatAsAudio } from '../hooks/renderBeat';
import BeatPad from './BeatPad';

const ALL_PAD_TYPES = ['KICK', 'SNARE', 'HI-HAT', 'FX'];

export default function BeatMakerScreen({ savedBeats, onSaveBeat, onDeleteBeat, onGoHome }) {
  const { playSound } = useAudio();
  const { isRecording, beats: recordedBeats, startRecording, recordTap, stopRecording, clearRecording } = useRecorder();
  const { isPlaying, activePad, play, stop } = useBeatPlayer(playSound);

  const [lastRecording, setLastRecording] = useState(null);
  const [beatName, setBeatName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [copied, setCopied] = useState(null);
  const [sharing, setSharing] = useState(null);

  const handleTap = useCallback((padType) => {
    playSound(padType);
    if (isRecording) {
      recordTap(padType);
    }
  }, [playSound, isRecording, recordTap]);

  const handleStopRecording = useCallback(() => {
    const duration = stopRecording();
    if (recordedBeats.length > 0) {
      setLastRecording({ beats: [...recordedBeats], duration });
      setShowSaveForm(true);
      setBeatName('');
    }
  }, [stopRecording, recordedBeats]);

  const handleSave = useCallback(() => {
    if (!lastRecording || !beatName.trim()) return;
    onSaveBeat({
      id: Date.now().toString(36),
      name: beatName.trim(),
      beats: lastRecording.beats,
      duration: lastRecording.duration,
      createdAt: Date.now(),
    });
    setShowSaveForm(false);
    setLastRecording(null);
    setBeatName('');
  }, [lastRecording, beatName, onSaveBeat]);

  const handleShare = useCallback(async (beat) => {
    setSharing(beat.id);
    try {
      const result = await shareBeatAsAudio(beat);
      if (result === 'shared' || result === 'downloaded') {
        setCopied(beat.id);
        setTimeout(() => setCopied(null), 2000);
      }
    } catch (e) {
      // ignore share errors
    }
    setSharing(null);
  }, []);

  const containerStyle = {
    ...shared.container,
    justifyContent: 'flex-start',
    paddingTop: '30px',
    gap: '18px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
  };

  const padContainerStyle = {
    display: 'flex',
    gap: 'clamp(12px, 3vw, 24px)',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const controlsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const recBtnStyle = (active) => ({
    ...shared.button,
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    padding: '12px 24px',
    background: active ? colors.pink : 'rgba(255,255,255,0.08)',
    border: `2px solid ${active ? colors.pink : colors.whiteAlpha2}`,
    boxShadow: active ? `0 0 20px ${colors.pink}66` : 'none',
    animation: active ? 'padPulse 1.5s ease infinite' : 'none',
    color: colors.white,
  });

  const playBtnStyle = {
    ...shared.button,
    fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
    padding: '12px 24px',
    background: isPlaying ? colors.purple : 'rgba(255,255,255,0.08)',
    border: `2px solid ${isPlaying ? colors.purple : colors.whiteAlpha2}`,
    color: colors.white,
  };

  const savedBeatCardStyle = {
    ...shared.card,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
    padding: '14px 18px',
    gap: '10px',
  };

  const smallBtnStyle = {
    fontFamily: fonts.display,
    fontSize: '0.8rem',
    padding: '8px 14px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    color: colors.white,
    background: 'rgba(255,255,255,0.1)',
    transition: 'all 0.2s ease',
  };

  const quitBtnStyle = {
    fontFamily: fonts.display,
    fontSize: '0.85rem',
    padding: '8px 18px',
    borderRadius: '50px',
    border: `1px solid ${colors.whiteAlpha2}`,
    background: 'transparent',
    color: colors.whiteAlpha6,
    cursor: 'pointer',
  };

  return (
    <div style={{ ...containerStyle, ...shared.screenAnimation }}>
      {/* Background orb */}
      <div style={{
        position: 'fixed', top: '15%', left: '5%', width: '250px', height: '250px',
        borderRadius: '50%', background: `radial-gradient(circle, ${colors.blue}12, transparent)`,
        animation: 'glow 4s ease infinite', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', width: '100%' }}>
        <div style={headerStyle}>
          <span style={{ fontFamily: fonts.display, fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)', color: colors.white }}>
            🎛️ Beat Maker
          </span>
          <button style={quitBtnStyle} onClick={onGoHome}>🏠 Home</button>
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            color: colors.pink,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'padPulse 1.5s ease infinite',
          }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: colors.pink }} />
            RECORDING — {recordedBeats.length} beats
          </div>
        )}

        {/* Beat pads */}
        <div style={padContainerStyle}>
          {ALL_PAD_TYPES.map((padType) => (
            <BeatPad
              key={padType}
              padType={padType}
              isActive={activePad === padType}
              onTap={handleTap}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={controlsStyle}>
          {!isRecording ? (
            <button style={recBtnStyle(false)} onClick={startRecording} disabled={isPlaying}>
              ⏺️ Record
            </button>
          ) : (
            <button style={recBtnStyle(true)} onClick={handleStopRecording}>
              ⏹️ Stop ({recordedBeats.length})
            </button>
          )}

          {lastRecording && !isRecording && (
            <>
              <button
                style={playBtnStyle}
                onClick={() => isPlaying ? stop() : play(lastRecording.beats)}
              >
                {isPlaying ? '⏹️ Stop' : '▶️ Play'}
              </button>
              {!showSaveForm && (
                <button
                  style={{ ...smallBtnStyle, background: `${colors.green}33`, border: `1px solid ${colors.green}55` }}
                  onClick={() => { setShowSaveForm(true); setBeatName(''); }}
                >
                  💾 Save
                </button>
              )}
            </>
          )}
        </div>

        {/* Save form */}
        {showSaveForm && lastRecording && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', animation: 'slideIn 0.3s ease' }}>
            <input
              style={{
                fontFamily: fonts.body,
                fontSize: '1rem',
                padding: '10px 18px',
                borderRadius: '50px',
                border: `2px solid ${colors.purple}`,
                background: 'rgba(255,255,255,0.08)',
                color: colors.white,
                outline: 'none',
                width: '200px',
                textAlign: 'center',
              }}
              placeholder="Name your beat..."
              value={beatName}
              onChange={(e) => setBeatName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              maxLength={30}
              autoFocus
            />
            <button
              style={{ ...shared.button, ...shared.primaryButton, fontSize: '0.9rem', padding: '10px 20px' }}
              onClick={handleSave}
              disabled={!beatName.trim()}
            >
              ✅ Save
            </button>
          </div>
        )}

        {/* Saved beats list */}
        {savedBeats.length > 0 && (
          <>
            <div style={{
              fontFamily: fonts.display,
              fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
              color: colors.whiteAlpha6,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '8px',
            }}>
              🎵 My Beats
            </div>

            {savedBeats.map((beat) => (
              <div key={beat.id} style={savedBeatCardStyle}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: fonts.display, fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', color: colors.white }}>
                    {beat.name}
                  </div>
                  <div style={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.whiteAlpha6, marginTop: '2px' }}>
                    {beat.beats.length} beats · {(beat.duration / 1000).toFixed(1)}s
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    style={{ ...smallBtnStyle, background: `${colors.blue}33` }}
                    onClick={() => isPlaying ? stop() : play(beat.beats)}
                  >
                    {isPlaying ? '⏹' : '▶️'}
                  </button>
                  <button
                    style={{ ...smallBtnStyle, background: `${colors.green}33` }}
                    onClick={() => handleShare(beat)}
                    disabled={sharing === beat.id}
                  >
                    {sharing === beat.id ? '⏳' : copied === beat.id ? '✅' : '📤'}
                  </button>
                  <button
                    style={{ ...smallBtnStyle, background: `${colors.pink}33` }}
                    onClick={() => onDeleteBeat(beat.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
