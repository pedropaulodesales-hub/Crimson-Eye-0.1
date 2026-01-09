
export enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3
}

export type Position = {
  x: number;
  y: number;
};

export type PlayerClass = 'WARRIOR' | 'MAGE' | 'CLERIC' | 'BARBARIAN' | 'ARCHER' | 'ROGUE';

export interface Skill {
  id: string;
  name: string;
  desc: string;
  cost: number; // MP Cost
  type: 'attack' | 'heal' | 'buff' | 'special' | 'passive';
  targetType: 'enemy' | 'ally' | 'self';
  minLevel: number; // Level required to learn
  isAoe?: boolean;
  basePower?: number; // Scaling factor for actives
  passiveStat?: string; // For passives: 'str', 'int', 'hp', 'critChance', etc.
  passiveVal?: number; // Value per skill level
  revive?: boolean;
}

export type ItemType = 'weapon' | 'helm' | 'chest' | 'gloves' | 'boots' | 'accessory' | 'consumable' | 'material';

export type ItemRarity = 'NORMAL' | 'UNCOMMON' | 'MAGIC' | 'RARE' | 'LEGENDARY' | 'UNIQUE';

export interface ItemMod {
  stat: 'str' | 'int' | 'dex' | 'vit' | 'cha' | 'atk' | 'def' | 'mAtk' | 'mDef' | 'hp' | 'mp' | 'critChance';
  value: number;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  value: number;
  stat?: number;
  magicStat?: number;
  description: string;
  rarity?: ItemRarity;
  mods?: ItemMod[];
}

export interface Buff {
  id: string; // Unique ID for stacking (e.g. 'buff_def')
  name: string;
  type: 'buff' | 'debuff';
  stat: 'str' | 'int' | 'dex' | 'vit' | 'atk' | 'def' | 'mAtk' | 'mDef' | 'acc' | 'eva' | 'critChance' | 'maxHp';
  value: number;
  duration: number; // turns
}

export interface Entity {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  str: number;
  int: number;
  dex: number;
  vit: number;
  cha: number;
  buffs: Buff[];
}

export interface DerivedStats {
  effectiveStr: number;
  effectiveInt: number;
  effectiveDex: number;
  effectiveVit: number;
  effectiveCha: number;
  atk: number;
  mAtk: number;
  def: number;
  mDef: number;
  acc: number;
  eva: number;
  critChance: number;
  critDamage: number;
  maxHp: number;
  maxMp: number;
}

export interface Player extends Entity {
  id: string;
  class: PlayerClass;
  avatar: string;
  xp: number;
  inventory: Item[];
  weapon: Item | null;
  helm: Item | null;
  chest: Item | null;
  gloves: Item | null;
  boots: Item | null;
  accessory: Item | null;
  skills: Skill[];
  skillPoints: number;
  skillLevels: Record<string, number>; // ID -> Level (1-3)
}

export interface Enemy extends Entity {
  id: string;
  instanceId: string;
  xpValue: number;
  goldValue: number;
  color: string;
  seed: number;
  prompt: string;
  avatar?: string;
  stolenFrom?: boolean;
}

export type GameState = 'TITLE' | 'LORE' | 'CREATION' | 'EXPLORE' | 'COMBAT' | 'DEATH' | 'INVENTORY' | 'MERCHANT' | 'SKILLS' | 'VICTORY';

export interface LogMessage {
  text: string;
  type: 'info' | 'player_action' | 'enemy_action' | 'damage' | 'heal' | 'crit' | 'miss' | 'loot' | 'level' | 'combat';
}

export interface CombatResult {
  targetId: string;
  value: string | number;
  type: 'damage' | 'heal' | 'miss' | 'crit' | 'block';
  timestamp: number;
}

export interface ClassDefinition {
  type: PlayerClass;
  avatar: string;
  description: string;
  hp: number;
  mp: number;
  str: number;
  int: number;
  dex: number;
  vit: number;
  cha: number;
  skillPool: Skill[];
  starterSkillIds: string[];
}
