import React from 'react';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Link2, Plus, ShieldCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function CallsView() {
  const { callLogs, startCall, chats } = useChat();

  const handleCallBack = (call) => {
    // Find contact or construct contact object
    const contact = chats.find(c => c.name === call.contactName) || {
      name: call.contactName,
      avatar: call.avatar
    };
    startCall(contact, call.type);
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
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Calls</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>End-to-end encrypted voice & video</p>
        </div>

        <button
          onClick={() => {
            const firstContact = chats[0];
            if (firstContact) startCall(firstContact, 'video');
          }}
          title="Start Call"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Plus size={18} />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Create Call Link Banner (WhatsApp style) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 14px',
            borderRadius: '14px',
            backgroundColor: 'var(--bg-sidebar-hover)',
            cursor: 'pointer',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Link2 size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Create call link
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Share a link for your encrypted call
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
            Calls are peer-to-peer encrypted with cryptographic key verification.
          </span>
        </div>

        {/* Recent Calls List or Empty State */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', paddingLeft: '4px' }}>
            Recent
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            {callLogs.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  To make audio or video calls with peers on AETHER, find their @username and tap the call button.
                </p>
              </div>
            ) : (
              callLogs.map(call => {
                const isMissed = call.status === 'missed';
                return (
                  <div
                    key={call.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={call.avatar}
                        alt={call.contactName}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />

                      <div>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: isMissed ? 'var(--accent-rose)' : 'var(--text-primary)'
                          }}
                        >
                          {call.contactName}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          {isMissed ? (
                            <PhoneMissed size={14} color="var(--accent-rose)" />
                          ) : call.direction === 'incoming' ? (
                            <PhoneIncoming size={14} color="var(--accent-emerald)" />
                          ) : (
                            <PhoneOutgoing size={14} color="var(--primary)" />
                          )}

                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {call.timestamp} • {call.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCallBack(call)}
                      title={`Call ${call.contactName}`}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-sidebar-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'all 0.2s'
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
                      {call.type === 'video' ? <Video size={17} /> : <Phone size={17} />}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
