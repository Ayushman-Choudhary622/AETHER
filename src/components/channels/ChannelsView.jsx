import React from 'react';
import { Radio, CheckCircle, Users, Heart, Share2, Compass, Plus } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ChannelsView() {
  const { channels, toggleFollowChannel } = useChat();

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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Channels</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Stay updated on topics you care about</p>
        </div>

        <button
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)'
          }}
        >
          <Compass size={14} /> Explore
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {/* Channel Feed Cards or Empty State */}
        {channels.length === 0 ? (
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
              <Radio size={30} />
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              No channels followed yet
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5, maxWidth: '290px' }}>
              Stay updated on topics you care about. Discover and follow public channels or create your own broadcast network.
            </p>
          </div>
        ) : (
          channels.map(channel => (
            <div
              key={channel.id}
              style={{
                borderRadius: '16px',
                backgroundColor: 'var(--bg-sidebar-hover)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Channel Info Bar */}
              <div
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {channel.name}
                      </h4>
                      {channel.verified && (
                        <CheckCircle size={15} color="var(--accent-cyan)" fill="rgba(6, 182, 212, 0.2)" />
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {channel.followers} followers
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowChannel(channel.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: channel.followed ? 'var(--bg-input)' : 'var(--primary)',
                    color: channel.followed ? 'var(--text-secondary)' : '#FFFFFF',
                    border: channel.followed ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {channel.followed ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Broadcast Content */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '13.5px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {channel.latestPost.text}
                </p>

                {channel.latestPost.image && (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', maxHeight: '200px' }}>
                    <img
                      src={channel.latestPost.image}
                      alt="Channel media"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Post Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>{channel.latestPost.timestamp}</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)' }}>
                      <Heart size={14} fill="currentColor" /> {channel.latestPost.reactions}
                    </span>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                      <Share2 size={14} /> Forward
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
