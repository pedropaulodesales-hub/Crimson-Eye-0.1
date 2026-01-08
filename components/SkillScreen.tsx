
import React from 'react';
import { Player, Skill, DerivedStats } from '../types';
import { CLASSES } from '../constants';

interface SkillScreenProps {
  party: Player[];
  selectedCharIndex: number;
  onSelectChar: (index: number) => void;
  onUpgradeSkill: (playerIndex: number, skillId: string) => void;
  onClose: () => void;
  calculateStats: (p: Player) => DerivedStats;
}

const SkillScreen: React.FC<SkillScreenProps> = ({ 
  party, 
  selectedCharIndex, 
  onSelectChar, 
  onUpgradeSkill, 
  onClose,
  calculateStats 
}) => {
  const player = party[selectedCharIndex];
  const classDef = CLASSES.find(c => c.type === player.class);
  const currentStats = calculateStats(player);

  if (!classDef) return null;

  const actives = classDef.skillPool.filter(s => s.type !== 'passive').sort((a,b) => a.minLevel - b.minLevel);
  const passives = classDef.skillPool.filter(s => s.type === 'passive').sort((a,b) => a.minLevel - b.minLevel);

  const renderSkillList = (skills: Skill[]) => (
    <div className="space-y-2">
       {skills.map(skill => {
         const level = player.skillLevels[skill.id] || 0;
         const isMax = level >= 3;
         const canAfford = player.skillPoints > 0;
         const reqMet = player.level >= skill.minLevel;
         const isPassive = skill.type === 'passive';

         return (
           <div key={skill.id} className={`border-2 p-2 transition-all flex flex-col md:flex-row gap-2 relative ${level > 0 ? 'border-cyan-600 bg-cyan-950/10' : 'border-emerald-950 opacity-80'}`}>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2">
                    <span className={`text-[10px] md:text-sm font-black uppercase ${level > 0 ? 'text-white' : reqMet ? 'text-emerald-500' : 'text-emerald-900'}`}>{skill.name}</span>
                    <span className={`text-[8px] px-1 border uppercase ${isPassive ? 'border-purple-900 text-purple-400' : 'border-cyan-900 text-cyan-600'}`}>{skill.type}</span>
                    {!reqMet && <span className="text-[8px] text-red-500 font-bold border border-red-900 px-1 bg-red-950/30">REQ LVL {skill.minLevel}</span>}
                 </div>
                 <p className="text-[8px] md:text-xs text-cyan-800 leading-tight italic mt-0.5">"{skill.desc}"</p>
                 {level > 0 && !isPassive && (
                    <div className="text-[8px] text-cyan-700/60 uppercase mt-1">
                       Power: +{(1 + (level - 1) * 0.2).toFixed(1)}x | Cost: {skill.cost} MP
                    </div>
                 )}
                 {level > 0 && isPassive && skill.passiveStat && (
                    <div className="text-[8px] text-purple-700/60 uppercase mt-1">
                       Bonus: +{(skill.passiveVal || 0) * level} {skill.passiveStat.toUpperCase()}
                    </div>
                 )}
              </div>
              
              <div className="flex flex-row md:flex-col items-end justify-between shrink-0 gap-2">
                 <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-2 h-2 border ${i <= level ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_5px_rgba(0,255,255,0.5)]' : 'border-cyan-950'}`} />
                    ))}
                 </div>
                 {!isMax ? (
                    <button 
                      disabled={!canAfford || !reqMet}
                      onClick={() => onUpgradeSkill(selectedCharIndex, skill.id)}
                      className={`px-3 py-1 text-[8px] md:text-xs font-black border transition-all w-24
                        ${!reqMet 
                            ? 'border-gray-800 text-gray-700 bg-black cursor-not-allowed' 
                            : canAfford 
                                ? 'bg-cyan-600 text-black border-cyan-300 hover:brightness-125' 
                                : 'bg-black text-cyan-950 border-cyan-950'
                        }`}
                    >
                      {level === 0 ? 'UNLOCK' : 'UPGRADE'}
                    </button>
                 ) : (
                    <span className="text-[8px] md:text-xs font-black text-cyan-400 uppercase tracking-widest w-24 text-right">MAX</span>
                 )}
              </div>
           </div>
         );
       })}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black text-emerald-500 font-mono p-4 animate-in fade-in zoom-in duration-300 border-4 border-cyan-900 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
      <div className="flex justify-between items-center border-b-2 border-cyan-900 pb-3 mb-4 shrink-0">
        <h2 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-cyan-400">Skill Sanctum</h2>
        <button onClick={onClose} className="retro-button px-3 py-1 text-[10px] md:text-xs border-red-900 text-red-500 hover:bg-red-900 hover:text-white">EXIT</button>
      </div>

      <div className="flex gap-1 mb-4 shrink-0">
        {party.map((p, i) => (
          <button 
            key={p.id}
            onClick={() => onSelectChar(i)}
            className={`flex-1 py-1.5 border-2 text-[8px] md:text-xs font-black transition-all flex items-center justify-center gap-2 ${
              selectedCharIndex === i ? 'bg-cyan-500 text-black border-cyan-300' : 'bg-black text-cyan-800 border-cyan-900'
            }`}
          >
            {p.avatar && <img src={p.avatar} alt="face" className="w-5 h-5 bg-black border border-cyan-900 hidden md:block" />}
            {p.class}
          </button>
        ))}
      </div>

      <div className="bg-cyan-950/20 border border-cyan-900/50 p-3 mb-4 flex justify-between items-center rounded-sm shrink-0">
           <div className="flex items-center gap-4">
              <img src={player.avatar} className="w-12 h-12 bg-black border-2 border-cyan-800 p-0.5 object-contain pixelated hidden md:block" alt={player.class} />
              <div>
                  <div className="text-[10px] md:text-base font-black text-white">{player.class}</div>
                  <div className="text-[8px] md:text-xs text-cyan-700">Level {player.level}</div>
              </div>
           </div>
           <div className="text-right">
              <div className="text-[14px] md:text-xl font-black text-cyan-400">{player.skillPoints} SP</div>
              <div className="text-[7px] md:text-[10px] text-cyan-900 uppercase">Available</div>
           </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
         <div className="mb-6">
             <div className="text-xs font-black text-cyan-500 border-b border-cyan-900/50 mb-2 pb-1 uppercase tracking-widest sticky top-0 bg-black z-10 py-1">Active Abilities</div>
             {renderSkillList(actives)}
         </div>
         <div>
             <div className="text-xs font-black text-purple-500 border-b border-purple-900/50 mb-2 pb-1 uppercase tracking-widest sticky top-0 bg-black z-10 py-1">Passive Traits</div>
             {renderSkillList(passives)}
         </div>
      </div>

      <div className="mt-4 pt-3 border-t border-cyan-900 text-[8px] md:text-xs grid grid-cols-4 gap-2 shrink-0">
         <div className="flex flex-col border border-cyan-900/30 p-1 bg-cyan-950/10"><span className="text-cyan-700">ATK</span> <span className="text-white font-bold">{currentStats.atk}</span></div>
         <div className="flex flex-col border border-cyan-900/30 p-1 bg-cyan-950/10"><span className="text-cyan-700">MAG</span> <span className="text-white font-bold">{currentStats.mAtk}</span></div>
         <div className="flex flex-col border border-cyan-900/30 p-1 bg-cyan-950/10"><span className="text-cyan-700">DEF</span> <span className="text-white font-bold">{currentStats.def}</span></div>
         <div className="flex flex-col border border-cyan-900/30 p-1 bg-cyan-950/10"><span className="text-cyan-700">RES</span> <span className="text-white font-bold">{currentStats.mDef}</span></div>
      </div>
    </div>
  );
};

export default SkillScreen;
