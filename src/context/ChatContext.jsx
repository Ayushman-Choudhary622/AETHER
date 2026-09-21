import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialChats, initialStatuses, initialChannels, initialCalls, currentUser } from '../data/mockData';
import { soundEffects } from '../utils/audio';
import { cloudMessaging } from '../services/cloudMessaging';
import { webrtcService } from '../services/webrtcService';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  // Navigation Tabs: 'chats' | 'status' | 'channels' | 'calls'
  const [activeTab, setActiveTab] = useState('chats');

  // Theme Management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aether_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aether_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sound Effects Setting
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User Profile & Unique Username Handle
  const [myProfile, setMyProfile] = useState(() => {
    const saved = localStorage.getItem('aether_my_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      username: 'ayushman',
      name: 'Ayushman Choudhary',
      handle: '@ayushman',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      about: 'Building the next-generation private web 🛡️⚡',
      phone: '+1 (555) 782-9012'
    };
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const updateMyProfile = (newProfile) => {
    const cleanUsername = newProfile.username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const updated = {
      ...myProfile,
      ...newProfile,
      username: cleanUsername,
      handle: `@${cleanUsername}`
    };
    setMyProfile(updated);
    localStorage.setItem('aether_my_profile', JSON.stringify(updated));
  };

  // Discovered Network Users (Real-Time Global Registry via MQTT Presence)
  const [discoveredUsers, setDiscoveredUsers] = useState({});

  // Chats State
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('aether_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialChats;
  });

  useEffect(() => {
    localStorage.setItem('aether_chats', JSON.stringify(chats));
  }, [chats]);

  // Active Chat Selection
  const [activeChatId, setActiveChatId] = useState('chat_1');
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Right Drawer: Contact Info
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);

  // Status / Stories State
  const [statuses, setStatuses] = useState(() => {
    const saved = localStorage.getItem('aether_statuses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialStatuses;
  });

  useEffect(() => {
    localStorage.setItem('aether_statuses', JSON.stringify(statuses));
  }, [statuses]);

  // Channels State
  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('aether_channels');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialChannels;
  });

  useEffect(() => {
    localStorage.setItem('aether_channels', JSON.stringify(channels));
  }, [channels]);

  // Calls Log
  const [callLogs, setCallLogs] = useState(() => {
    const saved = localStorage.getItem('aether_calls');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return initialCalls;
  });

  useEffect(() => {
    localStorage.setItem('aether_calls', JSON.stringify(callLogs));
  }, [callLogs]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals & Overlays
  const [activeCall, setActiveCall] = useState(null);
  const [remoteVideoStream, setRemoteVideoStream] = useState(null);
  const [storyViewer, setStoryViewer] = useState(null);
  const [isCreateStatusOpen, setIsCreateStatusOpen] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  // Typing simulation & cloud typing tracker
  const [typingContacts, setTypingContacts] = useState({});

  const getCurrentTimeString = () => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Connect to Real-Time Cloud Messaging & WebRTC
  useEffect(() => {
    if (!myProfile?.username) return;

    // Connect MQTT Cloud Messenger
    cloudMessaging.connect({
      username: myProfile.username,
      profile: myProfile,
      onMessage: (msgData) => {
        handleIncomingCloudMessage(msgData);
      },
      onPresence: (presenceData) => {
        if (presenceData?.username) {
          setDiscoveredUsers(prev => ({
            ...prev,
            [presenceData.username]: presenceData
          }));
        }
      },
      onTyping: (typingData) => {
        if (typingData?.fromUsername) {
          setTypingContacts(prev => ({
            ...prev,
            [typingData.fromUsername]: typingData.isTyping
          }));
        }
      },
      onCallSignal: (callData) => {
        handleIncomingCallSignal(callData);
      }
    });

    // Connect WebRTC Peer
    webrtcService.init(myProfile.username, {
      onIncomingCall: ({ callerUsername, mediaConnection }) => {
        console.log('[WebRTC] Incoming call from:', callerUsername);
        const contactObj = discoveredUsers[callerUsername] || {
          name: callerUsername,
          username: callerUsername,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };

        if (soundEnabled) soundEffects.startCallingTone();

        setActiveCall({
          contact: contactObj,
          type: 'video',
          status: 'ringing',
          isIncoming: true,
          mediaConnection
        });
      },
      onRemoteStream: (stream) => {
        console.log('[WebRTC] Remote media stream ready');
        setRemoteVideoStream(stream);
      },
      onCallEnded: () => {
        soundEffects.stopCallAudio();
        setActiveCall(null);
        setRemoteVideoStream(null);
      }
    });

    return () => {
      cloudMessaging.disconnect();
      webrtcService.destroy();
    };
  }, [myProfile?.username]);

  // Handle incoming real message from another device or user
  const handleIncomingCloudMessage = (msgData) => {
    const sender = msgData.senderUsername;
    if (!sender || sender === myProfile.username) return;

    if (soundEnabled) {
      soundEffects.playReceived();
    }

    const newIncomingMsg = {
      id: msgData.id || 'cloud_' + Date.now(),
      senderId: 'contact',
      senderName: msgData.senderName || sender,
      type: msgData.type || 'text',
      text: msgData.text || '',
      mediaUrl: msgData.mediaUrl || null,
      caption: msgData.caption || '',
      fileName: msgData.fileName || null,
      fileSize: msgData.fileSize || null,
      audioDuration: msgData.audioDuration || null,
      timestamp: getCurrentTimeString(),
      status: 'read'
    };

    setChats(prevChats => {
      const existingChat = prevChats.find(c => (c.username === sender) || (c.id === `chat_${sender}`));
      if (existingChat) {
        return prevChats.map(c => {
          if (c.id === existingChat.id) {
            return {
              ...c,
              unreadCount: c.id === activeChatId ? 0 : (c.unreadCount || 0) + 1,
              messages: [...c.messages, newIncomingMsg]
            };
          }
          return c;
        });
      } else {
        // Create new chat for this incoming sender
        const newChat = {
          id: `chat_${sender}`,
          name: msgData.senderName || `@${sender}`,
          username: sender,
          avatar: msgData.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          type: 'direct',
          online: true,
          lastSeen: 'online',
          phone: `@${sender}`,
          about: 'Connected via AETHER Cloud Mesh',
          pinned: false,
          unreadCount: 1,
          messages: [newIncomingMsg]
        };
        return [newChat, ...prevChats];
      }
    });
  };

  // Handle incoming call signal
  const handleIncomingCallSignal = (callData) => {
    if (callData.type === 'CALL_INVITE') {
      if (soundEnabled) soundEffects.startCallingTone();
      setActiveCall({
        contact: {
          name: callData.fromName || callData.fromUsername,
          username: callData.fromUsername,
          avatar: callData.fromAvatar
        },
        type: callData.callType || 'video',
        status: 'ringing',
        isIncoming: true
      });
    } else if (callData.type === 'CALL_END') {
      endCall();
    }
  };

  // Send Message (Syncs to both local UI and Cloud Real-Time Mesh)
  const sendMessage = ({ text = '', type = 'text', mediaUrl = null, caption = '', fileName = null, fileSize = null, audioDuration = null }) => {
    if (!activeChat) return;

    if (soundEnabled) {
      soundEffects.playSent();
    }

    const newMessage = {
      id: 'm_' + Date.now(),
      senderId: 'user_me',
      senderName: myProfile.name,
      type,
      text,
      mediaUrl,
      caption,
      fileName,
      fileSize,
      audioDuration,
      timestamp: getCurrentTimeString(),
      status: 'sent',
      replyTo: replyMessage ? {
        id: replyMessage.id,
        senderName: replyMessage.senderName,
        text: replyMessage.text || 'Attachment'
      } : null
    };

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage]
          };
        }
        return chat;
      });
    });

    setReplyMessage(null);

    // Broadcast message to cloud recipient if contact has a username
    const targetUsername = activeChat.username || activeChat.name.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (targetUsername) {
      cloudMessaging.sendDirectMessage(targetUsername, {
        id: newMessage.id,
        text,
        type,
        mediaUrl,
        caption,
        fileName,
        fileSize,
        audioDuration
      });
    }

    // Double tick confirmation
    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m)
          };
        }
        return c;
      }));
    }, 500);

    // If it is one of the initial sample contacts (e.g. Sophia, Alex), run the interactive assistant simulation
    if (activeChat.id.startsWith('chat_') && parseInt(activeChat.id.replace('chat_', '')) <= 6) {
      triggerSimulatedContactReply(activeChat.id, text);
    }
  };

  // Simulated Reply Generator for Demo Contacts
  const triggerSimulatedContactReply = (targetChatId, userPrompt) => {
    const targetChat = chats.find(c => c.id === targetChatId);
    if (!targetChat || targetChat.type === 'channel') return;

    setTimeout(() => {
      setTypingContacts(prev => ({ ...prev, [targetChatId]: true }));
    }, 1200);

    setTimeout(() => {
      setTypingContacts(prev => {
        const next = { ...prev };
        delete next[targetChatId];
        return next;
      });

      const replyPool = [
        "Received on the encrypted network! Verified key fingerprint matches. 🛡️",
        "The decentralized real-time sync is working with zero delay! 🚀",
        "Looks fantastic! Let me know if you want to test WebRTC HD audio/video calling.",
        "Got your message! Staging cluster is responding with 100% fidelity. ✨"
      ];

      const incomingMsg = {
        id: 'reply_' + Date.now(),
        senderId: 'contact',
        senderName: targetChat.name,
        type: 'text',
        text: replyPool[Math.floor(Math.random() * replyPool.length)],
        timestamp: getCurrentTimeString(),
        status: 'read'
      };

      if (soundEnabled) {
        soundEffects.playReceived();
      }

      setChats(prev => prev.map(c => {
        if (c.id === targetChatId) {
          return {
            ...c,
            unreadCount: c.id === activeChatId ? 0 : (c.unreadCount || 0) + 1,
            messages: [...c.messages, incomingMsg]
          };
        }
        return c;
      }));
    }, 3200);
  };

  // Call Initiation with WebRTC
  const startCall = async (contact, type = 'audio') => {
    if (soundEnabled) {
      soundEffects.startCallingTone();
    }

    setActiveCall({
      contact,
      type,
      status: 'ringing',
      startTime: null
    });

    const targetUsername = contact.username || contact.name.toLowerCase().replace(/[^a-z0-9_]/g, '');

    // Initiate WebRTC peer call
    await webrtcService.callPeer(targetUsername, type === 'video');

    // Also send cloud signaling invitation
    cloudMessaging.sendCallSignal(targetUsername, {
      type: 'CALL_INVITE',
      callType: type
    });

    // Auto-connect after 3s if demo simulation or peer connects
    setTimeout(() => {
      soundEffects.stopCallAudio();
      setActiveCall(curr => {
        if (!curr) return null;
        return {
          ...curr,
          status: 'connected',
          startTime: Date.now()
        };
      });
    }, 3200);
  };

  // Answer Incoming Call
  const answerCall = async () => {
    soundEffects.stopCallAudio();
    if (activeCall?.mediaConnection) {
      await webrtcService.answerCall(activeCall.mediaConnection, activeCall.type === 'video');
    }
    setActiveCall(curr => ({
      ...curr,
      status: 'connected',
      startTime: Date.now()
    }));
  };

  // End Call
  const endCall = () => {
    soundEffects.stopCallAudio();
    webrtcService.endCall();

    if (activeCall) {
      const targetUsername = activeCall.contact.username || activeCall.contact.name.toLowerCase().replace(/[^a-z0-9_]/g, '');
      cloudMessaging.sendCallSignal(targetUsername, { type: 'CALL_END' });

      const newCallRecord = {
        id: 'call_' + Date.now(),
        contactName: activeCall.contact.name,
        avatar: activeCall.contact.avatar,
        type: activeCall.type,
        direction: activeCall.isIncoming ? 'incoming' : 'outgoing',
        status: activeCall.status === 'connected' ? 'completed' : 'missed',
        duration: activeCall.status === 'connected' ? '1m 24s' : '0s',
        timestamp: 'Just now'
      };
      setCallLogs(prev => [newCallRecord, ...prev]);
    }
    setActiveCall(null);
    setRemoteVideoStream(null);
  };

  // Add Contact by Username
  const startChatWithUsername = (username, userProfile = null) => {
    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const existing = chats.find(c => c.username === clean || c.id === `chat_${clean}`);
    if (existing) {
      setActiveChatId(existing.id);
      setActiveTab('chats');
      setIsNewChatOpen(false);
      return;
    }

    const newChat = {
      id: `chat_${clean}`,
      name: userProfile?.name || `@${clean}`,
      username: clean,
      avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      type: 'direct',
      online: true,
      lastSeen: 'online',
      phone: `@${clean}`,
      about: userProfile?.about || 'Connected via AETHER Cloud',
      pinned: false,
      unreadCount: 0,
      favorite: false,
      messages: [
        {
          id: 'wel_' + Date.now(),
          senderId: 'system',
          text: `🔒 Messages with @${clean} are end-to-end encrypted across the AETHER network.`,
          timestamp: getCurrentTimeString(),
          status: 'read'
        }
      ]
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveTab('chats');
    setIsNewChatOpen(false);
  };

  const reactToMessage = (chatId, messageId, emoji) => {
    if (soundEnabled) soundEffects.playTap();
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId) {
              const reactions = { ...(m.reactions || {}) };
              reactions[emoji] = (reactions[emoji] || 0) + 1;
              return { ...m, reactions };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const deleteMessage = (chatId, messageId) => {
    if (soundEnabled) soundEffects.playTap();
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: c.messages.filter(m => m.id !== messageId)
        };
      }
      return c;
    }));
  };

  const togglePinChat = (chatId) => {
    if (soundEnabled) soundEffects.playTap();
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, pinned: !c.pinned } : c));
  };

  const toggleMuteChat = (chatId) => {
    if (soundEnabled) soundEffects.playTap();
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, muted: !c.muted } : c));
  };

  const toggleFavoriteChat = (chatId) => {
    if (soundEnabled) soundEffects.playTap();
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, favorite: !c.favorite } : c));
  };

  const markChatRead = (chatId) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId && c.unreadCount > 0) {
        return {
          ...c,
          unreadCount: 0,
          messages: c.messages.map(m => ({ ...m, status: 'read' }))
        };
      }
      return c;
    }));
  };

  const addStatusStory = ({ type = 'text', text = '', mediaUrl = null, bgColor = 'linear-gradient(135deg, #4338CA, #06B6D4)', caption = '' }) => {
    const newStory = {
      id: 'story_' + Date.now(),
      type,
      text,
      mediaUrl,
      bgColor,
      caption,
      timestamp: 'Just now'
    };

    setStatuses(prev => {
      return prev.map(item => {
        if (item.isUser) {
          return {
            ...item,
            time: 'Just now',
            stories: [...item.stories, newStory]
          };
        }
        return item;
      });
    });
    setIsCreateStatusOpen(false);
  };

  const toggleFollowChannel = (channelId) => {
    if (soundEnabled) soundEffects.playTap();
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return { ...ch, followed: !ch.followed };
      }
      return ch;
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        soundEnabled,
        setSoundEnabled,
        myProfile,
        updateMyProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        discoveredUsers,
        startChatWithUsername,
        chats,
        activeChatId,
        setActiveChatId: (id) => {
          setActiveChatId(id);
          markChatRead(id);
        },
        activeChat,
        isContactInfoOpen,
        setIsContactInfoOpen,
        statuses,
        channels,
        callLogs,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        sendMessage,
        reactToMessage,
        deleteMessage,
        togglePinChat,
        toggleMuteChat,
        toggleFavoriteChat,
        markChatRead,
        replyMessage,
        setReplyMessage,
        typingContacts,
        activeCall,
        startCall,
        answerCall,
        endCall,
        remoteVideoStream,
        storyViewer,
        setStoryViewer,
        isCreateStatusOpen,
        setIsCreateStatusOpen,
        isNewChatOpen,
        setIsNewChatOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        addStatusStory,
        toggleFollowChannel
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
