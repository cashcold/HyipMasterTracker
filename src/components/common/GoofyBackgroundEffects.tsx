import React, { useEffect, useState } from 'react';
import goofyCryptoMascot from '../../assets/images/goofy_crypto_mascot_1786742789221.jpg';
import goofyVaultGuardian from '../../assets/images/goofy_vault_guardian_1786742800081.jpg';
import goofyRocketTrader from '../../assets/images/goofy_rocket_trader_1786742811873.jpg';

const GOOFY_EMOJIS = ['🤑', '🚀', '💎', '🥳', '🦄', '💸', '🔥', '🎯', '👑', '🍕', '🐸', '🎉', '⚡', '🕺', '🍿', '⭐'];
const GOOFY_MASCOTS = [goofyCryptoMascot, goofyVaultGuardian, goofyRocketTrader];

interface FloatingItem {
  id: number;
  type: 'emoji' | 'mascot';
  content: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
  animationClass: string;
}

export const GoofyBackgroundEffects: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    // Generate 22 ambient floating goofy icons and mascot tokens across the page
    const floatingItems: FloatingItem[] = Array.from({ length: 22 }).map((_, i) => {
      const isMascot = i % 3 === 0;
      const animClasses = ['goofy-emoji-1', 'goofy-emoji-2', 'goofy-emoji-bounce', 'goofy-emoji-spin', 'goofy-emoji-jiggle', 'goofy-emoji-pop'];
      
      return {
        id: i,
        type: isMascot ? 'mascot' : 'emoji',
        content: isMascot
          ? GOOFY_MASCOTS[Math.floor(Math.random() * GOOFY_MASCOTS.length)]
          : GOOFY_EMOJIS[Math.floor(Math.random() * GOOFY_EMOJIS.length)],
        left: Math.random() * 95, // 0 to 95% across width
        duration: 12 + Math.random() * 16, // 12s to 28s
        delay: Math.random() * 12,
        size: isMascot ? 28 + Math.floor(Math.random() * 20) : 20 + Math.floor(Math.random() * 24), // 20px to 48px
        animationClass: animClasses[Math.floor(Math.random() * animClasses.length)],
      };
    });
    setItems(floatingItems);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-45">
      {items.map((item) => (
        <div
          key={item.id}
          className="goofy-floating-bg-item"
          style={{
            left: `${item.left}vw`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.type === 'mascot' ? (
            <div
              className={`rounded-full overflow-hidden border-2 border-amber-400/70 shadow-lg bg-slate-950 ${item.animationClass}`}
              style={{ width: `${item.size}px`, height: `${item.size}px` }}
            >
              <img src={item.content} alt="Goofy Mascot" className="w-full h-full object-cover" />
            </div>
          ) : (
            <span
              className={item.animationClass}
              style={{ fontSize: `${item.size}px` }}
            >
              {item.content}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

