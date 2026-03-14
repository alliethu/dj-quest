import { useState, useRef, useCallback } from 'react';

export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [beats, setBeats] = useState([]);
  const startTimeRef = useRef(null);

  const startRecording = useCallback(() => {
    setBeats([]);
    startTimeRef.current = Date.now();
    setIsRecording(true);
  }, []);

  const recordTap = useCallback((padType) => {
    if (!startTimeRef.current) return;
    const timeOffset = Date.now() - startTimeRef.current;
    setBeats((prev) => [...prev, { padType, timeOffset }]);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    const duration = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    startTimeRef.current = null;
    return duration;
  }, []);

  const clearRecording = useCallback(() => {
    setBeats([]);
    setIsRecording(false);
    startTimeRef.current = null;
  }, []);

  return {
    isRecording,
    beats,
    startRecording,
    recordTap,
    stopRecording,
    clearRecording,
  };
}
