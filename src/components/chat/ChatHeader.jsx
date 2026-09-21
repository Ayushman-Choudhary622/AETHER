import React, { useState } from 'react';
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  PanelRight, 
  CheckCircle2, 
  Clock, 
  BellOff, 
  Bell, 
  Trash2, 
  Download, 
  Ban, 
  X,
  ChevronLeft
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ChatHeader() {
  const { 
    activeChat, 
    setActiveChatId,
    startCall, 
    isContactInfoOpen, 
    setIsContactInfoOpen,
    typingContacts,
    toggleMuteChat,
    clearChat,
    exportChatHistory,
    blockContact,
    unblockContact,
    isContactBlocked,
    inChatSearchQuery,
    setInChatSearchQuery,
    isInChatSearchOpen,
    setIsInChatSearchOpen
  } = useChat();

  const [showMenu, setShowMenu] = useState(false);

  if (!activeChat) return null;

  const isTyping = typingContacts[activeChat.id];
  const isBlocked = activeChat.username ? isContactBlocked(activeChat.username) : false;
  const isMuted = !!activeChat.muted;
  const disappearing = activeChat.disappearingTimer && activeChat.disappearingTimer !== 'off' 
    ? activeChat.disappearingTimer 
    : null;

  return (
    <div
      className="glass-header"
      style={{
        minHeight: '64px',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 30,
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile Back Button to return to sidebar list */}
          <button 
            className="mobile-back-btn" 
            onClick={() => setActiveChatId(null)}
            title="Back to chats"
            aria-label="Back to chats"
          >
            <ChevronLeft size={24} />
          </button>

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
            {activeChat.online && !isBlocked && (
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
              {isMuted && (
                <BellOff size={13} color="var(--text-muted)" title="Notifications muted" />
              )}
              {disappearing && (
                <span 
                  title={`Disappearing messages active: ${disappearing}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--accent-cyan)',
                    backgroundColor: 'rgba(6, 182, 212, 0.12)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    border: '1px solid rgba(6, 182, 212, 0.25)'
                  }}
                >
                  <Clock size={11} /> {disappearing}
                </span>
              )}
              {isBlocked && (
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: 'var(--accent-rose)',
                    backgroundColor: 'rgba(244, 63, 94, 0.12)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(244, 63, 94, 0.25)'
                  }}
                >
                  BLOCKED
                </span>
              )}
            </div>

            <p style={{ fontSize: '12px', color: isBlocked ? 'var(--accent-rose)' : isTyping ? 'var(--accent-cyan)' : activeChat.online ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
              {isBlocked ? 'Contact blocked' : isTyping ? 'typing...' : activeChat.online ? 'online' : activeChat.lastSeen}
            </p>
          </div>
        </div>
      </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Search in Chat Button */}
          <button
            onClick={() => {
              setIsInChatSearchOpen(s => !s);
              if (isInChatSearchOpen) setInChatSearchQuery('');
            }}
            title="Search in Conversation"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isInChatSearchOpen ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: isInChatSearchOpen ? 'var(--bg-sidebar-active)' : 'transparent',
              transition: 'all 0.2s',
              border: '1px solid transparent'
            }}
            onMouseEnter={e => {
              if (!isInChatSearchOpen) {
                e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                e.currentTarget.style.color = 'var(--primary)';
              }
            }}
            onMouseLeave={e => {
              if (!isInChatSearchOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <Search size={18} />
          </button>

          {/* Video Call */}
          <button
            onClick={() => {
              if (isBlocked) {
                alert("Cannot call a blocked contact. Unblock them first.");
                return;
              }
              startCall(activeChat, 'video');
            }}
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
              border: '1px solid transparent',
              opacity: isBlocked ? 0.4 : 1
            }}
            onMouseEnter={e => {
              if (!isBlocked) {
                e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                e.currentTarget.style.color = 'var(--primary)';
              }
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
            onClick={() => {
              if (isBlocked) {
                alert("Cannot call a blocked contact. Unblock them first.");
                return;
              }
              startCall(activeChat, 'audio');
            }}
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
              border: '1px solid transparent',
              opacity: isBlocked ? 0.4 : 1
            }}
            onMouseEnter={e => {
              if (!isBlocked) {
                e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                e.currentTarget.style.color = 'var(--primary)';
              }
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
                  width: '200px',
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
                    gap: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <PanelRight size={16} /> Contact Info
                </button>

                <button
                  onClick={() => setIsInChatSearchOpen(true)}
                  style={{
                    width: '100%',
                    padding: '9px 16px',
                    fontSize: '13px',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Search size={16} /> Search in Chat
                </button>

                <button
                  onClick={() => toggleMuteChat(activeChat.id)}
                  style={{
                    width: '100%',
                    padding: '9px 16px',
                    fontSize: '13px',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {isMuted ? <Bell size={16} color="var(--accent-emerald)" /> : <BellOff size={16} />}
                  {isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
                </button>

                <button
                  onClick={() => exportChatHistory(activeChat.id)}
                  style={{
                    width: '100%',
                    padding: '9px 16px',
                    fontSize: '13px',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Download size={16} /> Export Chat (.txt)
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    if (window.confirm(`Clear all messages in chat with ${activeChat.name}?`)) {
                      clearChat(activeChat.id);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 16px',
                    fontSize: '13px',
                    textAlign: 'left',
                    color: 'var(--accent-rose)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={16} /> Clear Messages
                </button>

                {activeChat.username && (
                  <button
                    onClick={() => {
                      if (isBlocked) {
                        unblockContact(activeChat.username);
                      } else {
                        if (window.confirm(`Block @${activeChat.username}? They will not be able to message or call you.`)) {
                          blockContact(activeChat.username);
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 16px',
                      fontSize: '13px',
                      textAlign: 'left',
                      color: isBlocked ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = isBlocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Ban size={16} /> {isBlocked ? 'Unblock Contact' : 'Block Contact'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable In-Chat Search Bar */}
      {isInChatSearchOpen && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 4px 10px',
            borderTop: '1px solid var(--border-subtle)',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--bg-input)',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              autoFocus
              placeholder="Search in this conversation..."
              value={inChatSearchQuery}
              onChange={e => setInChatSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                outline: 'none'
              }}
            />
            {inChatSearchQuery && (
              <button
                onClick={() => setInChatSearchQuery('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setIsInChatSearchOpen(false);
              setInChatSearchQuery('');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'var(--bg-sidebar-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
