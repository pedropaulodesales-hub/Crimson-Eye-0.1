
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

export type EquipmentWeight = 'LIGHT' | 'MEDIUM' | 'HEAVY';

export type ItemRarity = 'NORMAL' | 'UNCOMMON' | 'MAGIC' | 'RARE' | 'LEGENDARY' | 'UNIQUE';

export interface ItemMod {
  stat: 'str' | 'int' | 'dex' | 'vit' | 'cha' | 'atk' | 'def' | 'mAtk' | 'mDef' | 'hp' | 'mp' | 'critChance' | 'eva';
  value: number;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  weight?: EquipmentWeight; // New property for Aptitude System
  minLevel?: number; // Level Requirement
  value: number;
  stat?: number; // Physical Stat (ATK for weapons, DEF for armor)
  magicStat?: number; // Magical Stat (M.ATK for weapons, M.DEF for armor)
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
  avatar?: string;
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
  xp: number;
  skillPoints: number;
  inventory: Item[];
  weapon: Item | null;
  helm: Item | null;
  chest: Item | null;
  gloves: Item | null;
  boots: Item | null;
  accessory: Item | null;
  skills: Skill[];
  skillLevels: Record<string, number>;
  avatar: string;
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

export type GameState = 'TITLE' | 'LORE' | 'CREATION' | 'EXPLORE' | 'COMBAT' | 'INVENTORY' | 'SKILLS' | 'MERCHANT' | 'DEATH' | 'VICTORY';

export interface LogMessage {
  text: string;
  type: 'info' | 'damage' | 'heal' | 'miss' | 'crit' | 'block' | 'loot' | 'level' | 'combat' | 'player_action';
}

export interface CombatResult {
  victory: boolean;
  xp: number;
  gold: number;
  items: Item[];
}
