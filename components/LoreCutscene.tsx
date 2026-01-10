import React, { useState, useEffect } from 'react';
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
  const [transitionPhase, setTransitionPhase] = useState<'lore' | 'blink_close' | 'blink_open' | 'glow' | 'fade_out'>('lore');
  const [startTransition, setStartTransition] = useState(false);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const [eyeOpacity, setEyeOpacity] = useState(0);
  const [tunnelSpeed, setTunnelSpeed] = useState(10);
  
  useEffect(() => {
    // Start background ambience on mount
    sounds.playLoreAmbience();
  }, []);

  // Text typing effect
  useEffect(() => {
    if (startTransition) return;
    if (lineIndex >= LORE_TEXTS.length) {
      // Last line is finished, start transition
      sounds.playEffect('eye_blink');
      setTransitionPhase('blink_close');
      setStartTransition(true);
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
      if (charIndex % 3 === 0) sounds.playEffect('type');

      charIndex++;
      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [lineIndex, startTransition]);

  // Final transition animation effect
  useEffect(() => {
      if (!startTransition) return;

      const timers = [
          setTimeout(() => setTransitionPhase('blink_open'), 200),
          setTimeout(() => {
              setTransitionPhase('glow');
              sounds.playEffect('eye_glow');
          }, 450),
          setTimeout(() => setShowRedFlash(true), 800),
          setTimeout(() => setShowRedFlash(false), 1200),
          setTimeout(() => setTransitionPhase('fade_out'), 1500),
          setTimeout(() => onComplete(), 2500)
      ];
      
      return () => timers.forEach(clearTimeout);
  }, [startTransition, onComplete]);

  const handleNext = () => {
    if (transitionPhase !== 'lore') return; // Disable clicks during transition

    if (isTyping) {
      setDisplayedText(LORE_TEXTS[lineIndex]);
      setIsTyping(false);
      return;
    }

    if (lineIndex < LORE_TEXTS.length) { // Allow advancing to the end
      setLineIndex(s => s + 1);
    }
  };
  
  const isBlinking = transitionPhase === 'blink_close';
  const isGlowing = transitionPhase === 'glow' || transitionPhase === 'fade_out';

  return (
    <div 
      className="absolute inset-0 z-[500] bg-black flex flex-col items-center justify-center overflow-hidden font-mono cursor-pointer"
      onClick={handleNext}
    >
      <div className={`absolute inset-0 bg-black transition-opacity duration-1000 z-50 pointer-events-none ${transitionPhase === 'fade_out' ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute inset-0 bg-red-600/40 backdrop-blur-sm transition-opacity duration-200 z-40 pointer-events-none ${showRedFlash ? 'opacity-100' : 'opacity-0'}`} />

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
          transform: `scale(${isGlowing ? 1.4 : 0.8 + (lineIndex * 0.05)})`
        }}
      >
        <div className={`absolute inset-0 bg-[#0a0000] rounded-[70%_30%_70%_30%] border-[4px] rotate-[45deg] overflow-hidden transition-all duration-700
          ${isGlowing ? 'shadow-[0_0_250px_rgba(255,80,80,1)] border-[#ff6666]' : 'shadow-[0_0_100px_rgba(200,0,0,0.4)] border-[#551111] animate-pulsate-eye'}`
        }>
           <div className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#330000_0%,transparent_80%)] opacity-70" />
           <div className="w-full h-full -rotate-[45deg] relative flex items-center justify-center">
              <div className={`w-30 h-30 md:w-40 md:h-40 bg-[#cc0000] rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] border-2 border-[#ff444444] transition-transform duration-150 ease-in-out ${isBlinking ? 'scale-y-0' : 'scale-y-100'} ${transitionPhase === 'lore' ? 'animate-look-around' : ''}`}>
                 <div className="w-6 h-24 md:w-8 md:h-32 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#000]" />
                 <div className="w-20 h-20 md:w-28 md:h-28 bg-black rounded-full opacity-60 blur-[4px]" />
                 <div className="absolute inset-0 border-[4px] border-dotted border-[#ff000044] rounded-full animate-spin-slow" />
                 <div className="w-5 h-5 md:w-8 md:h-8 bg-white/40 rounded-full absolute top-1/4 left-1/4 blur-[2px] opacity-80" />
                 <div className="w-2 h-2 md:w-3 md:h-3 bg-white/60 rounded-full absolute top-[20%] left-[35%] blur-[1px]" />
              </div>
           </div>
            {isGlowing && (
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_50%)] animate-pulse" />
          )}
        </div>
        {/* Glitch Overlay */}
        <div className="absolute inset-0 bg-red-500/10 mix-blend-screen opacity-0 animate-eye-glitch" />
      </div>

      {/* Narrative Container */}
      <div className={`relative z-30 w-full max-w-xl px-8 text-center transition-opacity duration-500 ${transitionPhase !== 'lore' ? 'opacity-0' : 'opacity-100'}`}>
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
