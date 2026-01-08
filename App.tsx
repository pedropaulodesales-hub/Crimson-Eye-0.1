
import React, { useState, useEffect, useCallback, useRef, ErrorInfo, ReactNode } from 'react';
import { 
  Direction, Position, Player, Enemy, GameState, LogMessage, Item, DerivedStats, Skill, ItemType, ItemRarity, ItemMod, Buff, CombatResult, ClassDefinition
} from './types';
import { ITEMS, MATERIALS, ENEMIES, CLASSES, MOD_POOL, generateDungeon, MERCHANT_AVATAR, AVATAR_TRAVELER } from './constants';
import DungeonRenderer from './components/DungeonRenderer';
import BattleScreen, { AnimationType, FloatingText } from './components/BattleScreen';
import InventoryScreen from './components/InventoryScreen';
import MerchantScreen from './components/MerchantScreen';
import SkillScreen from './components/SkillScreen';
import Minimap from './components/Minimap';
import CharacterCard from './components/CharacterCard';
import BattleTransition from './components/BattleTransition';
import VictoryTransition from './components/VictoryTransition';
import FloorTransition from './components/FloorTransition';
import LoreCutscene from './components/LoreCutscene';
import MerchantConversation from './components/MerchantConversation';
import { sounds } from './soundManager';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declare props to satisfy TypeScript
  declare props: Readonly<ErrorBoundaryProps>;

  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-red-500 font-mono p-8 text-center border-4 border-red-900">
          <h1 className="text-4xl font-bold mb-4">CRITICAL FAILURE</h1>
          <p className="mb-4">The dungeon collapsed.</p>
          <pre className="text-xs bg-red-950/20 p-4 rounded border border-red-900 max-w-full overflow-auto text-left">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-8 px-6 py-2 border border-red-500 hover:bg-red-900 text-white uppercase"
          >
            Restart Sequence
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ATB_MAX = 100;
const ATB_TICK_RATE = 50; // ms

const GameContent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [party, setParty] = useState<Player[]>([]);
  const [creatingParty, setCreatingParty] = useState<ClassDefinition[]>([]);
  const [activeEnemies, setActiveEnemies] = useState<Enemy[]>([]);
  const [creationPhase, setCreationPhase] = useState<'SELECTING' | 'CONFIRMING'>('SELECTING');
  
  // Transition States
  const [isBattleTransition, setIsBattleTransition] = useState(false);
  const [isVictoryTransition, setIsVictoryTransition] = useState(false);
  const [isFloorTransition, setIsFloorTransition] = useState(false);
  const [isDescending, setIsDescending] = useState(false);

  // Inventory State
  const [sharedInventory, setSharedInventory] = useState<Item[]>([]);
  const [materialsPouch, setMaterialsPouch] = useState<Item[]>([]);
  const [selectedInventoryChar, setSelectedInventoryChar] = useState(0);

  // Merchant State
  const [merchantInventory, setMerchantInventory] = useState<Item[]>([]);
  const [showMerchantPrompt, setShowMerchantPrompt] = useState(false);
  const [showMerchantIntro, setShowMerchantIntro] = useState(false);
  const [hasMetMerchant, setHasMetMerchant] = useState(false);

  // Traveler State
  const [showTravelerDialog, setShowTravelerDialog] = useState(false);

  // Quick Action State (Explore HUD)
  const [quickActionTargeting, setQuickActionTargeting] = useState<{type: 'item'|'skill', sourceIndex?: number, item?: Item, skill?: Skill} | null>(null);

  // Dungeon State
  const [dungeonFloors, setDungeonFloors] = useState<number[][][]>([]);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [currentPos, setCurrentPos] = useState<Position>({ x: 1, y: 1 });
  // Start facing SOUTH (2) to see the guaranteed merchant immediately
  const [currentDir, setCurrentDir] = useState<Direction>(Direction.SOUTH);
  const [explored, setExplored] = useState<Record<number, Set<string>>>({});

  // ATB / Combat State
  const [atbValues, setAtbValues] = useState<Record<string, number>>({});
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [actingId, setActingId] = useState<string | null>(null); // For visual animation
  const [impactIds, setImpactIds] = useState<string[]>([]); // For visual animation
  const [currentAnim, setCurrentAnim] = useState<AnimationType>('physical');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  // Targeting
  const [targetIndex, setTargetIndex] = useState(0);
  const [allyTargetIndex, setAllyTargetIndex] = useState(0);

  const [gold, setGold] = useState(100); 
  const [skeletonSprite, setSkeletonSprite] = useState<string | null>(null);
  const [merchantSprite, setMerchantSprite] = useState<string | null>(MERCHANT_AVATAR);
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // Refs for logs
  const logEndRefDesktop = useRef<HTMLDivElement>(null);
  const logEndRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRefDesktop.current?.scrollIntoView({ behavior: "smooth" });
    logEndRefMobile.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const atbTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Refs for State Access inside Interval/Async closures
  const partyRef = useRef(party);
  const enemiesRef = useRef(activeEnemies);
  
  useEffect(() => {
    partyRef.current = party;
    enemiesRef.current = activeEnemies;
  }, [party, activeEnemies]);

  // Music Management
  useEffect(() => {
    try {
      if (gameState === 'EXPLORE' || gameState === 'COMBAT') {
        sounds.playMusic(currentFloor);
      } else if (gameState === 'TITLE' || gameState === 'DEATH' || gameState === 'LORE') {
        sounds.stopMusic();
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }, [gameState, currentFloor]);

  const generateRandomItem = (base: Item, levelFactor: number = 1): Item => {
    if (base.type === 'consumable' || base.type === 'material') return { ...base, rarity: 'NORMAL', mods: [] };
    const roll = Math.random() * 100;
    let rarity: ItemRarity = 'NORMAL';
    let modCount = 0;
    if (roll > 98) { rarity = 'UNIQUE'; modCount = 5; }
    else if (roll > 92) { rarity = 'LEGENDARY'; modCount = 4; }
    else if (roll > 80) { rarity = 'RARE'; modCount = 3; }
    else if (roll > 60) { rarity = 'MAGIC'; modCount = 2; }
    else if (roll > 40) { rarity = 'UNCOMMON'; modCount = 1; }
    const mods: ItemMod[] = [];
    const pool = [...MOD_POOL];
    for (let i = 0; i < modCount; i++) {
      if (pool.length === 0) break;
      const idx = Math.floor(Math.random() * pool.length);
      const modTemplate = pool.splice(idx, 1)[0];
      mods.push({ ...modTemplate, value: Math.floor(modTemplate.value * (1 + (levelFactor - 1) * 0.2)) });
    }
    let finalName = base.name;
    if (mods.length > 0) finalName = `${base.name} ${mods[0].name}`;
    return { ...base, name: rarity === 'UNIQUE' ? `[Unique] ${finalName}` : finalName, rarity, mods, value: Math.floor(base.value * levelFactor * (1 + modCount * 0.5)) };
  };

  const calculateDerivedStats = (ent: Player | Enemy | any): DerivedStats => {
    const equipped = [ent.weapon, ent.helm, ent.chest, ent.gloves, ent.boots, ent.accessory].filter(Boolean) as Item[];
    
    // Accumulate passive bonuses automatically based on Skill data
    const passiveBonuses: Record<string, number> = {
        str: 0, int: 0, dex: 0, vit: 0, cha: 0,
        hp: 0, mp: 0, atk: 0, def: 0, mAtk: 0, mDef: 0, 
        acc: 0, eva: 0, critChance: 0, critDamage: 0
    };

    if (ent.skillLevels && ent.skills) {
      ent.skills.forEach((skill: Skill) => {
          const level = ent.skillLevels[skill.id] || 0;
          if (level > 0 && skill.type === 'passive' && skill.passiveStat && skill.passiveVal) {
              passiveBonuses[skill.passiveStat] = (passiveBonuses[skill.passiveStat] || 0) + (skill.passiveVal * level);
          }
      });
    }

    const modValues: Record<string, number> = { str: 0, int: 0, dex: 0, vit: 0, cha: 0, atk: 0, def: 0, mAtk: 0, mDef: 0, hp: 0, mp: 0 };
    equipped.forEach(item => { item.mods?.forEach(mod => { modValues[mod.stat] = (modValues[mod.stat] || 0) + mod.value; }); });
    
    const buffValues: Record<string, number> = { str: 0, int: 0, dex: 0, vit: 0, atk: 0, def: 0, mAtk: 0, mDef: 0, acc: 0, eva: 0, critChance: 0, maxHp: 0 };
    if (ent.buffs) {
        ent.buffs.forEach((b: Buff) => {
            if (b.stat && b.type === 'buff') buffValues[b.stat] = (buffValues[b.stat] || 0) + b.value;
            if (b.stat && b.type === 'debuff') buffValues[b.stat] = (buffValues[b.stat] || 0) + b.value; 
        });
    }

    const effectiveStr = Math.max(0, ent.str + modValues.str + passiveBonuses.str + buffValues.str);
    const effectiveInt = Math.max(0, ent.int + modValues.int + passiveBonuses.int + buffValues.int);
    const effectiveDex = Math.max(0, ent.dex + modValues.dex + passiveBonuses.dex + buffValues.dex);
    const effectiveVit = Math.max(0, ent.vit + modValues.vit + passiveBonuses.vit + buffValues.vit);
    const effectiveCha = Math.max(0, ent.cha + (modValues.cha || 0) + passiveBonuses.cha + (buffValues.cha || 0));
    
    const weaponBonus = (ent.weapon?.stat || 0); 
    const armorBonus = [ent.helm, ent.chest, ent.gloves, ent.boots].reduce((sum, i) => sum + (i?.stat || 0), 0);
    const accessoryStat = (ent.accessory?.stat || 0);
    const accessoryMagic = (ent.accessory?.magicStat || 0);

    const atk = Math.floor(effectiveStr * 2) + weaponBonus + accessoryStat + modValues.atk + passiveBonuses.atk + buffValues.atk;
    const mAtk = Math.floor(effectiveInt * 2) + (ent.weapon?.magicStat || 0) + accessoryMagic + modValues.mAtk + passiveBonuses.mAtk + buffValues.mAtk;
    const def = Math.floor(effectiveVit * 1.5) + armorBonus + modValues.def + passiveBonuses.def + buffValues.def;
    const mDef = Math.floor(effectiveInt * 1.0) + accessoryMagic + modValues.mDef + passiveBonuses.mDef + buffValues.mDef;
    
    const acc = Math.min(99, Math.floor(85 + (effectiveDex * 0.5) + passiveBonuses.acc + buffValues.acc));
    const eva = Math.min(75, Math.floor(effectiveDex * 0.8) + passiveBonuses.eva + buffValues.eva);
    const critChance = Math.min(80, Math.floor(effectiveDex * 0.5) + passiveBonuses.critChance + (buffValues.critChance || 0));
    const critDamage = 150 + (effectiveStr * 2) + passiveBonuses.critDamage;

    const baseMaxHp = ent.maxHp ?? ent.hp; 
    const baseMaxMp = ent.maxMp ?? ent.mp;
    const maxHp = baseMaxHp + modValues.hp + passiveBonuses.hp + (buffValues.maxHp || 0);
    const maxMp = baseMaxMp + modValues.mp + passiveBonuses.mp;

    return { 
        effectiveStr, effectiveInt, effectiveDex, effectiveVit, effectiveCha,
        atk, mAtk, def, mDef, acc, eva, critChance, critDamage, maxHp, maxMp 
    };
  };

  const updateExploration = useCallback((p: Position, f: number) => {
    setExplored(prev => {
      const current = new Set(prev[f] || []);
      let changed = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const key = `${p.x + dx},${p.y + dy}`;
          if (!current.has(key)) { current.add(key); changed = true; }
        }
      }
      return changed ? { ...prev, [f]: current } : prev;
    });
  }, []);

  useEffect(() => {
    if (gameState === 'EXPLORE') updateExploration(currentPos, currentFloor);
  }, [currentPos, currentFloor, gameState, updateExploration]);

  // Sprite fetching logic 
  useEffect(() => {
    const fetchSprites = async () => {
      try {
          const skelCached = localStorage.getItem('skeleton_sprite_v4');
          if (skelCached) setSkeletonSprite(skelCached);
      } catch (e) {
          console.warn("Local storage access failed", e);
      }
    };
    fetchSprites();
  }, []);

  const addLog = (text: string, type: LogMessage['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-49), { text, type }]);
  };

  const spawnFloatingText = (id: string, text: string, type: FloatingText['type']) => {
      const ft: FloatingText = { id, text, type, key: Date.now() + Math.random() };
      setFloatingTexts(prev => [...prev, ft]);
      setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.key !== ft.key));
      }, 1000);
  };

  const startAtbClock = useCallback(() => {
    if (atbTimerRef.current) return;
    atbTimerRef.current = setInterval(() => {
      setAtbValues(prev => {
        const next = { ...prev };
        let triggeredId: string | null = null;
        
        partyRef.current.forEach(p => {
          if (p.hp > 0 && !triggeredId) {
            const fillRate = 1.0 + (p.dex * 0.1);
            next[p.id] = Math.min(ATB_MAX, (next[p.id] || 0) + fillRate);
            if (next[p.id] >= ATB_MAX) triggeredId = p.id;
          }
        });
        
        enemiesRef.current.forEach(e => {
          if (e.hp > 0 && !triggeredId) {
            const fillRate = 1.0 + (e.dex * 0.1);
            next[e.instanceId] = Math.min(ATB_MAX, (next[e.instanceId] || 0) + fillRate);
            if (next[e.instanceId] >= ATB_MAX) triggeredId = e.instanceId;
          }
        });

        if (triggeredId) { 
            stopAtbClock(); 
            handleTurn(triggeredId); 
        }
        return next;
      });
    }, ATB_TICK_RATE);
  }, []);

  const stopAtbClock = () => { 
      if (atbTimerRef.current) { 
          clearInterval(atbTimerRef.current); 
          atbTimerRef.current = null; 
      } 
  };

  // ... (keeping applyDotEffects, handleTurn, executeEnemyTurn, resetAtb, spawnEnemies, move, turn, checkSquare, generateMerchantStock, handleAttack, handleDefend, handleSkill, handleVictory, handleEquip, handleUnequip, handleUseItem as is, just need to update where handleUpgradeSkill is)

  const applyDotEffects = (entity: Player | Enemy): { newHp: number, isDead: boolean, activeBuffs: Buff[] } => {
      let newHp = entity.hp;
      let tookDamage = false;
      
      const activeBuffs = entity.buffs.map(b => ({...b, duration: b.duration - 1})).filter(b => b.duration > 0);
      const expired = entity.buffs.filter(b => !activeBuffs.find(ab => ab.id === b.id));
      expired.forEach(b => addLog(`${b.name} faded from ${entity.name || 'Hero'}.`, 'info'));

      entity.buffs.forEach(b => {
          if (b.id === 'poison' || b.id === 'burn') {
              const dmg = Math.max(1, Math.floor(entity.maxHp * 0.05));
              newHp -= dmg;
              tookDamage = true;
              addLog(`${entity.name || (entity as Player).class} takes ${dmg} ${b.name} damage.`, 'damage');
              const id = (entity as any).instanceId || (entity as any).id;
              spawnFloatingText(id, `-${dmg}`, 'damage');
          }
      });

      if (tookDamage) sounds.playEffect('hit');
      
      return { newHp: Math.max(0, newHp), isDead: newHp <= 0, activeBuffs };
  };

  const handleTurn = (id: string) => {
    setActingId(null); 

    const isPlayer = id.startsWith('hero');
    let isDead = false;
    
    if (isPlayer) {
        let currentPlayer = partyRef.current.find(p => p.id === id);
        if (currentPlayer) {
            const res = applyDotEffects(currentPlayer); 
            isDead = res.isDead;
            setParty(prev => prev.map(p => p.id === id ? { ...p, hp: res.newHp, buffs: res.activeBuffs } : p));
            
            if (isDead) {
                const allDead = partyRef.current.every(p => p.id === id ? true : p.hp <= 0); 
                if (allDead) { setGameState('DEATH'); return; }
            }
        }
    } else {
        let currentEnemy = enemiesRef.current.find(e => e.instanceId === id);
        if (currentEnemy) {
            const res = applyDotEffects(currentEnemy);
            isDead = res.isDead;
            setActiveEnemies(prev => prev.map(e => e.instanceId === id ? { ...e, hp: res.newHp, buffs: res.activeBuffs } : e));
            
            if (isDead) {
                const finalEnemies = enemiesRef.current.map(e => e.instanceId === id ? { ...e, hp: 0 } : e);
                const remaining = finalEnemies.filter(e => e.instanceId !== id && e.hp > 0);
                if (remaining.length === 0) {
                     handleVictory(finalEnemies);
                     return;
                }
            }
        }
    }

    if (isDead) {
        setActingId(null);
        setTimeout(startAtbClock, 500);
        return;
    }

    if (isPlayer) {
        const pIndex = partyRef.current.findIndex(p => p.id === id);
        if (pIndex !== -1) {
             setActingId(null); 
             setActiveCharIndex(pIndex);
        }
    } else {
        setActiveCharIndex(null); 
        setActingId(id); 
        setTimeout(() => executeEnemyTurn(id), 500);
    }
  };

  const executeEnemyTurn = (enemyId: string) => {
    const enemy = enemiesRef.current.find(e => e.instanceId === enemyId);
    if (!enemy || enemy.hp <= 0) {
        setActingId(null);
        startAtbClock();
        return;
    }

    const alivePartyIndices = partyRef.current.map((p, i) => p.hp > 0 ? i : -1).filter(i => i !== -1);
    if (alivePartyIndices.length === 0) { setGameState('DEATH'); return; }
    
    const enemyStats = calculateDerivedStats(enemy);
    const partyStats = partyRef.current.map(p => calculateDerivedStats(p));
    
    const lowestHpIdx = alivePartyIndices.reduce((acc, curr) => 
      (partyRef.current[curr].hp / partyStats[curr].maxHp < partyRef.current[acc].hp / partyStats[acc].maxHp) ? curr : acc, alivePartyIndices[0]);
    
    let targetIdx = alivePartyIndices[Math.floor(Math.random() * alivePartyIndices.length)];
    if (Math.random() < 0.4) targetIdx = lowestHpIdx;

    const target = partyRef.current[targetIdx];
    const targetStats = partyStats[targetIdx];
    const isDefending = target.buffs.some(b => b.id.startsWith('posture_'));

    setAtbValues(prev => ({ ...prev, [enemyId]: 0 }));
    
    setCurrentAnim('physical');
    setImpactIds([target.id]);
    setTimeout(() => setImpactIds([]), 400);

    if (Math.random() * 100 < targetStats.eva) {
      addLog(`💨 MISS! ${target.class} dodged ${enemy.name}'s strike!`, 'miss');
      spawnFloatingText(target.id, "MISS", "miss");
      sounds.playEffect('miss');
    } else {
      let dmg = Math.max(1, (enemyStats.atk || (enemy.str * 2)) - Math.floor(targetStats.def * 0.5));
      
      const isEnemyCrit = Math.random() < 0.05;
      if (isEnemyCrit) {
        dmg = Math.floor(dmg * 1.5);
        addLog(`👹 CRITICAL! ${enemy.name} brutally rends ${target.class} for ${dmg} damage!`, 'enemy_action');
      } else {
        addLog(`👹 ${enemy.name} strikes ${target.class} for ${dmg} damage!`, 'enemy_action');
      }
      
      if (isDefending) {
          dmg = Math.floor(dmg * 0.5);
          addLog("🛡️ Attack blocked!", 'info');
          spawnFloatingText(target.id, "BLOCK", "block");
          setTimeout(() => {
             spawnFloatingText(target.id, `-${dmg}`, "damage");
          }, 300);
      } else {
          spawnFloatingText(target.id, `-${dmg}`, isEnemyCrit ? "crit" : "damage");
      }

      setParty(prev => {
        const next = [...prev];
        if (next[targetIdx]) {
            next[targetIdx] = { ...next[targetIdx], hp: Math.max(0, next[targetIdx].hp - dmg) };
        }
        return next;
      });
      
      sounds.playEffect('hit');
      if (target.hp - dmg <= 0) addLog(`💀 ${target.class} has fallen!`, 'combat');
    }
    
    setTimeout(() => {
        setActingId(null);
        startAtbClock();
    }, 600);
  };

  const resetAtb = (id: string) => { 
      setAtbValues(prev => ({ ...prev, [id]: 0 })); 
      setActiveCharIndex(null); 
      setActingId(null);
      startAtbClock(); 
  };

  const spawnEnemies = () => {
    const enemyCount = Math.floor(Math.random() * 2) + 2;
    // Fix: strictly only Level 1 monsters on Floor 1 (index 0)
    // For other floors, scale normally (floor + 1)
    const potential = ENEMIES.filter(e => currentFloor === 0 ? e.level === 1 : e.level <= currentFloor + 1);
    
    const newEnemies: Enemy[] = [];
    const newAtb: Record<string, number> = {};
    for (let i = 0; i < enemyCount; i++) {
      const template = potential[Math.floor(Math.random() * potential.length)];
      const instId = `enemy-${Date.now()}-${i}`;
      newEnemies.push({
        ...template, 
        instanceId: instId,
        hp: template.maxHp,
        maxHp: template.maxHp,
        mp: template.maxMp,
        maxMp: template.maxMp,
        buffs: []
      });
      newAtb[instId] = Math.random() * 30;
    }
    party.forEach(p => newAtb[p.id] = Math.random() * 40);
    setAtbValues(newAtb);
    setActiveEnemies(newEnemies);
    addLog(`⚔️ ENCOUNTER! Monsters emerge from the shadows.`, 'combat');
    
    // Play Battle Transition instead of direct state switch
    sounds.playEffect('encounter');
    setIsBattleTransition(true);
  };

  const move = useCallback((dirMod: number) => {
    if (gameState !== 'EXPLORE' || isBattleTransition || isVictoryTransition || showMerchantIntro || showMerchantPrompt || showTravelerDialog) return;
    const vecs = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
    const vec = vecs[currentDir];
    const nx = currentPos.x + vec.x * -dirMod;
    const ny = currentPos.y + vec.y * -dirMod;
    if (!dungeonFloors[currentFloor]) return;
    const currentMap = dungeonFloors[currentFloor];
    // Allow moving into 0 (Empty), 3 (Stairs), 4 (Chest), 5 (Merchant), 9 (Fake Wall)
    // 2 (NPC) and 6 (Traveler) might be blocking or interactable based on logic, let's treat them as passable or trigger on step?
    // Current logic blocks '1'.
    if (ny < 0 || ny >= currentMap.length || nx < 0 || nx >= currentMap[0].length || currentMap[ny][nx] === 1) return;
    
    // Handle Secret Wall Entry
    if (currentMap[ny][nx] === 9) {
        const isAlreadyExplored = explored[currentFloor]?.has(`${nx},${ny}`);
        if (!isAlreadyExplored) {
            sounds.playEffect('secret');
            addLog("👁️ You stepped through an illusion!", 'info');
        } else {
            sounds.playEffect('move');
        }
    } else {
        sounds.playEffect('move');
    }

    setCurrentPos({ x: nx, y: ny });
    checkSquare(nx, ny);
  }, [gameState, currentDir, currentFloor, currentPos, dungeonFloors, explored, isBattleTransition, isVictoryTransition, showMerchantIntro, showMerchantPrompt, showTravelerDialog]);

  const turn = useCallback((rot: number) => {
    if (gameState !== 'EXPLORE' || isBattleTransition || isVictoryTransition || showMerchantIntro || showMerchantPrompt || showTravelerDialog) return;
    sounds.playEffect('turn');
    setCurrentDir((currentDir + rot + 4) % 4);
  }, [gameState, currentDir, isBattleTransition, isVictoryTransition, showMerchantIntro, showMerchantPrompt, showTravelerDialog]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState !== 'EXPLORE') return;
        
        switch(e.key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                move(-1); // Forward
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                move(1); // Backward
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                turn(-1); // Left
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                turn(1); // Right
                break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, move, turn]);

  const checkSquare = (x: number, y: number) => {
    if (!dungeonFloors[currentFloor]) return;
    const currentMap = dungeonFloors[currentFloor];
    const tile = currentMap[y][x];
    if (tile === 4) {
      sounds.playEffect('loot');
      const baseItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const rolledItem = generateRandomItem(baseItem, 1 + currentFloor * 0.2);
      setSharedInventory(prev => [...prev, rolledItem]);
      const goldRoll = 25 + Math.floor(Math.random() * 25);
      setGold(g => g + goldRoll);
      addLog(`💰 Found ${rolledItem.name} and ${goldRoll} gold coins!`, 'loot');
      const newFloors = [...dungeonFloors];
      const newMap = [...newFloors[currentFloor]];
      const newRow = [...newMap[y]];
      newRow[x] = 0;
      newMap[y] = newRow;
      newFloors[currentFloor] = newMap;
      setDungeonFloors(newFloors);
    } else if (tile === 3) {
      sounds.playEffect('stairs');
      if (currentFloor + 1 >= dungeonFloors.length) {
          addLog(`🏆 You have conquered the final floor! Returning to surface...`, 'combat');
          setTimeout(() => setGameState('TITLE'), 3000);
      } else { 
          // Trigger visual transition before changing floor data
          setIsFloorTransition(true);
      }
    } else if (tile === 5) {
      // Check for first meeting on Floor 1 (index 0)
      if (currentFloor === 0 && !hasMetMerchant) {
        setShowMerchantIntro(true);
      } else {
        setShowMerchantPrompt(true);
      }
    } else if (tile === 6) {
        // Traveler NPC
        setShowTravelerDialog(true);
    } else if (Math.random() < 0.18) spawnEnemies(); 
  };

  const generateMerchantStock = () => {
    const levels = party.map(p => p.level);
    levels.sort((a, b) => a - b);
    const medianLevel = levels[Math.floor(levels.length / 2)];
    const levelFactor = 1.25 + (medianLevel - 1) * 0.25; 
    const stock: Item[] = [];
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const base = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const item = generateRandomItem(base, levelFactor);
      stock.push(item);
    }
    setMerchantInventory(stock);
  };

  // ... (keeping existing battle logic)
  const handleAttack = () => {
    if (activeCharIndex === null || actingId) return;
    const attacker = party[activeCharIndex];
    let effectiveTargetIndex = targetIndex;
    let target = activeEnemies[effectiveTargetIndex];
    
    // --- TARGET REDIRECTION LOGIC (Handle Attack) ---
    if (!target || target.hp <= 0) {
         effectiveTargetIndex = activeEnemies.findIndex(e => e.hp > 0);
         if (effectiveTargetIndex !== -1) {
             setTargetIndex(effectiveTargetIndex);
             target = activeEnemies[effectiveTargetIndex];
         } else return;
    }
    // ------------------------------------------------

    setActingId(attacker.id);
    setCurrentAnim('physical');
    setImpactIds([target.instanceId]);
    setTimeout(() => setImpactIds([]), 400);
    setTimeout(() => {
        const stats = calculateDerivedStats(attacker);
        const targetStats = calculateDerivedStats(target);
        addLog(`⚔️ ${attacker.class} strikes at ${target.name}...`, 'player_action');
        if (Math.random() * 100 > stats.acc) {
          sounds.playEffect('miss');
          addLog(`💨 MISS! The attack whistled past the target.`, 'miss');
          spawnFloatingText(target.instanceId, "MISS", "miss");
        } else {
          let dmg = Math.max(1, stats.atk - Math.floor(targetStats.def * 0.5));
          const isCrit = Math.random() * 100 < stats.critChance;
          if (isCrit) {
            dmg = Math.floor(dmg * (stats.critDamage / 100));
            sounds.playEffect('crit');
            addLog(`🌟 CRITICAL HIT! 💥 ${target.name} is devastated for ${dmg} damage!`, 'crit');
            spawnFloatingText(target.instanceId, `-${dmg}`, "crit");
          } else {
            sounds.playEffect('attack');
            addLog(`💥 ${target.name} takes ${dmg} damage.`, 'damage');
            spawnFloatingText(target.instanceId, `-${dmg}`, "damage");
          }
          const currentEnemies = enemiesRef.current;
          const newEnemies = currentEnemies.map(e => e.instanceId === target.instanceId ? { ...e, hp: Math.max(0, e.hp - dmg) } : e);
          setActiveEnemies(newEnemies);
          if (newEnemies.filter(e => e.hp > 0).length === 0) { 
              handleVictory(newEnemies); 
              return; 
          }
        }
        resetAtb(attacker.id);
    }, 400);
  };

  const handleDefend = () => {
    if (activeCharIndex === null || actingId) return;
    const defender = party[activeCharIndex];
    setActingId(defender.id);
    const defBuff: Buff = { id: 'posture_def', name: 'Defending', type: 'buff', stat: 'def', value: 50, duration: 1 };
    const mDefBuff: Buff = { id: 'posture_mdef', name: 'Defending', type: 'buff', stat: 'mDef', value: 50, duration: 1 };
    setCurrentAnim('defend');
    setImpactIds([defender.id]);
    setTimeout(() => setImpactIds([]), 400);
    setTimeout(() => {
        setParty(prev => prev.map((p, i) => {
            if (i === activeCharIndex) {
                const otherBuffs = p.buffs.filter(b => !b.id.startsWith('posture_'));
                return { ...p, buffs: [...otherBuffs, defBuff, mDefBuff] };
            }
            return p;
        }));
        sounds.playEffect('skill');
        addLog(`🛡️ ${defender.class} adopts a defensive stance.`, 'player_action');
        spawnFloatingText(defender.id, "DEFEND", "block");
        resetAtb(defender.id);
    }, 400);
  };

  const handleSkill = (skill: Skill, explicitTargetIndex?: number) => {
    if (activeCharIndex === null || actingId) return;
    
    // --- TARGET REDIRECTION LOGIC (Handle Skill) ---
    let effectiveTargetIndex = targetIndex;
    if (skill.targetType === 'enemy' && !skill.isAoe) {
        if (explicitTargetIndex !== undefined) {
            effectiveTargetIndex = explicitTargetIndex;
        } else {
            const currentTarget = activeEnemies[effectiveTargetIndex];
            if (!currentTarget || currentTarget.hp <= 0) {
                 const aliveIdx = activeEnemies.findIndex(e => e.hp > 0);
                 if (aliveIdx !== -1) {
                     effectiveTargetIndex = aliveIdx;
                     setTargetIndex(aliveIdx);
                 } else {
                     return;
                 }
            }
        }
    }
    // ----------------------------------------------

    const attacker = party[activeCharIndex];
    const stats = calculateDerivedStats(attacker);
    const skillLevel = attacker.skillLevels[skill.id] || 0; 
    if (skillLevel <= 0) {
      addLog(`${attacker.class} has not learned ${skill.name} yet!`, 'miss');
      return;
    }
    setActingId(attacker.id);
    const levelPowerMult = 1 + (skillLevel - 1) * 0.2;
    sounds.playEffect('skill');
    addLog(`🔥 ${attacker.class} uses skill: ${skill.name} (Lv.${skillLevel})!`, 'player_action');
    setParty(prev => prev.map(m => m.id === attacker.id ? { ...m, mp: m.mp - skill.cost } : m));
    let targetIds: string[] = [];
    if (skill.targetType === 'enemy') {
        if (skill.isAoe) targetIds = enemiesRef.current.filter(e => e.hp > 0).map(e => e.instanceId);
        else targetIds = [activeEnemies[effectiveTargetIndex]?.instanceId].filter(Boolean);
    } else {
        if (skill.isAoe) targetIds = party.filter(p => p.hp > 0).map(p => p.id);
        else targetIds = [party[explicitTargetIndex !== undefined ? explicitTargetIndex : allyTargetIndex]?.id || attacker.id];
    }
    setImpactIds(targetIds);
    setTimeout(() => setImpactIds([]), 500);
    setTimeout(() => {
        if (skill.targetType === 'enemy') {
            setCurrentAnim(skill.id === 'w_cleave' || skill.id === 'r_dage' ? 'physical' : 'magical');
            const currentEnemies = enemiesRef.current;
            const newEnemies = [...currentEnemies]; 
            targetIds.forEach(tid => {
                const targetIdx = newEnemies.findIndex(e => e.instanceId === tid);
                if (targetIdx === -1) return;
                const oldTarget = newEnemies[targetIdx];
                const power = (skill.basePower || 1.0) * levelPowerMult;
                let dmg = 0;
                
                if (skill.id === 'r_gold') {
                    dmg = 5 + Math.floor(stats.effectiveDex * 0.5); // Minor damage
                    
                    // --- STEAL MECHANIC ---
                    if (!oldTarget.stolenFrom) {
                        const stealChance = 25 + (stats.effectiveDex * 2);
                        const roll = Math.random() * 100;
                        if (roll < stealChance) {
                             const baseItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
                             const item = generateRandomItem(baseItem, 1 + currentFloor * 0.2);
                             setSharedInventory(prev => [...prev, item]);
                             newEnemies[targetIdx] = { ...newEnemies[targetIdx], stolenFrom: true };
                             
                             addLog(`🖐️ ${attacker.class} stole ${item.name} from ${oldTarget.name}!`, 'loot');
                             spawnFloatingText(tid, "ITEM STOLEN!", "crit");
                             sounds.playEffect('loot');
                        } else {
                             addLog(`Failed to steal item from ${oldTarget.name}.`, 'miss');
                             spawnFloatingText(tid, "STEAL FAILED", "miss");
                        }
                    } else {
                        addLog(`${oldTarget.name} has empty pockets.`, 'miss');
                        spawnFloatingText(tid, "EMPTY", "miss");
                    }

                    const goldStolen = 10 * skillLevel + Math.floor(Math.random() * 10);
                    setGold(g => g + goldStolen);
                    spawnFloatingText(attacker.id, `+${goldStolen}G`, "loot");
                    // ----------------------

                } else if (skill.id === 'b_blood') {
                    dmg = Math.floor(stats.atk * power);
                    spawnFloatingText(attacker.id, `+${Math.floor(dmg * 0.3)}`, "heal");
                } else {
                    dmg = skill.type === 'attack' ? Math.floor(stats.atk * power) : Math.floor(stats.mAtk * power);
                }
                
                if (skill.id === 'w_bash') {
                    setAtbValues(prev => ({...prev, [tid]: Math.max(0, (prev[tid] || 0) - 30)}));
                } else if (skill.id === 'r_pois') {
                    const newBuffs = [...oldTarget.buffs.filter(b => b.id !== 'poison'), { id: 'poison', name: 'Poison', type: 'debuff', stat: 'def', value: -5, duration: 3 } as Buff];
                    newEnemies[targetIdx] = { ...newEnemies[targetIdx], buffs: newBuffs };
                } else if (skill.id === 'a_fire') {
                    const newBuffs = [...oldTarget.buffs.filter(b => b.id !== 'burn'), { id: 'burn', name: 'Burn', type: 'debuff', stat: 'def', value: -10, duration: 2 } as Buff];
                    newEnemies[targetIdx] = { ...newEnemies[targetIdx], buffs: newBuffs };
                }
                const newHp = Math.max(0, newEnemies[targetIdx].hp - dmg);
                newEnemies[targetIdx] = { ...newEnemies[targetIdx], hp: newHp };
                spawnFloatingText(tid, `-${dmg}`, "damage");
            });
            setActiveEnemies(newEnemies);
            if (skill.id === 'b_blood') {
                 const dmg = Math.floor(stats.atk * (skill.basePower||1) * levelPowerMult);
                 setParty(prev => prev.map(p => p.id === attacker.id ? {...p, hp: Math.min(stats.maxHp, p.hp + Math.floor(dmg * 0.3))} : p));
            }
            if (newEnemies.filter(e => e.hp > 0).length === 0) {
                 handleVictory(newEnemies);
                 return;
            }
        } else {
            setCurrentAnim(skill.type === 'heal' ? 'heal' : 'magical');
            setParty(prev => prev.map(p => {
                if (!targetIds.includes(p.id)) return p;
                const pStats = calculateDerivedStats(p);
                
                // REVIVE LOGIC CHECK
                if ((skill as any).revive) {
                    if (p.hp > 0) return p; // Can't revive living
                    const healAmt = Math.floor(pStats.maxHp * 0.3); // 30% HP revive
                    spawnFloatingText(p.id, `REVIVE`, "heal");
                    return { ...p, hp: healAmt, buffs: [] }; // Reset buffs on revive
                }

                if (p.hp <= 0) return p; // Normal heals don't work on dead

                if (skill.type === 'heal' || skill.id === 'm_surge') {
                    if (skill.id === 'm_surge') {
                        spawnFloatingText(p.id, `+${15 * skillLevel} MP`, "heal");
                        return { ...p, mp: Math.min(pStats.maxMp, p.mp + (15 * skillLevel)) };
                    } else {
                        const healAmt = Math.floor((skill.type === 'heal' ? attacker.int * 1.5 : 0) * levelPowerMult);
                        spawnFloatingText(p.id, `+${healAmt}`, "heal");
                        return { ...p, hp: Math.min(pStats.maxHp, p.hp + healAmt) };
                    }
                } else if (skill.type === 'buff') {
                    let newBuffs = [...p.buffs];
                    let buffsToAdd: Buff[] = [];
                    if (skill.id === 'w_sw') buffsToAdd.push({ id: 'w_sw', name: 'Shield Wall', type: 'buff', stat: 'def', value: Math.floor(pStats.def * 0.5), duration: 3 });
                    if (skill.id === 'm_shld') buffsToAdd.push({ id: 'm_shld', name: 'Mana Shield', type: 'buff', stat: 'mDef', value: Math.floor(pStats.mDef * 0.5), duration: 3 });
                    if (skill.id === 'c_bless') buffsToAdd.push({ id: 'c_bless_s', name: 'Blessing', type: 'buff', stat: 'str', value: Math.ceil(p.str * 0.2), duration: 3 });
                    if (skill.id === 'b_shout') buffsToAdd.push({ id: 'b_shout', name: 'War Cry', type: 'buff', stat: 'atk', value: Math.floor(stats.atk * 0.2 * levelPowerMult), duration: 3 });
                    if (skill.id === 'a_eye') buffsToAdd.push({ id: 'a_eye', name: 'Eagle Eye', type: 'buff', stat: 'critChance', value: 20, duration: 3 });
                    if (skill.id === 'r_inv') buffsToAdd.push({ id: 'r_inv', name: 'Vanish', type: 'buff', stat: 'eva', value: 30, duration: 2 });
                    if (skill.id === 'b_endure') { 
                        buffsToAdd.push({ id: 'b_endure', name: 'Endure', type: 'buff', stat: 'vit', value: Math.ceil(p.vit * 0.5), duration: 3 });
                        p.hp += 50; 
                    }
                    buffsToAdd.forEach(newB => {
                        newBuffs = newBuffs.filter(b => b.id !== newB.id);
                        newBuffs.push(newB);
                    });
                    spawnFloatingText(p.id, "BUFF", "block");
                    return { ...p, buffs: newBuffs };
                }
                return p;
            }));
        }
        resetAtb(attacker.id);
    }, 500);
  };

  const handleCastSkillOutCombat = (casterIndex: number, targetIndex: number, skill: Skill) => {
      const caster = party[casterIndex];
      const target = party[targetIndex];
      const level = caster.skillLevels[skill.id] || 0;
      const powerMult = 1 + (level - 1) * 0.2;
      const targetStats = calculateDerivedStats(target);

      // Check MP
      if (caster.mp < skill.cost) {
          addLog(`${caster.class} doesn't have enough MP!`, 'miss');
          sounds.playEffect('miss');
          return;
      }

      // Check Revive condition
      if ((skill as any).revive) {
          if (target.hp > 0) {
              addLog(`${target.class} is already alive!`, 'miss');
              return;
          }
      } else if (skill.type === 'heal' && target.hp <= 0) {
          addLog(`${target.class} is dead! Cannot heal.`, 'miss');
          return;
      }

      // Apply Effect
      setParty(prev => {
          const next = [...prev];
          const c = next[casterIndex];
          const t = next[targetIndex];
          c.mp -= skill.cost;

          if ((skill as any).revive) {
              const healAmt = Math.floor(targetStats.maxHp * 0.3);
              t.hp = healAmt;
              t.buffs = []; // Clear death state/buffs
              addLog(`${caster.class} revives ${target.class}!`, 'heal');
              sounds.playEffect('heal');
          } else if (skill.type === 'heal') {
              const healAmt = Math.floor(caster.int * 1.5 * powerMult);
              t.hp = Math.min(targetStats.maxHp, t.hp + healAmt);
              addLog(`${caster.class} heals ${target.class} for ${healAmt} HP.`, 'heal');
              sounds.playEffect('heal');
          } else if (skill.id === 'm_surge') {
              const mpAmt = Math.floor(15 * level);
              t.mp = Math.min(targetStats.maxMp, t.mp + mpAmt);
              addLog(`${caster.class} restores ${mpAmt} MP to ${target.class}.`, 'heal');
              sounds.playEffect('heal');
          } else {
              addLog(`${caster.class} casts ${skill.name} on ${target.class}.`, 'player_action');
              sounds.playEffect('skill');
          }
          return next;
      });
  };

  const handleVictory = (finalEnemies: Enemy[]) => {
    stopAtbClock();
    setIsVictoryTransition(true);
    sounds.playEffect('victory');
    const totalXp = finalEnemies.reduce((sum, e) => sum + e.xpValue, 0);
    let totalGold = finalEnemies.reduce((sum, e) => sum + e.goldValue, 0);
    const droppedItems: Item[] = [];
    const droppedMaterials: Item[] = [];
    finalEnemies.forEach(e => {
      if (Math.random() < 0.3) { 
        const mat = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
        droppedMaterials.push({ ...mat, rarity: 'NORMAL' });
      }
      if (Math.random() < 0.15) { 
        const baseItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        droppedItems.push(generateRandomItem(baseItem, 1 + currentFloor * 0.2));
      }
      totalGold += Math.floor(Math.random() * 8);
    });
    setGold(g => g + totalGold);
    setSharedInventory(prev => [...prev, ...droppedItems]);
    setMaterialsPouch(prev => [...prev, ...droppedMaterials]);
    setParty(p => p.map(m => {
        const nextXp = m.xp + Math.floor(totalXp / 3);
        const xpToLevel = m.level * 150; 
        let leveledUp = false;
        let curXp = nextXp;
        let nextLevel = m.level;
        let skillPoints = m.skillPoints;
        if (curXp >= xpToLevel) { 
          leveledUp = true;
          nextLevel++; 
          curXp -= xpToLevel; 
          skillPoints += 1; 
          addLog(`🎊 LEVEL UP! ${m.class} reached level ${nextLevel}! +1 Skill Point.`, 'level'); 
        }
        const nextMaxHp = m.maxHp + (leveledUp ? 8 : 0); 
        return { 
            ...m, 
            xp: curXp, 
            level: nextLevel, 
            skillPoints: skillPoints,
            maxHp: nextMaxHp,
            hp: Math.min(nextMaxHp, m.hp + 2), 
            str: m.str + (leveledUp ? 1 : 0),
            vit: m.vit + (leveledUp ? 1 : 0),
            int: m.int + (leveledUp ? 1 : 0),
            dex: m.dex + (leveledUp ? 1 : 0),
            buffs: [] 
        };
    }));
    addLog(`🏆 VICTORY! Gathered ${totalGold} gold.`, 'loot');
    
    // Quick Transition
    setTimeout(() => {
        setIsVictoryTransition(false);
        setGameState('EXPLORE');
    }, 1000);
  };

  const handleEquip = (item: Item, playerIndex: number) => {
    const slot = item.type as keyof Player;
    const oldItem = (party[playerIndex] as any)[slot];
    setSharedInventory(prev => {
      let next = prev.filter(i => i !== item);
      if (oldItem) next = [...next, oldItem];
      return next;
    });
    setParty(prev => {
      const next = [...prev];
      next[playerIndex] = { ...next[playerIndex], [slot]: item };
      return next;
    });
    sounds.playEffect('loot');
  };

  const handleUnequip = (type: ItemType, playerIndex: number) => {
    const item = (party[playerIndex] as any)[type];
    if (!item) return;
    setSharedInventory(prev => [...prev, item]);
    setParty(prev => {
      const next = [...prev];
      next[playerIndex] = { ...next[playerIndex], [type]: null };
      return next;
    });
    sounds.playEffect('loot');
  };

  const handleUseItem = (item: Item, targetIndex: number) => {
    if (item.type === 'consumable') {
      setSharedInventory(prev => prev.filter(i => i !== item));
      setParty(prev => {
        const next = [...prev];
        const stats = calculateDerivedStats(next[targetIndex]); 
        next[targetIndex] = { 
          ...next[targetIndex], 
          hp: Math.min(stats.maxHp, next[targetIndex].hp + (item.stat || 0)) 
        };
        return next;
      });
      sounds.playEffect('heal');
      addLog(`🧪 Used ${item.name} on ${party[targetIndex].class}.`, 'heal');
    }
  };

  const handleQuickAction = (action: {type: 'item'|'skill', sourceIndex?: number, item?: Item, skill?: Skill}) => {
      setQuickActionTargeting(action);
  };

  const executeQuickAction = (targetIndex: number) => {
      if (!quickActionTargeting) return;
      if (quickActionTargeting.type === 'item' && quickActionTargeting.item) {
          handleUseItem(quickActionTargeting.item, targetIndex);
      } else if (quickActionTargeting.type === 'skill' && quickActionTargeting.skill && quickActionTargeting.sourceIndex !== undefined) {
          handleCastSkillOutCombat(quickActionTargeting.sourceIndex, targetIndex, quickActionTargeting.skill);
      }
      setQuickActionTargeting(null);
  };

  const getUsableSkills = (p: Player) => {
      return p.skills.filter(s => {
          const lvl = p.skillLevels[s.id] || 0;
          return lvl > 0 && ((s.type === 'heal') || ((s as any).revive) || (s.type === 'buff' && s.targetType === 'ally'));
      });
  };

  const handleAddChar = (cls: ClassDefinition) => {
    if (creatingParty.length < 3) {
      setCreatingParty(prev => {
        const next = [...prev, cls];
        if (next.length === 3) setCreationPhase('CONFIRMING');
        return next;
      });
      sounds.playEffect('loot');
    }
  };

  const handleConfirmParty = () => {
    const floors = generateDungeon();
    setDungeonFloors(floors);
    const newParty: Player[] = creatingParty.map((cls, i) => ({
      id: `hero_${Date.now()}_${i}`,
      class: cls.type,
      avatar: cls.avatar,
      name: cls.type,
      level: 1,
      xp: 0,
      hp: cls.hp, maxHp: cls.hp,
      mp: cls.mp, maxMp: cls.mp,
      str: cls.str, int: cls.int, dex: cls.dex, vit: cls.vit, cha: cls.cha,
      inventory: [],
      weapon: null, helm: null, chest: null, gloves: null, boots: null, accessory: null,
      skills: cls.skillPool,
      skillPoints: 0,
      skillLevels: cls.starterSkillIds.reduce((acc, id) => ({...acc, [id]: 1}), {}),
      buffs: []
    }));
    setParty(newParty);
    setCurrentFloor(0);
    setCurrentPos({x: 1, y: 1});
    setExplored({});
    setGameState('EXPLORE');
    sounds.playEffect('victory');
    addLog("The descent begins...", 'info');
  };

  const handleUpgradeSkill = (playerIndex: number, skillId: string) => {
    setParty(prev => {
      const next = [...prev];
      const p = next[playerIndex];
      if (p.skillPoints > 0) {
        const cur = p.skillLevels[skillId] || 0;
        if (cur < 3) { // MAX LEVEL 3
          p.skillPoints--;
          p.skillLevels = { ...p.skillLevels, [skillId]: cur + 1 };
          addLog(`✨ ${p.class} upgraded skill!`, 'level');
          sounds.playEffect('loot');
        }
      }
      return next;
    });
  };

  const handleBuy = (item: Item) => {
    if (gold >= item.value) {
      setGold(g => g - item.value);
      setSharedInventory(prev => [...prev, item]);
      setMerchantInventory(prev => prev.filter(i => i.id !== item.id));
      sounds.playEffect('loot');
      addLog(`Bought ${item.name}`, 'loot');
    } else {
      sounds.playEffect('miss');
    }
  };

  const handleSell = (item: Item) => {
    const val = Math.floor(item.value / 2);
    setGold(g => g + val);
    setSharedInventory(prev => prev.filter(i => i !== item));
    setMerchantInventory(prev => [...prev, item]);
    sounds.playEffect('loot');
    addLog(`Sold ${item.name} for ${val}G`, 'loot');
  };

  const renderLogs = (ref?: React.RefObject<HTMLDivElement>) => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1 text-[10px] md:text-xs font-mono bg-black/60 h-full">
        {logs.map((msg, i) => {
            let color = 'text-emerald-500';
            if (msg.type === 'damage') color = 'text-red-400';
            if (msg.type === 'heal') color = 'text-green-400';
            if (msg.type === 'loot') color = 'text-yellow-400';
            if (msg.type === 'crit') color = 'text-orange-500 font-bold';
            if (msg.type === 'miss') color = 'text-gray-500 italic';
            if (msg.type === 'level') color = 'text-cyan-400 font-black';
            if (msg.type === 'combat') color = 'text-red-600 font-bold';
            return (
                <div key={i} className={`${color} leading-tight break-words border-l-2 border-transparent pl-1 hover:border-emerald-500/30`}>
                    <span className="opacity-30 mr-2 text-[8px]">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    {msg.text}
                </div>
            );
        })}
        <div ref={ref} />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-black text-emerald-500 font-mono select-none overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes prompt-glitch {
          0% { clip: rect(44px, 9999px, 56px, 0); transform: skew(0.1deg); }
          5% { clip: rect(12px, 9999px, 86px, 0); transform: skew(0.5deg); }
          10% { clip: rect(67px, 9999px, 12px, 0); transform: skew(0.2deg); }
          15% { clip: rect(0, 9999px, 0, 0); transform: skew(0); }
          100% { clip: rect(0, 9999px, 0, 0); transform: skew(0); }
        }
        .animate-prompt-glitch {
            animation: prompt-glitch 2s infinite;
        }
      `}} />

      {/* VICTORY TRANSITION OVERLAY */}
      {isVictoryTransition && <VictoryTransition />}

      {/* TRAVELER DIALOG */}
      {showTravelerDialog && (
        <div className="absolute inset-0 z-[150] bg-black/95 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#1a1005] border-2 border-amber-900 p-6 flex flex-col gap-6 relative shadow-[0_0_50px_rgba(255,160,50,0.1)]">
                <div className="flex gap-4 items-start border-b border-amber-900/50 pb-4">
                    <div className="w-24 h-24 border-2 border-amber-800 bg-amber-950/30 shrink-0">
                        <img src={AVATAR_TRAVELER} className="w-full h-full object-contain pixelated" alt="Traveler" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-amber-500 uppercase tracking-widest mb-1">Unshackled Soul</h3>
                        <p className="text-xs text-amber-700 font-bold uppercase">The Lost Traveler</p>
                    </div>
                </div>
                <div className="text-sm md:text-base text-amber-200/90 leading-relaxed font-serif italic">
                    <p className="mb-4">"Many thanks… truly, many thanks! At last, I am freed — I walk once more in the shadows of liberty."</p>
                    <p className="mb-4">"The Hooded Man… hast thou seen him? Trust him not. He cast me into this pit of illusion and despair!"</p>
                    <p className="mb-4">"Yet now I am free, and I shall repay thee when the time is ripe… Seek me at my dwelling; it lies along the path of thy Destiny."</p>
                    <p>"How do I know? Prithee, what other reason would draw thee hither?"</p>
                </div>
                <button 
                    onClick={() => {
                        setShowTravelerDialog(false);
                        // Convert Traveler tile to empty so he "leaves"
                        const newFloors = [...dungeonFloors];
                        newFloors[currentFloor][currentPos.y][currentPos.x] = 0;
                        setDungeonFloors(newFloors);
                        addLog("The Traveler vanishes into the dark...", 'info');
                    }} 
                    className="w-full py-3 border border-amber-700 text-amber-500 font-black hover:bg-amber-900/20 uppercase tracking-widest"
                >
                    Farewell
                </button>
            </div>
        </div>
      )}

      {/* TRANSITIONS */}
      {isBattleTransition && (
        <BattleTransition onComplete={() => {
            setIsBattleTransition(false);
            setGameState('COMBAT');
            startAtbClock();
        }} />
      )}

      {isFloorTransition && (
        <FloorTransition 
            floor={currentFloor}
            onMidpoint={() => {
                setCurrentFloor(f => f + 1); 
                setCurrentPos({ x: 1, y: 1 });
            }}
            onComplete={() => setIsFloorTransition(false)}
        />
      )}

      {/* MERCHANT CONVERSATION OVERLAY */}
      {showMerchantIntro && (
        <MerchantConversation 
          merchantSprite={merchantSprite}
          onComplete={() => {
            setShowMerchantIntro(false);
            setHasMetMerchant(true);
            setShowMerchantPrompt(true); // Open the prompt after talking
          }}
        />
      )}

      {showMerchantPrompt && !showMerchantIntro && (
        <div className="absolute inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 animate-in fade-in duration-300 backdrop-blur-md">
            <div className="bg-[#020402] border-4 border-emerald-500 p-8 w-full shadow-[0_0_80px_rgba(51,255,51,0.2)] flex flex-col items-center gap-8 max-w-md relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />

                <div className="text-center flex flex-col items-center">
                    {merchantSprite ? (
                      <div className="w-32 h-32 mb-6 border-2 border-emerald-900 bg-emerald-950/20 p-4 shadow-[0_0_30px_rgba(51,255,51,0.3)] relative group">
                        <img src={merchantSprite} className="w-full h-full object-contain pixelated relative z-10 brightness-125" alt="Merchant" />
                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                        <div className="absolute inset-0 bg-emerald-500/20 animate-prompt-glitch pointer-events-none" />
                      </div>
                    ) : (
                      <div className="text-4xl mb-2">💎</div>
                    )}
                    <h3 className="text-2xl font-black text-emerald-400 tracking-[0.4em] uppercase mb-4 text-shadow-glow">INCOMING SIGNAL</h3>
                    <div className="text-xs md:text-sm text-emerald-600 leading-relaxed font-bold bg-emerald-950/20 p-4 border border-emerald-900">
                        <span className="text-emerald-300">"TRANSFER REQUEST DETECTED...</span> 
                        <br/>Greetings, data-travelers. I have salvaged treasures for your credits. Do you accept the connection?"
                    </div>
                </div>
                <div className="flex gap-6 w-full">
                    <button onClick={() => { setShowMerchantPrompt(false); generateMerchantStock(); setGameState('MERCHANT'); }} className="flex-1 retro-button py-4 text-sm md:text-base border-emerald-400 hover:scale-105 transition-transform">ACCEPT_LINK</button>
                    <button onClick={() => setShowMerchantPrompt(false)} className="flex-1 retro-button py-4 text-sm md:text-base border-red-900 text-red-500 hover:bg-red-900/40">ABORT</button>
                </div>
            </div>
        </div>
      )}
      
      {gameState === 'TITLE' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050000] overflow-hidden select-none">
            {/* Dark Fantasy Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#150000_0%,#000_80%)] z-0" />
            
            {/* Weathered Stone Texture Simulation */}
            <div className="absolute inset-0 opacity-[0.25] pointer-events-none z-0" 
                 style={{ 
                     backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #331111 40px, #331111 42px), repeating-linear-gradient(90deg, transparent, transparent 80px, #331111 80px, #331111 82px)',
                     backgroundSize: '160px 80px',
                 }} 
            />

            {/* Drifting Mist and Fog */}
            <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                <div className="absolute top-0 left-0 w-[300%] h-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(60,0,0,0.15)_0%,transparent_70%)] animate-fog-scroll" />
                <div className="absolute top-1/2 left-0 w-[400%] h-[300px] bg-[linear-gradient(to_right,transparent_0%,rgba(40,0,0,0.25)_50%,transparent_100%)] blur-[70px] animate-mist-scroll opacity-60" />
            </div>

            {/* Fade Out Overlay */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-[2000ms] pointer-events-none z-[60] ${isDescending ? 'opacity-100' : 'opacity-0'}`} />

            {/* Content Container (Menu) - Highest Z-Index when visible */}
            <div className={`z-[70] flex flex-col items-center space-y-10 max-w-4xl w-full relative transition-all duration-1000 ${isDescending ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
                
                {/* Header / Title Section */}
                <div className="flex flex-col items-center space-y-2 relative group cursor-default text-center">
                    <div className="text-[#882222] font-serif tracking-[1.5em] text-[10px] md:text-sm uppercase animate-pulse mb-2 font-bold">
                        &mdash; FORSAKEN DEPTHS &mdash;
                    </div>
                    
                    <div className="relative">
                        <div className="text-[12px] md:text-lg font-serif text-[#aa3333] tracking-[0.8em] mb-2 italic opacity-90 uppercase">Dungeon of the</div>
                        <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff4444] via-[#cc0000] to-[#220000] tracking-tighter drop-shadow-[0_10px_30px_rgba(200,0,0,0.7)] relative z-10 font-serif leading-none filter drop-shadow(0 0 10px #ff000033)"
                            style={{ textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 0 0 50px rgba(136,0,0,0.8)' }}>
                            CRIMSON EYE
                        </h1>
                    </div>
                </div>

                {/* Dark Stone-Carved Menu */}
                <div className="flex flex-col gap-6 w-full max-w-sm mt-10 px-6">
                    <button 
                        onClick={() => { 
                            sounds.init(); 
                            setIsDescending(true);
                            // Delayed transition to match zoom animation
                            setTimeout(() => {
                                setIsDescending(false);
                                setGameState('LORE'); 
                            }, 2500);
                        }} 
                        className="group relative px-8 py-6 bg-[#080000] border-2 border-[#441111] hover:border-[#ff4444] hover:bg-[#1a0000] transition-all duration-300 overflow-hidden text-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-sm"
                    >
                        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(200,0,0,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xl md:text-2xl font-black tracking-[0.4em] text-[#aa3333] group-hover:text-[#ff4444] uppercase relative z-10 flex items-center justify-center gap-4 transition-all group-hover:scale-105"
                              style={{ textShadow: '2px 2px 0px #000' }}>
                            DESCEND
                        </span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button disabled className="group px-4 py-4 bg-[#050000] border border-[#331111] opacity-40 cursor-not-allowed flex items-center justify-center">
                            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#662222] uppercase">
                                HISTORY
                            </span>
                        </button>
                        <button disabled className="group px-4 py-4 bg-[#050000] border border-[#331111] opacity-40 cursor-not-allowed flex items-center justify-center">
                            <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#662222] uppercase">
                                SCROLLS
                            </span>
                        </button>
                    </div>

                    <div className="text-[10px] md:text-xs text-[#552222] text-center mt-12 font-serif tracking-[0.3em] italic opacity-70 uppercase font-black">
                        Fate waits in the dark.
                    </div>
                </div>
            </div>

            {/* The Occult Crimson Eye Graphic - Lower Z-Index so it doesn't block buttons unless descending */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[2500ms] ease-in-out" ${isDescending ? 'scale-[50] rotate-0 z-50' : 'scale-100 rotate-0 z-0'}`}>
                {/* Visual Offset wrapper to position it correctly in layout initially, then centered absolute overrides take over */}
                <div className={`w-32 h-32 md:w-48 md:h-48 bg-[#0a0000] rounded-[70%_30%_70%_30%] relative shadow-[0_0_100px_rgba(200,0,0,0.6)] flex items-center justify-center overflow-hidden border-[3px] border-[#551111] ${!isDescending ? 'animate-pulsate-eye rotate-[45deg]' : 'rotate-[45deg]'}`}>
                    {/* Blood sheen */}
                    <div className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#330000_0%,transparent_80%)] opacity-70" />
                    
                    {/* Iris Container */}
                    <div className="w-24 h-24 md:w-36 md:h-36 -rotate-[45deg] relative flex items-center justify-center">
                        {/* Inner Eye structure */}
                        <div className={`w-20 h-20 md:w-30 md:h-30 bg-[#cc0000] rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] border-2 border-[#ff444444] ${!isDescending ? 'animate-look-around' : ''}`}>
                            {/* The Slit Pupil */}
                            <div className="w-4 h-16 md:w-6 md:h-24 bg-[#000] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#000]" />
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-black rounded-full opacity-60 blur-[4px]" />
                            
                            {/* Occult Runes / Details around iris */}
                            <div className="absolute inset-0 border-[4px] border-dotted border-[#ff000044] rounded-full animate-spin-slow" />
                            
                            {/* Cornea Highlight / Wetness */}
                            <div className="w-5 h-5 md:w-8 md:h-8 bg-white/40 rounded-full absolute top-1/4 left-1/4 blur-[2px] opacity-80" />
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-white/60 rounded-full absolute top-[20%] left-[35%] blur-[1px]" />
                        </div>
                    </div>
                </div>
            </div>

            {gameState === 'TITLE' && !isDescending && creationPhase === 'SELECTING' && (
               <div className="absolute bottom-4 right-4 z-[80]">
                   <button 
                       onClick={() => {
                          setCreationPhase('SELECTING');
                          setCreatingParty([]);
                          setGameState('CREATION');
                          setIsDescending(false);
                       }}
                       className="text-[#661111] text-[10px] hover:text-red-500 font-bold"
                   >
                       [DEBUG: SKIP TO CREATION]
                   </button>
               </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fog-scroll {
                    0% { transform: translateX(-25%) translateY(-5%); }
                    50% { transform: translateX(0%) translateY(0%); }
                    100% { transform: translateX(-25%) translateY(-5%); }
                }
                .animate-fog-scroll { animation: fog-scroll 30s infinite ease-in-out; }
                
                @keyframes mist-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-mist-scroll { animation: mist-scroll 20s infinite linear; }

                @keyframes pulsate-eye {
                    0%, 100% { transform: rotate(45deg) scale(1); box-shadow: 0 0 80px rgba(150,0,0,0.5); }
                    50% { transform: rotate(45deg) scale(1.03); box-shadow: 0 0 120px rgba(255,0,0,0.7); }
                }
                .animate-pulsate-eye { animation: pulsate-eye 4s infinite ease-in-out; }

                @keyframes look-around {
                    0%, 100% { transform: translate(0, 0); }
                    15% { transform: translate(-4px, -2px); }
                    30% { transform: translate(4px, 2px); }
                    45% { transform: translate(-3px, 4px); }
                    60% { transform: translate(5px, -3px); }
                    80% { transform: translate(-2px, -2px); }
                }
                .animate-look-around { animation: look-around 8s infinite ease-in-out; }

                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 12s infinite linear; }
            `}} />
        </div>
      )}

      {/* ... (Rest of component render blocks remain identical) ... */}
      {gameState === 'LORE' && <LoreCutscene onComplete={() => { setGameState('CREATION'); setCreatingParty([]); setCreationPhase('SELECTING'); }} />}
      {/* ... */}
      {gameState === 'CREATION' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-black text-emerald-500 font-mono select-none overflow-hidden">
            {/* ... Content ... */}
            <div className="z-10 flex flex-col h-full p-4 md:p-8">
                {/* ... */}
                <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
                    <div className="w-full md:w-1/3 max-w-sm flex flex-col border-2 border-emerald-900/50 bg-black/40 p-2 shrink-0">
                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                          <div className="grid grid-cols-1 gap-2">
                            {CLASSES.map((cls) => (
                                <button key={cls.type} onClick={() => handleAddChar(cls)} disabled={creatingParty.length >= 3} className={`relative group flex items-center gap-3 p-2 border-2 text-left transition-all duration-200 ${creatingParty.length >= 3 ? 'opacity-40 border-gray-900 cursor-not-allowed' : 'border-emerald-900/60 hover:border-emerald-500 hover:bg-emerald-950/30'}`}>
                                    <div className="w-12 h-12 shrink-0 border border-emerald-800 bg-black relative overflow-hidden">
                                        <img src={cls.avatar} className="w-full h-full object-contain pixelated" alt={cls.type} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-black text-emerald-300 uppercase leading-none mb-1">{cls.type}</div>
                                        <div className="text-[9px] text-emerald-600/80 leading-tight">{cls.description.substring(0, 40)}...</div>
                                    </div>
                                    <div className="text-xl text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-2">+</div>
                                </button>
                            ))}
                          </div>
                        </div>
                    </div>
                    {/* ... */}
                    <div className="flex-1 flex flex-col gap-4 min-w-0 h-full relative">
                        <div className="flex-1 flex flex-row gap-4 h-full min-h-0 perspective-[1000px]">
                            {creatingParty.length === 0 && (
                                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-900/40 border-4 border-dashed border-emerald-900/20 bg-emerald-950/5 animate-pulse">
                                    <div className="text-6xl mb-4 opacity-30">⚰️</div>
                                    <div className="text-xl font-black uppercase tracking-widest">ROSTER EMPTY</div>
                                    <div className="text-sm mt-2">Initializing Soul Transfer...</div>
                                </div>
                            )}
                            {creatingParty.map((cls, i) => (
                                <div key={i} className="relative group animate-in zoom-in duration-500 h-full flex-1 min-w-0 shadow-2xl hover:flex-[1.1] transition-all ease-out">
                                    <div className="flex-1 overflow-hidden flex flex-col h-full border-4 border-emerald-900/50">
                                      <CharacterCard player={{...cls, class: cls.type, level: 1}} stats={calculateDerivedStats({...cls, skillLevels: {}, buffs: []})} />
                                    </div>
                                    <button onClick={() => { setCreatingParty(prev => prev.filter((_, idx) => idx !== i)); if (creationPhase === 'CONFIRMING') setCreationPhase('SELECTING'); }} className="absolute -top-3 -right-3 w-8 h-8 bg-red-900 border-2 border-red-500 text-white flex items-center justify-center font-black text-lg hover:bg-red-600 z-50 shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all hover:scale-110 rounded-full">✕</button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-4 border-t border-emerald-900 shrink-0">
                            {creationPhase === 'CONFIRMING' ? (
                                <button onClick={handleConfirmParty} className="w-full py-4 text-xl font-black bg-emerald-600 text-black border-2 border-emerald-400 hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">BEGIN DESCENT</button>
                            ) : (
                                <div className="w-full py-4 text-center text-emerald-800 font-bold border-2 border-dashed border-emerald-900 bg-emerald-950/10 cursor-not-allowed">SELECT {3 - creatingParty.length} MORE HEROES</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {gameState === 'EXPLORE' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 relative border-r border-emerald-900">
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <DungeonRenderer pos={currentPos} dir={currentDir} floor={currentFloor} merchantSprite={merchantSprite} mapData={dungeonFloors[currentFloor]} />
            </div>
            <div className="h-48 hidden md:flex min-h-0 border-t border-emerald-900 shrink-0">
                 {renderLogs(logEndRefDesktop)}
            </div>
          </div>
          <div className="w-full md:w-96 flex-none flex flex-col md:bg-black/90 md:h-full">
            <div className="p-3 md:p-4 border-b border-emerald-900 flex flex-col gap-4">
                 <div className="flex justify-center">
                    <Minimap pos={currentPos} dir={currentDir} floor={currentFloor} explored={explored[currentFloor] || new Set()} mapData={dungeonFloors[currentFloor]} />
                 </div>
                 {/* Mobile Controls */}
                 <div className="md:hidden flex justify-center gap-2"><button onClick={() => move(-1)} className="retro-button p-3 text-lg leading-none">▲</button></div>
                 <div className="md:hidden flex justify-center gap-2">
                    <button onClick={() => turn(-1)} className="retro-button p-3 text-lg leading-none">◀</button>
                    <button onClick={() => move(1)} className="retro-button p-3 text-lg leading-none">▼</button>
                    <button onClick={() => turn(1)} className="retro-button p-3 text-lg leading-none">▶</button>
                 </div>
            </div>
            
            {/* Party Status */}
            <div className="p-3 grid grid-cols-3 md:grid-cols-1 gap-2 border-t md:border-t-0 border-emerald-900 bg-black/80 md:bg-transparent">
                {party.map((p, i) => {
                  const stats = calculateDerivedStats(p);
                  const isSelectedForAction = quickActionTargeting && (quickActionTargeting.type === 'item' || quickActionTargeting.type === 'skill');
                  return (
                    <div 
                        key={p.id} 
                        onClick={() => isSelectedForAction && executeQuickAction(i)}
                        className={`text-[8px] md:text-xs border p-1 md:p-2 flex gap-2 items-center transition-all cursor-pointer
                            ${p.hp <= 0 ? 'border-red-900 bg-red-950/20 opacity-50' : 'border-emerald-900 md:bg-emerald-950/10'}
                            ${isSelectedForAction ? 'hover:bg-emerald-500/20 hover:border-emerald-400 animate-pulse' : ''}
                        `}
                    >
                        <img src={p.avatar} alt={p.class} className="w-8 h-8 md:w-10 md:h-10 border border-emerald-800 bg-black object-contain pixelated hidden md:block" />
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold uppercase ${p.hp <= 0 ? 'text-red-500' : 'text-white'} md:mb-1 truncate`}>{p.class}</div>
                          <div className="flex justify-between"><span>HP:</span> <span>{p.hp}/{stats.maxHp}</span></div>
                          <div className="flex justify-between"><span>MP:</span> <span>{p.mp}/{stats.maxMp}</span></div>
                        </div>
                    </div>
                  );
                })}
            </div>

            {/* Bag/Skills Buttons */}
            <div className="p-2 flex gap-2 border-t border-emerald-900 mt-auto md:mt-0 bg-black">
                <button onClick={() => setGameState('INVENTORY')} className="flex-1 retro-button py-2 text-[8px] md:text-sm border-emerald-400 bg-emerald-950/40">🎒 BAG</button>
                <button onClick={() => setGameState('SKILLS')} className="flex-1 retro-button py-2 text-[8px] md:text-sm border-cyan-400 bg-cyan-950/40">✨ SKILLS</button>
            </div>

            {/* Quick Actions Panel (Smart Layout) */}
            <div className="flex-1 border-t border-emerald-900 bg-black/40 overflow-hidden flex flex-col p-2 min-h-[150px]">
                {quickActionTargeting ? (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-200">
                        <div className="text-emerald-400 font-bold uppercase tracking-widest mb-2 text-center text-xs">
                            Select Target for<br/>
                            <span className="text-white text-sm">{quickActionTargeting.item?.name || quickActionTargeting.skill?.name}</span>
                        </div>
                        <button onClick={() => setQuickActionTargeting(null)} className="retro-button px-4 py-1 text-xs border-red-500 text-red-500">CANCEL</button>
                    </div>
                ) : (
                    <>
                        <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mb-2 text-center border-b border-emerald-900/30 pb-1">Quick Cast</div>
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                            {/* Potion Section */}
                            {sharedInventory.some(i => i.type === 'consumable') && (
                                <div className="mb-3">
                                    <div className="text-[9px] text-emerald-600 font-bold mb-1 pl-1">CONSUMABLES</div>
                                    <div className="grid grid-cols-2 gap-1">
                                        {Array.from(new Set(sharedInventory.filter(i => i.type === 'consumable').map(i => i.id))).map(id => {
                                            const item = sharedInventory.find(i => i.id === id)!;
                                            const count = sharedInventory.filter(i => i.id === id).length;
                                            return (
                                                <button key={id} onClick={() => handleQuickAction({type: 'item', item})} className="text-[9px] border border-emerald-900/50 bg-emerald-950/20 hover:bg-emerald-900/40 p-1 flex justify-between items-center text-left">
                                                    <span className="truncate flex-1 text-emerald-400">{item.name}</span>
                                                    <span className="text-white font-bold ml-1">x{count}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            {/* Skills Section */}
                            <div className="text-[9px] text-cyan-600 font-bold mb-1 pl-1">SUPPORT SPELLS</div>
                            <div className="grid grid-cols-1 gap-1">
                                {party.map((p, pIdx) => {
                                    const usable = getUsableSkills(p);
                                    if (usable.length === 0) return null;
                                    return (
                                        <div key={p.id} className="flex gap-1 items-center bg-black/20 p-1 border border-cyan-900/20">
                                            <div className="w-4 h-4 bg-cyan-900 text-[8px] flex items-center justify-center text-white font-bold">{p.class.substring(0,1)}</div>
                                            <div className="flex-1 flex flex-wrap gap-1">
                                                {usable.map(s => (
                                                    <button 
                                                        key={s.id} 
                                                        disabled={p.mp < s.cost}
                                                        onClick={() => handleQuickAction({type: 'skill', skill: s, sourceIndex: pIdx})}
                                                        className={`text-[8px] px-1.5 py-0.5 border ${p.mp >= s.cost ? 'border-cyan-700 text-cyan-300 hover:bg-cyan-900/40' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
                                                    >
                                                        {s.name} <span className="opacity-50">({s.cost})</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden bg-black/40 md:hidden min-h-[80px]">
                {renderLogs(logEndRefMobile)}
            </div>
          </div>
        </div>
      )}
      
      {/* ... Other States ... */}
      {gameState === 'SKILLS' && (
        <div className="absolute inset-0 z-50 md:flex md:items-center md:justify-center md:bg-black/80 md:backdrop-blur-sm">
            <div className="w-full h-full md:max-w-3xl md:h-[80vh] md:relative">
                <SkillScreen 
                party={party}
                selectedCharIndex={selectedInventoryChar}
                onSelectChar={setSelectedInventoryChar}
                onUpgradeSkill={handleUpgradeSkill}
                onCastSkill={handleCastSkillOutCombat}
                onClose={() => setGameState('EXPLORE')}
                calculateStats={calculateDerivedStats}
                />
            </div>
        </div>
      )}
      {gameState === 'INVENTORY' && (
        <div className="absolute inset-0 z-50 md:flex md:items-center md:justify-center md:bg-black/80 md:backdrop-blur-sm">
            <div className="w-full h-full md:max-w-6xl md:h-[90vh] md:relative">
                <InventoryScreen 
                party={party}
                selectedCharIndex={selectedInventoryChar}
                onSelectChar={setSelectedInventoryChar}
                sharedInventory={sharedInventory}
                materialsPouch={materialsPouch}
                gold={gold}
                onClose={() => setGameState('EXPLORE')}
                onEquip={handleEquip}
                onUnequip={handleUnequip}
                onUse={handleUseItem}
                onDrop={(idx) => setSharedInventory(prev => prev.filter((_, i) => i !== idx))}
                onDropMaterial={(idx) => setMaterialsPouch(prev => prev.filter((_, i) => i !== idx))}
                calculateStats={calculateDerivedStats}
                />
            </div>
        </div>
      )}
      {gameState === 'MERCHANT' && (
        <div className="absolute inset-0 z-50 md:flex md:items-center md:justify-center md:bg-black/80 md:backdrop-blur-sm">
             <div className="w-full h-full md:max-w-5xl md:h-[85vh] md:relative">
                <MerchantScreen 
                merchantInventory={merchantInventory}
                playerInventory={sharedInventory}
                gold={gold}
                merchantSprite={merchantSprite}
                onBuy={handleBuy}
                onSell={handleSell}
                onClose={() => setGameState('EXPLORE')}
                party={party}
                calculateStats={calculateDerivedStats}
                />
            </div>
        </div>
      )}
      {gameState === 'COMBAT' && (
        <div className="absolute inset-0 z-40 w-full h-full">
            <BattleScreen 
            party={party} 
            enemies={activeEnemies} 
            activeCharIndex={activeCharIndex}
            targetIndex={targetIndex}
            setTargetIndex={setTargetIndex}
            allyTargetIndex={allyTargetIndex}
            setAllyTargetIndex={setAllyTargetIndex}
            atbValues={atbValues}
            actingId={actingId}
            impactIds={impactIds}
            currentAnim={currentAnim}
            floatingTexts={floatingTexts}
            skeletonSprite={skeletonSprite}
            onAttack={handleAttack} 
            onDefend={handleDefend}
            onSkill={handleSkill}
            onRun={() => { stopAtbClock(); setGameState('EXPLORE'); addLog(`🏃 Party retreated safely.`, 'info'); }}
            calculateStats={calculateDerivedStats}
            logs={logs}
            />
        </div>
      )}
      {gameState === 'DEATH' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-red-950/20 text-center animate-pulse">
          <h2 className="text-red-600 text-6xl font-black mb-8">PARTY WIPED</h2>
          <button onClick={() => setGameState('TITLE')} className="retro-button px-8 py-4 text-red-600 border-red-600 hover:bg-red-600 hover:text-white">GRAVEYARD</button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <GameContent />
        </ErrorBoundary>
    );
};

export default App;
