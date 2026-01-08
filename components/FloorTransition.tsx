
import React, { useEffect, useState } from 'react';

interface FloorTransitionProps {
  floor: number;
  onMidpoint: () => void;
  onComplete: () => void;
}

const FloorTransition: React.FC<FloorTransitionProps> = ({ floor, onMidpoint, onComplete }) => {
  const [opacity, setOpacity] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    // Fade In
    requestAnimationFrame(() => setOpacity(1));
    
    // Midpoint - Update actual floor data
    const t1 = setTimeout(() => {
        onMidpoint();
        setText(`FLOOR B${floor + 1}`);
    }, 1000);

    // Fade Out
    const t2 = setTimeout(() => {
        setOpacity(0);
    }, 2500);

    // Complete
    const t3 = setTimeout(() => {
        onComplete();
    }, 3500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div 
        className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none"
        style={{ opacity }}
    >
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-emerald-500 font-mono text-2xl tracking-[0.5em] animate-pulse">DESCENDING</h2>
            <div className="w-16 h-1 bg-emerald-900 overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[pulse_1s_infinite]" />
            </div>
            {text && (
                <div className="text-emerald-700 font-mono text-lg mt-4 animate-in fade-in zoom-in duration-500 font-black">
                    {text}
                </div>
            )}
        </div>
    </div>
  );
};

export default FloorTransition;
