import React from 'react';
import { Plus, Camera, Edit3, CircleDashed, ShieldCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { currentUser } from '../../data/mockData';

export default function StatusView() {
  const { 
    statuses, 
    setStoryViewer, 
    setIsCreateStatusOpen,
    myProfile
  } = useChat();

  const userStatus = statuses.find(s => s.isUser);
  const recentStatuses = statuses.filter(s => !s.isUser && s.unviewed);
  const viewedStatuses = statuses.filter(s => !s.isUser && !s.unviewed);

  const handleOpenStory = (statusItem) => {
    if (!statusItem.stories || statusItem.stories.length === 0) {
      setIsCreateStatusOpen(true);
      return;
    }
    setStoryViewer({ statusItem, initialIndex: 0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Status</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Disappearing 24h stories</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsCreateStatusOpen(true)}
            title="Create Text Story"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-sidebar-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.2s'
            }}
          >
            <Edit3 size={17} />
          </button>

          <button
            onClick={() => setIsCreateStatusOpen(true)}
            title="Upload Media Story"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <Camera size={17} />
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* User's My Status */}
        <div 
          onClick={() => handleOpenStory(userStatus)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '10px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-sidebar-hover)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
            <img
              src={myProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="My Status"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: userStatus?.stories?.length > 0 ? '2px solid var(--accent-cyan)' : '2px solid var(--border-subtle)'
              }}
            />
            {(!userStatus?.stories || userStatus.stories.length === 0) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  border: '2px solid var(--bg-sidebar)'
                }}
              >
                <Plus size={14} strokeWidth={3} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>My Status</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {userStatus?.stories?.length > 0 
                ? `${userStatus.stories.length} active updates` 
                : 'Tap to add story update'}
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <ShieldCheck size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Your status updates are end-to-end encrypted and disappear after 24 hours.
          </span>
        </div>

        {/* Recent Updates Section */}
        {recentStatuses.length > 0 && (
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', paddingLeft: '4px' }}>
              Recent Updates
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {recentStatuses.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleOpenStory(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0, padding: '3px' }}>
                    {/* Glowing Story Gradient Ring */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366F1, #06B6D4, #10B981)',
                        padding: '2px',
                        boxShadow: '0 0 10px rgba(6, 182, 212, 0.35)'
                      }}
                    />
                    <img
                      src={item.avatar}
                      alt={item.name}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--bg-sidebar)'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewed Updates Section */}
        {viewedStatuses.length > 0 && (
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', paddingLeft: '4px' }}>
              Viewed Updates
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {viewedStatuses.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleOpenStory(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    opacity: 0.8,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '0.8';
                  }}
                >
                  <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
                    <img
                      src={item.avatar}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--text-muted)'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
