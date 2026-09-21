import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Camera, 
  BarChart2, 
  User, 
  X,
  Sparkles
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import EmojiPicker from './EmojiPicker';
import VoiceNoteRecorder from './VoiceNoteRecorder';

export default function ChatInput() {
  const { 
    sendMessage, 
    replyMessage, 
    setReplyMessage 
  } = useChat();

  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ text: text.trim(), type: 'text' });
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectEmoji = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      sendMessage({
        type: 'image',
        mediaUrl: url,
        caption: text.trim() || ''
      });
      setText('');
      setShowAttachMenu(false);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      sendMessage({
        type: 'document',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setShowAttachMenu(false);
    }
  };

  const handleVoiceSend = (duration) => {
    sendMessage({
      type: 'voice',
      audioDuration: duration
    });
    setIsRecordingVoice(false);
  };

  return (
    <div
      className="glass-footer"
      style={{
        padding: '10px 18px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30
      }}
    >
      {/* Quoted Reply Banner */}
      {replyMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            marginBottom: '8px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-sidebar-hover)',
            borderLeft: '4px solid var(--primary)',
            border: '1px solid var(--border-subtle)',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', display: 'block' }}>
              Replying to {replyMessage.senderName}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {replyMessage.text || 'Media attachment'}
            </span>
          </div>

          <button
            onClick={() => setReplyMessage(null)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Attachment Options Popup (WhatsApp-Style) */}
      {showAttachMenu && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            left: '52px',
            backgroundColor: 'var(--bg-modal)',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5), var(--shadow-glow)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 50,
            animation: 'slideUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <input
            type="file"
            ref={docInputRef}
            accept=".pdf,.doc,.docx,.zip,.txt"
            style={{ display: 'none' }}
            onChange={handleDocUpload}
          />

          <button
            onClick={() => imageInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <ImageIcon size={16} />
            </div>
            Photos &amp; Videos
          </button>

          <button
            onClick={() => docInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <FileText size={16} />
            </div>
            Document
          </button>

          <button
            onClick={() => imageInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Camera size={16} />
            </div>
            Camera Capture
          </button>
        </div>
      )}

      {/* Main Input Dock or Live Voice Recorder */}
      {isRecordingVoice ? (
        <VoiceNoteRecorder
          onCancel={() => setIsRecordingVoice(false)}
          onSend={handleVoiceSend}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          {/* Emoji Toggle */}
          <button
            onClick={() => {
              setShowEmojiPicker(e => !e);
              setShowAttachMenu(false);
            }}
            title="Emoji & Stickers"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showEmojiPicker ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color 0.15s',
              flexShrink: 0
            }}
          >
            <Smile size={21} />
          </button>

          {/* Attachment Toggle */}
          <button
            onClick={() => {
              setShowAttachMenu(a => !a);
              setShowEmojiPicker(false);
            }}
            title="Attach Media & Docs"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showAttachMenu ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'color 0.15s',
              flexShrink: 0
            }}
          >
            <Paperclip size={20} />
          </button>

          {/* Auto-expanding Input Box */}
          <div
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-input)',
              borderRadius: '20px',
              padding: '8px 16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.2)'
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type a message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                background: 'transparent',
                resize: 'none',
                fontSize: '14.5px',
                lineHeight: 1.4,
                color: 'var(--text-primary)',
                maxHeight: '120px'
              }}
            />
          </div>

          {/* Send OR Microphone Record Button */}
          {text.trim() ? (
            <button
              onClick={handleSend}
              title="Send Message"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Send size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsRecordingVoice(true)}
              title="Record Voice Note"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--primary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
