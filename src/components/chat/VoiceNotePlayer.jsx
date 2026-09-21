import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

export default function VoiceNotePlayer({ duration = '0:15', isOutgoing = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1, 1.5, 2
  const timerRef = useRef(null);

  // Parse duration seconds
  const parseSeconds = (dur) => {
    if (!dur) return 15;
    const parts = dur.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 15;
  };

  const totalSecs = parseSeconds(duration);

  // Generate deterministic wave heights
  const bars = [8, 14, 20, 12, 18, 26, 16, 22, 10, 24, 18, 12, 28, 14, 20, 16, 24, 10, 16, 22, 14, 8];

  useEffect(() => {
    if (isPlaying) {
      const stepInterval = 100;
      const stepPercent = (stepInterval / (totalSecs * 1000 / playbackSpeed)) * 100;

      timerRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + stepPercent;
        });
      }, stepInterval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalSecs]);

  const togglePlay = () => {
    setIsPlaying(p => !p);
  };

  const handleSeek = (idx) => {
    const newProgress = (idx / bars.length) * 100;
    setProgress(newProgress);
  };

  const cycleSpeed = () => {
    if (playbackSpeed === 1) setPlaybackSpeed(1.5);
    else if (playbackSpeed === 1.5) setPlaybackSpeed(2);
    else setPlaybackSpeed(1);
  };

  const currentSecs = Math.floor((progress / 100) * totalSecs);
  const displayTimer = `${Math.floor(currentSecs / 60)}:${(currentSecs % 60).toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 4px',
        minWidth: '240px'
      }}
    >
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: isOutgoing ? '#FFFFFF' : 'var(--primary)',
          color: isOutgoing ? '#4338CA' : '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'transform 0.15s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: '2px' }} />}
      </button>

      {/* Waveform Visualization */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            height: '30px',
            cursor: 'pointer'
          }}
        >
          {bars.map((height, idx) => {
            const barProgress = (idx / bars.length) * 100;
            const isFilled = progress >= barProgress;

            return (
              <div
                key={idx}
                onClick={() => handleSeek(idx)}
                style={{
                  flex: 1,
                  height: `${height}px`,
                  borderRadius: '2px',
                  backgroundColor: isFilled
                    ? (isOutgoing ? '#FFFFFF' : 'var(--accent-cyan)')
                    : (isOutgoing ? 'rgba(255, 255, 255, 0.35)' : 'rgba(148, 163, 184, 0.3)'),
                  transition: 'background-color 0.1s'
                }}
              />
            );
          })}
        </div>

        {/* Footer info: Timer and Speed Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: isOutgoing ? 'rgba(255, 255, 255, 0.85)' : 'var(--text-secondary)' }}>
            {isPlaying ? displayTimer : duration}
          </span>

          <button
            onClick={cycleSpeed}
            style={{
              padding: '2px 6px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: isOutgoing ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-sidebar-hover)',
              color: isOutgoing ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
}
