import Peer from 'peerjs';

class WebRTCService {
  constructor() {
    this.peer = null;
    this.username = null;
    this.localStream = null;
    this.currentCall = null;
    this.onIncomingCallCallback = null;
    this.onRemoteStreamCallback = null;
    this.onCallEndedCallback = null;
  }

  init(username, { onIncomingCall, onRemoteStream, onCallEnded }) {
    if (this.peer) {
      this.destroy();
    }

    this.username = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    this.onIncomingCallCallback = onIncomingCall;
    this.onRemoteStreamCallback = onRemoteStream;
    this.onCallEndedCallback = onCallEnded;

    const peerId = `aether_peer_${this.username}`;

    try {
      this.peer = new Peer(peerId, {
        debug: 1,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      });

      this.peer.on('open', (id) => {
        console.log(`[AETHER WebRTC] Peer ready with ID: ${id}`);
      });

      // Handle incoming WebRTC call
      this.peer.on('call', (mediaConnection) => {
        console.log('[AETHER WebRTC] Received incoming call from:', mediaConnection.peer);
        this.currentCall = mediaConnection;

        if (this.onIncomingCallCallback) {
          const callerUsername = mediaConnection.peer.replace('aether_peer_', '');
          this.onIncomingCallCallback({
            callerUsername,
            mediaConnection
          });
        }
      });

      this.peer.on('error', (err) => {
        console.warn('[AETHER WebRTC] Peer error:', err);
      });
    } catch (e) {
      console.error('[AETHER WebRTC] Failed to initialize peer:', e);
    }
  }

  async getLocalMediaStream(video = true) {
    if (this.localStream) return this.localStream;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: video ? { width: { ideal: 640 }, height: { ideal: 480 } } : false,
          audio: true
        });
        this.localStream = stream;
        return stream;
      }
    } catch (err) {
      console.log('[AETHER WebRTC] Media capture denied or unavailable:', err);
    }
    return null;
  }

  // Start outgoing call
  async callPeer(targetUsername, isVideo = true) {
    if (!this.peer) return null;

    const targetPeerId = `aether_peer_${targetUsername.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
    const stream = await this.getLocalMediaStream(isVideo);

    try {
      // If we don't have local media (camera permission denied), create dummy audio track so call can still connect
      const callStream = stream || this.createSilentAudioStream();
      const mediaConnection = this.peer.call(targetPeerId, callStream);
      this.currentCall = mediaConnection;

      mediaConnection.on('stream', (remoteStream) => {
        console.log('[AETHER WebRTC] Received remote stream!');
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(remoteStream);
        }
      });

      mediaConnection.on('close', () => {
        this.handleCallEnded();
      });

      mediaConnection.on('error', (err) => {
        console.warn('[AETHER WebRTC] Call error:', err);
        this.handleCallEnded();
      });

      return stream;
    } catch (err) {
      console.error('[AETHER WebRTC] Call failed:', err);
      return null;
    }
  }

  // Answer incoming call
  async answerCall(mediaConnection, isVideo = true) {
    const stream = await this.getLocalMediaStream(isVideo);
    const callStream = stream || this.createSilentAudioStream();

    this.currentCall = mediaConnection;
    mediaConnection.answer(callStream);

    mediaConnection.on('stream', (remoteStream) => {
      console.log('[AETHER WebRTC] Remote stream connected upon answer!');
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(remoteStream);
      }
    });

    mediaConnection.on('close', () => {
      this.handleCallEnded();
    });

    return stream;
  }

  createSilentAudioStream() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        return dst.stream;
      }
    } catch (e) {}
    return new MediaStream();
  }

  toggleMicrophone(muted) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
  }

  toggleCamera(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  endCall() {
    if (this.currentCall) {
      try { this.currentCall.close(); } catch (e) {}
      this.currentCall = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop());
      this.localStream = null;
    }
    this.handleCallEnded();
  }

  handleCallEnded() {
    if (this.onCallEndedCallback) {
      this.onCallEndedCallback();
    }
  }

  destroy() {
    this.endCall();
    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
      this.peer = null;
    }
  }
}

export const webrtcService = new WebRTCService();
