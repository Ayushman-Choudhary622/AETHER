import React from 'react';
import { Lock, ShieldCheck, MessageSquarePlus, Ban } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ContactDrawer from './ContactDrawer';
import BrandLogo from '../common/BrandLogo';

export default function ChatArea() {
  const { 
    activeChat, 
    setReplyMessage, 
    setIsNewChatOpen,
    isContactBlocked,
    unblockContact
  } = useChat();

  const isBlocked = activeChat?.username ? isContactBlocked(activeChat.username) : false;

  if (!activeChat) {
    return (
      <main
        style={{
          flex: 1,
          height: '100%',
          backgroundColor: 'var(--bg-chat)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          position: 'relative'
        }}
        className="chat-canvas-bg"
      >
        <div style={{ maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BrandLogo size={64} showText={false} />
          
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 800,
              marginTop: '20px',
              letterSpacing: '1px',
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #A5B4FC 80%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AETHER Web
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.6 }}>
            Send and receive messages with quantum-resistant end-to-end encryption. Share voice notes, media, and stay connected seamlessly.
          </p>

          <button
            onClick={() => setIsNewChatOpen(true)}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              borderRadius: '24px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.45)'
            }}
          >
            <MessageSquarePlus size={18} /> Start a New Conversation
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <Lock size={14} color="var(--accent-cyan)" />
          <span>End-to-end encrypted with zero knowledge architecture</span>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Central Chat View */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0
        }}
      >
        <ChatHeader />
        {isBlocked && (
          <div
            style={{
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              borderBottom: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              zIndex: 25
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontSize: '13px', fontWeight: 500 }}>
              <Ban size={16} />
              <span>You have blocked @{activeChat.username}. Messages and calls from this user are blocked.</span>
            </div>
            <button
              onClick={() => unblockContact(activeChat.username)}
              style={{
                padding: '5px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-rose)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Unblock
            </button>
          </div>
        )}
        <MessageList onReplyMessage={(msg) => setReplyMessage(msg)} />
        <ChatInput />
      </div>

      {/* Right Slide-out Drawer */}
      <ContactDrawer />
    </main>
  );
}
