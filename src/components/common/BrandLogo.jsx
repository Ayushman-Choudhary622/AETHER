import React from 'react';

export default function BrandLogo({ size = 38, showText = true, className = '' }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div 
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <svg 
          viewBox="0 0 48 48" 
          width={size} 
          height={size} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.45))' }}
        >
          <defs>
            <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="logo-glow-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Outer Shield Backing */}
          <rect x="3" y="3" width="42" height="42" rx="13" fill="#0B101E" stroke="url(#logo-grad-1)" strokeWidth="2"/>
          {/* Orbital dashed ring */}
          <circle cx="24" cy="24" r="14" stroke="url(#logo-glow-ring)" strokeWidth="1.6" strokeDasharray="4 2.5" />
          {/* Interlocking Dynamic Chat Node / Nexus */}
          <path 
            d="M17 19C17 15.686 19.8 13.5 24 13.5C28.2 13.5 31 15.686 31 19C31 21.6 29.5 23.8 27.2 24.8L29 30.5L23.2 28.6C21.8 28.9 20.4 28.6 19.1 27.6C17.7 26.1 17 23.5 17 19Z" 
            fill="url(#logo-grad-1)" 
          />
          <circle cx="24" cy="20" r="2.5" fill="#FFFFFF" />
          <circle cx="20" cy="20" r="1.4" fill="#E0E7FF" />
          <circle cx="28" cy="20" r="1.4" fill="#E0E7FF" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span 
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '1.5px',
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #FFFFFF 30%, #A5B4FC 80%, #38BDF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AETHER
          </span>
          <span 
            style={{
              fontSize: '9px',
              letterSpacing: '1.2px',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              opacity: 0.9
            }}
          >
            Encrypted Sphere
          </span>
        </div>
      )}
    </div>
  );
}
