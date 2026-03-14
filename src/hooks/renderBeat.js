// Renders a beat sequence to a WAV audio file using OfflineAudioContext

function synthesizeToContext(ctx, padType, time) {
  switch (padType) {
    case 'KICK': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
      gain.gain.setValueAtTime(0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.25);
      break;
    }
    case 'SNARE': {
      const bufferSize = Math.floor(ctx.sampleRate * 0.15);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.6, time);
      nGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.15);

      const osc = ctx.createOscillator();
      const oGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(100, time + 0.1);
      oGain.gain.setValueAtTime(0.4, time);
      oGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.connect(oGain);
      oGain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.1);
      break;
    }
    case 'HI-HAT': {
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 8000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(time);
      noise.stop(time + 0.08);
      break;
    }
    case 'FX': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, time);
      osc.frequency.exponentialRampToValueAtTime(800, time + 0.15);
      osc.frequency.exponentialRampToValueAtTime(300, time + 0.3);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.35);
      break;
    }
    default:
      break;
  }
}

function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const channels = [];
  for (let ch = 0; ch < numChannels; ch++) channels.push(buffer.getChannelData(ch));

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export async function renderBeatToWav(beats, duration) {
  const sampleRate = 44100;
  const totalSeconds = (duration / 1000) + 1; // add 1s buffer for tail
  const offlineCtx = new OfflineAudioContext(1, Math.ceil(sampleRate * totalSeconds), sampleRate);

  for (const beat of beats) {
    const time = beat.timeOffset / 1000;
    synthesizeToContext(offlineCtx, beat.padType, time);
  }

  const renderedBuffer = await offlineCtx.startRendering();
  return audioBufferToWav(renderedBuffer);
}

export async function shareBeatAsAudio(beat) {
  const wavBlob = await renderBeatToWav(beat.beats, beat.duration);
  const fileName = `${beat.name.replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'beat'}.wav`;

  // Try Web Share API with file (works on iOS Safari)
  if (navigator.share && navigator.canShare) {
    const file = new File([wavBlob], fileName, { type: 'audio/wav' });
    const shareData = { title: `🎧 ${beat.name}`, text: `Check out my beat "${beat.name}" from DJ Quest!`, files: [file] };
    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return 'shared';
      } catch (e) {
        if (e.name === 'AbortError') return 'cancelled';
      }
    }
  }

  // Fallback: download the file
  const url = URL.createObjectURL(wavBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return 'downloaded';
}
