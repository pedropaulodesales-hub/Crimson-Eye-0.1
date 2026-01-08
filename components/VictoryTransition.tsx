
import React, { useEffect, useState } from 'react';

const VictoryTransition: React.FC = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0: Flash Start, 1: Flash End
    requestAnimationFrame(() => setPhase(1));
  }, []);

  return (
    <div className={`fixed inset-0 z-[2000] pointer-events-none flex items-center justify-center transition-all duration-700 ease-out ${phase === 1 ? 'bg-white/0' : 'bg-white'}`}>
        <div className={`absolute inset-0 bg-emerald-500/20 mix-blend-screen transition-opacity duration-500 ${phase === 1 ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter transform transition-all duration-500 ${phase === 1 ? 'scale-150 opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'}`} style={{ textShadow: '0 0 50px rgba(255,255,255,1)' }}>
            VICTORY
        </div>
    </div>
  );
};

export default VictoryTransition;
