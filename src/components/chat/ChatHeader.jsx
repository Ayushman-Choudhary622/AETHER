import React, { useState } from 'react';
import { Phone, Video, Search, MoreVertical, PanelRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ChatHeader() {
  const { 
    activeChat, 
    startCall, 
    isContactInfoOpen, 
    setIsContactInfoOpen,
    typingContacts
  } = useChat();
  const [showMenu, setShowMenu] = useState(false);

  if (!activeChat) return null;

  const isTyping = typingContacts[activeChat.id];

  return (
    <div
      className="glass-header"
      style={{
        height: '64px',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 30
      }}
    >
      {/* Contact Profile Trigger */}
      <div
        onClick={() => setIsContactInfoOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '10px',
          transition: 'background 0.15s'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-subtle)'
            }}
          />
          {activeChat.online && (
            <div
              style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-emerald)',
                border: '2px solid var(--bg-rail)'
              }}
            />
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeChat.name}
            </h3>
            {activeChat.verified && (
              <CheckCircle2 size={15} color="var(--accent-cyan)" />
            )}
          </div>

          <p style={{ fontSize: '12px', color: isTyping ? 'var(--accent-cyan)' : activeChat.online ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            {isTyping ? 'typing...' : activeChat.online ? 'online' : activeChat.lastSeen}
          </p>
        </div>
      </div>

      {/* Action Buttons: Video Call, Voice Call, Search, Info Drawer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Video Call */}
        <button
          onClick={() => startCall(activeChat, 'video')}
          title="Video Call"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
            border: '1px solid transparent'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Video size={19} />
        </button>

        {/* Audio Call */}
        <button
          onClick={() => startCall(activeChat, 'audio')}
          title="Voice Call"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
            border: '1px solid transparent'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Phone size={18} />
        </button>

        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

        {/* Toggle Contact Info Drawer */}
        <button
          onClick={() => setIsContactInfoOpen(prev => !prev)}
          title="Contact Info & Media"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isContactInfoOpen ? 'var(--primary)' : 'var(--text-secondary)',
            backgroundColor: isContactInfoOpen ? 'var(--bg-sidebar-active)' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          <PanelRight size={19} />
        </button>

        {/* More Actions Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(m => !m)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: '0',
                width: '180px',
                backgroundColor: 'var(--bg-modal)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                padding: '6px 0',
                zIndex: 60,
                animation: 'slideUp 0.15s ease-out'
              }}
              onClick={() => setShowMenu(false)}
            >
              <button
                onClick={() => setIsContactInfoOpen(true)}
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  fontSize: '13px',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Contact Info
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  fontSize: '13px',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Mute Notifications
              </button>
              <button
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  fontSize: '13px',
                  textAlign: 'left',
                  color: 'var(--accent-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Clear Messages
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
