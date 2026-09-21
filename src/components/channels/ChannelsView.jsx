import React, { useState } from 'react';
import { Radio, CheckCircle, Users, Heart, Share2, Compass, Plus, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const discoverableChannels = [
  {
    id: 'chan_tech',
    name: 'Tech & AI Pulse',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    verified: true,
    followers: '2.4M',
    about: 'Daily breakthroughs in artificial intelligence, cryptography, and computing.',
    latestPost: {
      text: '⚡ Quantum key distribution test achieves new record throughput over optical fiber networks.',
      timestamp: 'Today at 10:45 AM',
      reactions: '1.2K'
    }
  },
  {
    id: 'chan_space',
    name: 'Cosmos & Space Missions',
    avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80',
    verified: true,
    followers: '1.8M',
    about: 'Astronomy discoveries, James Webb updates, and deep-space exploration.',
    latestPost: {
      text: '🔭 Webb telescope captures stunning new infrared perspectives of the Pillars of Creation.',
      timestamp: 'Yesterday at 4:20 PM',
      reactions: '950'
    }
  },
  {
    id: 'chan_crypto',
    name: 'Decentralized Networks',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&auto=format&fit=crop&q=80',
    verified: true,
    followers: '850K',
    about: 'Zero-knowledge proofs, mesh networking, and decentralized state architecture.',
    latestPost: {
      text: '🛡️ Privacy-first protocols continue to gain adoption across next-generation web applications.',
      timestamp: '2 days ago',
      reactions: '620'
    }
  }
];

export default function ChannelsView() {
  const { channels, toggleFollowChannel } = useChat();
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelAbout, setNewChannelAbout] = useState('');
  const [copiedPostId, setCopiedPostId] = useState(null);

  const handleCopyPost = (channel, post) => {
    const text = `[${channel.name}] ${post.text}\nShared via AETHER Messenger`;
    navigator.clipboard?.writeText(text);
    setCopiedPostId(channel.id);
    setTimeout(() => setCopiedPostId(null), 2000);
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Channels</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Stay updated on topics you care about</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowExploreModal(true)}
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
              border: 'none',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)',
              cursor: 'pointer'
            }}
          >
            <Compass size={14} /> Explore
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {/* Channel Feed Cards or Empty State */}
        {channels.length === 0 ? (
          <div style={{ padding: '50px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
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

            <button
              onClick={() => setShowExploreModal(true)}
              style={{
                marginTop: '18px',
                padding: '9px 18px',
                borderRadius: '20px',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={15} /> Discover Channels
            </button>
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
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  {channel.followed ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Broadcast Content */}
              {channel.latestPost && (
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
                      <button
                        onClick={() => handleCopyPost(channel, channel.latestPost)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: copiedPostId === channel.id ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        <Share2 size={14} /> {copiedPostId === channel.id ? 'Copied!' : 'Forward'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Explore Channels Modal */}
      {showExploreModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowExploreModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              maxHeight: '80vh',
              backgroundColor: 'var(--bg-modal)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Discover Channels
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Follow verified channels to receive instant updates
                </p>
              </div>

              <button
                onClick={() => setShowExploreModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-sidebar-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {discoverableChannels.map(item => {
                const isFollowed = channels.some(c => c.id === item.id);
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-sidebar-hover)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.avatar}
                          alt={item.name}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.name}
                          </h4>
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {item.followers} followers
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollowChannel(item.id, item)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: isFollowed ? 'var(--bg-input)' : 'var(--primary)',
                          color: isFollowed ? 'var(--text-secondary)' : '#FFFFFF',
                          border: isFollowed ? '1px solid var(--border-subtle)' : 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {item.about}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
