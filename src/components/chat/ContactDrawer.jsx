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
  QrCode,
  Trash2,
  Download,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ContactDrawer() {
  const { 
    activeChat, 
    isContactInfoOpen, 
    setIsContactInfoOpen, 
    startCall, 
    toggleMuteChat,
    blockedContacts,
    blockContact,
    unblockContact,
    isContactBlocked,
    clearChat,
    deleteChat,
    setDisappearingTimer
  } = useChat();

  const [activeMediaTab, setActiveMediaTab] = useState('media'); // 'media' | 'docs' | 'starred'

  if (!isContactInfoOpen || !activeChat) return null;

  // Extract media and starred from messages
  const mediaMessages = activeChat.messages.filter(m => m.type === 'image' && !m.deleted);
  const docMessages = activeChat.messages.filter(m => m.type === 'document' && !m.deleted);
  const starredMessages = activeChat.messages.filter(m => m.starred && !m.deleted);

  const isBlocked = activeChat.username ? isContactBlocked(activeChat.username) : false;
  const currentTimer = activeChat.disappearingTimer || 'off';

  const handleCycleDisappearingTimer = () => {
    const next = currentTimer === 'off' ? '24h' : currentTimer === '24h' ? '7d' : 'off';
    setDisappearingTimer(activeChat.id, next);
  };

  const exportChatHistory = () => {
    if (!activeChat?.messages) return;
    const transcript = activeChat.messages.map(m => {
      return `[${m.timestamp}] ${m.senderName || m.senderId}: ${m.deleted ? '[Deleted Message]' : (m.text || m.type + ' attachment')}`;
    }).join('\n');

    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AETHER_Chat_${activeChat.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      className="contact-drawer-aside"
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
          {activeChat.username ? `@${activeChat.username}` : activeChat.phone || 'AETHER User'}
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer'
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
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)',
              cursor: 'pointer'
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

      {/* Media, Docs & Starred Section */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Media, Docs &amp; Starred
          </span>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
            {mediaMessages.length + docMessages.length + starredMessages.length} items
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {[
            { id: 'media', label: 'Media', count: mediaMessages.length },
            { id: 'docs', label: 'Docs', count: docMessages.length },
            { id: 'starred', label: 'Starred', count: starredMessages.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMediaTab(tab.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
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

        {/* Content View */}
        {activeMediaTab === 'media' && (
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
        )}

        {activeMediaTab === 'docs' && (
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

        {activeMediaTab === 'starred' && (
          starredMessages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {starredMessages.map(m => (
                <div key={m.id} style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: 'var(--bg-sidebar-hover)', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent-amber)', marginBottom: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
                      <Star size={12} fill="currentColor" /> Starred
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{m.timestamp}</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{m.text || 'Media attachment'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
              No starred messages in this chat
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

      {/* Settings & Danger Zone Options */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Mute Notifications */}
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
            transition: 'background 0.15s',
            cursor: 'pointer'
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

        {/* Disappearing Messages */}
        <button
          onClick={handleCycleDisappearingTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            transition: 'background 0.15s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={18} color={currentTimer !== 'off' ? 'var(--accent-cyan)' : 'inherit'} />
            <span>Disappearing Messages</span>
          </div>
          <span style={{ fontSize: '12px', color: currentTimer !== 'off' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 600 }}>
            {currentTimer === '24h' ? '24 Hours' : currentTimer === '7d' ? '7 Days' : 'Off'}
          </span>
        </button>

        {/* Export Chat History */}
        <button
          onClick={exportChatHistory}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            transition: 'background 0.15s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Download size={18} color="var(--primary)" />
            <span>Export Chat History</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--primary)' }}>.TXT</span>
        </button>

        {/* Clear Messages */}
        <button
          onClick={() => {
            if (window.confirm(`Clear all messages in chat with ${activeChat.name}?`)) {
              clearChat(activeChat.id);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
            fontSize: '13.5px',
            transition: 'background 0.15s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
            e.currentTarget.style.color = 'var(--accent-rose)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Trash2 size={18} />
          <span>Clear Messages</span>
        </button>

        {/* Block / Unblock Contact */}
        <button
          onClick={() => {
            if (activeChat.username) {
              if (isBlocked) {
                unblockContact(activeChat.username);
              } else {
                blockContact(activeChat.username);
              }
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px',
            color: isBlocked ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            backgroundColor: isBlocked ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
            fontSize: '13.5px',
            marginTop: '4px',
            transition: 'background 0.15s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = isBlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = isBlocked ? 'rgba(16, 185, 129, 0.08)' : 'transparent'}
        >
          <Slash size={18} />
          <span>{isBlocked ? `Unblock ${activeChat.name}` : `Block ${activeChat.name}`}</span>
        </button>

        {/* Delete Entire Chat */}
        <button
          onClick={() => {
            if (window.confirm(`Delete conversation with ${activeChat.name} completely?`)) {
              deleteChat(activeChat.id);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '10px',
            color: 'var(--accent-rose)',
            fontSize: '13.5px',
            transition: 'background 0.15s',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Trash2 size={18} />
          <span>Delete Chat</span>
        </button>
      </div>
    </aside>
  );
}
