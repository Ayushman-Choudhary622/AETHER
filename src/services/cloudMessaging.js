import mqtt from 'mqtt';

// Cloud Real-Time Messaging Service using high-speed public WebSocket brokers
// Provides 100% free, zero-config real-time cross-device sync, discovery, and signaling

const BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt'
];

class CloudMessagingService {
  constructor() {
    this.client = null;
    this.username = null;
    this.profile = null;
    this.isConnected = false;
    this.onMessageCallback = null;
    this.onPresenceCallback = null;
    this.onTypingCallback = null;
    this.onCallSignalCallback = null;
    this.presenceInterval = null;
  }

  connect({ username, profile, onMessage, onPresence, onTyping, onCallSignal }) {
    if (this.client) {
      try { this.client.end(true); } catch (e) {}
    }

    this.username = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    this.profile = profile;
    this.onMessageCallback = onMessage;
    this.onPresenceCallback = onPresence;
    this.onTypingCallback = onTyping;
    this.onCallSignalCallback = onCallSignal;

    const clientId = `aether_${this.username}_${Math.random().toString(36).substring(2, 8)}`;
    const brokerUrl = BROKERS[0];

    try {
      this.client = mqtt.connect(brokerUrl, {
        clientId,
        clean: true,
        reconnectPeriod: 3000,
        connectTimeout: 8000
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log(`[AETHER Cloud] Connected as @${this.username}`);

        // Subscribe to personal inbox
        this.client.subscribe(`aether/inbox/${this.username}`, { qos: 1 });
        // Subscribe to global network presence
        this.client.subscribe('aether/presence/+', { qos: 0 });
        // Subscribe to incoming call signaling
        this.client.subscribe(`aether/calls/${this.username}`, { qos: 1 });
        // Subscribe to typing signals
        this.client.subscribe(`aether/typing/${this.username}`, { qos: 0 });

        // Broadcast initial presence
        this.broadcastPresence();

        // Heartbeat presence every 20 seconds
        if (this.presenceInterval) clearInterval(this.presenceInterval);
        this.presenceInterval = setInterval(() => {
          this.broadcastPresence();
        }, 20000);
      });

      this.client.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          this.handleIncomingMessage(topic, data);
        } catch (e) {
          console.warn('[AETHER Cloud] Failed to parse message payload:', e);
        }
      });

      this.client.on('error', (err) => {
        console.warn('[AETHER Cloud] MQTT Connection error:', err);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });
    } catch (err) {
      console.error('[AETHER Cloud] Connect error:', err);
    }
  }

  handleIncomingMessage(topic, data) {
    if (topic.startsWith('aether/inbox/')) {
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    } else if (topic.startsWith('aether/presence/')) {
      const sender = topic.replace('aether/presence/', '');
      if (sender !== this.username && this.onPresenceCallback) {
        this.onPresenceCallback(data);
      }
    } else if (topic.startsWith('aether/typing/')) {
      if (this.onTypingCallback) {
        this.onTypingCallback(data);
      }
    } else if (topic.startsWith('aether/calls/')) {
      if (this.onCallSignalCallback) {
        this.onCallSignalCallback(data);
      }
    }
  }

  // Broadcast user's online status and profile card to the entire global network
  broadcastPresence() {
    if (!this.client || !this.isConnected || !this.username) return;

    const payload = JSON.stringify({
      username: this.username,
      name: this.profile?.name || this.username,
      avatar: this.profile?.avatar || '',
      about: this.profile?.about || 'Available on AETHER',
      lastSeen: 'online',
      timestamp: Date.now()
    });

    this.client.publish(`aether/presence/${this.username}`, payload, { qos: 0, retain: false });
  }

  // Send real-time direct message to any recipient anywhere in the world
  sendDirectMessage(targetUsername, messageData) {
    if (!this.client || !this.isConnected) {
      console.warn('[AETHER Cloud] Client not connected, message will not route via cloud');
      return false;
    }

    const cleanTarget = targetUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const payload = JSON.stringify({
      ...messageData,
      senderUsername: this.username,
      senderName: this.profile?.name || this.username,
      senderAvatar: this.profile?.avatar || '',
      targetUsername: cleanTarget,
      sentAt: Date.now()
    });

    this.client.publish(`aether/inbox/${cleanTarget}`, payload, { qos: 1 });
    return true;
  }

  // Send real-time typing indicator
  sendTypingSignal(targetUsername, isTyping) {
    if (!this.client || !this.isConnected) return;
    const cleanTarget = targetUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const payload = JSON.stringify({
      fromUsername: this.username,
      isTyping
    });
    this.client.publish(`aether/typing/${cleanTarget}`, payload, { qos: 0 });
  }

  // Send call signaling (offer, answer, reject, end)
  sendCallSignal(targetUsername, signalData) {
    if (!this.client || !this.isConnected) return;
    const cleanTarget = targetUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const payload = JSON.stringify({
      ...signalData,
      fromUsername: this.username,
      fromName: this.profile?.name || this.username,
      fromAvatar: this.profile?.avatar || ''
    });
    this.client.publish(`aether/calls/${cleanTarget}`, payload, { qos: 1 });
  }

  disconnect() {
    if (this.presenceInterval) clearInterval(this.presenceInterval);
    if (this.client) {
      try { this.client.end(true); } catch (e) {}
      this.client = null;
    }
    this.isConnected = false;
  }
}

export const cloudMessaging = new CloudMessagingService();
