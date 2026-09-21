// AETHER Production Data Model - 100% Clean Slate (Zero Prebuilt / Fake Chats)

export const defaultUserProfile = {
  username: '',
  name: '',
  handle: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Available on AETHER Encrypted Messenger 🛡️✨',
  phone: '',
  hasCompletedOnboarding: false
};

export const currentUser = defaultUserProfile;

// Start with empty clean-slate conversations
export const initialChats = [];

// Start with only user's own status
export const initialStatuses = [
  {
    id: 'status_user',
    isUser: true,
    name: 'My Status',
    avatar: '',
    time: 'Tap to add status update',
    stories: []
  }
];

// Official Public Channels
export const initialChannels = [
  {
    id: 'chan_aether',
    name: 'AETHER Official Network',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    verified: true,
    followers: '100% Encrypted',
    description: 'Real-time peer-to-peer network announcements and cryptographic security updates.',
    followed: true,
    latestPost: {
      text: 'Welcome to AETHER! A 100% decentralized, private messaging and calling network. Claim your @username and connect with anyone across the globe. Zero data harvesting.',
      timestamp: 'Just now',
      reactions: 1042
    }
  }
];

// Start with empty call log
export const initialCalls = [];
