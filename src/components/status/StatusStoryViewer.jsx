import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart, Flame, ThumbsUp, Laugh, Shield } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function StatusStoryViewer() {
  const { storyViewer, setStoryViewer, sendMessage, setActiveChatId, setActiveTab } = useChat();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  const statusItem = storyViewer?.statusItem;
  const stories = statusItem?.stories || [];
  const currentStory = stories[currentIndex];

  const DURATION_MS = 5000;
  const INTERVAL_MS = 50;

  useEffect(() => {
    if (storyViewer?.initialIndex !== undefined) {
      setCurrentIndex(storyViewer.initialIndex);
    }
    setProgress(0);
  }, [storyViewer]);

  useEffect(() => {
    if (!currentStory || isPaused) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Advance to next story or close
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(i => i + 1);
            return 0;
          } else {
            setStoryViewer(null);
            return 100;
          }
        }
        return prev + (INTERVAL_MS / DURATION_MS) * 100;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [currentStory, currentIndex, isPaused, stories.length, setStoryViewer]);

  if (!storyViewer || !currentStory) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setProgress(0);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(i => i + 1);
      setProgress(0);
    } else {
      setStoryViewer(null);
    }
  };

  const handleSendReply = (textToSend) => {
    const text = textToSend || replyText;
    if (!text.trim()) return;

    // Send direct reply message to this contact
    if (statusItem.contactId) {
      setActiveChatId(statusItem.contactId);
      setActiveTab('chats');
      sendMessage({
        text: `Replied to your status: "${text}"`,
        type: 'text'
      });
    }

    setReplyText('');
    setStoryViewer(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.96)',
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setStoryViewer(null)}
    >
      {/* Story Stage Frame */}
      <div
        onClick={e => e.stopPropagation()}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '92vh',
          maxHeight: '820px',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Top Segmented Progress Bars */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            display: 'flex',
            gap: '5px',
            zIndex: 30
          }}
        >
          {stories.map((story, idx) => {
            let fillWidth = '0%';
            if (idx < currentIndex) fillWidth = '100%';
            else if (idx === currentIndex) fillWidth = `${progress}%`;

            return (
              <div
                key={story.id}
                style={{
                  flex: 1,
                  height: '3.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: fillWidth,
                    backgroundColor: '#FFFFFF',
                    transition: idx === currentIndex ? 'none' : 'width 0.2s',
                    boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Header Bar */}
        <div
          style={{
            position: 'absolute',
            top: '26px',
            left: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={statusItem.avatar}
              alt={statusItem.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.8)'
              }}
            />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {statusItem.name}
              </h4>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {currentStory.timestamp}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStoryViewer(null)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Click Zones for Previous / Next */}
        <div
          onClick={handlePrev}
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            width: '30%',
            bottom: '100px',
            zIndex: 20,
            cursor: 'pointer'
          }}
        />
        <div
          onClick={handleNext}
          style={{
            position: 'absolute',
            top: '70px',
            right: 0,
            width: '30%',
            bottom: '100px',
            zIndex: 20,
            cursor: 'pointer'
          }}
        />

        {/* Story Canvas Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: currentStory.type === 'text' 
              ? (currentStory.bgColor || 'linear-gradient(135deg, #312E81, #1E1B4B)')
              : '#090D16'
          }}
        >
          {currentStory.type === 'image' ? (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img
                src={currentStory.mediaUrl}
                alt="Story"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {currentStory.caption && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '90px',
                    left: '20px',
                    right: '20px',
                    padding: '12px 18px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(12px)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    lineHeight: 1.4,
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    zIndex: 25
                  }}
                >
                  {currentStory.caption}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.5,
                fontFamily: 'var(--font-heading)',
                maxWidth: '90%'
              }}
            >
              {currentStory.text}
            </div>
          )}
        </div>

        {/* Bottom Reply Bar & Quick Emoji Reactions */}
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: 'rgba(10, 15, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {/* Quick Reaction Emojis */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 10px' }}>
            {['❤️', '🔥', '👏', '😂', '😮', '🙏'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleSendReply(emoji)}
                style={{
                  fontSize: '20px',
                  background: 'transparent',
                  padding: '4px',
                  borderRadius: '50%',
                  transition: 'transform 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply Input */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={`Reply to ${statusItem.name}...`}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendReply()}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '13px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            />
            <button
              onClick={() => handleSendReply()}
              disabled={!replyText.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: replyText.trim() ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                cursor: replyText.trim() ? 'pointer' : 'default'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
