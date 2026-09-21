import React, { useState } from 'react';
import { 
  Search, 
  X, 
  MessageSquarePlus, 
  Pin, 
  VolumeX, 
  Check, 
  CheckCheck, 
  Camera, 
  Mic, 
  FileText, 
  Archive,
  MessageSquare,
  Sparkles,
  Users
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import StatusView from '../status/StatusView';
import ChannelsView from '../channels/ChannelsView';
import CallsView from '../calls/CallsView';

export default function SidebarList() {
  const { 
    activeTab, 
    chats, 
    activeChatId, 
    setActiveChatId, 
    searchQuery, 
    setSearchQuery, 
    activeFilter, 
    setActiveFilter, 
    setIsNewChatOpen,
    typingContacts
  } = useChat();

  // If not chats tab, delegate to specialized view
  if (activeTab === 'status') {
    return (
      <section className="aether-sidebar-list" style={{ width: '400px', height: '100%', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <StatusView />
      </section>
    );
  }

  if (activeTab === 'channels') {
    return (
      <section className="aether-sidebar-list" style={{ width: '400px', height: '100%', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <ChannelsView />
      </section>
    );
  }

  if (activeTab === 'calls') {
    return (
      <section className="aether-sidebar-list" style={{ width: '400px', height: '100%', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <CallsView />
      </section>
    );
  }

  // Filter & Search Logic for Chats
  const filteredChats = (chats || []).filter(chat => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (chat.name || '').toLowerCase().includes(q);
      const matchUsername = (chat.username || '').toLowerCase().includes(q);
      const matchMsg = (chat.messages || []).some(m => (m.text || '').toLowerCase().includes(q));
      if (!matchName && !matchUsername && !matchMsg) return false;
    }

    if (activeFilter === 'unread' && (!chat.unreadCount || chat.unreadCount === 0)) return false;
    if (activeFilter === 'favorites' && !chat.favorite) return false;
    if (activeFilter === 'groups' && chat.type !== 'group') return false;

    return true;
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'groups', label: 'Groups' }
  ];

  return (
    <section
      className="aether-sidebar-list"
      style={{
        width: '400px',
        height: '100%',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 20
      }}
    >
      {/* Top Header: Title & New Chat Action */}
      <div
        style={{
          padding: '16px 20px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
          Chats
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsNewChatOpen(true)}
            title="Start New Chat"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
              cursor: 'pointer',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <MessageSquarePlus size={18} />
          </button>
        </div>
      </div>

      {/* Search Bar (WhatsApp Web style) */}
      <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '12px',
            padding: '8px 14px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={16} color="var(--text-muted)" style={{ marginRight: '10px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              fontSize: '13.5px',
              color: 'var(--text-primary)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '2px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '0 16px 12px',
          overflowX: 'auto',
          flexShrink: 0
        }}
      >
        {filterTabs.map(tab => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '5px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-sidebar-hover)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conversations List / Clean Slate Empty State */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sortedChats.length === 0 ? (
          <div style={{ padding: '60px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '16px'
              }}
            >
              <MessageSquare size={30} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No conversations yet
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5, maxWidth: '280px' }}>
              Connect with friends anywhere in the world by searching their unique @username.
            </p>

            <button
              onClick={() => setIsNewChatOpen(true)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                borderRadius: '20px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}
            >
              <MessageSquarePlus size={16} /> Start New Chat
            </button>
          </div>
        ) : (
          sortedChats.map(chat => {
            const isActive = chat.id === activeChatId;
            const messages = chat.messages || [];
            const lastMsg = messages[messages.length - 1];
            const isTyping = typingContacts[chat.id] || typingContacts[chat.username];

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background 0.15s',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Contact Avatar */}
                <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                  <img
                    src={chat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={chat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  {chat.online && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1px',
                        right: '1px',
                        width: '11px',
                        height: '11px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-emerald)',
                        border: '2px solid var(--bg-sidebar)'
                      }}
                    />
                  )}
                </div>

                {/* Info & Last Message */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Top Line: Name & Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4
                      style={{
                        fontSize: '14.5px',
                        fontWeight: chat.unreadCount > 0 ? 700 : 600,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginRight: '8px'
                      }}
                    >
                      {chat.name}
                    </h4>

                    <span
                      style={{
                        fontSize: '11px',
                        color: chat.unreadCount > 0 ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: chat.unreadCount > 0 ? 600 : 400,
                        flexShrink: 0
                      }}
                    >
                      {lastMsg?.timestamp || 'Just now'}
                    </span>
                  </div>

                  {/* Bottom Line: Message Snippet & Indicators */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        fontSize: '12.5px',
                        color: isTyping ? 'var(--accent-cyan)' : (chat.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)'),
                        fontWeight: chat.unreadCount > 0 ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isTyping ? (
                        <span>typing...</span>
                      ) : (
                        <>
                          {lastMsg?.senderId === 'user_me' && (
                            <span>
                              {lastMsg.status === 'read' ? (
                                <CheckCheck size={14} color="var(--tick-blue)" />
                              ) : (
                                <CheckCheck size={14} color="var(--tick-gray)" />
                              )}
                            </span>
                          )}

                          {lastMsg?.type === 'image' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Camera size={13} /> Photo
                            </span>
                          )}

                          {lastMsg?.type === 'voice' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Mic size={13} color="var(--primary)" /> Voice note ({lastMsg.audioDuration || '0:14'})
                            </span>
                          )}

                          {lastMsg?.type === 'document' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <FileText size={13} /> {lastMsg.fileName}
                            </span>
                          )}

                          {(!lastMsg?.type || lastMsg?.type === 'text') && (
                            <span>{lastMsg?.text || 'Encrypted chat room ready'}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Right Badges: Pin, Mute, Unread count */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                      {chat.muted && <VolumeX size={13} color="var(--text-muted)" />}
                      {chat.pinned && <Pin size={13} color="var(--text-muted)" />}

                      {chat.unreadCount > 0 && (
                        <span
                          style={{
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            minWidth: '18px',
                            height: '18px',
                            padding: '0 5px',
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)'
                          }}
                        >
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
