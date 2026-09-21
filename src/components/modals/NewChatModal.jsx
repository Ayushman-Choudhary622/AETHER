import React, { useState } from 'react';
import { X, Users, UserPlus, Shield, Sparkles, AtSign, Search, MessageSquare } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function NewChatModal() {
  const { 
    isNewChatOpen, 
    setIsNewChatOpen, 
    startChatWithUsername, 
    discoveredUsers,
    myProfile 
  } = useChat();

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'group'
  const [usernameInput, setUsernameInput] = useState('');
  const [groupName, setGroupName] = useState('');

  if (!isNewChatOpen) return null;

  const handleStartChat = (username, userObj) => {
    startChatWithUsername(username, userObj);
  };

  const cleanSearch = usernameInput.toLowerCase().replace(/[^a-z0-9_]/g, '');

  // Filter discovered network users
  const networkUsersList = Object.values(discoveredUsers).filter(u => u.username !== myProfile?.username);

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
      onClick={() => setIsNewChatOpen(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '82vh',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), var(--shadow-glow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('search')}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: activeTab === 'search' ? 'var(--primary)' : 'var(--bg-sidebar-hover)',
                color: activeTab === 'search' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AtSign size={15} /> Find by Username
            </button>
            <button
              onClick={() => setActiveTab('group')}
              style={{
                padding: '6px 14px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: activeTab === 'group' ? 'var(--primary)' : 'var(--bg-sidebar-hover)',
                color: activeTab === 'group' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={15} /> New Group
            </button>
          </div>

          <button
            onClick={() => setIsNewChatOpen(false)}
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

        {/* Tab 1: Find by Username */}
        {activeTab === 'search' ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            {/* Search Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Enter Username to Chat in Real Time
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '14px',
                  padding: '0 14px',
                  border: '1px solid var(--border-glow)'
                }}
              >
                <AtSign size={16} color="var(--primary)" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  placeholder="e.g. sophia or alex or test_user"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    background: 'transparent',
                    fontSize: '14px',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Direct Connect Button if username typed */}
            {cleanSearch && (
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg-sidebar-hover)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 700 }}>
                    @{cleanSearch.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      @{cleanSearch}
                    </h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--accent-cyan)' }}>
                      Direct Encrypted Cloud Route
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartChat(cleanSearch)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  Start Chat
                </button>
              </div>
            )}

            {/* Discovered Users on Network */}
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Live Peers on Network ({networkUsersList.length})
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {networkUsersList.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                    Type any username above to connect with them instantly!
                  </p>
                ) : (
                  networkUsersList.map(u => (
                    <div
                      key={u.username}
                      onClick={() => handleStartChat(u.username, u)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-sidebar-hover)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={u.avatar}
                          alt={u.name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.name}
                          </h4>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            @{u.username}
                          </span>
                        </div>
                      </div>

                      <button
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <MessageSquare size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Group creation */
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Group Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Founders &amp; Builders"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <button
              onClick={() => {
                if (!groupName.trim()) return;
                handleStartChat(groupName.trim().toLowerCase().replace(/\s+/g, '_'), { name: groupName.trim() });
              }}
              disabled={!groupName.trim()}
              style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px',
                cursor: groupName.trim() ? 'pointer' : 'default',
                opacity: groupName.trim() ? 1 : 0.5,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              Create Encrypted Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
