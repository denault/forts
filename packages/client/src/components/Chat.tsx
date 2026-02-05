import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useRoomStore } from '../stores/roomStore';

interface ChatProps {
  onClose: () => void;
  onSend: (content: string) => void;
}

const NAME_COLORS = [
  'text-amber-400',
  'text-rose-400',
  'text-teal-400',
  'text-orange-400',
  'text-emerald-400',
  'text-pink-400',
];

function getNameColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return NAME_COLORS[hash % NAME_COLORS.length];
}

export default function Chat({ onClose, onSend }: ChatProps) {
  const { messages } = useChatStore();
  const { localPeerId } = useRoomStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-canvas-900/50 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-canvas-800">
        <div className="flex items-center gap-2">
          <ChatIcon />
          <h2 className="font-display font-semibold text-ink-strong text-sm">Chat</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-canvas-800 rounded-lg transition-colors text-ink-faint hover:text-ink-muted"
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-canvas-800 flex items-center justify-center mb-3">
              <EmptyIcon />
            </div>
            <p className="text-ink-muted text-sm font-medium">No messages</p>
            <p className="text-ink-faint text-xs mt-1">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.peerId === localPeerId;
            const showMeta = index === 0 || messages[index - 1].peerId !== msg.peerId;
            const nameColor = getNameColor(msg.displayName);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
              >
                {showMeta && (
                  <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs font-medium ${isOwn ? 'text-brand-300' : nameColor}`}>
                      {isOwn ? 'You' : msg.displayName}
                    </span>
                    <span className="text-[10px] text-ink-faint">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    isOwn
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'bg-canvas-800 text-ink-base rounded-bl-sm'
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-canvas-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 px-3 py-2.5 bg-canvas-800 border border-canvas-700 rounded-lg
                       text-ink-base placeholder-ink-faint text-sm
                       focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50
                       transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-brand text-white rounded-lg
                       hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all"
            title="Send"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg className="w-4 h-4 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg className="w-6 h-6 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
