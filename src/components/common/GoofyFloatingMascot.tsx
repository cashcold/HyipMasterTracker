import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, VolumeX, X, MessageSquareHeart, Flame } from 'lucide-react';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';

const GOOFY_QUOTES = [
  "🚀 'Crypto goes up, crypto goes down, but goofy mascots are forever!'",
  "🤑 'Money counter goes BRRRRRRR! 💸💸💸'",
  "🚀 'To the moon! Don't forget your space helmet!'",
  "🛡️ 'HyipMasterTracker Insurance has got you 100% covered!'",
  "🥳 'Party time! Green candles everywhere!'",
  "💎 'Diamond hands, diamond brains, diamond waffles!'",
  "🦄 'Always verify payouts before you FOMO!'",
  "🐸 'Ribbit! Only invest what you can afford to turn into memes!'",
  "🍕 'Even if Bitcoin crashes, pizza is still delicious!'",
  "👑 'You are the VIP Master Tracker of your portfolio!'",
];

const EMOJI_BURST = ['🤑', '🚀', '💎', '🥳', '🦄', '💸', '🔥', '🎉', '⭐', '🌈', '🍕', '🐸', '🕺', '🍿', '🎯'];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  rotation: number;
}

export const GoofyFloatingMascot: React.FC = () => {
  const [quote, setQuote] = useState(GOOFY_QUOTES[0]);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [danceMode, setDanceMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Play silly sound using Web Audio API
  const playSillySound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      const freqs = [350, 520, 680, 880, 1040];
      const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(randomFreq * 1.5, audioCtx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // Audio not permitted or supported in background
    }
  };

  const triggerGoofyConfetti = () => {
    playSillySound();
    setDanceMode(true);
    setTimeout(() => setDanceMode(false), 2000);

    const nextQuote = GOOFY_QUOTES[Math.floor(Math.random() * GOOFY_QUOTES.length)];
    setQuote(nextQuote);
    setBubbleOpen(true);

    const newParticles: Particle[] = Array.from({ length: 16 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: EMOJI_BURST[Math.floor(Math.random() * EMOJI_BURST.length)],
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 160,
      vy: -60 - Math.random() * 120,
      scale: 0.8 + Math.random() * 0.8,
      rotation: Math.random() * 360,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  };

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles([]);
    }, 1800);
    return () => clearTimeout(timer);
  }, [particles]);

  // Periodic random quote change
  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(GOOFY_QUOTES[Math.floor(Math.random() * GOOFY_QUOTES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble */}
      {bubbleOpen && (
        <div className="mb-2 max-w-[260px] sm:max-w-[300px] bg-slate-900/95 text-white border-2 border-amber-400 p-2.5 rounded-2xl shadow-2xl relative animate-in fade-in slide-in-from-bottom-2 duration-300 goofy-pulse-border">
          <button
            onClick={() => setBubbleOpen(false)}
            className="absolute -top-2 -left-2 w-5 h-5 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 goofy-img-animated-1 shrink-0">
              <img src={goofyCryptoMascot} alt="Goofy Mascot" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              Goofy Tracker Bot
            </span>
            <span className="goofy-emoji-spin text-xs">⭐</span>
          </div>

          <p className="text-[11px] leading-snug font-medium text-slate-100 italic">
            {quote}
          </p>

          <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
            <button
              onClick={triggerGoofyConfetti}
              className="text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Tap for Fun! 🎉</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-white cursor-pointer"
              title={soundEnabled ? 'Mute silly sound' : 'Unmute silly sound'}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
            </button>
          </div>

          {/* Bubble Arrow */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-amber-400 transform rotate-45" />
        </div>
      )}

      {/* Confetti Explosion Particles */}
      <div className="relative pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-all duration-1000 ease-out pointer-events-none"
            style={{
              transform: `translate(${p.vx}px, ${p.vy}px) scale(${p.scale}) rotate(${p.rotation}deg)`,
              opacity: 0,
              fontSize: '22px',
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Goofy Mascot Button */}
      <button
        onClick={triggerGoofyConfetti}
        className={`relative p-1 sm:p-1.5 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-400 text-slate-950 shadow-2xl border-2 border-white hover:scale-115 active:scale-95 transition-all cursor-pointer group goofy-pulse-border ${
          danceMode ? 'goofy-rainbow-fx scale-125 rotate-12' : ''
        }`}
        title="I am the Goofy Master Tracker! Click me for Goofy Fun & Insurance Luck!"
      >
        {/* Floating Ring Emojis around button */}
        <span className="hidden sm:inline absolute -top-2 -left-2 text-sm goofy-emoji-spin">
          ⭐
        </span>
        <span className="hidden sm:inline absolute -bottom-1 -left-2 text-sm goofy-emoji-pop">
          🔥
        </span>
        <span className="hidden sm:inline absolute -top-2 -right-2 text-sm goofy-emoji-jiggle">
          🚀
        </span>

        {/* Mascot Face Artwork */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-slate-900 bg-slate-950 shadow-inner">
          <img src={goofyCryptoMascot} alt="Goofy Mascot" className="w-full h-full object-cover" />
        </div>

        {/* Pulsing indicator */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="status-dot-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-rose-500 text-[7px] sm:text-[8px] text-white font-bold items-center justify-center">
            !
          </span>
        </span>
      </button>
    </div>
  );
};
