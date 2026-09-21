import React, { useState, useRef } from 'react';
import { X, Image, Type, Palette, Check, Sparkles, Upload } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const GRADIENTS = [
  'linear-gradient(135deg, #4338CA 0%, #06B6D4 100%)',
  'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
  'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
  'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
  'linear-gradient(135deg, #881337 0%, #F43F5E 100%)'
];

export default function CreateStatusModal() {
  const { isCreateStatusOpen, setIsCreateStatusOpen, addStatusStory } = useChat();
  const [mode, setMode] = useState('text'); // 'text' | 'image'
  const [textContent, setTextContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

  if (!isCreateStatusOpen) return null;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handlePost = () => {
    if (mode === 'text') {
      if (!textContent.trim()) return;
      addStatusStory({
        type: 'text',
        text: textContent.trim(),
        bgColor: selectedGradient
      });
    } else {
      if (!imagePreview) return;
      addStatusStory({
        type: 'image',
        mediaUrl: imagePreview,
        caption: caption.trim()
      });
    }
    // reset
    setTextContent('');
    setImagePreview(null);
    setCaption('');
  };

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
      onClick={() => setIsCreateStatusOpen(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '24px',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), var(--shadow-glow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
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
              onClick={() => setMode('text')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: mode === 'text' ? 'var(--primary)' : 'var(--bg-sidebar-hover)',
                color: mode === 'text' ? '#FFFFFF' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Type size={14} /> Text Status
            </button>
            <button
              onClick={() => setMode('image')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: mode === 'image' ? 'var(--primary)' : 'var(--bg-sidebar-hover)',
                color: mode === 'image' ? '#FFFFFF' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Image size={14} /> Photo Status
            </button>
          </div>

          <button
            onClick={() => setIsCreateStatusOpen(false)}
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

        {/* Modal Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'text' ? (
            <div>
              {/* Canvas Preview Area */}
              <div
                style={{
                  height: '240px',
                  borderRadius: '16px',
                  background: selectedGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                <textarea
                  placeholder="Type a status update..."
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  maxLength={180}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-heading)',
                    resize: 'none',
                    height: '140px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Gradient Picker */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'center' }}>
                {GRADIENTS.map((grad, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGradient(grad)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: grad,
                      border: selectedGradient === grad ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      transform: selectedGradient === grad ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s'
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />

              {imagePreview ? (
                <div style={{ position: 'relative', height: '240px', borderRadius: '16px', overflow: 'hidden' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    height: '220px',
                    borderRadius: '16px',
                    border: '2px dashed var(--border-glow)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-sidebar-hover)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Upload size={32} color="var(--primary)" />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Click to select an image
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Supports PNG, JPG, GIF
                  </span>
                </div>
              )}

              {/* Caption Input */}
              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px'
                }}
              />
            </div>
          )}

          {/* Post Action Button */}
          <button
            onClick={handlePost}
            disabled={mode === 'text' ? !textContent.trim() : !imagePreview}
            style={{
              marginTop: '4px',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: (mode === 'text' ? textContent.trim() : imagePreview) ? 1 : 0.5,
              cursor: (mode === 'text' ? textContent.trim() : imagePreview) ? 'pointer' : 'default',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Sparkles size={16} /> Share to My Status
          </button>
        </div>
      </div>
    </div>
  );
}
