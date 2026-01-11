
import React, { useState, useEffect, useCallback, useRef, ErrorInfo, ReactNode, useMemo } from 'react';
import { 
  Direction, Position, Player, Enemy, GameState, LogMessage, Item, DerivedStats, Skill, ItemType, ItemRarity, ItemMod, Buff, CombatResult, ClassDefinition, SaveData
} from './types';
import { ITEMS, MATERIALS, ENEMIES, CLASSES, MOD_POOL, generateDungeon, MERCHANT_AVATAR, AVATAR_TRAVELER, CLASS_APTITUDES, generateTownMap, TEXTURE_FOUNTAIN, AVATAR_VILLAGER, TEXTURE_WALL_BRICK, TEXTURE_WALL_STONE, TEXTURE_WALL_METAL, TEXTURE_WALL_CITY, TEXTURE_DOOR, INTERIOR_MAPS, DOOR_LOCATIONS, SPRITE_STAIRS_UP, AVATAR_GHOST } from './constants';
import { DungeonRenderer } from './components/DungeonRenderer';
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
import SealingTransition from './components/SealingTransition';
import DialogueBox from './components/DialogueBox';
import FountainMenu from './components/DescentTransition';
import TravelMenu from './components/EyeTransition';
import { sounds } from './soundManager';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
            onClick={() => { localStorage.clear(); window.location.reload(); }} 
            className="mt-8 px-6 py-2 border border-red-500 hover:bg-red-900 text-white uppercase"
          >
            Purge Corrupted Data & Restart
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ATB_MAX = 100;
const ATB_TICK_RATE = 50; // ms
const SAVE_KEY = "dungeon_savegame";

const GameContent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [party, setParty] = useState<Player[]>([]);
  const [creatingParty, setCreatingParty] = useState<ClassDefinition[]>([]);
  const [activeEnemies, setActiveEnemies] = useState<Enemy[]>([]);
  const [creationPhase, setCreationPhase] = useState<'SELECTING' | 'CONFIRMING'>('SELECTING');
  
  // Transition States
  const [isBattleTransition, setIsBattleTransition] = useState(false);
  const [isVictoryTransition, setIsVictoryTransition] = useState(false);
  const [floorTransitionState, setFloorTransitionState] = useState<'none' | 'descending' | 'ascending'>('none');
  const [isDescending, setIsDescending] = useState(false);
  const [isSealingTransition, setIsSealingTransition] = useState(false);
  const [doorPhase, setDoorPhase] = useState<'none' | 'closing' | 'opening'>('none');

  // UI States
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [dialogue, setDialogue] = useState<string[] | null>(null);
  const [dialogueSpeaker, setDialogueSpeaker] = useState<{name: string, avatar: string} | null>(null);
  const [interactionTarget, setInteractionTarget] = useState<{type: 'door' | 'stairs' | 'chest' | 'merchant' | 'npc' | 'fountain', pos: Position, tileId: number, label: string} | null>(null);

  // Inventory State
  const [sharedInventory, setSharedInventory] = useState<Item[]>([]);
  const [materialsPouch, setMaterialsPouch] = useState<Item[]>([]);
  const [selectedInventoryChar, setSelectedInventoryChar] = useState(0);

  // Merchant State
  const [merchantInventory, setMerchantInventory] = useState<Item[]>([]);
  const [showMerchantPrompt, setShowMerchantPrompt] = useState(false);
  const [showMerchantIntro, setShowMerchantIntro] = useState(false);
  const [hasMetMerchant, setHasMetMerchant] = useState(false);

  // Quick Action State
  const [quickActionTargeting, setQuickActionTargeting] = useState<{type: 'item'|'skill', sourceIndex?: number, item?: Item, skill?: Skill} | null>(null);

  // Map State
  const [townMap, setTownMap] = useState<number[][]>([]);
  const [dungeonData, setDungeonData] = useState<{floors: number[][][], stairsDownLocations: Record<number, Position>, stairsUpLocations: Record<number, Position>, fountainLocations: Record<number, Position>} | null>(null);
  const [currentFloor, setCurrentFloor] = useState(-1);
  const [currentPos, setCurrentPos] = useState<Position>({ x: 7, y: 14 });
  const [currentDir, setCurrentDir] = useState<Direction>(Direction.NORTH);
  const [explored, setExplored] = useState<Record<number, Set<string>>>({});
  const [stepsSinceBattle, setStepsSinceBattle] = useState(0);
  const [townExitState, setTownExitState] = useState<{ pos: Position, dir: Direction } | null>(null);
  const [defeatedBosses, setDefeatedBosses] = useState<Set<number>>(new Set());
  
  // Save/Load & Fountain State
  const [saveGameExists, setSaveGameExists] = useState(false);
  const [isFountainMenuOpen, setIsFountainMenuOpen] = useState(false);
  const [isTravelMenuOpen, setIsTravelMenuOpen] = useState(false);
  const [discoveredFountains, setDiscoveredFountains] = useState<number[]>([]);

  // ATB / Combat State
  const [atbValues, setAtbValues] = useState<Record<string, number>>({});
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [impactIds, setImpactIds] = useState<string[]>([]);
  const [currentAnim, setCurrentAnim] = useState<AnimationType>('physical');
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  // Targeting
  const [targetIndex, setTargetIndex] = useState(0);
  const [allyTargetIndex, setAllyTargetIndex] = useState(0);

  const [gold, setGold] = useState(100); 
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const logEndRefDesktop = useRef<HTMLDivElement>(null);
  const logEndRefMobile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRefDesktop.current?.scrollIntoView({ behavior: "smooth" });
    logEndRefMobile.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const atbTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const partyRef = useRef(party);
  const enemiesRef = useRef(activeEnemies);
  
  useEffect(() => {
    partyRef.current = party;
    enemiesRef.current = activeEnemies;
  }, [party, activeEnemies]);

  // Check for save game on mount
  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(SAVE_KEY);
      setSaveGameExists(!!savedGame);
    } catch (e) {
      console.warn("Could not access localStorage:", e);
      setSaveGameExists(false);
    }
  }, []);

  const saveGame = () => {
    try {
        const exploredData: Record<number, string[]> = {};
        Object.keys(explored).forEach(key => {
            exploredData[Number(key)] = Array.from(explored[Number(key)]);
        });

        const saveData: SaveData = {
            party,
            sharedInventory,
            materialsPouch,
            gold,
            currentFloor,
            currentPos,
            currentDir,
            explored: exploredData,
            defeatedBosses: Array.from(defeatedBosses),
            hasMetMerchant,
            discoveredFountains,
        };

        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        addLog("💾 Memory imprinted upon the flow.", 'info');
        sounds.playEffect('save_game');
        setSaveGameExists(true);
    } catch (error) {
        console.error("Failed to save game:", error);
        addLog("❌ Save failed. The memory fades.", 'damage');
    }
  };

  const loadGame = () => {
      try {
          const savedString = localStorage.getItem(SAVE_KEY);
          if (!savedString) {
              addLog("No save data found.", 'miss');
              return;
          }

          const data: SaveData = JSON.parse(savedString);
          
          const exploredSets: Record<number, Set<string>> = {};
          if (data.explored) {
            Object.keys(data.explored).forEach(key => {
                exploredSets[Number(key)] = new Set(data.explored[Number(key)]);
            });
          }

          setParty(data.party);
          setSharedInventory(data.sharedInventory);
          setMaterialsPouch(data.materialsPouch || []);
          setGold(data.gold);
          setCurrentFloor(data.currentFloor);
          setCurrentPos(data.currentPos);
          setCurrentDir(data.currentDir);
          setExplored(exploredSets);
          setDefeatedBosses(new Set(data.defeatedBosses));
          setHasMetMerchant(data.hasMetMerchant);
          setDiscoveredFountains(data.discoveredFountains || []);

          if (!dungeonData) {
              const d = generateDungeon(60);
              setDungeonData(d);
          }
          if (!townMap.length) {
              setTownMap(generateTownMap());
          }

          setGameState('EXPLORE');
          addLog("💾 The memory returns. The path is clear.", 'info');

      } catch (error) {
          console.error("Failed to load game:", error);
          addLog("❌ Load failed. The memory is corrupted.", 'damage');
          localStorage.removeItem(SAVE_KEY);
          setSaveGameExists(false);
      }
  };

  const handleFastTravel = (floor: number) => {
      setIsTravelMenuOpen(false);
      setIsFountainMenuOpen(false);
      
      setCurrentFloor(floor);
      if (floor === -1) {
          setCurrentPos({x: 7, y: 7});
          setCurrentDir(Direction.SOUTH);
      } else {
          const fountainPos = dungeonData?.fountainLocations[floor];
          if (fountainPos) {
              setCurrentPos(fountainPos);
          }
      }
      addLog(`🌀 Warped to ${floor === -1 ? 'Town' : `Floor B${floor + 1}`}.`, 'info');
  };

  // Music Management
  useEffect(() => {
    try {
      if (gameState === 'TITLE' || gameState === 'CREATION' || gameState === 'LORE') {
        sounds.playLoreAmbience();
      } else if (gameState === 'EXPLORE' || gameState === 'COMBAT') {
        if (currentFloor <= -1) {
            sounds.playTownTheme(); 
        } else {
            sounds.playDungeonTheme(currentFloor);
        }
      } else if (gameState === 'DEATH') {
        sounds.stopMusic();
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }, [gameState, currentFloor]);
  
  // Dungeon Generation
  useEffect(() => {
    if (gameState === 'GENERATING') {
        const timer = setTimeout(() => {
            const d = generateDungeon(60);
            setDungeonData(d);
            setTownMap(generateTownMap());
            
            // Reset for new game
            setCurrentFloor(-1);
            setCurrentPos({ x: 7, y: 14 });
            setCurrentDir(Direction.NORTH);
            setExplored({});
            setSharedInventory([
                {...ITEMS.find(i => i.id === 'pot_hp_s')!, id: 'start_pot_1'},
                {...ITEMS.find(i => i.id === 'pot_hp_s')!, id: 'start_pot_2'},
                {...ITEMS.find(i => i.id === 'pot_hp_s')!, id: 'start_pot_3'}
            ]);
            setMaterialsPouch([]);
            setGold(100);
            setDefeatedBosses(new Set());
            setHasMetMerchant(false);
            setDiscoveredFountains([]);

            addLog("You arrive at a lonely outpost, a grim haven.", 'info');
            setGameState('EXPLORE');
        }, 100);

        return () => clearTimeout(timer);
    }
  }, [gameState]);

  const currentMap = useMemo(() => {
    if (currentFloor === -1) return townMap;
    if (currentFloor < -1) return INTERIOR_MAPS[currentFloor]?.map || [];
    if (dungeonData?.floors[currentFloor]) return dungeonData.floors[currentFloor];
    return [];
  }, [currentFloor, townMap, dungeonData]);

  // Interaction Check Logic
  useEffect(() => {
      if (gameState !== 'EXPLORE' || !currentMap.length) {
          setInteractionTarget(null);
          return;
      }
      
      let target: {type: 'door' | 'stairs' | 'chest' | 'merchant' | 'npc' | 'fountain', pos: Position, tileId: number, label: string} | null = null;

      const currentTile = currentMap[currentPos.y][currentPos.x];
      if (currentTile === 3) target = { type: 'stairs', pos: currentPos, tileId: 3, label: 'Descend Stairs' };
      else if (currentTile === 11) target = { type: 'stairs', pos: currentPos, tileId: 11, label: 'Ascend Stairs' };
      else if (currentTile === 7) target = { type: 'fountain', pos: currentPos, tileId: 7, label: 'Examine Fountain' };

      if (!target) {
          const vecs = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
          const vec = vecs[currentDir];
          const targetX = currentPos.x + vec.x;
          const targetY = currentPos.y + vec.y;
    
          if (targetY >= 0 && targetY < currentMap.length && targetX >= 0 && targetX < currentMap[0].length) {
              const tileInFront = currentMap[targetY][targetX];
              if (tileInFront === 10) target = { type: 'door', pos: {x: targetX, y: targetY}, tileId: 10, label: 'Open Door' };
              else if (tileInFront === 4) target = { type: 'chest', pos: {x: targetX, y: targetY}, tileId: 4, label: 'Open Chest' };
              else if (tileInFront === 5) target = { type: 'merchant', pos: {x: targetX, y: targetY}, tileId: 5, label: 'Talk to Merchant' };
              else if ([2, 6, 8, 12].includes(tileInFront)) target = { type: 'npc', pos: {x: targetX, y: targetY}, tileId: tileInFront, label: 'Talk' };
              else if (tileInFront === 7) target = { type: 'fountain', pos: {x: targetX, y: targetY}, tileId: 7, label: 'Examine Fountain' };
          }
      }

      setInteractionTarget(target);

  }, [currentPos, currentDir, currentMap, gameState]);

  const generateRandomItem = (base: Item, levelFactor: number = 1, magicFind: number = 0): Item => {
    if (base.type === 'consumable' || base.type === 'material') return { ...base, rarity: 'NORMAL', mods: [] };
    
    const roll = Math.random() * 100 + magicFind;
    
    let rarity: ItemRarity = 'NORMAL';
    let modCount = 0;

    if (roll > 99.99) { rarity = 'UNIQUE'; modCount = 5; }
    else if (roll > 99.5) { rarity = 'LEGENDARY'; modCount = 4; }
    else if (roll > 95) { rarity = 'RARE'; modCount = 3; }
    else if (roll > 80) { rarity = 'MAGIC'; modCount = 2; }
    else if (roll > 55) { rarity = 'UNCOMMON'; modCount = 1; }
    else { rarity = 'NORMAL'; modCount = 0; }

    const mods: ItemMod[] = [];
    const pool = [...MOD_POOL];
    for (let i = 0; i < modCount; i++) {
      if (pool.length === 0) break;
      const idx = Math.floor(Math.random() * pool.length);
      const modTemplate = pool.splice(idx, 1)[0];
      mods.push({ ...modTemplate, value: Math.max(1, Math.floor(modTemplate.value * (1 + (levelFactor - 1) * 0.3))) });
    }

    let finalName = base.name;
    if (rarity === 'UNCOMMON' && mods.length > 0) {
      finalName = `${base.name} ${mods[0].name}`;
    } else if (rarity !== 'NORMAL') {
      const prefixes: Record<string, string> = { MAGIC: 'Magic', RARE: 'Rare', LEGENDARY: 'Legendary', UNIQUE: `[Unique]` };
      finalName = `${prefixes[rarity] || ''} ${base.name}`;
    }

    const rarityValueMultiplier: Record<ItemRarity, number> = { NORMAL: 1, UNCOMMON: 1.5, MAGIC: 2.5, RARE: 5, LEGENDARY: 15, UNIQUE: 50 };
    const finalValue = Math.floor(base.value * levelFactor * (rarityValueMultiplier[rarity] || 1));

    return { ...base, name: finalName, rarity, mods, value: finalValue };
  };

  const calculateDerivedStats = (ent: Player | Enemy | any): DerivedStats => {
    const equipped = [ent.weapon, ent.helm, ent.chest, ent.gloves, ent.boots, ent.accessory].filter(Boolean) as Item[];
    const isPlayer = !!ent.class;

    const passiveBonuses: Record<string, number> = { str: 0, int: 0, dex: 0, vit: 0, cha: 0, hp: 0, mp: 0, atk: 0, def: 0, mAtk: 0, mDef: 0, acc: 0, eva: 0, critChance: 0, critDamage: 0 };
    if (ent.skillLevels && ent.skills) {
      ent.skills.forEach((skill: Skill) => {
          const level = ent.skillLevels[skill.id] || 0;
          if (level > 0 && skill.type === 'passive' && skill.passiveStat && skill.passiveVal) {
              passiveBonuses[skill.passiveStat] = (passiveBonuses[skill.passiveStat] || 0) + (skill.passiveVal * level);
          }
      });
    }

    const modValues: Record<string, number> = { str: 0, int: 0, dex: 0, vit: 0, cha: 0, atk: 0, def: 0, mAtk: 0, mDef: 0, hp: 0, mp: 0, critChance: 0 };
    let itemBonusStats: Record<string, number> = { atk: 0, def: 0, mAtk: 0, mDef: 0, maxHp: 0, maxMp: 0 };
    let heavyItemsEquipped = 0;

    equipped.forEach(item => { 
        let multiplier = 1.0;
        
        if (isPlayer && item.weight) {
            const aptitudes = CLASS_APTITUDES[ent.class as keyof typeof CLASS_APTITUDES];
            if (aptitudes) multiplier = aptitudes[item.weight] || 1.0;
            if (item.weight === 'HEAVY') heavyItemsEquipped++;
        }

        if (item.stat) {
            if (item.type === 'weapon' || item.type === 'accessory') itemBonusStats.atk += Math.floor(item.stat * multiplier);
            else itemBonusStats.def += Math.floor(item.stat * multiplier);
        }
        if (item.magicStat) {
             if (item.type === 'weapon') itemBonusStats.mAtk += Math.floor(item.magicStat * multiplier);
             else itemBonusStats.mDef += Math.floor(item.magicStat * multiplier);
        }
        item.mods?.forEach(mod => { 
            modValues[mod.stat] = (modValues[mod.stat] || 0) + Math.floor(mod.value * multiplier); 
        }); 
    });
    
    const buffValues: Record<string, number> = { str: 0, int: 0, dex: 0, vit: 0, atk: 0, def: 0, mAtk: 0, mDef: 0, acc: 0, eva: 0, critChance: 0, maxHp: 0, damage_taken_increase: 0 };
    if (ent.buffs) {
        ent.buffs.forEach((b: Buff) => {
            if (b.stat && (b.type === 'buff' || b.type === 'debuff')) {
                buffValues[b.stat] = (buffValues[b.stat] || 0) + b.value; 
            }
        });
    }

    const effectiveStr = Math.max(0, ent.str + modValues.str + passiveBonuses.str + buffValues.str);
    const effectiveInt = Math.max(0, ent.int + modValues.int + passiveBonuses.int + buffValues.int);
    const effectiveDex = Math.max(0, ent.dex + modValues.dex + passiveBonuses.dex + buffValues.dex);
    const effectiveVit = Math.max(0, ent.vit + modValues.vit + passiveBonuses.vit + buffValues.vit);
    const effectiveCha = Math.max(0, ent.cha + (modValues.cha || 0) + passiveBonuses.cha + (buffValues.cha || 0));
    
    const atk = Math.floor(effectiveStr * 2) + itemBonusStats.atk + modValues.atk + passiveBonuses.atk + buffValues.atk;
    const mAtk = Math.floor(effectiveInt * 2) + itemBonusStats.mAtk + modValues.mAtk + passiveBonuses.mAtk + buffValues.mAtk;
    const def = Math.floor(effectiveVit * 1.5) + itemBonusStats.def + modValues.def + passiveBonuses.def + buffValues.def;
    const mDef = Math.floor(effectiveInt * 1.0) + itemBonusStats.mDef + modValues.mDef + passiveBonuses.mDef + buffValues.mDef;
    
    let speedPenalty = 0, evaPenalty = 0, critPenalty = 0;
    if (isPlayer && heavyItemsEquipped > 0) {
        if (ent.class === 'ARCHER') speedPenalty = 5 * heavyItemsEquipped;
        else if (ent.class === 'ROGUE') { evaPenalty = 10 * heavyItemsEquipped; critPenalty = 5 * heavyItemsEquipped; }
    }
    const effectiveSpeedDex = Math.max(1, effectiveDex - speedPenalty);

    const acc = Math.min(99, Math.floor(85 + (effectiveDex * 0.5) + passiveBonuses.acc + buffValues.acc));
    const eva = Math.max(0, Math.min(75, Math.floor(effectiveDex * 0.8) + passiveBonuses.eva + buffValues.eva - evaPenalty));
    const critChance = Math.max(0, Math.min(80, Math.floor(effectiveDex * 0.5) + passiveBonuses.critChance + (buffValues.critChance || 0) + (modValues.critChance || 0) - critPenalty));
    const critDamage = 150 + (effectiveStr * 2) + passiveBonuses.critDamage;

    const baseMaxHp = ent.maxHp ?? ent.hp; 
    const baseMaxMp = ent.maxMp ?? ent.mp;
    const maxHp = baseMaxHp + modValues.hp + passiveBonuses.hp + (buffValues.maxHp || 0);
    const maxMp = baseMaxMp + modValues.mp + passiveBonuses.mp;
    
    return { 
        effectiveStr, effectiveInt, effectiveDex: effectiveSpeedDex, effectiveVit, effectiveCha,
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

  const addLog = (text: string, type: LogMessage['type'] = 'info') => {
    setLogs(prev => [...prev.slice(-49), { text, type }]);
  };

  const spawnFloatingText = (id: string, text: string, type: FloatingText['type']) => {
      const ft: FloatingText = { id, text, type, key: Date.now() + Math.random() };
      setFloatingTexts(prev => [...prev, ft]);
      setTimeout(() => {
          setFloatingTexts(prev => prev.filter(t => t.key !== ft.key));
      }, 2000);
  };

  const startAtbClock = useCallback(() => {
    if (atbTimerRef.current) return;
    atbTimerRef.current = setInterval(() => {
      setAtbValues(prev => {
        const next = { ...prev };
        let triggeredId: string | null = null;
        
        partyRef.current.forEach(p => {
          if (p.hp > 0 && !triggeredId) {
            const stats = calculateDerivedStats(p);
            const fillRate = 1.0 + (Math.max(1, stats.effectiveDex) * 0.1);
            next[p.id] = Math.min(ATB_MAX, (next[p.id] || 0) + fillRate);
            if (next[p.id] >= ATB_MAX) triggeredId = p.id;
          }
        });
        
        enemiesRef.current.forEach(e => {
          if (e.hp > 0 && !triggeredId) {
            const stats = calculateDerivedStats(e);
            const fillRate = 1.0 + (stats.effectiveDex * 0.1);
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

  const applyDotEffects = (entity: Player | Enemy): { newHp: number, isDead: boolean, activeBuffs: Buff[] } => {
      let newHp = entity.hp;
      let shieldHp = entity.shieldHp || 0;
      let tookDamage = false;
      let addedBuffs: Buff[] = [];
      
      const activeBuffs = entity.buffs
        .map(b => {
          if (b.id === 'rage_buff' && b.duration -1 <= 0) {
            addedBuffs.push({id: 'stun', name: 'Confused', type: 'debuff', stat: 'dex', value: 0, duration: 1});
            addLog(`${entity.name}'s rage subsides, leaving them confused!`, 'info');
          }
          return {...b, duration: b.duration - 1}
        })
        .filter(b => b.duration > 0);

      const expired = entity.buffs.filter(b => !activeBuffs.find(ab => ab.id === b.id));
      expired.forEach(b => addLog(`${b.name} faded from ${entity.name || 'Hero'}.`, 'info'));

      entity.buffs.forEach(b => {
          if (b.id === 'poison' || b.id === 'burn' || b.id === 'bleed') {
              const dmg = Math.max(1, Math.floor(entity.maxHp * b.value));
              
              let damageDealt = dmg;
              if (shieldHp > 0) {
                const shieldDmg = Math.min(shieldHp, damageDealt);
                shieldHp -= shieldDmg;
                damageDealt -= shieldDmg;
              }
              newHp -= damageDealt;
              
              tookDamage = true;
              addLog(`${entity.name || (entity as Player).class} takes ${dmg} ${b.id} damage.`, 'damage');
              const id = (entity as any).instanceId || (entity as any).id;
              spawnFloatingText(id, `-${dmg}`, 'damage');
          }
      });

      if (tookDamage) sounds.playEffect('hit');
      
      return { newHp: Math.max(0, newHp), isDead: newHp <= 0, activeBuffs: [...activeBuffs, ...addedBuffs] };
  };

  const handleTurn = (id: string) => {
    setActingId(null); 

    const isPlayer = id.startsWith('hero');
    let isDead = false;
    let turnSkipped = false;
    
    if (isPlayer) {
        let currentPlayer = partyRef.current.find(p => p.id === id);
        if (currentPlayer) {
            if (currentPlayer.buffs.some(b => b.id === 'stun' || b.id === 'polymorph')) {
                addLog(`${currentPlayer.class} is stunned and cannot act!`, 'info');
                turnSkipped = true;
            }
            const res = applyDotEffects(currentPlayer); 
            isDead = res.isDead;
            setParty(prev => prev.map(p => p.id === id ? { ...p, hp: res.newHp, buffs: res.activeBuffs } : p));
            
            if (isDead) {
                addLog(`${currentPlayer.class} has fallen!`, 'combat');
                const allDead = partyRef.current.every(p => p.hp <= 0); 
                if (allDead) { setGameState('DEATH'); return; }
            }
        }
    } else {
        let currentEnemy = enemiesRef.current.find(e => e.instanceId === id);
        if (currentEnemy) {
            if (currentEnemy.buffs.some(b => b.id === 'stun' || b.id === 'polymorph')) {
                addLog(`${currentEnemy.name} is unable to act!`, 'info');
                turnSkipped = true;
            }
            const res = applyDotEffects(currentEnemy);
            isDead = res.isDead;
            setActiveEnemies(prev => prev.map(e => e.instanceId === id ? { ...e, hp: res.newHp, buffs: res.activeBuffs } : e));
            
            if (isDead) {
                addLog(`${currentEnemy.name} was defeated!`, 'combat');
                const remaining = enemiesRef.current.filter(e => e.hp > 0 && e.instanceId !== id);
                if (remaining.length === 0) {
                     handleVictory(enemiesRef.current);
                     return;
                }
            }
        }
    }

    if (isDead || turnSkipped) {
        setAtbValues(prev => ({ ...prev, [id]: 0 }));
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
    let targetIdx = alivePartyIndices[Math.floor(Math.random() * alivePartyIndices.length)];
    const target = partyRef.current[targetIdx];
    const targetStats = calculateDerivedStats(target);

    let damage = Math.max(1, Math.floor((enemyStats.atk - targetStats.def * 0.5) * (0.8 + Math.random() * 0.4)));
    
    const markedDebuff = target.buffs.find(b => b.id === 'mark_for_death');
    if (markedDebuff) {
        damage = Math.floor(damage * (1 + markedDebuff.value));
    }
    
    const isCrit = Math.random() * 100 < enemyStats.critChance;
    let finalDamage = isCrit ? Math.floor(damage * (enemyStats.critDamage / 100)) : damage;
    const hit = Math.random() * 100 < (enemyStats.acc - targetStats.eva);

    setImpactIds([target.id]);
    setCurrentAnim('physical');
    sounds.playEffect('attack');
    
    setTimeout(() => {
        if (hit) {
            let damageDealt = finalDamage;
            let currentShield = target.shieldHp || 0;
            if (currentShield > 0) {
              const shieldDmg = Math.min(currentShield, damageDealt);
              currentShield -= shieldDmg;
              damageDealt -= shieldDmg;
              addLog(`🛡️ ${target.class}'s barrier absorbs ${shieldDmg} damage!`, 'block');
              spawnFloatingText(target.id, `-${shieldDmg}`, 'block');
            }

            if (damageDealt > 0) {
                spawnFloatingText(target.id, isCrit ? `${damageDealt}!` : `${damageDealt}`, isCrit ? 'crit' : 'damage');
                addLog(`${enemy.name} attacks ${target.class} for ${damageDealt} damage.`, 'damage');
                if (isCrit) sounds.playEffect('crit');
            }

            setParty(prev => prev.map((p, i) => {
                if (i !== targetIdx) return p;
                const newHp = Math.max(0, p.hp - damageDealt);
                return { ...p, hp: newHp, shieldHp: currentShield };
            }));

            if (target.hp - damageDealt <= 0) {
                const stillAlive = partyRef.current.filter((p, i) => i !== targetIdx && p.hp > 0).length;
                if (stillAlive === 0) setGameState('DEATH');
            }
        } else {
            spawnFloatingText(target.id, "MISS", 'miss');
            addLog(`${enemy.name} missed ${target.class}.`, 'miss');
            sounds.playEffect('miss');
        }
        
        setTimeout(() => {
            setImpactIds([]);
            setActingId(null);
            setAtbValues(prev => ({ ...prev, [enemyId]: 0 }));
            startAtbClock();
        }, 500);
    }, 300);
  };

  const handleVictory = (finalEnemies: Enemy[]) => {
    stopAtbClock();
    sounds.playEffect('victory');
    
    let totalXp = 0, totalGold = 0;
    const drops: Item[] = [];
    const magicFind = currentFloor * 0.5;

    finalEnemies.forEach(e => {
        totalXp += e.xpValue;
        totalGold += e.goldValue;
        
        if (Math.random() < 0.2) {
            const baseItem = Math.random() < 0.3 
                ? MATERIALS[Math.floor(Math.random() * MATERIALS.length)]
                : ITEMS[Math.floor(Math.random() * ITEMS.length)];
            drops.push(generateRandomItem(baseItem, currentFloor + 1, magicFind));
        }
    });

    setParty(prev => prev.map(p => {
        if (p.hp <= 0) return p;
        let newXp = p.xp + totalXp, newLevel = p.level, skillPoints = p.skillPoints;
        let nextLevelXp = newLevel * 100;
        while (newXp >= nextLevelXp) {
            newXp -= nextLevelXp;
            newLevel++;
            skillPoints++;
            addLog(`${p.class} reached Level ${newLevel}!`, 'level');
            nextLevelXp = newLevel * 100;
        }
        return { ...p, xp: newXp, level: newLevel, skillPoints };
    }));

    setGold(g => g + totalGold);
    setSharedInventory(inv => [...inv, ...drops]);

    const bossDefeated = finalEnemies.find(e => e.isBoss);
    if (bossDefeated) {
        addLog(`The guardian of Floor ${currentFloor + 1} has been vanquished! The way is clear.`, 'level');
        setDefeatedBosses(prev => new Set(prev).add(currentFloor));
    }

    addLog(`Victory! Gained ${totalXp} XP and ${totalGold} Gold.`, 'loot');
    if (drops.length > 0) addLog(`Found ${drops.length} items.`, 'loot');

    setGameState('VICTORY');
    setIsVictoryTransition(true);

    setTimeout(() => {
        setIsVictoryTransition(false);
        setGameState('EXPLORE');
        sounds.playDungeonTheme(currentFloor);
        setActiveEnemies([]);
        setAtbValues({});
    }, 3000);
  };

  const resetAtb = (id: string) => { 
      setAtbValues(prev => ({ ...prev, [id]: 0 })); 
      setActiveCharIndex(null); 
      setActingId(null);
      startAtbClock(); 
  };

  const handleAttack = () => {
    if (activeCharIndex === null || actingId) return;
    const attacker = party[activeCharIndex];
    let effectiveTargetIndex = targetIndex;
    let target = activeEnemies[effectiveTargetIndex];
    
    if (!target || target.hp <= 0) {
         effectiveTargetIndex = activeEnemies.findIndex(e => e.hp > 0);
         if (effectiveTargetIndex !== -1) {
             setTargetIndex(effectiveTargetIndex);
             target = activeEnemies[effectiveTargetIndex];
         } else return;
    }

    setActingId(attacker.id);
    setCurrentAnim('physical');
    setImpactIds([target.instanceId]);
    setTimeout(() => setImpactIds([]), 400);
    setTimeout(() => {
        const stats = calculateDerivedStats(attacker);
        const targetStats = calculateDerivedStats(target);
        addLog(`⚔️ ${attacker.class} strikes at ${target.name}...`, 'player_action');
        
        let guaranteedCrit = false;
        const vanishBuff = attacker.buffs.find(b => b.id === 'guaranteed_crit');
        if (vanishBuff) {
            guaranteedCrit = true;
            setParty(prev => prev.map(p => p.id === attacker.id ? {...p, buffs: p.buffs.filter(b => b.id !== 'guaranteed_crit')} : p));
        }

        if (Math.random() * 100 > stats.acc) {
          sounds.playEffect('miss');
          addLog(`💨 MISS! The attack whistled past the target.`, 'miss');
          spawnFloatingText(target.instanceId, "MISS", "miss");
        } else {
          let dmg = Math.max(1, stats.atk - Math.floor(targetStats.def * 0.5));
          const markedDebuff = target.buffs.find(b => b.id === 'mark_for_death');
          if (markedDebuff) dmg = Math.floor(dmg * (1 + markedDebuff.value));
          const isCrit = guaranteedCrit || Math.random() * 100 < stats.critChance;

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
          let newEnemies = [...enemiesRef.current];
          
          let targetData = newEnemies.find(e => e.instanceId === target.instanceId);
          if (targetData) {
              let damageDealt = dmg;
              let shield = targetData.shieldHp || 0;
              if (shield > 0) {
                  const shieldDmg = Math.min(shield, damageDealt);
                  shield -= shieldDmg;
                  damageDealt -= shieldDmg;
                  addLog(`🛡️ Barrier absorbs ${shieldDmg} damage!`, 'block');
              }
              const newHp = Math.max(0, targetData.hp - damageDealt);
              newEnemies = newEnemies.map(e => e.instanceId === target.instanceId ? { ...e, hp: newHp, shieldHp: shield } : e);
          }

          setActiveEnemies(newEnemies);
          if (newEnemies.every(e => e.hp <= 0)) { 
              handleVictory(newEnemies); 
              return; 
          }
        }
        resetAtb(attacker.id);
    }, 400);
  };

  const handleCombatUseItem = (item: Item, targetIdx: number) => {
    if (activeCharIndex === null || actingId) return;
    const actor = party[activeCharIndex];
    const target = party[targetIdx];
    
    setSharedInventory(prev => {
        const idx = prev.findIndex(i => i.id === item.id);
        if (idx > -1) {
            const next = [...prev]; next.splice(idx, 1); return next;
        }
        return prev;
    });

    setActingId(actor.id);
    setCurrentAnim('heal');
    setImpactIds([target.id]);
    
    setTimeout(() => setImpactIds([]), 400);
    setTimeout(() => {
        const stats = calculateDerivedStats(target);
        const healAmount = item.stat || 0;
        const mpAmount = item.magicStat || 0; 

        setParty(prev => prev.map((p, i) => {
            if (i === targetIdx) {
                let newHp = p.hp, newMp = p.mp;
                if (healAmount > 0) newHp = Math.min(stats.maxHp, p.hp + healAmount);
                if (mpAmount > 0) newMp = Math.min(stats.maxMp, p.mp + mpAmount);
                return { ...p, hp: newHp, mp: newMp };
            }
            return p;
        }));

        sounds.playEffect('heal');
        addLog(`🧪 ${actor.class} uses ${item.name} on ${target.class}.`, 'heal');
        
        if (healAmount > 0) spawnFloatingText(target.id, `+${healAmount}`, "heal");
        if (mpAmount > 0) spawnFloatingText(target.id, `+${mpAmount} MP`, "heal");

        setActingId(null);
        resetAtb(actor.id);
    }, 400);
  };

  const handleSkill = (skill: Skill, explicitTargetIndex?: number) => {
    if (activeCharIndex === null || actingId) return;
    
    let effectiveTargetIndex = targetIndex;
    if (skill.targetType === 'enemy' && !skill.isAoe) {
        if (explicitTargetIndex !== undefined) {
            effectiveTargetIndex = explicitTargetIndex;
        } else {
            const currentTarget = activeEnemies[effectiveTargetIndex];
            if (!currentTarget || currentTarget.hp <= 0) {
                 const aliveIdx = activeEnemies.findIndex(e => e.hp > 0);
                 if (aliveIdx !== -1) { effectiveTargetIndex = aliveIdx; setTargetIndex(aliveIdx); }
                 else return;
            }
        }
    }

    const attacker = party[activeCharIndex];
    const attackerStats = calculateDerivedStats(attacker);
    const skillLevel = attacker.skillLevels[skill.id] || 0; 
    
    setActingId(attacker.id);
    
    const multipliers = [1.0, 1.15, 1.30, 1.50];
    const levelPowerMult = multipliers[Math.min(3, Math.max(0, skillLevel - 1))];

    sounds.playEffect('skill');
    addLog(`✨ ${attacker.class} uses ${skill.name}!`, 'player_action');
    
    let targets: (Player | Enemy)[] = [];
    if (skill.targetType === 'enemy') {
        setCurrentAnim('magical');
        if (skill.isAoe) targets = enemiesRef.current.filter(e => e.hp > 0);
        else targets = [activeEnemies[effectiveTargetIndex]].filter(Boolean);
    } else {
        setCurrentAnim(skill.type === 'heal' ? 'heal' : 'magical');
        if (skill.isAoe) targets = partyRef.current;
        else {
            const targetCharIndex = explicitTargetIndex !== undefined ? explicitTargetIndex : allyTargetIndex;
            targets = [party[targetCharIndex] || attacker];
        }
    }

    setImpactIds(targets.map(t => (t as Enemy).instanceId || (t as Player).id));
    
    setTimeout(() => {
        attacker.mp -= skill.cost;
      
        targets.forEach(t => {
            let target = t;
            const targetStats = calculateDerivedStats(target);
            let damage = 0, heal = 0;
            let buffsToAdd: Buff[] = [];

            if (skill.type === 'attack') {
                const isMagic = ['m_', 'c_smite'].some(prefix => skill.id.startsWith(prefix));
                const power = isMagic ? attackerStats.mAtk : attackerStats.atk;
                const defense = isMagic ? targetStats.mDef : targetStats.def;
                damage = Math.max(1, Math.floor((power * (skill.basePower || 1) * levelPowerMult) - (defense * 0.5)));
            } else if (skill.type === 'heal') {
                heal = Math.floor(attackerStats.mAtk * (skill.basePower || 1) * levelPowerMult);
            }

            switch (skill.id) {
                case 'w_shield_block': buffsToAdd.push({ id: 'def_buff', name: 'Shield Block', type: 'buff', stat: 'def', value: Math.floor(attackerStats.effectiveVit * 1.5), duration: 3 }); break;
                case 'w_shattering_blow': buffsToAdd.push({ id: 'def_debuff', name: 'Armor Shattered', type: 'debuff', stat: 'def', value: -10, duration: 3 }); break;
                case 'w_war_cry': buffsToAdd.push({ id: 'atk_buff', name: 'War Cry', type: 'buff', stat: 'atk', value: Math.floor(attackerStats.effectiveStr * 0.5), duration: 3 }); break;
                case 'w_impale': if (Math.random() < 0.3) buffsToAdd.push({ id: 'bleed', name: 'Bleeding', type: 'debuff', stat: 'dex', value: 0.05, duration: 3 }); break;
                case 'w_earthshatter': if (Math.random() < 0.25) buffsToAdd.push({ id: 'stun', name: 'Stunned', type: 'debuff', stat: 'dex', value: 0, duration: 1 }); break;
                case 'm_firebolt': if (Math.random() < 0.2) buffsToAdd.push({ id: 'burn', name: 'Burning', type: 'debuff', stat: 'dex', value: 0.04, duration: 3 }); break;
                case 'm_frostbite': if (Math.random() < 0.5) buffsToAdd.push({ id: 'slow', name: 'Slowed', type: 'debuff', stat: 'dex', value: -Math.floor(attackerStats.effectiveInt * 0.5), duration: 2 }); break;
                case 'm_magic_shield': buffsToAdd.push({ id: 'mdef_buff', name: 'Magic Shield', type: 'buff', stat: 'mDef', value: Math.floor(attackerStats.effectiveInt * 1.2), duration: 4 }); break;
                case 'm_blizzard': if (Math.random() < 0.8) buffsToAdd.push({ id: 'slow', name: 'Slowed', type: 'debuff', stat: 'dex', value: -Math.floor(attackerStats.effectiveInt * 0.4), duration: 3 }); break;
                case 'm_telekinetic_shock': if (Math.random() < 0.2) buffsToAdd.push({ id: 'stun', name: 'Stunned', type: 'debuff', stat: 'dex', value: 0, duration: 1 }); break;
                case 'm_time_warp': setAtbValues(prev => ({ ...prev, [target.id || (target as Enemy).instanceId]: ATB_MAX })); break;
                case 'c_bless': 
                    buffsToAdd.push({ id: 'str_buff', name: 'Blessing', type: 'buff', stat: 'str', value: Math.floor(attackerStats.effectiveInt * 0.3), duration: 4 });
                    buffsToAdd.push({ id: 'int_buff', name: 'Blessing', type: 'buff', stat: 'int', value: Math.floor(attackerStats.effectiveInt * 0.3), duration: 4 });
                    break;
                case 'c_cure': target.buffs = target.buffs.filter(b => b.type === 'buff'); addLog(`${target.name}'s ailments were cleansed!`, 'heal'); break;
                case 'c_barrier': target.shieldHp = (target.shieldHp || 0) + Math.floor(attackerStats.mAtk * 2); addLog(`${target.name} is protected by a barrier!`, 'heal'); break;
                case 'r_gouge': if (Math.random() < 0.5) buffsToAdd.push({ id: 'acc_debuff', name: 'Gouged', type: 'debuff', stat: 'acc', value: -20, duration: 3 }); break;
                case 'r_poison_stab': buffsToAdd.push({ id: 'poison', name: 'Poisoned', type: 'debuff', stat: 'dex', value: 0.05, duration: 4 }); break;
                case 'r_vanish': buffsToAdd.push({ id: 'guaranteed_crit', name: 'Vanished', type: 'buff', stat: 'critChance', value: 100, duration: 2 }); addLog(`${attacker.name} vanishes!`, 'info'); break;
                case 'r_mark_for_death': buffsToAdd.push({ id: 'mark_for_death', name: 'Marked', type: 'debuff', stat: 'damage_taken_increase', value: 0.25, duration: 5 }); break;
            }

            if (damage > 0) {
                let shield = target.shieldHp || 0;
                if (shield > 0) {
                    const shieldDmg = Math.min(shield, damage);
                    target.shieldHp = shield - shieldDmg;
                    damage -= shieldDmg;
                    addLog(`🛡️ Barrier on ${target.name} absorbs ${shieldDmg} damage!`, 'block');
                }
                target.hp = Math.max(0, target.hp - damage);
                spawnFloatingText((target as Enemy).instanceId || (target as Player).id, `-${damage}`, 'damage');
            }
            if (heal > 0) {
                target.hp = Math.min(targetStats.maxHp, target.hp + heal);
                spawnFloatingText((target as Enemy).instanceId || (target as Player).id, `+${heal}`, 'heal');
            }

            buffsToAdd.forEach(buff => {
                const existing = target.buffs.find(b => b.id === buff.id);
                if (existing) existing.duration = Math.max(existing.duration, buff.duration);
                else target.buffs.push(buff);
                addLog(`${target.name} gains ${buff.name}!`, 'info');
            });
        });

        setParty([...party]);
        setActiveEnemies([...activeEnemies]);
        
        if (enemiesRef.current.every(e => e.hp <= 0)) {
            handleVictory(enemiesRef.current);
            return;
        }

        setTimeout(() => {
            setImpactIds([]);
            resetAtb(attacker.id);
        }, 500);
    }, 400);
  };

  const handleCastSkillOutCombat = (casterIndex: number, targetIndex: number, skill: Skill) => {
      const caster = party[casterIndex];
      const target = party[targetIndex];
      const level = caster.skillLevels[skill.id] || 0;
      const powerMult = 1 + (level - 1) * 0.2;
      const targetStats = calculateDerivedStats(target);

      if (caster.mp < skill.cost) {
          addLog(`${caster.class} doesn't have enough MP!`, 'miss');
          sounds.playEffect('miss');
          return;
      }

      if ((skill as any).revive) {
          if (target.hp > 0) {
              addLog(`${target.class} is already alive!`, 'miss');
              return;
          }
      } else if (skill.type === 'heal' && target.hp <= 0) {
          addLog(`${target.class} is dead! Cannot heal.`, 'miss');
          return;
      }

      setParty(prev => {
          const next = [...prev];
          const c = next[casterIndex];
          const t = next[targetIndex];
          c.mp -= skill.cost;

          if ((skill as any).revive) {
              const healAmt = Math.floor(targetStats.maxHp * 0.3);
              t.hp = healAmt;
              t.buffs = []; 
              addLog(`${caster.class} revives ${target.class}!`, 'heal');
              sounds.playEffect('heal');
          } else if (skill.type === 'heal') {
              const healAmt = Math.floor(caster.int * 1.5 * powerMult);
              t.hp = Math.min(targetStats.maxHp, t.hp + healAmt);
              addLog(`${caster.class} heals ${target.class} for ${healAmt} HP.`, 'heal');
              sounds.playEffect('heal');
          } else {
              addLog(`${caster.class} casts ${skill.name} on ${target.class}.`, 'player_action');
              sounds.playEffect('skill');
          }
          return next;
      });
  };

  const handleEquip = (item: Item, playerIndex: number) => {
    if (item.minLevel && party[playerIndex].level < item.minLevel) {
        sounds.playEffect('miss');
        return;
    }

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
      sounds.playEffect('menu_select');
    }
  };

  const handleConfirmParty = () => {
    const newParty: Player[] = creatingParty.map((cls, i) => ({
      id: `hero_${Date.now()}_${i}`,
      class: cls.type,
      avatar: cls.avatar,
      name: cls.type,
      level: 1, xp: 0,
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
    sounds.playEffect('seal');
    setIsSealingTransition(true);
  };

  const handleUpgradeSkill = (playerIndex: number, skillId: string) => {
    setParty(prev => {
      const next = [...prev];
      const p = next[playerIndex];
      if (p.skillPoints > 0) {
        const cur = p.skillLevels[skillId] || 0;
        if (cur < 4) { 
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

  const spawnEnemies = () => {
    const enemyCount = Math.floor(Math.random() * 2) + 2;
    
    const minLevel = currentFloor + 1;
    const maxLevel = currentFloor + 2;

    let potential = ENEMIES.filter(e => e.level >= minLevel && e.level <= maxLevel && !e.isBoss);
    
    if (potential.length === 0) {
      potential = ENEMIES.filter(e => e.level <= maxLevel && !e.isBoss);
      if (potential.length === 0) potential = [ENEMIES[0]];
    }
    
    const newEnemies: Enemy[] = [];
    const newAtb: Record<string, number> = {};
    for (let i = 0; i < enemyCount; i++) {
      const template = potential[Math.floor(Math.random() * potential.length)];
      const instId = `enemy-${Date.now()}-${i}`;
      newEnemies.push({ ...template, instanceId: instId, hp: template.maxHp, maxHp: template.maxHp, mp: template.maxMp, maxMp: template.maxMp, buffs: [] });
      newAtb[instId] = Math.random() * 30;
    }
    party.forEach(p => newAtb[p.id] = Math.random() * 40);
    setAtbValues(newAtb);
    setActiveEnemies(newEnemies);
    setStepsSinceBattle(0);
    addLog(`⚔️ ENCOUNTER! Monsters emerge from the shadows.`, 'combat');
    
    sounds.playEffect('encounter');
    setIsBattleTransition(true);
  };

  const spawnBoss = (floorIndex: number) => {
    const bossLevel = floorIndex + 1;
    const boss = ENEMIES.find(e => e.isBoss && e.level > bossLevel - 2 && e.level < bossLevel + 2);

    if (!boss) {
        addLog("Error: Guardian not found for this floor.", 'miss');
        setDefeatedBosses(prev => new Set(prev).add(floorIndex));
        return;
    }

    const instId = `boss-${Date.now()}`;
    const newEnemies: Enemy[] = [{ ...boss, instanceId: instId, hp: boss.maxHp, maxHp: boss.maxHp, mp: boss.maxMp, maxMp: boss.maxMp, buffs: [] }];
    const newAtb: Record<string, number> = { [instId]: 0 };
    party.forEach(p => newAtb[p.id] = Math.random() * 40);

    setAtbValues(newAtb);
    setActiveEnemies(newEnemies);
    addLog(`A powerful presence emerges! You face the ${boss.name}!`, 'combat');
    sounds.playEffect('encounter');
    setIsBattleTransition(true);
  };

  const move = useCallback((dirMod: number) => {
    if (gameState !== 'EXPLORE' || isBattleTransition || isVictoryTransition || showMerchantIntro || showMerchantPrompt || dialogue || isMapExpanded || doorPhase !== 'none' || floorTransitionState !== 'none' || isFountainMenuOpen || isTravelMenuOpen) return;
    
    const vecs = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
    const vec = vecs[currentDir];
    const nx = currentPos.x + vec.x * -dirMod;
    const ny = currentPos.y + vec.y * -dirMod;

    if (!currentMap || ny < 0 || ny >= currentMap.length || nx < 0 || nx >= currentMap[0].length) return;
    
    const tile = currentMap[ny][nx];

    if (tile === 1) return;

    if (dirMod === -1 && [2, 4, 5, 6, 7, 8, 10, 12].includes(tile)) return; 

    if (tile === 9) {
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

    setStepsSinceBattle(prev => prev + 1);
    setCurrentPos({ x: nx, y: ny });
    
    if (dirMod === -1 && (tile === 0 || tile === 9) && currentFloor >= 0) {
        if (Math.random() < 0.18 && stepsSinceBattle > 10) {
            spawnEnemies();
        }
    }

  }, [gameState, currentDir, currentFloor, currentPos, currentMap, explored, isBattleTransition, isVictoryTransition, showMerchantIntro, showMerchantPrompt, dialogue, isMapExpanded, stepsSinceBattle, doorPhase, floorTransitionState, isFountainMenuOpen, isTravelMenuOpen]);

  const turn = useCallback((rot: number) => {
    if (gameState !== 'EXPLORE' || isBattleTransition || isVictoryTransition || showMerchantIntro || showMerchantPrompt || dialogue || isMapExpanded || doorPhase !== 'none' || floorTransitionState !== 'none' || isFountainMenuOpen || isTravelMenuOpen) return;
    sounds.playEffect('turn');
    setCurrentDir((currentDir + rot + 4) % 4);
  }, [gameState, currentDir, isBattleTransition, isVictoryTransition, showMerchantIntro, showMerchantPrompt, dialogue, isMapExpanded, doorPhase, floorTransitionState, isFountainMenuOpen, isTravelMenuOpen]);

  const handleInteraction = () => {
      if (!interactionTarget) return;
      const { type, pos, tileId } = interactionTarget;
      const { x, y } = pos;

      if (type === 'door') {
          sounds.playEffect('door_open');
          setDoorPhase('closing');
          setTimeout(() => {
              if (currentFloor < -1) {
                  if (townExitState) {
                      setCurrentFloor(-1);
                      setCurrentPos(townExitState.pos);
                      setCurrentDir(townExitState.dir);
                      setTownExitState(null);
                  }
              } else {
                  setTownExitState({ pos: currentPos, dir: (currentDir + 2) % 4 });
                  const doorKey = `${x},${y}`;
                  const houseId = DOOR_LOCATIONS[doorKey];
                  if (houseId && INTERIOR_MAPS[houseId]) {
                      setCurrentFloor(houseId);
                      setCurrentPos(INTERIOR_MAPS[houseId].entryPos);
                      setCurrentDir(Direction.NORTH); 
                  }
              }
              setDoorPhase('opening');
          }, 400); 
          setTimeout(() => setDoorPhase('none'), 800);
      } else if (type === 'stairs') {
          sounds.playEffect('stairs');
          if (tileId === 3) {
              const isBossFloor = (currentFloor + 1) % 5 === 0 && (currentFloor + 1) > 0;
              if (isBossFloor && !defeatedBosses.has(currentFloor)) {
                  addLog("A powerful presence blocks the way!", 'combat');
                  spawnBoss(currentFloor);
                  return;
              }
              if (currentFloor === -1) setFloorTransitionState('descending');
              else if (currentFloor + 1 >= (dungeonData?.floors.length || 0)) {
                  addLog(`🏆 You have conquered the final floor! Returning to surface...`, 'combat');
                  setTimeout(() => setGameState('TITLE'), 3000);
              } else {
                  setFloorTransitionState('descending');
              }
          } else if (tileId === 11) {
              setFloorTransitionState('ascending');
          }
      } else if (type === 'chest') {
          sounds.playEffect('loot');
          
          const partyAverageLevel = Math.max(1, Math.floor(party.reduce((sum, p) => sum + p.level, 0) / party.length));
          const availableItems = ITEMS.filter(item => (item.minLevel || 1) <= partyAverageLevel && item.type !== 'consumable' && item.type !== 'material');
          
          const baseItem = availableItems.length > 0 
              ? availableItems[Math.floor(Math.random() * availableItems.length)]
              : ITEMS[0];

          const magicFind = 5 + (currentFloor * 0.75);
          const rolledItem = generateRandomItem(baseItem, partyAverageLevel, magicFind);
          
          setSharedInventory(prev => [...prev, rolledItem]);
          
          const goldRoll = 25 + Math.floor(Math.random() * 25);
          setGold(g => g + goldRoll);
          addLog(`💰 Found ${rolledItem.name} and ${goldRoll} gold coins!`, 'loot');
          
          setDungeonData(prev => {
              if (!prev) return prev;
              const newFloors = [...prev.floors];
              newFloors[currentFloor][y][x] = 0;
              return {...prev, floors: newFloors};
          });
          setInteractionTarget(null);
      } else if (type === 'merchant') {
          if (currentFloor === -1 && !hasMetMerchant) setShowMerchantIntro(true);
          else setShowMerchantPrompt(true);
      } else if (type === 'npc') {
          if (currentFloor === -1) return;
          if (currentFloor < -1) {
              if (tileId === 6) {
                  setDialogueSpeaker({ name: "Lost Traveler", avatar: AVATAR_TRAVELER });
                  setDialogue(["Have you seen a hooded man?", "He is not what he seems... Be wary."]);
              } else if (tileId === 8) {
                  setDialogueSpeaker({ name: "Old Man", avatar: AVATAR_VILLAGER });
                  setDialogue(["The Eye... it feeds on memory.", "Don't let it take yours."]);
              }
          } else if (tileId === 12) {
              setDialogueSpeaker({ name: "Echo of the Abyss", avatar: AVATAR_GHOST });
              setDialogue(["This place is not real... it is a memory.", "The Eye is a lens, focused on a forgotten time.", "To leave is not to walk, but to remember who you were."]);
              setDungeonData(prev => {
                if (!prev) return prev;
                const newFloors = [...prev.floors];
                newFloors[currentFloor][y][x] = 0;
                return {...prev, floors: newFloors};
              });
              setInteractionTarget(null);
          }
      } else if (type === 'fountain') {
          sounds.playEffect('heal');
          if (!discoveredFountains.includes(currentFloor)) {
              setDiscoveredFountains(prev => [...prev, currentFloor].sort((a,b)=>a-b));
              addLog(`You've discovered a new Fountain of Memory.`, 'info');
          }
          setIsFountainMenuOpen(true);
      }
  };

  const generateMerchantStock = () => {
    const levels = party.map(p => p.level);
    levels.sort((a, b) => a - b);
    const medianLevel = levels[Math.floor(levels.length / 2)] || 1;
    const levelFactor = 1.25 + (medianLevel - 1) * 0.25;
    const magicFind = medianLevel * 0.6;
    const stock: Item[] = [];
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const base = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const item = generateRandomItem(base, levelFactor, magicFind);
      stock.push(item);
    }
    setMerchantInventory(stock);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState !== 'EXPLORE') return;
        switch(e.key) {
            case 'w': case 'W': case 'ArrowUp': move(-1); break;
            case 's': case 'S': case 'ArrowDown': move(1); break;
            case 'a': case 'A': case 'ArrowLeft': turn(-1); break;
            case 'd': case 'D': case 'ArrowRight': turn(1); break;
            case 'e': case 'E': case 'Enter': case ' ': handleInteraction(); break;
            case 'm': case 'M': setIsMapExpanded(prev => !prev); break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, move, turn, handleInteraction]);

  const renderLogs = (ref?: React.RefObject<HTMLDivElement>) => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1 text-sm md:text-base font-mono bg-black/60 h-full">
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
                    <span className="opacity-30 mr-2 text-xs">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
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
        @keyframes prompt-glitch { 0% { clip: rect(44px, 9999px, 56px, 0); transform: skew(0.1deg); } 5% { clip: rect(12px, 9999px, 86px, 0); transform: skew(0.5deg); } 10% { clip: rect(67px, 9999px, 12px, 0); transform: skew(0.2deg); } 15% { clip: rect(0, 9999px, 0, 0); transform: skew(0); } 100% { clip: rect(0, 9999px, 0, 0); transform: skew(0); } }
        .animate-prompt-glitch { animation: prompt-glitch 2s infinite; }
      `}} />

      {doorPhase !== 'none' && <div className={`absolute inset-0 bg-black z-[1000] transition-opacity duration-300 pointer-events-none ${doorPhase === 'closing' ? 'opacity-100' : 'opacity-0'}`} />}
      {isSealingTransition && <SealingTransition onComplete={() => { setIsSealingTransition(false); setGameState('LORE'); }} />}
      {dialogue && dialogueSpeaker && <DialogueBox speaker={dialogueSpeaker} lines={dialogue} onClose={() => { setDialogue(null); setDialogueSpeaker(null); }} />}
      {isFountainMenuOpen && <FountainMenu isTown={currentFloor === -1} onSave={() => { saveGame(); setIsFountainMenuOpen(false); }} onTravel={() => setIsTravelMenuOpen(true)} onDrink={() => { sounds.playEffect('heal'); addLog("💧 The water restores you completely.", 'heal'); setParty(p => p.map(char => { const stats = calculateDerivedStats(char); return { ...char, hp: stats.maxHp, mp: stats.maxMp }; })); setIsFountainMenuOpen(false); }} onClose={() => setIsFountainMenuOpen(false)} />}
      {isTravelMenuOpen && <TravelMenu discoveredFountains={discoveredFountains} onTravel={handleFastTravel} onClose={() => setIsTravelMenuOpen(false)} />}
      {interactionTarget && !dialogue && !isMapExpanded && !showMerchantPrompt && !isBattleTransition && !isVictoryTransition && doorPhase === 'none' && floorTransitionState === 'none' && !isFountainMenuOpen && !isTravelMenuOpen && (
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-200 pointer-events-auto cursor-pointer" onClick={handleInteraction}>
              <div className="bg-black/80 border-2 border-emerald-400 p-3 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex flex-col items-center">
                  <div className="text-emerald-300 font-bold uppercase tracking-widest text-sm mb-1">{interactionTarget.label}</div>
                  <div className="text-[10px] text-emerald-600 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50 font-black tracking-[0.2em] animate-pulse">
                      [E] INTERACT
                  </div>
              </div>
          </div>
      )}

      {isMapExpanded && (
        <div className="absolute inset-0 z-[100] bg-black/95 flex flex-col p-4 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-emerald-800 pb-2">
                <span className="text-emerald-400 font-black uppercase tracking-widest text-xl">Tactical Map</span>
                <button onClick={() => setIsMapExpanded(false)} className="retro-button px-4 py-2 text-sm border-red-500 text-red-500 hover:bg-red-900"> CLOSE [M] </button>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden border-2 border-emerald-900/50 bg-black">
                <Minimap pos={currentPos} dir={currentDir} floor={currentFloor} explored={explored[currentFloor] || new Set()} mapData={currentMap} expanded={true} />
            </div>
            <div className="mt-2 text-center text-sm text-emerald-800 font-bold uppercase"> {currentFloor === -1 ? 'SAFE HAVEN' : `Floor B${currentFloor + 1}`} • {explored[currentFloor]?.size || 0} Sectors Charted </div>
        </div>
      )}

      {isVictoryTransition && <VictoryTransition />}
      {isBattleTransition && <BattleTransition onComplete={() => { setIsBattleTransition(false); setGameState('COMBAT'); startAtbClock(); }} />}
      {floorTransitionState !== 'none' && <FloorTransition floor={currentFloor} type={floorTransitionState} onMidpoint={() => { if (floorTransitionState === 'descending') { if (currentFloor === -1) { setCurrentFloor(0); const pos = dungeonData?.stairsUpLocations[0]; if (pos) setCurrentPos(pos); setCurrentDir(Direction.NORTH); } else { const targetFloor = currentFloor + 1; if (dungeonData?.floors[targetFloor]) { setCurrentFloor(targetFloor); const pos = dungeonData.stairsUpLocations[targetFloor]; if (pos) setCurrentPos(pos); } } } else { if (currentFloor === 0) { setCurrentFloor(-1); setCurrentPos({ x: 7, y: 2 }); setCurrentDir(Direction.SOUTH); } else { const targetFloor = currentFloor - 1; setCurrentFloor(targetFloor); const pos = dungeonData?.stairsDownLocations[targetFloor]; if (pos) setCurrentPos(pos); } } }} onComplete={() => setFloorTransitionState('none')} />}
      {showMerchantIntro && <MerchantConversation merchantSprite={MERCHANT_AVATAR} onComplete={() => { setShowMerchantIntro(false); setHasMetMerchant(true); setShowMerchantPrompt(true); }} />}
      {showMerchantPrompt && !showMerchantIntro && (
        <div className="absolute inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#020402] border-4 border-emerald-500 p-8 w-full shadow-[0_0_80px_rgba(51,255,51,0.2)] flex flex-col items-center gap-8 max-w-md relative">
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                <div className="text-center flex flex-col items-center">
                    {MERCHANT_AVATAR ? (<div className="w-32 h-32 mb-6 border-2 border-emerald-900 bg-emerald-950/20 p-4 shadow-[0_0_30px_rgba(51,255,51,0.3)] relative group"> <img src={MERCHANT_AVATAR} className="w-full h-full object-contain pixelated relative z-10 brightness-125" alt="Merchant" /> <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" /> <div className="absolute inset-0 bg-emerald-500/20 animate-prompt-glitch pointer-events-none" /> </div>) : (<div className="text-4xl mb-2">💎</div>)}
                    <h3 className="text-3xl font-black text-emerald-400 tracking-[0.4em] uppercase mb-4 text-shadow-glow">INCOMING SIGNAL</h3>
                    <div className="text-sm md:text-base text-emerald-600 leading-relaxed font-bold bg-emerald-950/20 p-4 border border-emerald-900"> <span className="text-emerald-300">"TRANSFER REQUEST DETECTED...</span> <br/>Greetings, data-travelers. I have salvaged treasures for your credits. Do you accept the connection?" </div>
                </div>
                <div className="flex gap-6 w-full">
                    <button onClick={() => { setShowMerchantPrompt(false); generateMerchantStock(); setGameState('MERCHANT'); }} className="flex-1 retro-button py-4 text-base md:text-lg border-emerald-400 hover:scale-105 transition-transform">ACCEPT_LINK</button>
                    <button onClick={() => setShowMerchantPrompt(false)} className="flex-1 retro-button py-4 text-base md:text-lg border-red-900 text-red-500 hover:bg-red-900/40">ABORT</button>
                </div>
            </div>
        </div>
      )}
      
      {gameState === 'TITLE' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050000] overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#150000_0%,#000_80%)] z-0" />
            <div className="absolute inset-0 opacity-[0.25] pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #331111 40px, #331111 42px), repeating-linear-gradient(90deg, transparent, transparent 80px, #331111 80px, #331111 82px)', backgroundSize: '160px 80px' }} />
            <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                <div className="absolute top-0 left-0 w-[300%] h-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(60,0,0,0.15)_0%,transparent_70%)] animate-fog-scroll" />
                <div className="absolute top-1/2 left-0 w-[400%] h-[300px] bg-[linear-gradient(to_right,transparent_0%,rgba(40,0,0,0.25)_50%,transparent_100%)] blur-[70px] animate-mist-scroll opacity-60" />
            </div>
            <div className={`absolute inset-0 bg-black transition-opacity duration-[2000ms] pointer-events-none z-[60] ${isDescending ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`z-[70] flex flex-col items-center space-y-10 max-w-4xl w-full relative transition-all duration-1000 ${isDescending ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="flex flex-col items-center space-y-2 relative group cursor-default text-center">
                    <div className="text-[#882222] font-serif tracking-[1.5em] text-xs md:text-base uppercase animate-pulse mb-2 font-bold"> &mdash; FORSAKEN DEPTHS &mdash; </div>
                    <div className="relative">
                        <div className="text-sm md:text-xl font-serif text-[#aa3333] tracking-[0.8em] mb-2 italic opacity-90 uppercase">Dungeon of the</div>
                        <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ff4444] via-[#cc0000] to-[#220000] tracking-tighter drop-shadow-[0_10px_30px_rgba(200,0,0,0.7)] relative z-10 font-serif leading-none filter drop-shadow(0 0 10px #ff000033)" style={{ textShadow: '4px 4px 0px #000, -2px -2px 0px #000, 0 0 50px rgba(136,0,0,0.8)' }}>CRIMSON EYE</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-6 w-full max-w-sm mt-10 px-6">
                    {saveGameExists && (
                        <button onClick={() => { sounds.init(); sounds.playEffect('menu_select'); setIsDescending(true); setTimeout(() => { setIsDescending(false); loadGame(); }, 2500); }} className="group relative px-8 py-4 bg-[#00081a] border-2 border-[#112244] hover:border-[#4488ff] hover:bg-[#00001a] transition-all duration-300 overflow-hidden text-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-sm">
                            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,80,200,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-xl md:text-2xl font-black tracking-[0.4em] text-[#3366aa] group-hover:text-[#4488ff] uppercase relative z-10 flex items-center justify-center gap-4 transition-all group-hover:scale-105" style={{ textShadow: '2px 2px 0px #000' }}>CONTINUE</span>
                        </button>
                    )}
                    <button onClick={() => { sounds.init(); sounds.playEffect('menu_select'); setIsDescending(true); setTimeout(() => { setIsDescending(false); setGameState('CREATION'); setCreatingParty([]); setCreationPhase('SELECTING'); }, 2500); }} className="group relative px-8 py-6 bg-[#080000] border-2 border-[#441111] hover:border-[#ff4444] hover:bg-[#1a0000] transition-all duration-300 overflow-hidden text-center shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-sm">
                        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(200,0,0,0.3),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xl md:text-2xl font-black tracking-[0.4em] text-[#aa3333] group-hover:text-[#ff4444] uppercase relative z-10 flex items-center justify-center gap-4 transition-all group-hover:scale-105" style={{ textShadow: '2px 2px 0px #000' }}>NEW GAME</span>
                    </button>
                    <div className="text-[10px] md:text-xs text-[#552222] text-center mt-12 font-serif tracking-[0.3em] italic opacity-70 uppercase font-black"> Fate waits in the dark. </div>
                </div>
            </div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-[2500ms] ease-in-out" ${isDescending ? 'scale-[50] rotate-0 z-50' : 'scale-100 rotate-0 z-0'}`}>
                <div className={`w-32 h-32 md:w-48 md:h-48 bg-[#0a0000] rounded-[70%_30%_70%_30%] relative shadow-[0_0_100px_rgba(200,0,0,0.6)] flex items-center justify-center overflow-hidden border-[3px] border-[#551111] ${!isDescending ? 'animate-pulsate-eye rotate-[45deg]' : 'rotate-[45deg]'}`}>
                    <div className="w-full h-full absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#330000_0%,transparent_80%)] opacity-70" />
                    <div className="w-24 h-24 md:w-36 md:h-36 -rotate-[45deg] relative flex items-center justify-center">
                        <div className={`w-20 h-20 md:w-30 md:h-30 bg-[#cc0000] rounded-full flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] border-2 border-[#ff444444] ${!isDescending ? 'animate-look-around' : ''}`}>
                            <div className="w-4 h-16 md:w-6 md:h-24 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#000]" />
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-black rounded-full opacity-60 blur-[4px]" />
                            <div className="absolute inset-0 border-[4px] border-dotted border-[#ff000044] rounded-full animate-spin-slow" />
                            <div className="w-5 h-5 md:w-8 md:h-8 bg-white/40 rounded-full absolute top-1/4 left-1/4 blur-[2px] opacity-80" />
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-white/60 rounded-full absolute top-[20%] left-[35%] blur-[1px]" />
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: ` @keyframes fog-scroll { 0% { transform: translateX(-25%) translateY(-5%); } 50% { transform: translateX(0%) translateY(0%); } 100% { transform: translateX(-25%) translateY(-5%); } } .animate-fog-scroll { animation: fog-scroll 30s infinite ease-in-out; } @keyframes mist-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-mist-scroll { animation: mist-scroll 20s infinite linear; } @keyframes pulsate-eye { 0%, 100% { transform: rotate(45deg) scale(1); box-shadow: 0 0 80px rgba(150,0,0,0.5); } 50% { transform: rotate(45deg) scale(1.03); box-shadow: 0 0 120px rgba(255,0,0,0.7); } } .animate-pulsate-eye { animation: pulsate-eye 4s infinite ease-in-out; } @keyframes look-around { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-8px, -4px); } 40% { transform: translate(8px, 4px); } 60% { transform: translate(-6px, 8px); } 80% { transform: translate(10px, -6px); } } .animate-look-around { animation: look-around 8s infinite ease-in-out; } @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 12s infinite linear; } `}} />
        </div>
      )}

      {gameState === 'LORE' && <LoreCutscene onComplete={() => setGameState('GENERATING')} />}
      {gameState === 'GENERATING' && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-black text-emerald-500 font-mono">
            <div className="text-6xl mb-4 animate-pulse">⚙️</div>
            <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Constructing the Abyss...</div>
            <div className="mt-4 w-64 h-2 bg-emerald-900 overflow-hidden rounded-full"> <div className="h-full bg-emerald-500 w-full animate-[loading-bar_3s_infinite_linear]" /> </div>
            <style dangerouslySetInnerHTML={{ __html: ` @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } `}} />
        </div>
      )}
      {gameState === 'CREATION' && (
        <div className="absolute inset-0 z-50 flex flex-col bg-black text-emerald-500 font-mono select-none overflow-hidden">
            <div className="z-10 flex flex-col h-full p-4 md:p-8">
                <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
                    <div className="w-full md:w-1/3 max-w-sm flex flex-col border-2 border-emerald-900/50 bg-black/40 p-2 shrink-0">
                        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                          <div className="grid grid-cols-1 gap-2">
                            {CLASSES.map((cls) => (
                                <button key={cls.type} onClick={() => handleAddChar(cls)} disabled={creatingParty.length >= 3} className={`relative group flex items-center gap-3 p-2 border-2 text-left transition-all duration-200 ${creatingParty.length >= 3 ? 'opacity-40 border-gray-900 cursor-not-allowed' : 'border-emerald-900/60 hover:border-emerald-500 hover:bg-emerald-950/30'}`}>
                                    <div className="w-12 h-12 shrink-0 border border-emerald-800 bg-black relative overflow-hidden"> <img src={cls.avatar} className="w-full h-full object-contain pixelated" alt={cls.type} /> </div>
                                    <div className="flex-1 min-w-0"> <div className="text-lg font-black text-emerald-300 uppercase leading-none mb-1">{cls.type}</div> <div className="text-sm text-emerald-600/80 leading-tight">{cls.description.substring(0, 40)}...</div> </div>
                                    <div className="text-xl text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-2">+</div>
                                </button>
                            ))}
                          </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 min-w-0 h-full relative">
                        <div className="flex-1 flex flex-row gap-4 h-full min-h-0 perspective-[1000px]">
                            {creatingParty.length === 0 && ( <div className="w-full h-full flex flex-col items-center justify-center text-emerald-900/40 border-4 border-dashed border-emerald-900/20 bg-emerald-950/5 animate-pulse"> <div className="text-6xl mb-4 opacity-30">⚰️</div> <div className="text-2xl font-black uppercase tracking-widest">ROSTER EMPTY</div> <div className="text-base mt-2">Initializing Soul Transfer...</div> </div> )}
                            {creatingParty.map((cls, i) => (
                                <div key={i} className="relative group animate-in zoom-in duration-500 h-full flex-1 min-w-0 shadow-2xl hover:flex-[1.1] transition-all ease-out">
                                    <div className="flex-1 overflow-hidden flex flex-col h-full border-4 border-emerald-900/50"> <CharacterCard player={{...cls, class: cls.type, level: 1}} stats={calculateDerivedStats({...cls, skillLevels: {}, buffs: []})} /> </div>
                                    <button onClick={() => { setCreatingParty(prev => prev.filter((_, idx) => idx !== i)); if (creationPhase === 'CONFIRMING') setCreationPhase('SELECTING'); }} className="absolute -top-3 -right-3 w-8 h-8 bg-red-900 border-2 border-red-500 text-white flex items-center justify-center font-black text-lg hover:bg-red-600 z-50 shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all hover:scale-110 rounded-full">✕</button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-4 border-t border-emerald-900 shrink-0">
                            {creationPhase === 'CONFIRMING' ? ( <button onClick={handleConfirmParty} className="w-full py-4 text-2xl font-black bg-emerald-600 text-black border-2 border-emerald-400 hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">BEGIN DESCENT</button> ) : ( <div className="w-full py-4 text-center text-emerald-800 font-bold border-2 border-dashed border-emerald-900 bg-emerald-950/10 cursor-not-allowed text-lg">SELECT {3 - creatingParty.length} MORE HEROES</div> )}
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
                <DungeonRenderer pos={currentPos} dir={currentDir} floor={currentFloor} merchantSprite={MERCHANT_AVATAR} fountainSprite={TEXTURE_FOUNTAIN} villagerSprite={AVATAR_VILLAGER} ghostSprite={AVATAR_GHOST} mapData={currentMap} wallBrickTexture={TEXTURE_WALL_BRICK} wallStoneTexture={TEXTURE_WALL_STONE} wallMetalTexture={TEXTURE_WALL_METAL} wallCityTexture={TEXTURE_WALL_CITY} doorTexture={TEXTURE_DOOR} stairsUpSprite={SPRITE_STAIRS_UP} />
            </div>
            <div className="h-48 hidden md:flex min-h-0 border-t border-emerald-900 shrink-0"> {renderLogs(logEndRefDesktop)} </div>
          </div>
          <div className="w-full md:w-96 flex-none flex flex-col md:bg-black/90 md:h-full">
            <div className="p-3 md:p-4 border-b border-emerald-900 flex flex-col gap-4">
                 <div className="flex justify-center relative">
                    <Minimap pos={currentPos} dir={currentDir} floor={currentFloor} explored={explored[currentFloor] || new Set()} mapData={currentMap} />
                    <button onClick={() => setIsMapExpanded(true)} className="absolute bottom-2 right-2 bg-emerald-900/80 border border-emerald-500 text-emerald-300 w-6 h-6 flex items-center justify-center hover:bg-emerald-700 text-xs font-bold rounded-sm z-20" title="Expand Map [M]">+</button>
                 </div>
                 <div className="md:hidden flex justify-center gap-2"><button onClick={() => move(-1)} className="retro-button p-3 text-lg leading-none">▲</button></div>
                 <div className="md:hidden flex justify-center gap-2">
                    <button onClick={() => turn(-1)} className="retro-button p-3 text-lg leading-none">◀</button>
                    <button onClick={() => move(1)} className="retro-button p-3 text-lg leading-none">▼</button>
                    <button onClick={() => turn(1)} className="retro-button p-3 text-lg leading-none">▶</button>
                 </div>
            </div>
            
            <div className="p-3 grid grid-cols-3 md:grid-cols-1 gap-4 border-t md:border-t-0 border-emerald-900 bg-black/80 md:bg-transparent">
                {party.map((p, i) => {
                  const stats = calculateDerivedStats(p);
                  const isSelectedForAction = quickActionTargeting && (quickActionTargeting.type === 'item' || quickActionTargeting.type === 'skill');
                  const xpToNext = p.level * 100;
                  const xpProgress = Math.min(100, (p.xp / xpToNext) * 100);

                  return (
                    <div key={p.id} onClick={() => isSelectedForAction && executeQuickAction(i)} className={`text-sm md:text-base border p-2 flex gap-3 items-start transition-all cursor-pointer relative ${p.hp <= 0 ? 'border-red-900 bg-red-950/20 opacity-50' : 'border-emerald-900 md:bg-emerald-950/10'} ${isSelectedForAction ? 'hover:bg-emerald-500/20 hover:border-emerald-400 animate-pulse' : ''}`}>
                        <img src={p.avatar} alt={p.class} className="w-10 h-10 md:w-12 md:h-12 border border-emerald-800 bg-black object-contain pixelated hidden md:block shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                              <div className={`font-black uppercase ${p.hp <= 0 ? 'text-red-500' : 'text-white'} truncate text-base md:text-lg`}>{p.class}</div>
                              <div className="text-xs md:text-sm font-bold text-emerald-400 border border-emerald-900/50 px-1 bg-black/40">LV {p.level}</div>
                          </div>
                          <div className="w-full bg-red-950/50 h-3 border border-red-900/30 relative">
                              <div className="absolute inset-0 bg-red-600 transition-all duration-300" style={{ width: `${(p.hp / stats.maxHp) * 100}%` }} />
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white drop-shadow-md z-10 leading-none">HP {p.hp}/{stats.maxHp}</div>
                          </div>
                          <div className="w-full bg-blue-950/50 h-3 border border-blue-900/30 relative">
                              <div className="absolute inset-0 bg-blue-500 transition-all duration-300" style={{ width: `${(p.mp / stats.maxMp) * 100}%` }} />
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white drop-shadow-md z-10 leading-none">MP {p.mp}/{stats.maxMp}</div>
                          </div>
                          <div className="w-full bg-purple-950/50 h-1.5 mt-0.5 border border-purple-900/30 relative" title={`XP: ${p.xp}/${xpToNext}`}>
                              <div className="absolute inset-0 bg-purple-500 transition-all duration-300" style={{ width: `${xpProgress}%` }} />
                          </div>
                        </div>
                    </div>
                  );
                })}
            </div>

            <div className="p-2 flex gap-2 border-t border-emerald-900 mt-auto md:mt-0 bg-black">
                <button onClick={() => setGameState('INVENTORY')} className="flex-1 retro-button py-2 text-xs md:text-base border-emerald-400 bg-emerald-950/40">🎒 BAG</button>
                <button onClick={() => setGameState('SKILLS')} className="flex-1 retro-button py-2 text-xs md:text-base border-cyan-400 bg-cyan-950/40">✨ SKILLS</button>
            </div>

            <div className="flex-1 border-t border-emerald-900 bg-black/40 overflow-hidden flex flex-col p-2 min-h-[150px]">
                {quickActionTargeting ? (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-200">
                        <div className="text-emerald-400 font-bold uppercase tracking-widest mb-2 text-center text-sm">Select Target for<br/><span className="text-white text-base">{quickActionTargeting.item?.name || quickActionTargeting.skill?.name}</span></div>
                        <button onClick={() => setQuickActionTargeting(null)} className="retro-button px-4 py-1 text-sm border-red-500 text-red-500">CANCEL</button>
                    </div>
                ) : ( <>
                    <div className="text-xs uppercase font-bold text-emerald-700 tracking-wider mb-2 text-center border-b border-emerald-900/30 pb-1">Quick Cast</div>
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        {sharedInventory.some(i => i.type === 'consumable') && (<div className="mb-3">
                            <div className="text-[11px] text-emerald-600 font-bold mb-1 pl-1">CONSUMABLES</div>
                            <div className="grid grid-cols-2 gap-1">{Array.from(new Set(sharedInventory.filter(i => i.type === 'consumable').map(i => i.id))).map(id => { const item = sharedInventory.find(i => i.id === id)!; const count = sharedInventory.filter(i => i.id === id).length; return ( <button key={id} onClick={() => handleQuickAction({type: 'item', item})} className="text-[11px] border border-emerald-900/50 bg-emerald-950/20 hover:bg-emerald-900/40 p-1 flex justify-between items-center text-left"> <span className="truncate flex-1 text-emerald-400">{item.name}</span> <span className="text-white font-bold ml-1">x{count}</span> </button> )})} </div>
                        </div>)}
                        <div className="text-[11px] text-cyan-600 font-bold mb-1 pl-1">SUPPORT SPELLS</div>
                        <div className="grid grid-cols-1 gap-1"> {party.map((p, pIdx) => { const usable = getUsableSkills(p); if (usable.length === 0) return null; return ( <div key={p.id} className="flex gap-1 items-center bg-black/20 p-1 border border-cyan-900/20"> <div className="w-4 h-4 bg-cyan-900 text-[10px] flex items-center justify-center text-white font-bold">{p.class.substring(0,1)}</div> <div className="flex-1 flex flex-wrap gap-1"> {usable.map(s => ( <button key={s.id} disabled={p.mp < s.cost} onClick={() => handleQuickAction({type: 'skill', skill: s, sourceIndex: pIdx})} className={`text-[11px] px-1.5 py-0.5 border ${p.mp >= s.cost ? 'border-cyan-700 text-cyan-300 hover:bg-cyan-900/40' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}> {s.name} <span className="opacity-50">({s.cost})</span> </button> ))} </div> </div> ); })} </div>
                    </div>
                </>)}
            </div>
            <div className="flex-1 p-2 flex flex-col gap-2 overflow-hidden bg-black/40 md:hidden min-h-[80px]"> {renderLogs(logEndRefMobile)} </div>
          </div>
        </div>
      )}
      
      {gameState === 'SKILLS' && (<div className="absolute inset-0 z-50 md:flex md:items-center md:justify-center md:bg-black/80 md:backdrop-blur-sm"> <div className="w-full h-full md:max-w-3xl md:h-[80vh] md:relative"> <SkillScreen party={party} selectedCharIndex={selectedInventoryChar} onSelectChar={setSelectedInventoryChar} onUpgradeSkill={handleUpgradeSkill} onClose={() => setGameState('EXPLORE')} calculateStats={calculateDerivedStats} /> </div> </div>)}
      {gameState === 'INVENTORY' && (<div className="absolute inset-0 z-50 md:flex md:items-center md:justify-center md:bg-black/80 md:backdrop-blur-sm"> <div className="w-full h-full md:max-w-6xl md:h-[90vh] md:relative"> <InventoryScreen party={party} selectedCharIndex={selectedInventoryChar} onSelectChar={setSelectedInventoryChar} sharedInventory={sharedInventory} materialsPouch={materialsPouch} gold={gold} onClose={() => setGameState('EXPLORE')} onEquip={handleEquip} onUnequip={handleUnequip} onUse={handleUseItem} onDrop={(idx) => setSharedInventory(prev => prev.filter((_, i) => i !== idx))} onDropMaterial={(idx) => setMaterialsPouch(prev => prev.filter((_, i) => i !== idx))} calculateStats={calculateDerivedStats} /> </div> </div>)}
      {gameState === 'MERCHANT' && (<div className="absolute inset-0 z-50 md:flex md:items-center md:justify-center md:bg-black/80 md:backdrop-blur-sm"> <div className="w-full h-full md:max-w-5xl md:h-[85vh] md:relative"> <MerchantScreen merchantInventory={merchantInventory} playerInventory={sharedInventory} gold={gold} merchantSprite={MERCHANT_AVATAR} onBuy={handleBuy} onSell={handleSell} onClose={() => setGameState('EXPLORE')} party={party} calculateStats={calculateDerivedStats} /> </div> </div>)}
      {gameState === 'COMBAT' && (<div className="absolute inset-0 z-40 w-full h-full"> <BattleScreen party={party} enemies={activeEnemies} inventory={sharedInventory} activeCharIndex={activeCharIndex} targetIndex={targetIndex} setTargetIndex={setTargetIndex} allyTargetIndex={allyTargetIndex} setAllyTargetIndex={setAllyTargetIndex} atbValues={atbValues} actingId={actingId} impactIds={impactIds} currentAnim={currentAnim} floatingTexts={floatingTexts} onAttack={handleAttack} onUseItem={handleCombatUseItem} onSkill={handleSkill} onRun={() => { stopAtbClock(); setGameState('EXPLORE'); addLog(`🏃 Party retreated safely.`, 'info'); }} calculateStats={calculateDerivedStats} logs={logs} /> </div>)}
      {gameState === 'DEATH' && (<div className="flex-1 flex flex-col items-center justify-center p-8 bg-red-950/20 text-center animate-pulse"> <h2 className="text-red-600 text-6xl font-black mb-8">PARTY WIPED</h2> <button onClick={() => window.location.reload()} className="retro-button px-8 py-4 text-red-600 border-red-600 hover:bg-red-600 hover:text-white">RESTART</button> </div>)}
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
