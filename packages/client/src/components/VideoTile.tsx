import { useEffect, useRef } from 'react';

interface VideoTileProps {
  stream: MediaStream | null;
  displayName: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isLocal?: boolean;
  isScreenShare?: boolean;
  delay?: number;
}

const AVATAR_COLORS = [
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-emerald-600',
  'from-sky-500 to-blue-600',
  'from-fuchsia-500 to-rose-600',
  'from-lime-500 to-green-600',
];

function getAvatarColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function VideoTile({
  stream,
  displayName,
  isMuted,
  isCameraOff,
  isLocal = false,
  isScreenShare = false,
  delay = 0,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const avatarColor = getAvatarColor(displayName);

  return (
    <div
      className="video-tile animate-scale-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {stream && !isCameraOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal && !isScreenShare ? '-scale-x-100' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-canvas-700 to-canvas-800">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl sm:text-3xl font-display font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {isScreenShare && (
        <div className="absolute top-2 left-2 badge-brand">
          <ScreenIcon />
          <span>Screen</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-white truncate">
            {displayName}
            {isLocal && !isScreenShare && <span className="text-ink-muted ml-1">(You)</span>}
          </span>

          {!isScreenShare && (isMuted || isCameraOff) && (
            <div className="flex items-center gap-1">
              {isMuted && (
                <div className="p-1 bg-red-500/20 rounded" title="Muted">
                  <MicOffIcon />
                </div>
              )}
              {isCameraOff && (
                <div className="p-1 bg-red-500/20 rounded" title="Camera off">
                  <CameraOffIcon />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MicOffIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
