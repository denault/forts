import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../stores/roomStore';
import { useChatStore } from '../stores/chatStore';
import { useMediaStore } from '../stores/mediaStore';
import { useMediaStream } from '../hooks/useMediaStream';
import { useRoom } from '../hooks/useRoom';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import Chat from './Chat';
import Logo, { FortMark } from './Logo';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState<string>('');
  const [namePrompt, setNamePrompt] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { isConnected, isConnecting, error } = useRoomStore();
  const { isOpen: chatOpen, setOpen: setChatOpen } = useChatStore();
  const { localStream } = useMediaStore();

  const { startMedia, toggleMute, toggleCamera, startScreenShare, stopScreenShare } =
    useMediaStream();
  const { peers, remoteStreams, joinRoom, leaveRoom, sendChat } = useRoom({ localStream });

  useEffect(() => {
    const stateDisplayName = (location.state as { displayName?: string })?.displayName;
    if (stateDisplayName) {
      setDisplayName(stateDisplayName);
    } else {
      setNamePrompt(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (!displayName || !roomId) return;

    let mounted = true;

    const init = async () => {
      try {
        await startMedia();
        if (mounted) {
          joinRoom(roomId, displayName);
        }
      } catch (err) {
        if (mounted) {
          setMediaError('Could not access camera/microphone. Please check your browser permissions.');
          console.error('Media error:', err);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [displayName, roomId, startMedia, joinRoom]);

  const handleLeave = () => {
    leaveRoom();
    navigate('/');
  };

  const copyFortLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Name prompt screen
  if (namePrompt) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        <div className="w-full max-w-sm relative z-10 animate-scale-up">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <FortMark className="w-8 h-8" />
              </div>
              <h1 className="font-display text-xl font-semibold text-ink-strong mb-1">
                Join Fort
              </h1>
              <p className="text-ink-muted text-sm">
                <span className="font-mono text-brand">{roomId}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-ink-muted mb-2">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="input"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && displayName.trim()) {
                      setNamePrompt(false);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => displayName.trim() && setNamePrompt(false)}
                disabled={!displayName.trim()}
                className="btn-primary w-full py-3"
              >
                Enter Fort
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Media error screen
  if (mediaError) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        <div className="w-full max-w-sm relative z-10 animate-scale-up">
          <div className="card p-8 border-red-500/20">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertIcon />
              </div>
              <h1 className="font-display text-xl font-semibold text-ink-strong mb-2">
                Permission Required
              </h1>
              <p className="text-ink-muted text-sm mb-6">
                {mediaError}
              </p>
              <button onClick={() => navigate('/')} className="btn-secondary">
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (isConnecting || !isConnected) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        <div className="text-center relative z-10 animate-fade-in">
          <div className="relative w-12 h-12 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-canvas-700" />
            <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
          <p className="text-ink-base font-medium mb-1">Connecting to fort</p>
          <p className="text-ink-faint text-sm font-mono">{roomId}</p>
          {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  // Main room UI
  return (
    <div className="h-screen bg-canvas flex flex-col relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 bg-canvas-900/80 backdrop-blur-md border-b border-canvas-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="sm" className="text-ink-strong" />
          </button>

          <div className="h-5 w-px bg-canvas-700 hidden sm:block" />

          <button
            onClick={copyFortLink}
            className="flex items-center gap-2 px-3 py-1.5 bg-canvas-800 hover:bg-canvas-700 border border-canvas-700 rounded-lg transition-colors"
          >
            <span className="text-ink-muted text-sm font-mono">{roomId}</span>
            {copied ? (
              <CheckIcon className="w-4 h-4 text-success" />
            ) : (
              <CopyIcon className="w-4 h-4 text-ink-faint" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-canvas-800 border border-canvas-700 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-ink-muted text-sm">
              {peers.size + 1}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className={`flex-1 p-4 transition-all duration-200 ${chatOpen ? 'pr-0' : ''}`}>
          <VideoGrid
            localStream={localStream}
            peers={peers}
            remoteStreams={remoteStreams}
            displayName={displayName}
          />
        </div>

        {chatOpen && (
          <div className="w-80 border-l border-canvas-800 animate-slide-right">
            <Chat onClose={() => setChatOpen(false)} onSend={sendChat} />
          </div>
        )}
      </div>

      {/* Controls */}
      <Controls
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={async () => {
          const { isScreenSharing } = useMediaStore.getState();
          if (isScreenSharing) {
            stopScreenShare();
          } else {
            await startScreenShare();
          }
        }}
        onToggleChat={() => setChatOpen(!chatOpen)}
        onLeave={handleLeave}
      />
    </div>
  );
}

// Icons
function AlertIcon() {
  return (
    <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function CopyIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
