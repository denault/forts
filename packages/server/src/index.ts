import { SignalingServer } from './signaling.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = new SignalingServer(PORT);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  server.close();
  process.exit(0);
});
