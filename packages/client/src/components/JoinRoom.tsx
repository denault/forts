import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo, { FortMark } from './Logo';

function generateFortId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export default function JoinRoom() {
  const navigate = useNavigate();
  const [fortId, setFortId] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleCreateFort = () => {
    if (!displayName.trim()) return;
    const newFortId = generateFortId();
    navigate(`/r/${newFortId}`, { state: { displayName: displayName.trim() } });
  };

  const handleJoinFort = () => {
    if (!fortId.trim() || !displayName.trim()) return;
    navigate(`/r/${fortId.trim()}`, { state: { displayName: displayName.trim() } });
  };

  return (
    <div className="min-h-screen bg-canvas relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Header */}
      <header className="relative z-10 section py-5">
        <div className="section-content flex items-center justify-between">
          <Logo size="md" className="text-ink-strong" />
          <nav className="flex items-center gap-2">
            <a href="#features" className="btn-ghost hidden sm:flex">Features</a>
            <a href="#security" className="btn-ghost hidden sm:flex">Security</a>
            <a
              href="https://github.com/denault/forts"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <GithubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="section pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="section-content">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Copy + Form */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 badge-brand mb-6 animate-fade-up">
                  <ShieldIcon className="w-3.5 h-3.5" />
                  <span>End-to-end encrypted</span>
                </div>

                {/* Headline */}
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink-strong leading-[1.1] tracking-tight mb-5 animate-fade-up delay-1">
                  Private video rooms{' '}
                  <span className="text-gradient">for teams who care</span>{' '}
                  about security
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-ink-muted mb-8 animate-fade-up delay-2">
                  Forts creates peer-to-peer video connections that bypass central servers entirely.
                  Your conversations stay between you and your team—always.
                </p>

                {/* CTA Card */}
                <div className="animate-fade-up delay-3">
                  <div className="card p-5">
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-ink-muted mb-1.5">
                          Your name
                        </label>
                        <input
                          id="displayName"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Enter your name"
                          className="input"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && displayName.trim()) {
                              handleCreateFort();
                            }
                          }}
                        />
                      </div>

                      <button
                        onClick={handleCreateFort}
                        disabled={!displayName.trim()}
                        className="btn-primary w-full py-3"
                      >
                        Create a Fort
                        <ArrowIcon />
                      </button>

                      <div className="relative py-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-canvas-700" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 bg-canvas-800/60 text-ink-faint text-xs">or join existing</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={fortId}
                          onChange={(e) => setFortId(e.target.value)}
                          placeholder="Fort ID"
                          className="input font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && fortId.trim() && displayName.trim()) {
                              handleJoinFort();
                            }
                          }}
                        />
                        <button
                          onClick={handleJoinFort}
                          disabled={!fortId.trim() || !displayName.trim()}
                          className="btn-secondary px-5"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-ink-faint text-sm mt-3">
                    No account required. Your fort is ready in seconds.
                  </p>
                </div>
              </div>

              {/* Right: P2P Visualization */}
              <div className="hidden lg:block animate-fade-in delay-2">
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Glow background */}
                  <div className="absolute inset-0 bg-gradient-radial from-brand/20 via-transparent to-transparent rounded-full blur-2xl" />

                  {/* Connection lines SVG */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e07a5f" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#e07a5f" stopOpacity="0.1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Mesh connections - all peers connected to each other */}
                    <g filter="url(#glow)">
                      {/* Top to sides */}
                      <line x1="200" y1="60" x2="340" y2="150" stroke="url(#connectionGradient)" strokeWidth="2" className="animate-pulse-slow" />
                      <line x1="200" y1="60" x2="60" y2="150" stroke="url(#connectionGradient)" strokeWidth="2" className="animate-pulse-slow" style={{ animationDelay: '0.5s' }} />

                      {/* Sides to bottom sides */}
                      <line x1="340" y1="150" x2="320" y2="300" stroke="url(#connectionGradient)" strokeWidth="2" className="animate-pulse-slow" style={{ animationDelay: '1s' }} />
                      <line x1="60" y1="150" x2="80" y2="300" stroke="url(#connectionGradient)" strokeWidth="2" className="animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

                      {/* Bottom sides to bottom center */}
                      <line x1="320" y1="300" x2="200" y2="360" stroke="url(#connectionGradient)" strokeWidth="2" className="animate-pulse-slow" style={{ animationDelay: '2s' }} />
                      <line x1="80" y1="300" x2="200" y2="360" stroke="url(#connectionGradient)" strokeWidth="2" className="animate-pulse-slow" style={{ animationDelay: '2.5s' }} />

                      {/* Cross connections */}
                      <line x1="60" y1="150" x2="340" y2="150" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="60" y1="150" x2="320" y2="300" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.3" />
                      <line x1="340" y1="150" x2="80" y2="300" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.3" />
                      <line x1="200" y1="60" x2="200" y2="360" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.2" />
                      <line x1="80" y1="300" x2="320" y2="300" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.4" />
                      <line x1="200" y1="60" x2="80" y2="300" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.2" />
                      <line x1="200" y1="60" x2="320" y2="300" stroke="url(#connectionGradient)" strokeWidth="1.5" strokeOpacity="0.2" />
                    </g>

                    {/* Data packets - randomized paths between forts */}
                    {/* Design Fort ↔ Dev Fort */}
                    <circle r="3" fill="#e07a5f" opacity="0.9">
                      <animateMotion dur="2.3s" repeatCount="indefinite" path="M200,60 L340,150" begin="0s" />
                    </circle>
                    <circle r="2.5" fill="#e07a5f" opacity="0.7">
                      <animateMotion dur="2.8s" repeatCount="indefinite" path="M340,150 L200,60" begin="1.2s" />
                    </circle>

                    {/* Design Fort ↔ Legal Fort */}
                    <circle r="2.5" fill="#e07a5f" opacity="0.8">
                      <animateMotion dur="2.5s" repeatCount="indefinite" path="M200,60 L60,150" begin="0.4s" />
                    </circle>
                    <circle r="3" fill="#e07a5f" opacity="0.6">
                      <animateMotion dur="3.1s" repeatCount="indefinite" path="M60,150 L200,60" begin="2s" />
                    </circle>

                    {/* Dev Fort ↔ Sales Fort */}
                    <circle r="2" fill="#e07a5f" opacity="0.7">
                      <animateMotion dur="2.1s" repeatCount="indefinite" path="M340,150 L320,300" begin="0.7s" />
                    </circle>
                    <circle r="3" fill="#e07a5f" opacity="0.8">
                      <animateMotion dur="2.9s" repeatCount="indefinite" path="M320,300 L340,150" begin="1.8s" />
                    </circle>

                    {/* Legal Fort ↔ Ops Fort */}
                    <circle r="2.5" fill="#e07a5f" opacity="0.75">
                      <animateMotion dur="2.4s" repeatCount="indefinite" path="M60,150 L80,300" begin="0.3s" />
                    </circle>
                    <circle r="2" fill="#e07a5f" opacity="0.65">
                      <animateMotion dur="3.2s" repeatCount="indefinite" path="M80,300 L60,150" begin="1.5s" />
                    </circle>

                    {/* Sales Fort ↔ You */}
                    <circle r="3" fill="#e07a5f" opacity="0.9">
                      <animateMotion dur="1.9s" repeatCount="indefinite" path="M320,300 L200,360" begin="0.1s" />
                    </circle>
                    <circle r="2.5" fill="#e07a5f" opacity="0.7">
                      <animateMotion dur="2.6s" repeatCount="indefinite" path="M200,360 L320,300" begin="1.3s" />
                    </circle>

                    {/* Ops Fort ↔ You */}
                    <circle r="2.5" fill="#e07a5f" opacity="0.8">
                      <animateMotion dur="2.2s" repeatCount="indefinite" path="M80,300 L200,360" begin="0.6s" />
                    </circle>
                    <circle r="3" fill="#e07a5f" opacity="0.6">
                      <animateMotion dur="2.7s" repeatCount="indefinite" path="M200,360 L80,300" begin="2.1s" />
                    </circle>

                    {/* Cross connections - diagonal traffic */}
                    <circle r="2" fill="#e07a5f" opacity="0.5">
                      <animateMotion dur="3.5s" repeatCount="indefinite" path="M60,150 L320,300" begin="0.8s" />
                    </circle>
                    <circle r="2" fill="#e07a5f" opacity="0.5">
                      <animateMotion dur="3.3s" repeatCount="indefinite" path="M340,150 L80,300" begin="1.6s" />
                    </circle>
                    <circle r="2.5" fill="#e07a5f" opacity="0.4">
                      <animateMotion dur="4s" repeatCount="indefinite" path="M200,60 L200,360" begin="0.9s" />
                    </circle>

                    {/* Horizontal cross traffic */}
                    <circle r="2" fill="#e07a5f" opacity="0.55">
                      <animateMotion dur="2.8s" repeatCount="indefinite" path="M60,150 L340,150" begin="1.1s" />
                    </circle>
                    <circle r="2" fill="#e07a5f" opacity="0.5">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M80,300 L320,300" begin="0.5s" />
                    </circle>
                  </svg>

                  {/* Peer nodes */}
                  <NetworkNode
                    position="top-4 left-1/2 -translate-x-1/2"
                    name="Design Fort"
                    icon={<PaletteIcon />}
                    color="from-pink-500 to-rose-500"
                    flagColor="#ec4899"
                    delay={0}
                  />
                  <NetworkNode
                    position="top-28 right-2"
                    name="Dev Fort"
                    icon={<TerminalIcon />}
                    color="from-sky-500 to-indigo-500"
                    flagColor="#0ea5e9"
                    delay={300}
                  />
                  <NetworkNode
                    position="top-28 left-2"
                    name="Legal Fort"
                    icon={<ScaleIcon />}
                    color="from-amber-500 to-orange-500"
                    flagColor="#f59e0b"
                    delay={600}
                  />
                  <NetworkNode
                    position="bottom-16 right-6"
                    name="Sales Fort"
                    icon={<ChartIcon />}
                    color="from-emerald-500 to-teal-500"
                    flagColor="#10b981"
                    delay={150}
                  />
                  <NetworkNode
                    position="bottom-16 left-6"
                    name="Ops Fort"
                    icon={<GearIcon />}
                    color="from-slate-500 to-zinc-500"
                    flagColor="#64748b"
                    delay={450}
                  />
                  <NetworkNode
                    position="bottom-0 left-1/2 -translate-x-1/2"
                    name="You"
                    icon={<UserPlusIcon />}
                    color="from-brand to-brand-400"
                    flagColor="#e07a5f"
                    delay={200}
                    isHighlighted
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof / Trust */}
        <section className="section py-12 border-y border-canvas-800">
          <div className="section-content">
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-ink-faint">
              <div className="flex items-center gap-2">
                <CheckCircleIcon />
                <span className="text-sm">No data collection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon />
                <span className="text-sm">Open source</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon />
                <span className="text-sm">WebRTC encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon />
                <span className="text-sm">No account needed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section py-24">
          <div className="section-content">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-strong mb-4">
                Built different
              </h2>
              <p className="text-ink-muted text-lg max-w-xl mx-auto">
                Traditional video calls route through central servers. Forts connects you directly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<NetworkIcon />}
                title="True P2P Architecture"
                description="Video and audio flow directly between participants. Our servers only help establish the initial connection—they never see your content."
              />
              <FeatureCard
                icon={<LockIcon />}
                title="Zero-Knowledge Design"
                description="We can't access your meetings even if we wanted to. The encryption keys exist only on participant devices."
              />
              <FeatureCard
                icon={<ZapIcon />}
                title="Lower Latency"
                description="Direct connections mean faster video. No round-trips through distant data centers slowing down your conversation."
              />
              <FeatureCard
                icon={<UsersIcon />}
                title="Intimate by Design"
                description="Optimized for teams of 2-6 people. Perfect for standups, pair programming, or sensitive discussions."
              />
              <FeatureCard
                icon={<GlobeIcon />}
                title="Works Everywhere"
                description="Runs in any modern browser. No downloads, plugins, or extensions. Share a link and start talking."
              />
              <FeatureCard
                icon={<CodeIcon />}
                title="Fully Open Source"
                description="Audit our code. Verify our claims. Run your own instance. We believe in transparency."
              />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="section py-24 bg-canvas-900/50">
          <div className="section-content">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="badge-success mb-4">
                  <ShieldIcon className="w-3.5 h-3.5" />
                  <span>Security-first</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-strong mb-6">
                  Your conversations are yours alone
                </h2>
                <p className="text-ink-muted text-lg mb-8">
                  Forts uses WebRTC's built-in DTLS-SRTP encryption for all media streams.
                  Combined with our peer-to-peer architecture, this means your video calls
                  never touch our infrastructure after the initial handshake.
                </p>
                <ul className="space-y-4">
                  {[
                    'DTLS 1.2+ encrypted media streams',
                    'No server-side recording capability',
                    'Ephemeral rooms with no persistence',
                    'Signaling server sees only connection metadata',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-ink-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  {/* Connection diagram */}
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e07a5f" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#e07a5f" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    {/* Peer connection lines */}
                    <line x1="200" y1="80" x2="320" y2="200" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse-slow" />
                    <line x1="200" y1="80" x2="80" y2="200" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse-slow" />
                    <line x1="320" y1="200" x2="200" y2="320" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse-slow" />
                    <line x1="80" y1="200" x2="200" y2="320" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse-slow" />
                    <line x1="80" y1="200" x2="320" y2="200" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse-slow" />

                    {/* Animated data packets */}
                    <circle r="3" fill="#e07a5f" opacity="0.8">
                      <animateMotion dur="2.4s" repeatCount="indefinite" path="M200,80 L320,200" begin="0s" />
                    </circle>
                    <circle r="2.5" fill="#e07a5f" opacity="0.7">
                      <animateMotion dur="2.7s" repeatCount="indefinite" path="M80,200 L200,80" begin="0.8s" />
                    </circle>
                    <circle r="2.5" fill="#e07a5f" opacity="0.75">
                      <animateMotion dur="2.2s" repeatCount="indefinite" path="M320,200 L200,320" begin="0.4s" />
                    </circle>
                    <circle r="3" fill="#e07a5f" opacity="0.65">
                      <animateMotion dur="2.9s" repeatCount="indefinite" path="M200,320 L80,200" begin="1.2s" />
                    </circle>
                    <circle r="2" fill="#e07a5f" opacity="0.6">
                      <animateMotion dur="3.1s" repeatCount="indefinite" path="M80,200 L320,200" begin="0.6s" />
                    </circle>
                    <circle r="2" fill="#e07a5f" opacity="0.5">
                      <animateMotion dur="2.6s" repeatCount="indefinite" path="M320,200 L80,200" begin="1.8s" />
                    </circle>
                  </svg>
                  {/* Peer nodes */}
                  <PeerNode position="top-8 left-1/2 -translate-x-1/2" label="You" />
                  <PeerNode position="top-1/2 -translate-y-1/2 left-8" label="Peer A" />
                  <PeerNode position="top-1/2 -translate-y-1/2 right-8" label="Peer B" />
                  <PeerNode position="bottom-8 left-1/2 -translate-x-1/2" label="Peer C" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="section py-24">
          <div className="section-content">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-strong mb-4">
                One platform, many forts
              </h2>
              <p className="text-ink-muted text-lg max-w-xl mx-auto">
                Create purpose-built spaces for every type of conversation
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Design Fort', desc: 'Creative reviews', color: 'from-pink-500 to-rose-500', bgColor: 'from-pink-500/10 to-rose-500/10', border: 'border-pink-500/20' },
                { name: 'Legal Fort', desc: 'Confidential discussions', color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/20' },
                { name: 'Dev Fort', desc: 'Code pairing', color: 'from-sky-500 to-blue-500', bgColor: 'from-sky-500/10 to-blue-500/10', border: 'border-sky-500/20' },
                { name: 'Chill Fort', desc: 'Team hangouts', color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20' },
              ].map((fort) => (
                <div
                  key={fort.name}
                  className="group relative pt-3"
                >
                  {/* Turrets */}
                  <div className="absolute top-0 left-4 right-4 flex justify-between">
                    <div className={`w-4 h-5 rounded-t-sm bg-gradient-to-b ${fort.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                    <div className={`w-4 h-5 rounded-t-sm bg-gradient-to-b ${fort.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                    <div className={`w-4 h-5 rounded-t-sm bg-gradient-to-b ${fort.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                  </div>

                  {/* Main card body */}
                  <div className={`relative p-5 pt-6 rounded-lg bg-gradient-to-br ${fort.bgColor} border ${fort.border} text-center transition-all group-hover:border-opacity-40`}>
                    {/* Door accent */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-gradient-to-t ${fort.color} opacity-20 rounded-t-full`} />

                    <p className="font-display font-semibold text-ink-strong mb-1">{fort.name}</p>
                    <p className="text-ink-muted text-sm">{fort.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section py-24">
          <div className="section-content">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-strong mb-4">
                Ready to build your fort?
              </h2>
              <p className="text-ink-muted text-lg mb-8">
                Create a private, encrypted video room in seconds. No signup required.
              </p>
              <button
                onClick={() => {
                  document.getElementById('displayName')?.focus();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary py-3 px-8"
              >
                Get Started
                <ArrowIcon />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="section py-8 border-t border-canvas-800">
          <div className="section-content flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" className="text-ink-muted" />
            <p className="text-ink-faint text-sm">
              Open source. Private by default.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Components
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="feature-card">
      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-4">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-ink-strong mb-2">{title}</h3>
      <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function NetworkNode({
  position,
  name,
  icon,
  color,
  flagColor,
  isHighlighted = false,
  delay = 0,
}: {
  position: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  flagColor: string;
  isHighlighted?: boolean;
  delay?: number;
}) {
  return (
    <div className={`absolute ${position} group`}>
      <div className="relative transition-transform hover:scale-105 hover:-translate-y-1">
        {/* Flag with pole */}
        <div className="absolute -top-4 -right-0.5 z-10">
          <div className={`w-0.5 h-7 bg-gradient-to-b ${color} rounded-full opacity-80`} />
          <svg
            className="absolute top-0.5 left-0.5 origin-left animate-flag-wave"
            style={{ animationDelay: `${delay}ms` }}
            width="14"
            height="10"
            viewBox="0 0 14 10"
          >
            <path
              d="M0 1 Q7 0 14 3 Q7 6 0 5 Z"
              fill={flagColor}
            />
          </svg>
        </div>

        {/* Fort structure */}
        <div className="relative">
          {/* Turrets/crenellations */}
          <div className="absolute -top-2 left-0.5 right-0.5 flex justify-between">
            <div className={`w-3.5 h-4 rounded-t-sm bg-gradient-to-b ${color} opacity-80`} />
            <div className={`w-3.5 h-4 rounded-t-sm bg-gradient-to-b ${color} opacity-80`} />
            <div className={`w-3.5 h-4 rounded-t-sm bg-gradient-to-b ${color} opacity-80`} />
          </div>

          {/* Main fort body */}
          <div
            className={`
              relative w-16 h-14 rounded-lg bg-gradient-to-br ${color}
              flex items-center justify-center shadow-lg
              ${isHighlighted ? 'ring-2 ring-brand/40 ring-offset-2 ring-offset-canvas shadow-glow' : ''}
            `}
          >
            {/* Door/entrance archway */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-6 bg-black/25 rounded-t-full" />

            {/* Icon */}
            <div className="text-white relative z-10 -mt-1">{icon}</div>
          </div>
        </div>
      </div>

      <p className={`text-xs text-center mt-3 whitespace-nowrap font-medium ${isHighlighted ? 'text-brand' : 'text-ink-muted'}`}>
        {name}
      </p>
    </div>
  );
}

function PeerNode({ position, label }: { position: string; label: string }) {
  return (
    <div className={`absolute ${position}`}>
      <div className="relative">
        {/* Turrets */}
        <div className="absolute -top-1.5 left-0 right-0 flex justify-between px-1.5">
          <div className="w-2.5 h-3 rounded-t bg-canvas-600" />
          <div className="w-2.5 h-3 rounded-t bg-canvas-600" />
          <div className="w-2.5 h-3 rounded-t bg-canvas-600" />
        </div>

        {/* Main body */}
        <div className="w-14 h-12 rounded-lg bg-canvas-700 border border-canvas-600 flex items-center justify-center shadow-lg">
          {/* Door */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-canvas-800 rounded-t-full" />
          <UserIcon className="w-5 h-5 text-ink-muted -mt-1" />
        </div>
      </div>
      <p className="text-xs text-ink-faint text-center mt-2.5">{label}</p>
    </div>
  );
}

// Icons
function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function ShieldIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" />
      <line x1="12" y1="8" x2="19" y2="16" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function UserIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
