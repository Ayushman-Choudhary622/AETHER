import React from 'react';
import { Lock, ShieldCheck, MessageSquarePlus } from 'lucide-react';
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
    setIsNewChatOpen 
  } = useChat();

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
        <MessageList onReplyMessage={(msg) => setReplyMessage(msg)} />
        <ChatInput />
      </div>

      {/* Right Slide-out Drawer */}
      <ContactDrawer />
    </main>
  );
}
