import React, { useState, useMemo } from 'react';
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
  Users,
  Globe,
  UserPlus
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
    typingContacts,
    discoveredUsers,
    searchUserDirectory,
    startChatWithUsername,
    myProfile
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

  // Search global directory for suggestions when query is present
  const suggestedGlobalUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results = searchUserDirectory ? searchUserDirectory(searchQuery) : [];
    const activeUsernames = new Set(chats.map(c => (c.username || '').toLowerCase()));
    return results.filter(u => !activeUsernames.has(u.username.toLowerCase()));
  }, [searchQuery, searchUserDirectory, chats]);

  // Suggested registered users when no chats exist and search is empty
  const availableRegisteredUsers = useMemo(() => {
    return Object.values(discoveredUsers || {}).filter(u => {
      if (!u || !u.username) return false;
      if (u.username === myProfile?.username) return false;
      const inChats = chats.some(c => (c.username || '').toLowerCase() === u.username.toLowerCase());
      return !inChats;
    });
  }, [discoveredUsers, myProfile?.username, chats]);

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

      {/* Search Bar (WhatsApp Web style with live suggestions) */}
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
            placeholder="Search by username or name"
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
      {!searchQuery.trim() && (
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
      )}

      {/* Conversations List / Global User Directory Suggestions */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* If user is actively searching */}
        {searchQuery.trim() ? (
          <div>
            {/* 1. Existing Conversations Matching Search */}
            {sortedChats.length > 0 && (
              <div>
                <div style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Chats ({sortedChats.length})
                </div>
                {sortedChats.map(chat => {
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
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => !isActive && (e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)')}
                      onMouseLeave={e => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        {chat.online && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              width: '11px',
                              height: '11px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--accent-emerald)',
                              border: '2px solid var(--bg-sidebar)'
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {chat.name}
                          </h4>
                          {lastMsg && (
                            <span style={{ fontSize: '11.5px', color: chat.unreadCount > 0 ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }}>
                              {lastMsg.timestamp}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <p style={{ fontSize: '13px', color: isTyping ? 'var(--accent-cyan)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                            {isTyping ? 'typing...' : (lastMsg?.text || chat.lastMessage || '')}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span style={{ minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. Global Registered Users Auto-Suggestions */}
            {suggestedGlobalUsers.length > 0 && (
              <div style={{ marginTop: sortedChats.length > 0 ? '12px' : '0' }}>
                <div style={{ padding: '8px 16px 6px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={13} />
                  <span>Registered Users ({suggestedGlobalUsers.length})</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 8px' }}>
                  {suggestedGlobalUsers.map(user => (
                    <div
                      key={user.username}
                      onClick={() => {
                        startChatWithUsername(user.username, user);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-sidebar-hover)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s, background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '14px',
                              flexShrink: 0
                            }}
                          >
                            {(user.username || 'U').substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {user.name}
                            </h4>
                            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', backgroundColor: 'rgba(6, 182, 212, 0.12)', padding: '1px 6px', borderRadius: '6px' }}>
                              @{user.username}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.about || 'Available on AETHER'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startChatWithUsername(user.username, user);
                          setSearchQuery('');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0,
                          cursor: 'pointer'
                        }}
                      >
                        <UserPlus size={13} /> Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. No Matches Found */}
            {sortedChats.length === 0 && suggestedGlobalUsers.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  No registered users found matching "{searchQuery}".
                </p>
                <button
                  onClick={() => {
                    startChatWithUsername(searchQuery.trim().replace(/^@/, ''));
                    setSearchQuery('');
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '8px 18px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)'
                  }}
                >
                  Start chat with @{searchQuery.trim().replace(/^@/, '')}
                </button>
              </div>
            )}
          </div>
        ) : sortedChats.length === 0 ? (
          <div style={{ padding: '36px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: '14px'
              }}
            >
              <MessageSquare size={28} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No conversations yet
            </h3>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5, maxWidth: '280px' }}>
              Search for any friend by their @username or start a chat with registered users below.
            </p>

            <button
              onClick={() => setIsNewChatOpen(true)}
              style={{
                marginTop: '16px',
                padding: '9px 18px',
                borderRadius: '18px',
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
              <MessageSquarePlus size={16} /> Find by Username
            </button>

            {/* List of Available Registered Users on the Mesh */}
            {availableRegisteredUsers.length > 0 && (
              <div style={{ marginTop: '28px', width: '100%', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', padding: '0 4px' }}>
                  <Globe size={13} color="var(--primary)" />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Registered Users ({availableRegisteredUsers.length})
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {availableRegisteredUsers.map(user => (
                    <div
                      key={user.username}
                      onClick={() => startChatWithUsername(user.username, user)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--bg-sidebar-hover)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '13px'
                            }}
                          >
                            {(user.username || 'U').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {user.name}
                          </h4>
                          <span style={{ fontSize: '11.5px', color: 'var(--accent-cyan)' }}>
                            @{user.username}
                          </span>
                        </div>
                      </div>

                      <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--primary)', padding: '4px 8px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.12)' }}>
                        Chat
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)')}
                onMouseLeave={e => !isActive && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {chat.online && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '11px',
                        height: '11px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-emerald)',
                        border: '2px solid var(--bg-sidebar)'
                      }}
                    />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {chat.name}
                    </h4>
                    {lastMsg && (
                      <span style={{ fontSize: '11.5px', color: chat.unreadCount > 0 ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0 }}>
                        {lastMsg.timestamp}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '13px', color: isTyping ? 'var(--accent-cyan)' : 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                      {isTyping ? 'typing...' : (lastMsg?.text || chat.lastMessage || '')}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span style={{ minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', backgroundColor: 'var(--primary)', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {chat.unreadCount}
                      </span>
                    )}
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
