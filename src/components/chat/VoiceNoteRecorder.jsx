import React, { useState, useEffect, useRef } from 'react';
import { Mic, Trash2, Send, Check } from 'lucide-react';

export default function VoiceNoteRecorder({ onCancel, onSend }) {
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRecordSeconds(s => s + 1);
    }, 1000);

    // Try starting MediaRecorder
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          recorder.ondataavailable = e => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.start();
        })
        .catch(err => {
          console.log('Mic recording fallback mode:', err);
        });
    }

    return () => {
      clearInterval(timer);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleSend = () => {
    const duration = `0:${recordSeconds.toString().padStart(2, '0')}`;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
    }
    onSend(duration);
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
    }
    onCancel();
  };

  const formattedTimer = `0:${recordSeconds.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '6px 12px',
        backgroundColor: 'var(--bg-input)',
        borderRadius: '24px',
        border: '1px solid var(--border-glow)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {/* Cancel Trash Action */}
      <button
        onClick={handleCancel}
        title="Cancel voice note"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-rose)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Trash2 size={18} />
      </button>

      {/* Recording Indicator & Dynamic Waveform */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-rose)',
              animation: 'pulseRing 1.2s infinite'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {formattedTimer}
          </span>
        </div>

        {/* Live Audio Visualizer Bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
          {[10, 16, 8, 20, 14, 24, 12, 18, 22, 14, 8, 16].map((h, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: `${h}px`,
                backgroundColor: 'var(--primary)',
                borderRadius: '2px',
                animation: `typingDot 0.8s infinite ${i * 0.08}s ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      {/* Send Voice Note Button */}
      <button
        onClick={handleSend}
        title="Send voice note"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer'
        }}
      >
        <Send size={16} />
      </button>
    </div>
  );
}
