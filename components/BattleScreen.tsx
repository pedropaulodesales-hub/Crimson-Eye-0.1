
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Player, Enemy, LogMessage, DerivedStats, Skill } from '../types';

export type AnimationType = 'physical' | 'magical' | 'heal' | 'defend';

export interface FloatingText {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'miss' | 'crit' | 'block' | 'loot';
  key: number;
}

interface BattleScreenProps {
  party: Player[];
  enemies: Enemy[];
  activeCharIndex: number | null;
  targetIndex: number;
  setTargetIndex: (idx: number) => void;
  allyTargetIndex: number;
  setAllyTargetIndex: (idx: number) => void;
  logs: LogMessage[];
  atbValues: Record<string, number>;
  actingId: string | null;
  impactIds: string[];
  currentAnim: AnimationType;
  floatingTexts: FloatingText[];
  skeletonSprite?: string | null;
  onAttack: () => void;
  onDefend: () => void;
  onSkill: (skill: Skill, targetIndex?: number) => void;
  onRun: () => void;
  calculateStats: (p: Player) => DerivedStats;
}

// Menu State Machine for Intelligent Layout
type MenuState = 'MAIN' | 'SKILLS' | 'TARGETING';

// Helper to inject blink animation into SVGs
const getAnimatedAvatar = (avatar: string, identifier: string) => {
    if (!avatar || !avatar.startsWith('data:image/svg+xml;base64,')) return avatar;

    try {
        const base64Content = avatar.split(',')[1];
        const rawSvg = atob(base64Content);
        
        let targetColor = '#ffffff'; 
        if (identifier === 'WARRIOR') targetColor = '#33ff33';
        if (identifier === 'ROGUE') targetColor = '#ff0000';
        if (identifier === 'CLERIC') targetColor = '#66ff66';
        if (identifier.includes('Bat') || identifier.includes('Hound') || identifier.includes('Mimic')) targetColor = '#ff0000';
        if (identifier.includes('Lich')) targetColor = '#00ffaa';

        const styleBlock = `
          <style>
            @keyframes eyeBlink {
               0%, 96%, 100% { opacity: 1; }
               98% { opacity: 0; }
            }
            .blink-pixel { animation: eyeBlink 4.5s infinite; animation-delay: ${Math.random() * 2}s; }
          </style>
        `;

        let modifiedSvg = rawSvg.replace('</svg>', `${styleBlock}</svg>`);
        
        // Robust Regex for fill attribute (single or double quotes, case insensitive)
        const colorRegex = new RegExp(`fill=["']${targetColor}["']`, 'gi');
        
        if (modifiedSvg.match(colorRegex)) {
            modifiedSvg = modifiedSvg.replace(colorRegex, `fill="${targetColor}" class="blink-pixel"`);
            return `data:image/svg+xml;base64,${btoa(modifiedSvg)}`;
        }
        
        return avatar;
    } catch (e) {
        return avatar;
    }
};

const BattleBackground = () => (
  <div className="absolute inset-0 z-0 w-full h-full bg-black overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a1a0a] to-[#000]" />
    <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
       <line x1="0" y1="0" x2="50%" y2="50%" stroke="#005500" strokeWidth="1" />
       <line x1="100%" y1="0" x2="50%" y2="50%" stroke="#005500" strokeWidth="1" />
       <line x1="0" y1="100%" x2="50%" y2="50%" stroke="#005500" strokeWidth="1" />
       <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="#005500" strokeWidth="1" />
       <line x1="25%" y1="0" x2="50%" y2="50%" stroke="#003300" strokeWidth="0.5" />
       <line x1="75%" y1="0" x2="50%" y2="50%" stroke="#003300" strokeWidth="0.5" />
       <line x1="25%" y1="100%" x2="50%" y2="50%" stroke="#003300" strokeWidth="0.5" />
       <line x1="75%" y1="100%" x2="50%" y2="50%" stroke="#003300" strokeWidth="0.5" />
       {[0.1, 0.25, 0.38, 0.46, 0.49].map((scale, i) => (
         <rect key={i} x={`${50 - 50 * scale}%`} y={`${50 - 50 * scale}%`} width={`${100 * scale}%`} height={`${100 * scale}%`} fill="none" stroke="#006600" strokeWidth={1 + i * 0.5} opacity={0.2 + i * 0.1} />
       ))}
       <rect x="49%" y="49%" width="2%" height="2%" fill="#003300" />
    </svg>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
  </div>
);

const BattleScreen: React.FC<BattleScreenProps> = ({
  party,
  enemies,
  activeCharIndex,
  targetIndex,
  setTargetIndex,
  allyTargetIndex,
  setAllyTargetIndex,
  logs,
  atbValues,
  actingId,
  impactIds,
  currentAnim,
  floatingTexts,
  onAttack,
  onDefend,
  onSkill,
  onRun,
  calculateStats
}) => {
  const [menuState, setMenuState] = useState<MenuState>('MAIN');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  
  const activeChar = activeCharIndex !== null ? party[activeCharIndex] : null;
  const logEndRef = useRef<HTMLDivElement>(null);

  // Reset menu state when turn changes
  useEffect(() => {
      setMenuState('MAIN');
      setSelectedSkill(null);
      setHoveredSkill(null);
  }, [activeCharIndex]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Memoize animated avatars to prevent re-calc on every ATB tick
  const animatedPartyAvatars = useMemo(() => party.map(p => getAnimatedAvatar(p.avatar, p.class)), [party]);
  const animatedEnemyAvatars = useMemo(() => enemies.map(e => getAnimatedAvatar(e.avatar || '', e.name)), [enemies]);

  const handleEnemyClick = (idx: number) => {
      if (actingId) return;
      
      if (menuState === 'TARGETING' && selectedSkill) {
          // If skill targets enemy, execute
          if (selectedSkill.targetType === 'enemy') {
              onSkill(selectedSkill, idx); // Explicit target
              setMenuState('MAIN');
          }
      } else {
          setTargetIndex(idx);
      }
  };

  const handleAllyClick = (idx: number) => {
      if (actingId) return;

      if (menuState === 'TARGETING' && selectedSkill) {
          if (selectedSkill.targetType === 'ally' || selectedSkill.targetType === 'self') {
              onSkill(selectedSkill, idx);
              setMenuState('MAIN');
          }
      } else {
          setAllyTargetIndex(idx);
      }
  };

  const initSkillTargeting = (skill: Skill) => {
      if (skill.targetType === 'self') {
          // Instant for self? Or strict targeting? Let's be strict for consistency
          setSelectedSkill(skill);
          setMenuState('TARGETING');
          // Auto-select self to be helpful
          if (activeCharIndex !== null) setAllyTargetIndex(activeCharIndex);
      } else if (skill.targetType === 'ally') {
          setSelectedSkill(skill);
          setMenuState('TARGETING');
      } else {
          // Enemy
          if (skill.isAoe) {
              onSkill(skill); // AOE just goes
          } else {
              setSelectedSkill(skill);
              setMenuState('TARGETING');
          }
      }
  };

  const renderImpactOverlay = (type: AnimationType) => {
    // ... (Same animations as before, kept for brevity)
    if(type === 'physical') return <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"><div className="absolute w-full h-1 rotate-45 flex justify-center items-center"><div className="w-full h-full bg-white animate-slash shadow-[0_0_10px_#fff]" /></div><div className="absolute w-full h-1 -rotate-45 flex justify-center items-center"><div className="w-full h-full bg-white animate-slash shadow-[0_0_10px_#fff]" /></div></div>;
    if(type === 'magical') return <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"><div className="w-8 h-8 rounded-full bg-cyan-400 animate-burst shadow-[0_0_20px_#22d3ee]" /></div>;
    if(type === 'heal') return <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"><div className="text-2xl text-green-400 animate-float-up">✚</div></div>;
    if(type === 'defend') return <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"><div className="text-4xl animate-bounce">🛡️</div></div>;
    return null;
  };

  const renderFloatingText = (targetId: string) => {
     const texts = floatingTexts.filter(t => t.id === targetId);
     if (texts.length === 0) return null;
     return (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
             {texts.map(ft => {
                 let colorClass = "text-white";
                 if (ft.type === 'damage') colorClass = "text-red-500 font-bold text-shadow-red";
                 else if (ft.type === 'heal') colorClass = "text-green-400 font-bold";
                 else if (ft.type === 'miss') colorClass = "text-gray-400 font-bold";
                 else if (ft.type === 'crit') colorClass = "text-orange-500 font-black text-2xl text-shadow-orange";
                 else if (ft.type === 'block') colorClass = "text-blue-300 font-bold";
                 else if (ft.type === 'loot') colorClass = "text-yellow-400 font-bold";
                 return <div key={ft.key} className={`absolute ${colorClass} animate-float-up text-lg md:text-2xl drop-shadow-md`}>{ft.text}</div>;
             })}
         </div>
     );
  };

  const renderBuffs = (buffs: any[]) => {
      if (!buffs || buffs.length === 0) return null;
      return (
          <div className="flex flex-wrap justify-center gap-1">
              {buffs.map((b, i) => {
                  const isDebuff = b.type === 'debuff';
                  const color = isDebuff ? 'bg-red-900/90 border-red-500 text-red-100' : 'bg-emerald-900/90 border-emerald-500 text-emerald-100';
                  return <div key={i} className={`flex items-center gap-0.5 px-1 py-px rounded border text-[6px] md:text-[8px] font-bold shadow-sm ${color}`} title={b.name}><span>{isDebuff ? '💀' : '🛡️'}</span><span>{b.name.substring(0, 3)}</span></div>;
              })}
          </div>
      );
  };

  const getSkillInfo = (skill: Skill) => {
      if (!activeChar) return { power: '-', color: 'text-gray-500' };
      const level = activeChar.skillLevels[skill.id] || 1;
      const stats = calculateStats(activeChar);
      const levelMult = 1 + (level - 1) * 0.2;
      
      let val = 0;
      let label = 'DMG';
      let color = 'text-red-400';

      if (skill.type === 'attack') {
          val = Math.floor(stats.atk * (skill.basePower || 1) * levelMult);
      } else if (skill.type === 'heal') {
          val = Math.floor(stats.mAtk * (skill.basePower || 1.5) * levelMult); // Approx heal scaling
          label = 'HEAL';
          color = 'text-green-400';
      } else if (skill.type === 'special') {
          val = Math.floor(stats.mAtk * (skill.basePower || 1) * levelMult);
          color = 'text-cyan-400';
      } else {
          return { power: 'BUFF', color: 'text-yellow-400' };
      }

      return { power: `${label} ~${val}`, color };
  };

  // --- COMPACT INTELLIGENT LAYOUT RENDER ---
  const renderActionMenu = () => {
      if (!activeChar || actingId) {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-800 animate-pulse border-2 border-dashed border-emerald-900/30">
               <div className="text-sm font-bold tracking-widest uppercase">Awaiting Turn Signal</div>
               <div className="w-1/2 h-1 bg-emerald-900/30 mt-2 overflow-hidden rounded-full"><div className="h-full bg-emerald-500/50 w-1/3 animate-[shimmer_1s_infinite_linear]" /></div>
            </div>
          );
      }

      if (menuState === 'TARGETING') {
          return (
              <div className="w-full h-full flex flex-col border-2 border-blue-500 bg-blue-950/20 p-2 animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 animate-[pulse_0.5s_infinite]" />
                  <div className="relative z-10 flex flex-col h-full">
                      <div className="text-center font-black text-blue-300 uppercase tracking-widest text-lg mb-1 drop-shadow-md">SELECT TARGET</div>
                      
                      <div className="bg-black/50 border border-blue-800 p-2 mb-2 text-center">
                          <div className="text-[10px] text-blue-400 uppercase font-bold">CASTING</div>
                          <div className="text-white font-black text-sm uppercase">{selectedSkill?.name}</div>
                      </div>

                      <div className="text-center text-xs text-white font-bold bg-blue-900/40 p-1 rounded mb-4">
                          {selectedSkill?.targetType === 'enemy' ? '>>> CHOOSE ENEMY <<<' : '>>> CHOOSE ALLY <<<'}
                      </div>
                      <div className="mt-auto">
                          <button onClick={() => setMenuState('SKILLS')} className="w-full py-3 border-2 border-red-500 bg-red-950/40 text-red-300 hover:bg-red-900 hover:text-white text-sm font-black uppercase tracking-wider transition-colors">CANCEL CAST</button>
                      </div>
                  </div>
              </div>
          );
      }

      if (menuState === 'SKILLS') {
          const displaySkill = hoveredSkill || activeChar.skills.find(s => (activeChar.skillLevels[s.id]||0) > 0);
          
          return (
              <div className="w-full h-full flex flex-col border-2 border-cyan-900 bg-black relative">
                  {/* Header */}
                  <div className="flex justify-between items-center bg-cyan-950/50 p-1.5 px-3 border-b border-cyan-800">
                      <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">SKILL COMMAND</span>
                      <span className="text-[10px] font-bold text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900">{activeChar.mp} MP</span>
                  </div>

                  {/* Split View: List & Detail */}
                  <div className="flex-1 flex flex-col min-h-0">
                      {/* List */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-1">
                          {activeChar.skills.map(skill => {
                              const level = activeChar.skillLevels[skill.id] || 0;
                              if (level === 0) return null;
                              const canAfford = activeChar.mp >= skill.cost;
                              return (
                                  <button 
                                    key={skill.id}
                                    disabled={!canAfford}
                                    onMouseEnter={() => setHoveredSkill(skill)}
                                    onClick={() => initSkillTargeting(skill)}
                                    className={`w-full flex justify-between items-center p-2 border transition-all text-left group relative
                                        ${canAfford ? 'border-cyan-900/40 hover:border-cyan-500 hover:bg-cyan-950/30' : 'border-gray-900 bg-gray-950/20 opacity-50 cursor-not-allowed'}
                                        ${hoveredSkill?.id === skill.id ? 'bg-cyan-900/20 border-cyan-600' : ''}
                                    `}
                                  >
                                      <div className="flex items-center gap-2">
                                          <span className="text-[10px] w-4 text-center">{skill.type === 'attack' ? '⚔️' : skill.type === 'heal' ? '✚' : '✨'}</span>
                                          <span className={`font-bold text-xs uppercase ${canAfford ? 'text-cyan-100' : 'text-gray-500'}`}>{skill.name}</span>
                                      </div>
                                      <span className={`text-[10px] font-mono font-bold ${canAfford ? 'text-blue-400' : 'text-red-900'}`}>{skill.cost} MP</span>
                                  </button>
                              );
                          })}
                      </div>

                      {/* Detail Pane (Fixed at Bottom of Skill Menu) */}
                      <div className="h-24 shrink-0 bg-cyan-950/20 border-t-2 border-cyan-800 p-2 flex flex-col justify-between">
                          {displaySkill ? (
                              <>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-cyan-300 font-black text-xs uppercase">{displaySkill.name}</span>
                                    <span className="text-[9px] text-cyan-600 uppercase font-bold tracking-wider">{displaySkill.type}</span>
                                </div>
                                <p className="text-[9px] text-cyan-500/80 italic leading-tight mb-1 h-8 overflow-hidden">
                                    "{displaySkill.desc}"
                                </p>
                                <div className="flex gap-2 text-[10px] font-mono border-t border-cyan-900/50 pt-1 mt-auto">
                                    {(() => {
                                        const info = getSkillInfo(displaySkill);
                                        return <span className={`font-bold ${info.color}`}>{info.power}</span>;
                                    })()}
                                    <span className="text-gray-500">|</span>
                                    <span className="text-blue-400 font-bold">COST: {displaySkill.cost}</span>
                                </div>
                              </>
                          ) : (
                              <div className="text-center text-[10px] text-cyan-900 py-4">SELECT A SKILL</div>
                          )}
                      </div>
                  </div>

                  {/* Back Button */}
                  <button onClick={() => setMenuState('MAIN')} className="p-2 border-t-2 border-red-900/50 bg-black text-xs font-black text-red-500 hover:bg-red-950/30 uppercase text-center hover:text-red-400 transition-colors">
                      ◀ BACK TO COMMANDS
                  </button>
              </div>
          );
      }

      // MAIN MENU - GRID LAYOUT
      return (
          <div className="w-full h-full flex flex-col p-1 gap-1">
              <div className="flex items-center justify-between mb-1 px-1 bg-emerald-950/30 border border-emerald-900/50 rounded py-1">
                  <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white uppercase bg-emerald-800 px-2 py-0.5 rounded-sm shadow-sm">{activeChar.class}</span>
                      <span className="text-[10px] font-mono text-emerald-500 animate-pulse">COMMAND_READY</span>
                  </div>
                  <span className="text-[9px] text-emerald-700">ACT_ID: {activeChar.id.split('_')[2]}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-2">
                  <button 
                    onClick={onAttack} 
                    className="retro-button border-red-600 text-red-500 hover:bg-red-600 hover:text-white flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
                  >
                      <span className="text-2xl group-hover:scale-110 transition-transform">⚔️</span>
                      <span className="text-xs md:text-sm tracking-widest">ATTACK</span>
                  </button>
                  
                  <button 
                    onClick={() => setMenuState('SKILLS')} 
                    className="retro-button border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
                  >
                      <span className="text-2xl group-hover:scale-110 transition-transform">⚡</span>
                      <span className="text-xs md:text-sm tracking-widest">SKILL</span>
                  </button>
                  
                  <button 
                    onClick={onDefend} 
                    className="retro-button border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
                  >
                      <span className="text-2xl group-hover:scale-110 transition-transform">🛡️</span>
                      <span className="text-xs md:text-sm tracking-widest">DEFEND</span>
                  </button>
                  
                  <button 
                    onClick={onRun} 
                    className="retro-button border-gray-500 text-gray-400 hover:bg-gray-600 hover:text-white flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
                  >
                      <span className="text-2xl group-hover:scale-110 transition-transform">🏃</span>
                      <span className="text-xs md:text-sm tracking-widest">RUN</span>
                  </button>
              </div>
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full w-full bg-black overflow-hidden relative font-mono">
      {/* CSS for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-up { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
        .animate-float-up { animation: float-up 0.8s ease-out forwards; }
        @keyframes crit-shake { 0% { transform: scale(1); } 20% { transform: scale(1.5) rotate(5deg); } 100% { transform: scale(1) translateY(-40px); opacity: 0; } }
        .animate-crit-shake { animation: crit-shake 1s ease-out forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes slash { 0% { transform: scaleX(0); opacity: 1; } 50% { transform: scaleX(1); } 100% { transform: scaleX(1); opacity: 0; } }
        .animate-slash { animation: slash 0.3s ease-out forwards; }
        @keyframes burst { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
        .animate-burst { animation: burst 0.4s ease-out forwards; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .text-shadow-red { text-shadow: 0 0 5px #ff0000; }
        .text-shadow-orange { text-shadow: 0 0 10px #ff6600; }
      `}} />

      {/* Wrapper to constrain max width on large screens */}
      <div className="w-full h-full max-w-7xl mx-auto flex flex-col relative bg-black shadow-2xl border-x-2 border-emerald-950">

        {/* MAIN BATTLE VIEW (Reduced height to make room for larger HUD) */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden border-b-2 border-emerald-900">
            <BattleBackground />

            {/* ENEMIES ROW */}
            <div className="flex justify-center items-end gap-8 md:gap-24 w-full px-4 mb-4 relative z-10">
               {enemies.map((enemy, idx) => {
                  if (enemy.hp <= 0) return null;
                  const isSelected = targetIndex === idx;
                  const isActing = actingId === enemy.instanceId;
                  const isImpact = impactIds.includes(enemy.instanceId);
                  const animatedAvatar = animatedEnemyAvatars[idx];
                  const isTargetingEnemy = menuState === 'TARGETING' && selectedSkill?.targetType === 'enemy';
                  
                  return (
                     <div 
                        key={enemy.instanceId}
                        onClick={() => handleEnemyClick(idx)}
                        className={`relative transition-all duration-300 cursor-pointer group flex flex-col items-center
                           ${isSelected ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'scale-100 hover:scale-105 opacity-90'}
                           ${isActing ? 'translate-y-[-20px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]' : ''}
                           ${isImpact ? 'brightness-200 contrast-200 saturate-0 animate-shake' : ''}
                           ${isTargetingEnemy ? 'animate-pulse contrast-125' : ''}
                        `}
                     >
                        <div className="relative">
                            {animatedAvatar ? (
                                <img src={animatedAvatar} alt={enemy.name} className={`w-32 h-32 md:w-56 md:h-56 object-contain pixelated filter transition-all duration-500 ${isSelected ? 'brightness-125' : 'brightness-90'}`} />
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-red-900/20 border-2 border-red-500 flex items-center justify-center"><span className="text-4xl">👹</span></div>
                            )}
                            
                            {/* Selection Indicator */}
                            {(isSelected || isTargetingEnemy) && (
                               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-500 animate-bounce text-2xl font-bold">▼</div>
                            )}

                            {renderFloatingText(enemy.instanceId)}
                            {isImpact && renderImpactOverlay(currentAnim)}
                        </div>

                        <div className="mt-2 w-20 md:w-32 relative">
                           {/* ATB Bar */}
                           <div className="h-1 w-full bg-gray-900 mb-0.5">
                               <div className="h-full bg-gray-400 shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ width: `${Math.min(100, atbValues[enemy.instanceId] || 0)}%` }} />
                           </div>
                           {/* HP Bar */}
                           <div className="h-1.5 w-full bg-red-950 border border-red-900">
                               <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                           </div>
                        </div>
                        
                        <div className="mt-1 text-[10px] font-bold text-red-400 bg-black/60 px-2 rounded backdrop-blur-sm">
                           {enemy.name}
                        </div>
                        <div className="mt-0.5">{renderBuffs(enemy.buffs)}</div>
                     </div>
                  );
               })}
            </div>
        </div>

        {/* HUD / CONTROLS - Expanded Height */}
        <div className="bg-[#050505] p-2 md:p-6 shrink-0 relative z-20 h-[45vh] flex flex-col">
           
           <div className="flex flex-row gap-4 flex-1 min-h-0 h-full">
              {/* Party Status Cards */}
              <div className="flex-1 grid grid-cols-3 gap-2 md:gap-6 h-full">
                 {party.map((p, i) => {
                    const isActive = activeCharIndex === i;
                    const isTarget = allyTargetIndex === i;
                    const stats = calculateStats(p);
                    const atb = atbValues[p.id] || 0;
                    const isImpact = impactIds.includes(p.id);
                    const animatedAvatar = animatedPartyAvatars[i];
                    const isTargetingAlly = menuState === 'TARGETING' && (selectedSkill?.targetType === 'ally' || selectedSkill?.targetType === 'self');

                    return (
                       <div 
                          key={p.id}
                          onClick={() => handleAllyClick(i)} 
                          className={`
                             border-4 relative overflow-hidden transition-all duration-200 flex flex-col h-full cursor-pointer
                             ${isActive ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] z-10' : 'border-emerald-900/60 opacity-90'}
                             ${isTargetingAlly ? 'animate-pulse border-blue-400 ring-2 ring-blue-500' : ''}
                             ${p.hp <= 0 ? 'grayscale opacity-40 border-red-900' : ''}
                             ${isImpact ? 'bg-red-900/50 animate-shake' : 'bg-black'}
                          `}
                       >
                          {/* Top Info */}
                          <div className="absolute top-1 left-1 z-20 pointer-events-none flex flex-col items-start gap-0.5">
                             <div className={`font-black text-[10px] md:text-xl uppercase tracking-wider bg-black/60 px-1 md:px-2 border-l-4 ${isActive ? 'border-emerald-400 text-white' : 'border-emerald-900 text-emerald-500'}`}>{p.class}</div>
                             <div className="text-[8px] md:text-sm text-emerald-700 font-bold bg-black/60 px-1">LV {p.level}</div>
                          </div>

                          {/* Avatar */}
                          <div className="flex-1 flex items-center justify-center relative z-10 p-2 overflow-hidden">
                             <img src={animatedAvatar} className="h-full w-full object-contain pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transform scale-125" alt={p.class} />
                             {isImpact && renderImpactOverlay(currentAnim)}
                             {renderFloatingText(p.id)}
                          </div>
                          
                          {/* Buffs */}
                          <div className="absolute top-1 right-1 z-20 flex flex-col items-end gap-1 pointer-events-none">
                             {renderBuffs(p.buffs)}
                          </div>

                          {/* ATB */}
                          <div className="h-1.5 w-full bg-emerald-950 relative z-20"><div className="h-full bg-emerald-500 transition-all duration-100 ease-linear origin-left" style={{ width: `${Math.min(100, atb)}%` }} /></div>

                          {/* Bars */}
                          <div className="bg-[#0a0a0a] border-t-2 border-emerald-900/30 relative z-20 flex flex-col w-full">
                             <div className="w-full bg-red-950 h-4 md:h-6 relative border-b border-black/50">
                                <div className="absolute inset-0 bg-red-600 transition-all duration-300" style={{ width: `${(p.hp / stats.maxHp) * 100}%` }} />
                                <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-xs font-black text-white drop-shadow-md tracking-wider z-10">{p.hp}/{stats.maxHp}</div>
                             </div>
                             <div className="w-full bg-blue-950 h-4 md:h-6 relative">
                                <div className="absolute inset-0 bg-blue-500 transition-all duration-300" style={{ width: `${(p.mp / stats.maxMp) * 100}%` }} />
                                <div className="absolute inset-0 flex items-center justify-center text-[8px] md:text-xs font-black text-white drop-shadow-md tracking-wider z-10">{p.mp}/{stats.maxMp}</div>
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>

              {/* INTELLIGENT COMPACT ACTION MENU */}
              <div className="w-48 md:w-80 flex flex-col gap-2 shrink-0 border-l-2 border-emerald-900 pl-4 h-full">
                 {renderActionMenu()}
              </div>
           </div>

           {/* Log View (Compact) */}
           <div className="mt-2 h-20 shrink-0 overflow-y-auto custom-scrollbar border-t-2 border-emerald-900 pt-2 bg-black text-[9px] md:text-xs font-mono opacity-80">
              {logs.slice(-10).reverse().map((log, i) => (
                 <div key={i} className={`mb-0.5 ${log.type === 'damage' ? 'text-red-400' : log.type === 'heal' ? 'text-green-400' : 'text-emerald-500'}`}>
                    {'>'} {log.text}
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BattleScreen;
