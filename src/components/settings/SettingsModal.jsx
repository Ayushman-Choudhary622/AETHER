import React, { useState, useRef } from 'react';
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
  Check, 
  Sparkles,
  Camera,
  Upload,
  LogOut,
  Trash2,
  Slash,
  Eye,
  EyeOff,
  QrCode,
  Copy,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
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
    uploadCustomAvatar,
    setIsProfileModalOpen,
    blockedContacts,
    unblockContact,
    privacySettings,
    updatePrivacySettings,
    logout,
    deleteAccount
  } = useChat();

  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState(myProfile?.name || '');
  const [userAbout, setUserAbout] = useState(myProfile?.about || '');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      uploadCustomAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const copyProfileLink = () => {
    const link = `https://aether.chat/@${myProfile?.username || 'user'}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

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
            <div style={{ position: 'relative', width: '68px', height: '68px', flexShrink: 0 }}>
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
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleCustomAvatarUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload Custom Profile Picture (DP)"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-modal)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              >
                <Camera size={13} />
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="Your Name"
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
                placeholder="About / Bio"
                style={{
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  marginTop: '4px',
                  width: '100%'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  @{myProfile?.username || 'user'}
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '11px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <Upload size={12} /> Change DP
                </button>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  style={{ fontSize: '11px', color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Share Profile Link & QR Code */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <QrCode size={24} color="var(--accent-cyan)" />
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Share My AETHER Link</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  aether.chat/@{myProfile?.username || 'user'}
                </p>
              </div>
            </div>

            <button
              onClick={copyProfileLink}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                backgroundColor: copiedLink ? 'var(--accent-emerald)' : 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
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

          {/* Privacy & Stealth Settings */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
              Privacy &amp; Stealth Mode
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Ghost Mode Toggle */}
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
                  {privacySettings.ghostMode ? <EyeOff size={20} color="var(--accent-cyan)" /> : <Eye size={20} color="var(--text-muted)" />}
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Ghost Mode (Stealth)</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Appear completely offline on the network even while chatting
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={privacySettings.ghostMode}
                  onChange={e => updatePrivacySettings({ ghostMode: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              {/* Incognito Typing Toggle */}
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
                  <UserCheck size={20} color="var(--primary)" />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Incognito Typing</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Never send "typing..." indicators to other participants
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={privacySettings.incognitoTyping}
                  onChange={e => updatePrivacySettings({ incognitoTyping: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

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
                  checked={privacySettings.readReceipts}
                  onChange={e => updatePrivacySettings({ readReceipts: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Blocked Contacts Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Blocked Contacts ({blockedContacts.length})
              </span>
            </div>

            {blockedContacts.length === 0 ? (
              <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12.5px', textAlign: 'center' }}>
                No contacts currently blocked.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {blockedContacts.map(username => (
                  <div
                    key={username}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Slash size={16} color="var(--accent-rose)" />
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        @{username}
                      </span>
                    </div>

                    <button
                      onClick={() => unblockContact(username)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '14px',
                        backgroundColor: 'rgba(244, 63, 94, 0.15)',
                        color: 'var(--accent-rose)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Management (Logout & Delete Account) */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
              Account &amp; Security
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LogOut size={18} color="var(--primary)" />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 600 }}>Log Out</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      End this session and switch or sign in with another @username
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Log Out</span>
              </button>

              {/* Delete Account (Danger Zone) */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(244, 63, 94, 0.08)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  color: 'var(--accent-rose)',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.08)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trash2 size={18} color="var(--accent-rose)" />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 700 }}>Delete Account</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      Permanently wipe all chats, keys, and media from this device
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>Delete</span>
              </button>
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

        {/* Confirmation Modal: Logout */}
        {showLogoutConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              zIndex: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '400px',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-modal)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                textAlign: 'center'
              }}
            >
              <LogOut size={36} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Log out of AETHER?</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                You will be returned to the onboarding screen where you can choose another handle or sign in again.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-sidebar-hover)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal: Delete Account */}
        {showDeleteConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 130,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '420px',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-modal)',
                border: '1.5px solid var(--accent-rose)',
                padding: '24px',
                boxShadow: '0 25px 60px rgba(244, 63, 94, 0.25)',
                textAlign: 'center'
              }}
            >
              <AlertTriangle size={40} color="var(--accent-rose)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-rose)' }}>Permanent Account Deletion</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
                This action is irreversible. All encryption keys, messages, contacts, voice notes, and data stored on this device will be permanently erased.
              </p>

              <div style={{ marginTop: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteInput}
                  onChange={e => setDeleteInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-rose)',
                    fontWeight: 700,
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-sidebar-hover)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={deleteInput.trim().toUpperCase() !== 'DELETE'}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent-rose)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: deleteInput.trim().toUpperCase() === 'DELETE' ? 'pointer' : 'default',
                    opacity: deleteInput.trim().toUpperCase() === 'DELETE' ? 1 : 0.4
                  }}
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
