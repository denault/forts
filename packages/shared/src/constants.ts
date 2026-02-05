export const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun.relay.metered.ca:80' },
  {
    urls: 'turn:global.relay.metered.ca:80',
    username: 'e8dd65b92f6389a52ce6c487',
    credential: 'pWSLdHIzG+WBCdFA',
  },
  {
    urls: 'turn:global.relay.metered.ca:80?transport=tcp',
    username: 'e8dd65b92f6389a52ce6c487',
    credential: 'pWSLdHIzG+WBCdFA',
  },
  {
    urls: 'turn:global.relay.metered.ca:443',
    username: 'e8dd65b92f6389a52ce6c487',
    credential: 'pWSLdHIzG+WBCdFA',
  },
  {
    urls: 'turns:global.relay.metered.ca:443?transport=tcp',
    username: 'e8dd65b92f6389a52ce6c487',
    credential: 'pWSLdHIzG+WBCdFA',
  },
];

export const MAX_ROOM_SIZE = 6;

export const RECONNECT_DELAY_MS = 2000;
export const MAX_RECONNECT_ATTEMPTS = 5;

export const CHAT_HISTORY_LIMIT = 100;
