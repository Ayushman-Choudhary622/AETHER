import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Video, 
  Lock, 
  Bell, 
  BellOff, 
  Clock, 
  Star, 
  Slash, 
  Flag, 
  ShieldCheck, 
  ChevronRight, 
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  QrCode
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ContactDrawer() {
  const { 
    activeChat, 
    isContactInfoOpen, 
    setIsContactInfoOpen, 
    startCall, 
    toggleMuteChat 
  } = useChat();

  const [activeMediaTab, setActiveMediaTab] = useState('media'); // 'media' | 'docs' | 'links'

  if (!isContactInfoOpen || !activeChat) return null;

  // Extract media from messages
  const mediaMessages = activeChat.messages.filter(m => m.type === 'image');
  const docMessages = activeChat.messages.filter(m => m.type === 'document');

  return (
    <aside
      style={{
        width: '360px',
        height: '100%',
        backgroundColor: 'var(--bg-drawer)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        zIndex: 35,
        flexShrink: 0,
        animation: 'slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Drawer Header */}
      <div
        className="glass-header"
        style={{
          height: '64px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Contact Info
        </h3>

        <button
          onClick={() => setIsContactInfoOpen(false)}
          style={{
            width: '34px',
            height: '34px',
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

      {/* Main Profile Info Card */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-sidebar-hover)' }}>
        <div style={{ position: 'relative', width: '96px', height: '96px', borderRadius: '50%', padding: '3px', border: '2px solid var(--border-glow)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)', marginBottom: '14px' }}>
          <img
            src={activeChat.avatar}
            alt={activeChat.name}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
          {activeChat.name}
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {activeChat.phone || '+1 (555) 019-2834'}
        </p>

        {/* Action Call Triggers */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button
            onClick={() => startCall(activeChat, 'audio')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-modal)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Phone size={15} /> Audio
          </button>

          <button
            onClick={() => startCall(activeChat, 'video')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)'
            }}
          >
            <Video size={15} /> Video
          </button>
        </div>
      </div>

      {/* About / Bio Section */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          About
        </span>
        <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '6px', lineHeight: 1.4 }}>
          {activeChat.about || 'Available on AETHER Encrypted Messenger.'}
        </p>
      </div>

      {/* Media, Docs, Links Section */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Media, Docs &amp; Links
          </span>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
            {mediaMessages.length + docMessages.length} items
          </span>
        </div>

        {/* Media Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {[
            { id: 'media', label: 'Media', count: mediaMessages.length },
            { id: 'docs', label: 'Docs', count: docMessages.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMediaTab(tab.id)}
              style={{
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: activeMediaTab === tab.id ? 'var(--primary)' : 'var(--bg-sidebar-hover)',
                color: activeMediaTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Grid Preview */}
        {activeMediaTab === 'media' ? (
          mediaMessages.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {mediaMessages.map(m => (
                <div key={m.id} style={{ height: '80px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={m.mediaUrl} alt="media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
              No media shared yet
            </p>
          )
        ) : (
          docMessages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {docMessages.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '8px', backgroundColor: 'var(--bg-sidebar-hover)' }}>
                  <FileText size={18} color="var(--primary)" />
                  <span style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.fileName}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
              No documents shared yet
            </p>
          )
        )}
      </div>

      {/* Encryption Key & Security Verification (WhatsApp-Style) */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
            <Lock size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Encryption
            </h4>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Messages and calls are end-to-end encrypted
            </p>
          </div>
        </div>

        <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Safety Number
            </span>
            <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              {activeChat.securityCode || '8291 0482 1029 4819 2039 1048'}
            </p>
          </div>
          <QrCode size={22} color="var(--text-secondary)" />
        </div>
      </div>

      {/* Settings Options */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <button
          onClick={() => toggleMuteChat(activeChat.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeChat.muted ? <BellOff size={18} color="var(--accent-rose)" /> : <Bell size={18} />}
            <span>Mute Notifications</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {activeChat.muted ? 'Muted' : 'Off'}
          </span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={18} />
            <span>Disappearing Messages</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Off</span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--accent-rose)',
            fontSize: '13.5px',
            marginTop: '8px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Slash size={18} />
          <span>Block {activeChat.name}</span>
        </button>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--accent-rose)',
            fontSize: '13.5px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Flag size={18} />
          <span>Report Contact</span>
        </button>
      </div>
    </aside>
  );
}
