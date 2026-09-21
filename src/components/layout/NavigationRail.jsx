import React from 'react';
import { 
  MessageSquare, 
  CircleDashed, 
  Radio, 
  Phone, 
  Star, 
  Settings, 
  Sun, 
  Moon,
  ShieldCheck
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { currentUser } from '../../data/mockData';
import BrandLogo from '../common/BrandLogo';

export default function NavigationRail() {
  const { 
    activeTab, 
    setActiveTab, 
    chats, 
    statuses, 
    callLogs, 
    theme, 
    toggleTheme,
    setIsSettingsOpen,
    myProfile
  } = useChat();

  // Calculate unread badge counts
  const totalUnreadMessages = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadStatuses = statuses.filter(s => !s.isUser && s.unviewed).length;
  const missedCalls = callLogs.filter(c => c.status === 'missed').length;

  const navItems = [
    {
      id: 'chats',
      label: 'Chats',
      icon: MessageSquare,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : null,
      badgeColor: 'var(--primary)'
    },
    {
      id: 'status',
      label: 'Status & Stories',
      icon: CircleDashed,
      badge: unreadStatuses > 0 ? unreadStatuses : null,
      badgeColor: 'var(--accent-cyan)'
    },
    {
      id: 'channels',
      label: 'Channels & Sphere',
      icon: Radio,
      badge: null
    },
    {
      id: 'calls',
      label: 'Calls',
      icon: Phone,
      badge: missedCalls > 0 ? missedCalls : null,
      badgeColor: 'var(--accent-rose)'
    }
  ];

  return (
    <aside
      style={{
        width: '68px',
        height: '100%',
        backgroundColor: 'var(--bg-rail)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        zIndex: 40,
        flexShrink: 0
      }}
    >
      {/* Top: Brand Emblem */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={() => setActiveTab('chats')}
          title="AETHER Home"
          style={{
            padding: '4px',
            borderRadius: '12px',
            transition: 'all 0.2s',
            outline: 'none'
          }}
        >
          <BrandLogo size={36} showText={false} />
        </button>

        {/* Primary Navigation Icons */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                style={{
                  position: 'relative',
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? 'var(--bg-rail-active)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={21} strokeWidth={isActive ? 2.3 : 1.8} />

                {/* Left Active Indicator Bar */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-11px',
                      width: '3px',
                      height: '24px',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '0 4px 4px 0',
                      boxShadow: '0 0 10px var(--primary)'
                    }}
                  />
                )}

                {/* Badge Counter */}
                {item.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      minWidth: '17px',
                      height: '17px',
                      padding: '0 4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      backgroundColor: item.badgeColor,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utilities: Theme, Settings, Profile */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
            border: '1px solid transparent'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title="Settings & Privacy"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
            border: '1px solid transparent'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Settings size={20} />
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          title={`${myProfile?.name || 'Profile'} (@${myProfile?.username || 'user'})`}
          style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            cursor: 'pointer',
            padding: '2px',
            border: '2px solid var(--border-glow)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
          }}
        >
          <img
            src={myProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={myProfile?.name || 'Profile'}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          {/* Online green dot */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-emerald)',
              border: '2px solid var(--bg-rail)'
            }}
          />
        </div>
      </div>
    </aside>
  );
}
