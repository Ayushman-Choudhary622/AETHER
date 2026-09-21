import React, { useState } from 'react';
import { Check, CheckCheck, FileText, Download, Reply, MoreVertical, Trash2, Smile, Heart, ThumbsUp, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import VoiceNotePlayer from './VoiceNotePlayer';

export default function MessageBubble({ message, isGroup = false, onReply }) {
  const { reactToMessage, deleteMessage, activeChatId } = useChat();
  const [showActions, setShowActions] = useState(false);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isOutgoing = message.senderId === 'user_me';

  const handleReaction = (emoji) => {
    reactToMessage(activeChatId, message.id, emoji);
    setShowReactionMenu(false);
  };

  const reactionEntries = Object.entries(message.reactions || {});

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isOutgoing ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
        position: 'relative',
        padding: '0 8px'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactionMenu(false);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '82%' }}>
        {/* Left Action Toolbar on Outgoing */}
        {isOutgoing && showActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', animation: 'fadeIn 0.15s' }}>
            <button
              onClick={() => setShowReactionMenu(r => !r)}
              title="React"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => onReply(message)}
              title="Reply"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Reply size={14} />
            </button>
            <button
              onClick={() => deleteMessage(activeChatId, message.id)}
              title="Delete"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        {/* Message Bubble Card */}
        <div
          className={isOutgoing ? 'bubble-tail-out' : 'bubble-tail-in'}
          style={{
            position: 'relative',
            padding: '8px 12px',
            borderRadius: isOutgoing ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            backgroundColor: isOutgoing ? 'var(--bg-bubble-out-plain)' : 'var(--bg-bubble-in)',
            background: isOutgoing ? 'var(--bg-bubble-out)' : 'var(--bg-bubble-in)',
            color: isOutgoing ? '#FFFFFF' : 'var(--text-primary)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.18)',
            border: isOutgoing ? 'none' : '1px solid var(--border-subtle)'
          }}
        >
          {/* Group Sender Name */}
          {isGroup && !isOutgoing && message.senderName && (
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              {message.senderName}
            </div>
          )}

          {/* Quoted Reply Preview */}
          {message.replyTo && (
            <div
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: isOutgoing ? 'rgba(0, 0, 0, 0.2)' : 'rgba(99, 102, 241, 0.12)',
                borderLeft: `3px solid ${isOutgoing ? '#FFFFFF' : 'var(--primary)'}`,
                marginBottom: '6px',
                fontSize: '12px'
              }}
            >
              <span style={{ fontWeight: 600, display: 'block', color: isOutgoing ? '#E0E7FF' : 'var(--primary)' }}>
                {message.replyTo.senderName}
              </span>
              <span style={{ color: isOutgoing ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                {message.replyTo.text}
              </span>
            </div>
          )}

          {/* Content: Photo / Media */}
          {message.type === 'image' && (
            <div style={{ marginBottom: message.caption || message.text ? '8px' : '2px' }}>
              <img
                src={message.mediaUrl}
                alt="Shared media"
                onClick={() => setIsLightboxOpen(true)}
                style={{
                  maxWidth: '320px',
                  width: '100%',
                  borderRadius: '12px',
                  display: 'block',
                  cursor: 'pointer',
                  objectFit: 'cover'
                }}
              />
              {message.caption && (
                <p style={{ fontSize: '13.5px', marginTop: '6px', lineHeight: 1.4 }}>
                  {message.caption}
                </p>
              )}
            </div>
          )}

          {/* Content: Voice Note */}
          {message.type === 'voice' && (
            <VoiceNotePlayer duration={message.audioDuration || '0:14'} isOutgoing={isOutgoing} />
          )}

          {/* Content: Document */}
          {message.type === 'document' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 10px',
                borderRadius: '10px',
                backgroundColor: isOutgoing ? 'rgba(0,0,0,0.18)' : 'var(--bg-sidebar-hover)',
                minWidth: '220px'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <FileText size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {message.fileName || 'Attachment.pdf'}
                </p>
                <span style={{ fontSize: '11px', color: isOutgoing ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)' }}>
                  {message.fileSize || '2.4 MB'} • PDF Document
                </span>
              </div>
              <button
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'inherit',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <Download size={15} />
              </button>
            </div>
          )}

          {/* Content: Text Message */}
          {message.text && message.type !== 'image' && (
            <div style={{ fontSize: '14px', lineHeight: 1.45, wordBreak: 'break-word', userSelect: 'text' }}>
              {message.text}
            </div>
          )}

          {/* Footer: Timestamp & Read Status Checks */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '4px',
              marginTop: '4px',
              fontSize: '11px',
              color: isOutgoing ? 'rgba(255, 255, 255, 0.75)' : 'var(--text-muted)'
            }}
          >
            <span>{message.timestamp}</span>

            {isOutgoing && (
              <span>
                {message.status === 'read' ? (
                  <CheckCheck size={14} color="var(--tick-blue)" strokeWidth={2.4} />
                ) : message.status === 'delivered' ? (
                  <CheckCheck size={14} color="rgba(255, 255, 255, 0.65)" strokeWidth={2} />
                ) : (
                  <Check size={14} color="rgba(255, 255, 255, 0.65)" strokeWidth={2} />
                )}
              </span>
            )}
          </div>

          {/* Reaction badges underneath */}
          {reactionEntries.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '-12px',
                right: isOutgoing ? '10px' : 'auto',
                left: !isOutgoing ? '10px' : 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                backgroundColor: 'var(--bg-modal)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1px 6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                zIndex: 5
              }}
            >
              {reactionEntries.map(([emoji, count]) => (
                <span key={emoji} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span>{emoji}</span>
                  {count > 1 && <span>{count}</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Toolbar on Incoming */}
        {!isOutgoing && showActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', animation: 'fadeIn 0.15s' }}>
            <button
              onClick={() => setShowReactionMenu(r => !r)}
              title="React"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Smile size={14} />
            </button>
            <button
              onClick={() => onReply(message)}
              title="Reply"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Reply size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Floating Reaction Picker Popup */}
      {showReactionMenu && (
        <div
          style={{
            position: 'absolute',
            top: '-36px',
            [isOutgoing ? 'right' : 'left']: '10px',
            backgroundColor: 'var(--bg-modal)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '4px 8px',
            display: 'flex',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            zIndex: 30,
            animation: 'slideUp 0.15s ease-out'
          }}
        >
          {['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              style={{
                fontSize: '18px',
                padding: '2px 4px',
                borderRadius: '50%',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'transform 0.12s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <img
            src={message.mediaUrl}
            alt="Expanded view"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
            }}
          />
        </div>
      )}
    </div>
  );
}
