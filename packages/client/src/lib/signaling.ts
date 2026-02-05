import type { ClientMessage, ServerMessage } from '@p2p-rooms/shared';
import { RECONNECT_DELAY_MS, MAX_RECONNECT_ATTEMPTS } from '@p2p-rooms/shared';

export type ServerMessageHandler = (message: ServerMessage) => void;

export class SignalingClient {
  private ws: WebSocket | null = null;
  private messageHandler: ServerMessageHandler | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: number | null = null;
  private url: string;
  private shouldReconnect = true;

  constructor(url?: string) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = url || `${wsProtocol}//${window.location.hostname}:3001`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shouldReconnect = true;

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as ServerMessage;
            this.messageHandler?.(message);
          } catch (err) {
            console.error('Failed to parse server message:', err);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          if (this.shouldReconnect) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect().catch(() => {
        // Will auto-retry via onclose
      });
    }, RECONNECT_DELAY_MS);
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(handler: ServerMessageHandler): void {
    this.messageHandler = handler;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
