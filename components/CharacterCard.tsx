
import React, { useMemo } from 'react';
import { Player, DerivedStats } from '../types';

interface CharacterCardProps {
  player: Player | any; // Any for creation screen preview
  stats: DerivedStats;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ player, stats }) => {
  
  // Dynamically inject a CSS animation into the SVG base64 string to make specific pixels blink
  const animatedAvatar = useMemo(() => {
    if (!player.avatar || !player.avatar.startsWith('data:image/svg+xml;base64,')) return player.avatar;

    try {
        const base64Content = player.avatar.split(',')[1];
        const rawSvg = atob(base64Content);
        
        let targetColor = '#ffffff'; // Default eye color (Mage, Barbarian, Archer)
        
        // Define specific eye colors for classes that differ from default white
        if (player.class === 'WARRIOR') targetColor = '#33ff33'; // Green Visor
        if (player.class === 'ROGUE') targetColor = '#ff0000';   // Red eyes
        if (player.class === 'CLERIC') targetColor = '#66ff66';  // Light Green Holy eyes

        // Define the blink animation styles
        const styleBlock = `
          <style>
            @keyframes eyeBlink {
               0%, 96%, 100% { opacity: 1; }
               98% { opacity: 0; }
            }
            .blink-pixel { animation: eyeBlink 4.5s infinite; animation-delay: ${Math.random() * 2}s; }
          </style>
        `;

        // Inject style at the end of SVG
        let modifiedSvg = rawSvg.replace('</svg>', `${styleBlock}</svg>`);

        // Robust Regex to find the fill attribute with either single or double quotes
        // We escape the hex code just in case
        const colorRegex = new RegExp(`fill=["']${targetColor}["']`, 'gi');
        
        // Check if we actually found matches before modifying, to avoid corrupting the SVG if no eyes found
        if (modifiedSvg.match(colorRegex)) {
            modifiedSvg = modifiedSvg.replace(colorRegex, `fill="${targetColor}" class="blink-pixel"`);
            return `data:image/svg+xml;base64,${btoa(modifiedSvg)}`;
        }
        
        // If no eyes found, return original to be safe
        return player.avatar;

    } catch (e) {
        // Fallback to static avatar on any error
        console.warn("Failed to inject blink animation", e);
        return player.avatar;
    }
  }, [player.avatar, player.class]);

  return (
    <div className="bg-[#050505] border-2 border-emerald-900/60 font-mono text-xs md:text-sm shadow-xl shadow-black relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-900/20 w-full h-full flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1.05); filter: brightness(1) drop-shadow(0 10px 10px rgba(0,0,0,0.5)); }
          50% { transform: scale(1.08); filter: brightness(1.1) drop-shadow(0 20px 25px rgba(16,185,129,0.15)); }
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.5); }
        }
        @keyframes card-shine {
          0% { transform: translateX(-200%) skewX(-20deg); opacity: 0; }
          40% { opacity: 0; }
          50% { opacity: 0.1; }
          60% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
          100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        }
      `}} />

      {/* Header */}
      <div className="border-b border-emerald-900/40 p-2 bg-gradient-to-r from-emerald-950/40 to-black flex justify-between items-center z-20">
        <span className="text-emerald-400 font-black tracking-[0.2em] text-sm md:text-lg uppercase text-shadow-sm">
          {player.class || 'ADVENTURER'}
        </span>
        <span className="text-emerald-700 font-bold bg-black/40 border border-emerald-900/30 px-2 py-0.5 text-[9px] rounded-sm">LVL {player.level || 1}</span>
      </div>

      {/* Sprite Container */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#0a1a1a_0%,#000_100%)]">
         {/* Background Grid Pattern */}
         <div className="absolute inset-0 opacity-10" 
              style={{
                  backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                  maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
              }}
         />
         
         {/* Pulsing Aura behind sprite */}
         <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald-500 rounded-full blur-[50px] animate-[aura-pulse_6s_ease-in-out_infinite] z-0" />

         {player.avatar && (
             <div className="relative z-10 w-full h-full flex items-center justify-center animate-[subtle-float_6s_ease-in-out_infinite]">
                 {/* Breathe Wrapper */}
                 <div className="w-full h-full flex items-center justify-center animate-[breathe_5s_ease-in-out_infinite] relative">
                     {/* Main Sprite with Internal Blink Animation */}
                     <img 
                       src={animatedAvatar} 
                       alt="class sprite" 
                       className="h-full w-full object-contain pixelated relative z-10" 
                       style={{ transformOrigin: 'center' }}
                     />
                 </div>
             </div>
         )}
         
         {/* Floor Shadow */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/60 blur-md rounded-[100%] z-0 scale-x-125" />

         {/* Metallic Shine Overlay */}
         <div className="absolute inset-0 z-20 pointer-events-none">
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-emerald-100/10 to-transparent animate-[card-shine_6s_ease-in-out_infinite]" />
         </div>

         {/* Vignette for cinematic look */}
         <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,#000_100%)] z-10 pointer-events-none" />
      </div>

      {/* Stats Footer */}
      <div className="border-t border-emerald-900/40 bg-black/95 p-2 shrink-0 z-20">
        <div className="grid grid-cols-2 gap-1 mb-2">
            <StatRow label="STR" value={stats.effectiveStr} color="text-red-400" />
            <StatRow label="INT" value={stats.effectiveInt} color="text-cyan-400" />
            <StatRow label="DEX" value={stats.effectiveDex} color="text-yellow-400" />
            <StatRow label="VIT" value={stats.effectiveVit} color="text-green-400" />
            <StatRow label="CHA" value={stats.effectiveCha} color="text-fuchsia-400" />
        </div>

        {/* Derived Stats Compact Grid */}
        <div className="grid grid-cols-2 gap-px bg-emerald-900/30 border border-emerald-900/30">
            <div className="bg-black/80 px-2 py-1 flex justify-between items-center">
                <span className="text-[9px] text-emerald-700 font-bold">HP</span>
                <span className="text-green-400 font-black text-xs">{stats.maxHp}</span>
            </div>
            <div className="bg-black/80 px-2 py-1 flex justify-between items-center">
                <span className="text-[9px] text-emerald-700 font-bold">MP</span>
                <span className="text-blue-400 font-black text-xs">{stats.maxMp}</span>
            </div>
            <div className="bg-black/80 px-2 py-1 flex justify-between items-center">
                <span className="text-[9px] text-emerald-700 font-bold">ATK</span>
                <span className="text-emerald-400 font-bold text-[10px]">{stats.atk}</span>
            </div>
             <div className="bg-black/80 px-2 py-1 flex justify-between items-center">
                <span className="text-[9px] text-emerald-700 font-bold">DEF</span>
                <span className="text-emerald-400 font-bold text-[10px]">{stats.def}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center px-2 py-0.5 border-l-2 border-emerald-900/30 bg-emerald-950/10">
    <span className="text-[9px] text-emerald-600/80 font-bold tracking-widest">{label}</span>
    <span className={`${color} font-black text-xs`}>{value}</span>
  </div>
);

export default CharacterCard;
