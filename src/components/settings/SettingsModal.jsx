import React, { useState } from 'react';
import { 
  X, 
  User, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Lock, 
  Palette, 
  HardDrive, 
  Check, 
  Sparkles,
  Camera
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { currentUser } from '../../data/mockData';
import BrandLogo from '../common/BrandLogo';

export default function SettingsModal() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    theme, 
    toggleTheme, 
    soundEnabled, 
    setSoundEnabled,
    myProfile,
    updateMyProfile,
    setIsProfileModalOpen
  } = useChat();

  const [userName, setUserName] = useState(myProfile?.name || '');
  const [userAbout, setUserAbout] = useState(myProfile?.about || '');
  const [readReceipts, setReadReceipts] = useState(true);

  if (!isSettingsOpen) return null;

  const handleSaveAndClose = () => {
    updateMyProfile({
      name: userName.trim() || myProfile?.username,
      about: userAbout.trim()
    });
    setIsSettingsOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), var(--shadow-glow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrandLogo size={28} showText={false} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              AETHER Settings &amp; Preferences
            </h3>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sidebar-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Profile Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              padding: '16px 20px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-sidebar-hover)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
              <img
                src={myProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border-glow)'
                }}
              />
              <button
                onClick={() => setIsProfileModalOpen(true)}
                title="Change Avatar & Handle"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-modal)',
                  cursor: 'pointer'
                }}
              >
                <Camera size={12} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    background: 'transparent',
                    borderBottom: '1px dashed var(--border-glow)',
                    paddingBottom: '2px',
                    width: '100%'
                  }}
                />
              </div>

              <input
                type="text"
                value={userAbout}
                onChange={e => setUserAbout(e.target.value)}
                style={{
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  marginTop: '4px',
                  width: '100%'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  @{myProfile?.username || 'user'}
                </span>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  style={{ fontSize: '10.5px', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Edit Handle
                </button>
              </div>
            </div>
          </div>

          {/* Theme & Display Options */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
              Appearance &amp; Sound
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Theme toggle row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {theme === 'dark' ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--accent-amber)" />}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Interface Theme</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Currently in {theme === 'dark' ? 'Deep Obsidian Dark' : 'Porcelain Frost Light'} mode
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>

              {/* Sound Effects toggle row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {soundEnabled ? <Volume2 size={20} color="var(--accent-cyan)" /> : <VolumeX size={20} color="var(--text-muted)" />}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>UI Sounds &amp; Chimes</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Synthesized Web Audio clicks, message pings, and ringtones
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSoundEnabled(s => !s)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    backgroundColor: soundEnabled ? 'var(--accent-emerald)' : 'var(--bg-sidebar-hover)',
                    color: soundEnabled ? '#FFFFFF' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: soundEnabled ? 'none' : '1px solid var(--border-subtle)'
                  }}
                >
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Cryptography */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
              Privacy &amp; Encryption
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Read Receipts */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Check size={20} color="var(--tick-blue)" />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Read Receipts</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Show double blue checkmarks when messages are read
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={readReceipts}
                  onChange={e => setReadReceipts(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Security info banner */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <ShieldCheck size={22} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Quantum-Resistant Encryption Active
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: '2px' }}>
                    All conversations, stories, voice notes, and media transmitted via AETHER use authenticated AES-GCM 256-bit symmetric encryption with client-side key derivation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--bg-sidebar-hover)' }}>
          <button
            onClick={handleSaveAndClose}
            style={{
              padding: '8px 22px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
              cursor: 'pointer'
            }}
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
