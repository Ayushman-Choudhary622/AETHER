// AETHER Production Data Model - 100% Clean Slate (Zero Prebuilt / Fake Chats)

export const defaultUserProfile = {
  username: '',
  name: '',
  handle: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  about: 'Available on AETHER 🛡️✨',
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

// Clean Slate: 0 prebuilt channels
export const initialChannels = [];

// Start with empty call log
export const initialCalls = [];
