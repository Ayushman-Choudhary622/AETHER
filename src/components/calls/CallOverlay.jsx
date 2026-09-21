import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, ShieldCheck, Check } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { webrtcService } from '../../services/webrtcService';

export default function CallOverlay() {
  const { 
    activeCall, 
    answerCall, 
    endCall, 
    remoteVideoStream 
  } = useChat();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (activeCall?.status === 'connected') {
      interval = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status]);

  // Set local video stream
  useEffect(() => {
    if (webrtcService.localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = webrtcService.localStream;
    }
  }, [activeCall, isVideoOn]);

  // Set remote video stream
  useEffect(() => {
    if (remoteVideoStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteVideoStream;
    }
  }, [remoteVideoStream]);

  const handleToggleMic = () => {
    const next = !isMuted;
    setIsMuted(next);
    webrtcService.toggleMicrophone(next);
  };

  const handleToggleVideo = () => {
    const next = !isVideoOn;
    setIsVideoOn(next);
    webrtcService.toggleCamera(next);
  };

  if (!activeCall) return null;

  const contact = activeCall.contact;
  const isVideo = activeCall.type === 'video';
  const isIncoming = activeCall.isIncoming && activeCall.status === 'ringing';

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.95)',
        backdropFilter: 'blur(25px)',
        zIndex: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          height: '86vh',
          maxHeight: '740px',
          borderRadius: '28px',
          backgroundColor: '#0A0E1A',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '24px 24px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontSize: '12px', marginBottom: '6px' }}>
            <ShieldCheck size={14} /> Peer-to-Peer WebRTC Encrypted
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.3px' }}>
            {contact.name}
          </h3>

          <p style={{ fontSize: '13px', color: activeCall.status === 'connected' ? 'var(--accent-emerald)' : 'var(--text-secondary)', marginTop: '4px' }}>
            {activeCall.status === 'connected' 
              ? formatTimer(callDuration) 
              : isIncoming 
                ? `Incoming ${isVideo ? 'HD Video' : 'Audio'} Call...` 
                : `Calling @${contact.username || contact.name}...`}
          </p>
        </div>

        {/* Center Visual: Remote Stream or Live Calling Avatar */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '20px'
          }}
        >
          {remoteVideoStream ? (
            <div style={{ width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Local picture-in-picture */}
              {isVideo && isVideoOn && (
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '120px', height: '90px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 14px rgba(0,0,0,0.6)' }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div
                className={activeCall.status === 'ringing' ? 'pulse-call' : ''}
                style={{
                  position: 'relative',
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  padding: '4px',
                  background: 'linear-gradient(135deg, #6366F1, #06B6D4)',
                  boxShadow: '0 0 35px rgba(99, 102, 241, 0.4)'
                }}
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #0A0E1A'
                  }}
                />
              </div>

              {activeCall.status === 'connected' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '24px' }}>
                  {[12, 22, 16, 26, 14, 20, 10].map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '3.5px',
                        height: `${h}px`,
                        borderRadius: '4px',
                        backgroundColor: 'var(--accent-cyan)',
                        animation: `typingDot 1s infinite ${idx * 0.15}s ease-in-out`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Actions */}
        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(11, 16, 29, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          {isIncoming ? (
            /* Incoming call Accept / Decline actions */
            <>
              <button
                onClick={endCall}
                title="Decline"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(239, 68, 68, 0.5)',
                  cursor: 'pointer'
                }}
              >
                <PhoneOff size={26} />
              </button>

              <button
                onClick={answerCall}
                title="Accept Call"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-emerald)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.5)',
                  cursor: 'pointer'
                }}
              >
                <Phone size={28} />
              </button>
            </>
          ) : (
            /* Connected or Outgoing controls */
            <>
              <button
                onClick={handleToggleMic}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: isMuted ? '#EF4444' : '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              {isVideo && (
                <button
                  onClick={handleToggleVideo}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: !isVideoOn ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: !isVideoOn ? '#EF4444' : '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
                </button>
              )}

              <button
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Volume2 size={22} />
              </button>

              <button
                onClick={endCall}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(239, 68, 68, 0.5)',
                  cursor: 'pointer'
                }}
              >
                <PhoneOff size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
