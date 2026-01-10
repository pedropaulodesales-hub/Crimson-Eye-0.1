import React, { useEffect, useState } from 'react';

interface SealingTransitionProps {
  onComplete: () => void;
}

const SealingTransition: React.FC<SealingTransitionProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'start' | 'fading' | 'end'>('start');

  useEffect(() => {
    // Start fading in the black overlay immediately
    requestAnimationFrame(() => setPhase('fading'));

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000); // Duration matches sound effect + fade

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
        className={`fixed inset-0 z-[2000] bg-black transition-opacity duration-[1800ms] ease-in-out
            ${phase === 'fading' ? 'opacity-100' : 'opacity-0'}
        `}
    >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Shrinking circle visual */}
            <div className={`
                w-[200vw] h-[200vw] border-4 border-emerald-500 rounded-full
                transition-all duration-[1500ms] ease-in
                ${phase === 'fading' ? 'scale-0 opacity-50' : 'scale-100 opacity-0'}
            `} />
        </div>
    </div>
  );
};

export default SealingTransition;
