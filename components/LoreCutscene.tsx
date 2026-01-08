
import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../soundManager';

interface LoreCutsceneProps {
  onComplete: () => void;
}

const LORE_TEXTS = [
  "There is no sky.",
  "There is no ground.",
  "Only corridors… and the Eye.",
  "A silent will judges all who enter this place.",
  "It tests strength… mind… and soul.",
  "Those who fail… disappear.",
  "Those who endure… move deeper.",
  "Enter The Grid Abyss.",
  "Face the Crimson Eye."
];

const LoreCutscene: React.FC<LoreCutsceneProps> = ({ onComplete }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [eyeOpacity, setEyeOpacity] = useState(0);
  const [tunnelSpeed, setTunnelSpeed] = useState(10);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Start background ambience on mount
    sounds.playLoreAmbience();
  }, []);

  useEffect(() => {
    if (lineIndex >= LORE_TEXTS.length) {
      setIsFinished(true);
      return;
    }

    const fullText = LORE_TEXTS[lineIndex];
    setDisplayedText("");
    setIsTyping(true);
    
    // Dynamic adjustments based on lore progression
    if (lineIndex === 2) setEyeOpacity(0.2);
    if (lineIndex === 3) setEyeOpacity(0.5);
    if (lineIndex === 7) setTunnelSpeed(2);
    if (lineIndex === 8) setEyeOpacity(1);

    sounds.playEffect('turn'); // Line change sound

    let charIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, charIndex + 1));
      
      // Play typing sound
      sounds.playEffect('type');

      charIndex++;
      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [lineIndex]);

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(LORE_TEXTS[lineIndex]);
      setIsTyping(false);
      return;
    }

    if (lineIndex < LORE_TEXTS.length - 1) {
      setLineIndex(s => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div 
      className="absolute inset-0 z-[500] bg-black flex flex-col items-center justify-center overflow-hidden font-mono cursor-pointer"
      onClick={handleNext}
    >
      {/* 3D Grid Tunnel Background */}
      <div className="absolute inset-0 z-0 perspective-[1000px]">
        <div 
          className="absolute inset-[-100%] border-[2px] border-emerald-950/30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(5, 50, 5, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(5, 50, 5, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            transform: 'rotateX(60deg) translateY(0)',
            animation: `grid-travel ${tunnelSpeed}s linear infinite`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
      </div>

      {/* The Crimson Eye (Central Motif) */}
      <div 
        className="relative z-20 w-48 h-48 md:w-64 md:h-64 mb-12 transition-all duration-[2000ms] ease-in-out"
        style={{ 
          opacity: eyeOpacity,
          transform: `scale(${0.8 + (lineIndex * 0.05)}) rotate(${lineIndex * 5}deg)`
        }}
      >
        <div className="absolute inset-0 bg-[#0a0000] rounded-[70%_30%_70%_30%] border-[4px] border-[#551111] animate-pulsate-eye rotate-[45deg] shadow-[0_0_100px_rgba(200,0,0,0.4)] overflow-hidden">
           <div className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#330000_0%,transparent_80%)] opacity-70" />
           <div className="w-full h-full -rotate-[45deg] relative flex items-center justify-center scale-75">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#cc0000] rounded-full flex items-center justify-center animate-look-around shadow-[inset_0_0_20px_#000]">
                 <div className="w-4 h-16 md:w-6 md:h-24 bg-black rounded-full" />
                 <div className="absolute inset-0 border-[4px] border-dotted border-[#ff000044] rounded-full animate-spin-slow" />
              </div>
           </div>
        </div>
        {/* Glitch Overlay */}
        <div className="absolute inset-0 bg-red-500/10 mix-blend-screen opacity-0 animate-eye-glitch" />
      </div>

      {/* Narrative Container */}
      <div className="relative z-30 w-full max-w-xl px-8 text-center">
        <div className="min-h-[100px] flex items-center justify-center">
          <p className="text-xl md:text-3xl font-black text-emerald-400 tracking-tight leading-relaxed drop-shadow-[0_0_10px_rgba(51,255,51,0.5)]">
            {displayedText}
            {isTyping && <span className="inline-block w-3 h-6 bg-emerald-500 ml-2 animate-pulse align-middle" />}
          </p>
        </div>

        {/* Footer Hint */}
        <div className="mt-16 opacity-30 animate-pulse text-[10px] md:text-xs tracking-[0.5em] text-emerald-900 uppercase font-black">
          {isTyping ? "WAITING FOR INPUT..." : "[ CLICK TO ADVANCE ]"}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grid-travel {
          0% { transform: rotateX(70deg) translateY(0); }
          100% { transform: rotateX(70deg) translateY(100px); }
        }
        
        @keyframes pulsate-eye {
            0%, 100% { transform: rotate(45deg) scale(1); box-shadow: 0 0 50px rgba(150,0,0,0.3); }
            50% { transform: rotate(45deg) scale(1.05); box-shadow: 0 0 80px rgba(255,0,0,0.5); }
        }

        @keyframes look-around {
            0%, 100% { transform: translate(0, 0); }
            20% { transform: translate(-8px, -4px); }
            40% { transform: translate(8px, 4px); }
            60% { transform: translate(-6px, 8px); }
            80% { transform: translate(10px, -6px); }
        }

        @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes eye-glitch {
          0%, 100% { opacity: 0; }
          95% { opacity: 0; }
          96% { opacity: 0.8; transform: scale(1.1) translateX(10px); }
          97% { opacity: 0; }
          98% { opacity: 0.5; transform: scale(0.9) translateX(-10px); }
          99% { opacity: 0; }
        }
        .animate-eye-glitch { animation: eye-glitch 4s infinite; }
      `}} />
    </div>
  );
};

export default LoreCutscene;
