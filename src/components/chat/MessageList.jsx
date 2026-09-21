import React, { useEffect, useRef, useState } from 'react';
import { Lock, ArrowDown, Search } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';

export default function MessageList({ onReplyMessage }) {
  const { activeChat, typingContacts, setIsContactInfoOpen, inChatSearchQuery } = useChat();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const isTyping = typingContacts[activeChat?.id];

  const messagesToDisplay = inChatSearchQuery?.trim()
    ? (activeChat?.messages || []).filter(m => 
        (m.text || m.caption || m.fileName || '').toLowerCase().includes(inChatSearchQuery.trim().toLowerCase())
      )
    : (activeChat?.messages || []);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [activeChat?.id]);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [activeChat?.messages?.length, isTyping]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight > 180) {
      setShowScrollBottom(true);
    } else {
      setShowScrollBottom(false);
    }
  };

  if (!activeChat) return null;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="chat-canvas-bg"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* End-to-End Encryption Security Banner */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div
          onClick={() => setIsContactInfoOpen(true)}
          style={{
            maxWidth: '520px',
            backgroundColor: 'rgba(15, 22, 38, 0.82)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'border-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)'}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
              flexShrink: 0
            }}
          >
            <Lock size={14} />
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.45, textAlign: 'center', margin: 0 }}>
            Messages and calls are end-to-end encrypted. No one outside of this chat, not even AETHER, can read or listen to them. <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Tap to verify key</span>.
          </p>
        </div>
      </div>

      {/* Date Divider */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <span
          style={{
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 14px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          Today
        </span>
      </div>

      {/* Messages Render */}
      {inChatSearchQuery?.trim() && messagesToDisplay.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <Search size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p style={{ fontSize: '14px', fontWeight: 500 }}>No messages found matching "{inChatSearchQuery}"</p>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Check spelling or try a different keyword</span>
        </div>
      ) : (
        messagesToDisplay.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isGroup={activeChat.type === 'group'}
            onReply={onReplyMessage}
          />
        ))
      )}

      {/* WhatsApp-Style Typing Indicator Bubble */}
      {isTyping && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '4px 8px 12px',
            animation: 'fadeIn 0.2s'
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '16px 16px 16px 4px',
              backgroundColor: 'var(--bg-bubble-in)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-cyan)', marginRight: '4px' }}>
              {activeChat.name.split(' ')[0]} is typing
            </span>
            <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
            <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
            <div className="typing-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} style={{ height: '4px' }} />

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom('smooth')}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '24px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-modal)',
            color: 'var(--primary)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            animation: 'fadeIn 0.2s'
          }}
        >
          <ArrowDown size={18} />
        </button>
      )}
    </div>
  );
}
