
import React, { useEffect, useState } from 'react';

interface BattleTransitionProps {
  onComplete: () => void;
}

const BattleTransition: React.FC<BattleTransitionProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'flash' | 'bolt' | 'text' | 'fade'>('flash');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('bolt'), 50),
      setTimeout(() => setPhase('text'), 150),
      setTimeout(() => setPhase('fade'), 700),
      setTimeout(() => onComplete(), 1000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[2000] flex items-center justify-center overflow-hidden transition-opacity duration-300 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Flickering Flash */}
      <div className={`absolute inset-0 transition-colors duration-75 ${
        phase === 'flash' || phase === 'bolt' ? 'bg-white' : 'bg-transparent'
      }`} />

      {/* Lightning Bolt SVG */}
      {(phase === 'bolt' || phase === 'text') && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <path 
            d="M 50 0 L 40 30 L 60 45 L 35 75 L 55 100" 
            fill="none" 
            stroke="cyan" 
            strokeWidth="2" 
            filter="url(#glow)"
            className="animate-bolt"
          />
          <path 
            d="M 50 0 L 40 30 L 60 45 L 35 75 L 55 100" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
          />
        </svg>
      )}

      {/* Impact Text */}
      {(phase === 'text' || phase === 'fade') && (
        <div className="relative">
          <h2 className="text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-battle-impact uppercase">
            BATTLE!
          </h2>
          <h2 className="absolute inset-0 text-8xl font-black italic tracking-tighter text-red-600 mix-blend-difference animate-battle-glitch uppercase">
            BATTLE!
          </h2>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bolt {
          0% { stroke-dashoffset: 100; opacity: 1; }
          20% { opacity: 0.5; }
          40% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        .animate-bolt {
          stroke-dasharray: 100;
          animation: bolt 0.3s ease-out forwards;
        }
        @keyframes battle-impact {
          0% { transform: scale(3); opacity: 0; filter: blur(10px); }
          20% { transform: scale(1); opacity: 1; filter: blur(0px); }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-battle-impact {
          animation: battle-impact 0.8s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards;
        }
        @keyframes battle-glitch {
          0% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          100% { transform: translate(0, 0); }
        }
        .animate-battle-glitch {
          animation: battle-glitch 0.1s infinite;
        }
      `}} />
    </div>
  );
};

export default BattleTransition;
