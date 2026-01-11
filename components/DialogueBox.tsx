import React, { useState, useEffect } from 'react';
import { sounds } from '../soundManager';

interface DialogueBoxProps {
  speaker: { name: string; avatar: string };
  lines: string[];
  onClose: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, lines, onClose }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setText("");
    setIsTyping(true);
    let charIdx = 0;
    const currentLine = lines[index];
    
    const interval = setInterval(() => {
      setText(currentLine.substring(0, charIdx + 1));
      if (charIdx % 3 === 0) sounds.playEffect('type');
      charIdx++;
      if (charIdx >= currentLine.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [index, lines]);

  const advance = () => {
    if (isTyping) {
      setText(lines[index]);
      setIsTyping(false);
      return;
    }
    sounds.playEffect('turn');
    if (index < lines.length - 1) {
      setIndex(i => i + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={advance}>
      <div className="w-full max-w-3xl bg-[#050a05] border-2 border-emerald-900 p-8 flex flex-col md:flex-row items-center gap-8 relative shadow-[0_0_50px_rgba(0,255,100,0.1)] animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
          
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />

          {speaker.avatar && (
            <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-emerald-900 bg-emerald-950/30 p-2 overflow-hidden relative shadow-[0_0_30px_rgba(16,185,129,0.3)] shrink-0">
                <img src={speaker.avatar} className="w-full h-full object-contain pixelated relative z-10" alt={speaker.name} />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,50,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-50" />
            </div>
          )}

          <div className="w-full flex-1 flex flex-col items-start justify-center text-left">
             <div className="border-b border-emerald-900/50 pb-2 mb-4 w-full">
                <h3 className="text-xl font-black text-emerald-300 uppercase tracking-widest">{speaker.name}</h3>
             </div>
             <div className="min-h-[96px]">
                <p className="text-emerald-400 font-mono text-base md:text-lg font-bold tracking-wide leading-relaxed drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                    {text}
                    <span className={`inline-block w-2.5 h-6 bg-emerald-500 ml-2 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                </p>
             </div>
          </div>
          
          <div onClick={advance} className="absolute bottom-4 right-4 text-[10px] md:text-xs text-emerald-800 uppercase tracking-[0.3em] font-black animate-pulse cursor-pointer">
             {isTyping ? "..." : "▶"}
          </div>
      </div>
    </div>
  );
};

export default DialogueBox;