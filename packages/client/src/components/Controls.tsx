import { useMediaStore } from '../stores/mediaStore';
import { useChatStore } from '../stores/chatStore';

interface ControlsProps {
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
}

export default function Controls({
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onToggleChat,
  onLeave,
}: ControlsProps) {
  const { isMuted, isCameraOff, isScreenSharing } = useMediaStore();
  const { isOpen: chatOpen, unreadCount } = useChatStore();

  return (
    <div className="relative z-10 flex items-center justify-center gap-2 p-4 bg-canvas-900/80 backdrop-blur-md border-t border-canvas-800">
      {/* Media controls */}
      <div className="flex items-center gap-1.5 p-1.5 bg-canvas-800 rounded-xl border border-canvas-700">
        <ControlButton
          onClick={onToggleMute}
          active={!isMuted}
          variant={isMuted ? 'danger' : 'default'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </ControlButton>

        <ControlButton
          onClick={onToggleCamera}
          active={!isCameraOff}
          variant={isCameraOff ? 'danger' : 'default'}
          title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
        >
          {isCameraOff ? <CameraOffIcon /> : <CameraIcon />}
        </ControlButton>

        <ControlButton
          onClick={onToggleScreenShare}
          active={isScreenSharing}
          variant={isScreenSharing ? 'brand' : 'default'}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
        >
          <ScreenShareIcon />
        </ControlButton>
      </div>

      {/* Chat */}
      <div className="flex items-center p-1.5 bg-canvas-800 rounded-xl border border-canvas-700">
        <ControlButton
          onClick={onToggleChat}
          active={chatOpen}
          title="Chat"
          badge={unreadCount}
        >
          <ChatIcon />
        </ControlButton>
      </div>

      {/* Leave */}
      <ControlButton
        onClick={onLeave}
        variant="danger"
        title="Leave fort"
      >
        <LeaveIcon />
      </ControlButton>
    </div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  active?: boolean;
  variant?: 'default' | 'danger' | 'brand';
  badge?: number;
}

function ControlButton({
  onClick,
  children,
  title,
  active,
  variant = 'default',
  badge,
}: ControlButtonProps) {
  const baseClasses = 'control-btn relative';

  const variantClasses = {
    default: active
      ? 'bg-canvas-600 text-ink-strong'
      : 'bg-transparent text-ink-muted hover:bg-canvas-700 hover:text-ink-base',
    danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25',
    brand: 'bg-brand/15 text-brand-300 hover:bg-brand/25',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      title={title}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}

// Icons
function MicIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
    </svg>
  );
}

function ScreenShareIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LeaveIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  );
}
