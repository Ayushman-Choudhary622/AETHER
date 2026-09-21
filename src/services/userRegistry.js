import Gun from 'gun/gun';

// Global Decentralized User Registry Service
// Ensures ANY user registered anywhere in the world is permanently discoverable,
// auto-suggested, and synchronized across devices and networks without central server dependencies.

const STORAGE_KEY = 'aether_global_user_directory';

class UserRegistryService {
  constructor() {
    this.gun = null;
    this.subscribers = new Set();
    this.cachedUsers = {};
    
    // Load local storage cache immediately
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.cachedUsers = JSON.parse(saved);
      }
    } catch (e) {
      this.cachedUsers = {};
    }

    this.initGun();
  }

  initGun() {
    try {
      this.gun = Gun({
        peers: [
          'https://relay.peer.ooo/gun'
        ],
        localStorage: false,
        radisk: false
      });

      // Listen for all registered users in the global decentralized mesh
      const userNode = this.gun.get('aether_registered_users_v2');
      userNode.map().on((data, key) => {
        if (!data || !key) return;
        const cleanUsername = String(key).toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (!cleanUsername) return;

        const userObj = {
          username: cleanUsername,
          name: data.name || cleanUsername,
          avatar: data.avatar || '',
          about: data.about || 'Available on AETHER',
          registeredAt: data.registeredAt || Date.now()
        };

        this.updateUser(userObj);
      });
    } catch (e) {
      console.warn('[AETHER Registry] Gun initialization warning:', e);
    }
  }

  // Register or update a user profile in the global public directory
  registerUser(profile) {
    if (!profile?.username) return;
    const cleanUsername = profile.username.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const userObj = {
      username: cleanUsername,
      name: profile.name || cleanUsername,
      avatar: profile.avatar || '',
      about: profile.about || 'Available on AETHER',
      registeredAt: Date.now()
    };

    // Update in-memory and local cache
    this.updateUser(userObj);

    // Publish to decentralized Gun network
    try {
      if (this.gun) {
        this.gun.get('aether_registered_users_v2').get(cleanUsername).put({
          username: userObj.username,
          name: userObj.name,
          avatar: userObj.avatar,
          about: userObj.about,
          registeredAt: userObj.registeredAt
        });
      }
    } catch (e) {
      console.warn('[AETHER Registry] Failed to broadcast user to Gun:', e);
    }

    return userObj;
  }

  updateUser(userObj) {
    if (!userObj?.username) return;
    const cleanUsername = userObj.username.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const existing = this.cachedUsers[cleanUsername];
    if (existing && existing.name === userObj.name && existing.avatar === userObj.avatar && existing.about === userObj.about) {
      return;
    }

    this.cachedUsers[cleanUsername] = {
      ...existing,
      ...userObj,
      username: cleanUsername
    };

    // Persist to local storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cachedUsers));
    } catch (e) {}

    // Notify all UI listeners
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    // Send current cached users immediately
    callback({ ...this.cachedUsers });

    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers() {
    const directory = { ...this.cachedUsers };
    this.subscribers.forEach(cb => {
      try {
        cb(directory);
      } catch (e) {}
    });
  }

  getAllUsers() {
    return Object.values(this.cachedUsers);
  }

  // Search and autocomplete helper
  searchUsers(query, excludeUsername = '') {
    if (!query || typeof query !== 'string') return [];
    const q = query.toLowerCase().trim().replace(/^@/, '');
    if (!q) return [];

    const exclude = (excludeUsername || '').toLowerCase();
    const users = Object.values(this.cachedUsers).filter(u => u.username !== exclude);

    // Score and rank matches
    const scored = users.map(user => {
      const uName = (user.username || '').toLowerCase();
      const dName = (user.name || '').toLowerCase();

      let score = 0;
      if (uName === q) score = 100; // Exact username match
      else if (dName === q) score = 90; // Exact display name match
      else if (uName.startsWith(q)) score = 80; // Starts with username
      else if (dName.startsWith(q)) score = 70; // Starts with display name
      else if (uName.includes(q)) score = 60; // Contains query in username
      else if (dName.includes(q)) score = 50; // Contains query in display name

      return { user, score };
    }).filter(item => item.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.user);
  }
}

export const userRegistry = new UserRegistryService();
