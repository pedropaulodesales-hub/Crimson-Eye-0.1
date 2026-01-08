
import React, { useState, useEffect } from 'react';
import { sounds } from '../soundManager';

interface MerchantConversationProps {
  onComplete: () => void;
  merchantSprite: string | null;
}

const LINES = [
  "…Ah… so… you have reached this place as well.",
  "Do not be afraid. All who arrive here do so in confusion.",
  "This place does not belong to the world you once knew.",
  "Here… something watches.",
  "It is always watching.",
  "Yet do not fear.",
  "While others fall… I remain.",
  "I remain… to offer help.",
  "If you wish to survive… you will need power.",
  "And power… always demands a price.",
  "Call me simply… the Merchant.",
  "For now… that will be enough.",
  "Go forward.",
  "The Eye sees all…",
  "…and it has noticed you."
];

const MerchantConversation: React.FC<MerchantConversationProps> = ({ onComplete, merchantSprite }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setText("");
    setIsTyping(true);
    let charIdx = 0;
    const currentLine = LINES[index];
    
    const interval = setInterval(() => {
      setText(currentLine.substring(0, charIdx + 1));
      if (charIdx % 3 === 0) sounds.playEffect('type'); // Play sound occasionally
      charIdx++;
      if (charIdx >= currentLine.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [index]);

  const advance = () => {
    if (isTyping) {
      setText(LINES[index]);
      setIsTyping(false);
      return;
    }
    sounds.playEffect('turn');
    if (index < LINES.length - 1) {
      setIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="absolute inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={advance}>
      <div className="w-full max-w-3xl bg-[#050a05] border-2 border-emerald-900 p-8 flex flex-col items-center gap-8 relative shadow-[0_0_50px_rgba(0,255,100,0.1)] animate-in fade-in zoom-in duration-300">
          
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />

          {/* Merchant Avatar */}
          {merchantSprite && (
            <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-emerald-900 bg-emerald-950/30 p-2 overflow-hidden relative shadow-[0_0_30px_rgba(16,185,129,0.3)] shrink-0">
                <img src={merchantSprite} className="w-full h-full object-contain pixelated relative z-10 filter brightness-110 sepia-[0.2]" alt="Merchant" />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay animate-pulse" />
                {/* Scanline overlay for avatar */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,50,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-50" />
            </div>
          )}

          {/* Text Area */}
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center min-h-[120px]">
             <p className="text-emerald-400 font-mono text-lg md:text-2xl font-bold tracking-wide leading-relaxed drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                {text}
                <span className={`inline-block w-2.5 h-6 bg-emerald-500 ml-2 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
             </p>
          </div>

          {/* Footer Controls */}
          <div className="text-[10px] md:text-xs text-emerald-800 uppercase tracking-[0.3em] font-black border-t border-emerald-900/50 pt-4 w-full text-center">
             {isTyping ? "INCOMING TRANSMISSION..." : "▶ CLICK TO CONTINUE"}
          </div>
      </div>
    </div>
  );
};

export default MerchantConversation;
