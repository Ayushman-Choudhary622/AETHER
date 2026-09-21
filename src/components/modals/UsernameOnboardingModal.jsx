import React, { useState, useRef } from 'react';
import { AtSign, User, Sparkles, Shield, Check, Globe, Camera, ArrowRight, Lock, CheckCircle2, Upload } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import BrandLogo from '../common/BrandLogo';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
];

export default function UsernameOnboardingModal() {
  const { 
    myProfile, 
    updateMyProfile, 
    isProfileModalOpen, 
    setIsProfileModalOpen 
  } = useChat();

  const fileInputRef = useRef(null);
  const [step, setStep] = useState(myProfile?.hasCompletedOnboarding ? 2 : 1);
  const [username, setUsername] = useState(myProfile?.username || '');
  const [displayName, setDisplayName] = useState(myProfile?.name || '');
  const [about, setAbout] = useState(myProfile?.about || 'Available on AETHER 🛡️✨');
  const [selectedAvatar, setSelectedAvatar] = useState(myProfile?.avatar || PRESET_AVATARS[0]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image file must be under 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAvatar(reader.result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  // Should show if user hasn't completed onboarding, or if explicitly opened from settings
  const shouldShow = !myProfile?.hasCompletedOnboarding || isProfileModalOpen;
  if (!shouldShow) return null;

  const handleNextStep = (e) => {
    e.preventDefault();
    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!clean || clean.length < 3) {
      setErrorMsg('Username must be at least 3 characters (letters, numbers, underscores)');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFinish = (e) => {
    e.preventDefault();
    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!clean) return;

    updateMyProfile({
      username: clean,
      name: displayName.trim() || clean,
      about: about.trim() || 'Available on AETHER 🛡️✨',
      avatar: selectedAvatar,
      hasCompletedOnboarding: true
    });

    setIsProfileModalOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.96)',
        backdropFilter: 'blur(25px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '28px',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), var(--shadow-glow)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Decorative Header */}
        <div
          style={{
            padding: '28px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-sidebar-hover)'
          }}
        >
          <BrandLogo size={52} showText={false} />

          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              marginTop: '14px',
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #A5B4FC 80%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {step === 1 ? 'Welcome to AETHER' : 'Complete Your Profile'}
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '380px', lineHeight: 1.5 }}>
            {step === 1
              ? 'Private, peer-to-peer encrypted messaging & calling. Choose a unique handle to connect.'
              : 'Enter your name and photo so your contacts can identify you.'}
          </p>

          {/* Stepper Dots */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <div style={{ width: step === 1 ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: 'var(--primary)', transition: 'all 0.2s' }} />
            <div style={{ width: step === 2 ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: step === 2 ? 'var(--primary)' : 'var(--border-subtle)', transition: 'all 0.2s' }} />
          </div>
        </div>

        {/* Step 1: Choose Username */}
        {step === 1 && (
          <form onSubmit={handleNextStep} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Your Unique @Username
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '16px',
                  padding: '0 16px',
                  border: '1.5px solid var(--border-glow)'
                }}
              >
                <AtSign size={18} color="var(--primary)" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  placeholder="e.g. ayushman or alex"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                    setErrorMsg('');
                  }}
                  autoFocus
                  required
                  style={{
                    flex: 1,
                    padding: '14px 0',
                    background: 'transparent',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px'
                  }}
                />
              </div>
              {errorMsg && (
                <span style={{ fontSize: '12px', color: 'var(--accent-rose)', marginTop: '6px', display: 'block' }}>
                  {errorMsg}
                </span>
              )}
            </div>

            {/* Feature Highlights */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" />
                <span>Find friends instantly anywhere in the world via @username</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                <Lock size={16} color="var(--accent-emerald)" />
                <span>All chats, photos &amp; voice notes saved permanently on device</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                <Globe size={16} color="var(--primary)" />
                <span>100% Free decentralized real-time sync with WebRTC calling</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!username.trim() || username.length < 3}
              style={{
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)',
                cursor: username.trim().length >= 3 ? 'pointer' : 'default',
                opacity: username.trim().length >= 3 ? 1 : 0.5
              }}
            >
              Continue to Profile <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Step 2: Profile Info */}
        {step === 2 && (
          <form onSubmit={handleFinish} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Avatar Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'center' }}>
                Profile Photo / DP
              </label>

              {/* Big Avatar Preview with Camera Trigger */}
              <div style={{ position: 'relative', width: '84px', height: '84px', marginBottom: '14px' }}>
                <img
                  src={selectedAvatar}
                  alt="Avatar Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--primary)',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload from device"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-modal)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                  }}
                >
                  <Camera size={14} />
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleCustomAvatarUpload}
                style={{ display: 'none' }}
              />

              {/* Upload Custom Photo Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  marginBottom: '14px'
                }}
              >
                <Upload size={14} /> Upload Custom Photo
              </button>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Or select an AETHER avatar:
              </span>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {PRESET_AVATARS.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAvatar(url)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      padding: '2px',
                      cursor: 'pointer',
                      border: selectedAvatar === url ? '2.5px solid var(--primary)' : '2px solid transparent',
                      boxShadow: selectedAvatar === url ? '0 0 10px var(--primary)' : 'none',
                      transform: selectedAvatar === url ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.15s'
                    }}
                  >
                    <img
                      src={url}
                      alt="Preset"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Display Name Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Your Display Name
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '0 14px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <User size={18} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="e.g. Ayushman Choudhary"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    background: 'transparent',
                    fontSize: '14.5px',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Status / Bio */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                About / Bio
              </label>
              <input
                type="text"
                placeholder="e.g. Always building ⚡"
                value={about}
                onChange={e => setAbout(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-sidebar-hover)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Back
              </button>

              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={18} /> Enter AETHER
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
