import React, { useState } from 'react';
import { Smile, Heart, ThumbsUp, Coffee, Plane, Flag, Search } from 'lucide-react';

const EMOJI_CATEGORIES = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😜', '😎', '🤩', '🥳', '😏', '🤔', '🤫', '🫡', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮‍💨', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥸'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️'],
  objects: ['🔥', '✨', '⚡', '💥', '💫', '⭐', '🌟', '🛡️', '🔒', '🔑', '💻', '📱', '🔋', '💡', '🔦', '🧭', '⏱️', '🎙️', '🎧', '📷', '📹', '🚀', '🛰️', '🪐', '☕', '🍕', '🎉', '🏆', '💎']
};

export default function EmojiPicker({ onSelectEmoji, onClose }) {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [search, setSearch] = useState('');

  const currentEmojis = search.trim()
    ? Object.values(EMOJI_CATEGORIES).flat().filter(e => e.includes(search.trim()))
    : EMOJI_CATEGORIES[activeCategory];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '70px',
        left: '20px',
        width: '320px',
        height: '320px',
        borderRadius: '18px',
        backgroundColor: 'var(--bg-modal)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), var(--shadow-glow)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Search Input */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Search size={15} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search emoji..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            fontSize: '13px',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      {/* Category Tabs */}
      {!search.trim() && (
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 4px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-sidebar-hover)' }}>
          {[
            { id: 'smileys', icon: Smile },
            { id: 'gestures', icon: ThumbsUp },
            { id: 'hearts', icon: Heart },
            { id: 'objects', icon: Coffee }
          ].map(cat => {
            const Icon = cat.icon;
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  color: isCatActive ? 'var(--primary)' : 'var(--text-secondary)',
                  backgroundColor: isCatActive ? 'var(--bg-rail-active)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div
        style={{
          flex: 1,
          padding: '10px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '6px',
          alignContent: 'start'
        }}
      >
        {currentEmojis.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onSelectEmoji(emoji)}
            style={{
              fontSize: '20px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'transform 0.12s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
