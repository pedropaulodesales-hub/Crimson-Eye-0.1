
import React, { useState } from 'react';
import { Player, Item, DerivedStats, ItemType, ItemRarity } from '../types';
import { CLASS_APTITUDES } from '../constants';

interface InventoryScreenProps {
  party: Player[];
  selectedCharIndex: number;
  onSelectChar: (index: number) => void;
  sharedInventory: Item[];
  materialsPouch: Item[];
  gold: number;
  onClose: () => void;
  onEquip: (item: Item, playerIndex: number) => void;
  onUnequip: (type: ItemType, playerIndex: number) => void;
  onUse: (item: Item, playerIndex: number) => void;
  onDrop: (index: number) => void;
  onDropMaterial: (index: number) => void;
  calculateStats: (p: Player) => DerivedStats;
}

const RARITY_COLORS: Record<ItemRarity, string> = {
  NORMAL: 'border-gray-600 text-gray-400',
  UNCOMMON: 'border-green-600 text-green-400',
  MAGIC: 'border-blue-600 text-blue-400',
  RARE: 'border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
  LEGENDARY: 'border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]',
  UNIQUE: 'border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
};

const RARITY_BG: Record<ItemRarity, string> = {
  NORMAL: 'bg-gray-900/10',
  UNCOMMON: 'bg-green-900/10',
  MAGIC: 'bg-blue-900/10',
  RARE: 'bg-yellow-900/10',
  LEGENDARY: 'bg-orange-900/10',
  UNIQUE: 'bg-purple-900/10'
};

const RARITY_PREFIX: Record<ItemRarity, string> = {
  NORMAL: '',
  UNCOMMON: '[U] ',
  MAGIC: '[M] ',
  RARE: '[R] ',
  LEGENDARY: '[L] ',
  UNIQUE: '[!] '
};

// Combat Power Calculation (Precise Version)
export const calculateCP = (item: Item): number => {
  if (item.type === 'consumable' || item.type === 'material') return 0;
  
  let cp = 0;
  
  // Weights based on improvement request
  const W = {
      STAT: 10,      // Base ATK/DEF
      MAGIC_STAT: 10, // Base MATK/MDEF
      STR: 15,
      INT: 15,
      DEX: 15,
      VIT: 15,
      CHA: 10,
      HP: 0.5,
      MP: 0.5,
      CRIT: 20,
      EVA: 20
  };

  if (item.stat) cp += item.stat * W.STAT;
  if (item.magicStat) cp += item.magicStat * W.MAGIC_STAT;

  if (item.mods) {
      item.mods.forEach(m => {
          const val = m.value;
          switch(m.stat) {
              case 'str': cp += val * W.STR; break;
              case 'int': cp += val * W.INT; break;
              case 'dex': cp += val * W.DEX; break;
              case 'vit': cp += val * W.VIT; break;
              case 'cha': cp += val * W.CHA; break;
              case 'atk': cp += val * W.STAT; break; 
              case 'def': cp += val * W.STAT; break;
              case 'mAtk': cp += val * W.MAGIC_STAT; break;
              case 'mDef': cp += val * W.MAGIC_STAT; break;
              case 'hp': cp += val * W.HP; break;
              case 'mp': cp += val * W.MP; break;
              case 'critChance': cp += val * W.CRIT; break;
              case 'eva': cp += val * W.EVA; break;
              default: cp += val * 5; 
          }
      });
  }

  // Rarity Bonus (Intrinsic value of rarity tier)
  const rarityBonus: Record<string, number> = {
    'NORMAL': 0, 'UNCOMMON': 20, 'MAGIC': 50, 'RARE': 100, 'LEGENDARY': 250, 'UNIQUE': 500
  };
  cp += rarityBonus[item.rarity || 'NORMAL'] || 0;

  return Math.floor(cp);
};

const InventoryScreen: React.FC<InventoryScreenProps> = ({ 
  party,
  selectedCharIndex,
  onSelectChar,
  sharedInventory,
  materialsPouch,
  gold,
  onClose, 
  onEquip, 
  onUnequip, 
  onUse, 
  onDrop,
  onDropMaterial,
  calculateStats
}) => {
  const [selectedBagIndex, setSelectedBagIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ItemType | null>(null);
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'MATERIALS'>('ITEMS');

  const player = party[selectedCharIndex];
  const currentStats = calculateStats(player);

  const bagItem = activeTab === 'ITEMS' && selectedBagIndex !== null ? sharedInventory[selectedBagIndex] : null;
  const materialItem = activeTab === 'MATERIALS' && selectedBagIndex !== null ? materialsPouch[selectedBagIndex] : null;
  
  const selectedItem = selectedSlot && selectedSlot !== 'consumable'
    ? (player as any)[selectedSlot] as Item | null
    : (bagItem || materialItem);

  // Comparison Logic
  let hypotheticalStats: DerivedStats | null = null;
  let currentEquippedInSlot: Item | null = null;

  if (bagItem && bagItem.type !== 'consumable' && bagItem.type !== 'material') {
    const slot = bagItem.type as keyof Player;
    currentEquippedInSlot = (player as any)[slot] as Item | null;
    const tempPlayer = { ...player, [slot]: bagItem };
    hypotheticalStats = calculateStats(tempPlayer as Player);
  }

  // CP Comparison Values
  const selectedCP = selectedItem ? calculateCP(selectedItem) : 0;
  const equippedCP = currentEquippedInSlot ? calculateCP(currentEquippedInSlot) : 0;
  const cpDiff = selectedCP - equippedCP;

  const slots: { type: ItemType; label: string; icon: string }[] = [
    { type: 'weapon', label: 'WEAPON', icon: '⚔️' },
    { type: 'helm', label: 'HELM', icon: '🪖' },
    { type: 'chest', label: 'CHEST', icon: '🛡️' },
    { type: 'gloves', label: 'GLOVES', icon: '🧤' },
    { type: 'boots', label: 'BOOTS', icon: '👢' },
    { type: 'accessory', label: 'ACCESSORY', icon: '💍' },
  ];

  const renderStatComparison = (label: string, current: number, hypothetical: number | undefined, isPercent: boolean = false) => {
    const showComparison = hypothetical !== undefined && hypothetical !== current;
    const diff = hypothetical !== undefined ? hypothetical - current : 0;
    const colorClass = diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-500' : 'text-emerald-400';
    return (
      <div className="flex justify-between items-center py-1 border-b border-emerald-900/10 last:border-0">
        <span className="text-sm md:text-base text-emerald-800 font-bold uppercase tracking-wider">{label}:</span>
        <div className="flex items-center gap-2 text-base md:text-lg">
          <span className="text-emerald-600 line-through opacity-40 text-sm">{showComparison ? `${current}${isPercent ? '%' : ''}` : ''}</span>
          <span className={`${colorClass} font-black`}>{hypothetical !== undefined ? hypothetical : current}{isPercent ? '%' : ''}</span>
          {showComparison && <span className={`text-xs md:text-sm font-bold ${colorClass}`}>({diff > 0 ? '+' : ''}{diff}{isPercent ? '%' : ''})</span>}
        </div>
      </div>
    );
  };

  const getAptitude = (item: Item | null) => {
      if (!item || !item.weight) return 1.0;
      const aptitudes = CLASS_APTITUDES[player.class];
      return aptitudes ? aptitudes[item.weight] : 1.0;
  };

  const activeList = activeTab === 'ITEMS' ? sharedInventory : materialsPouch;

  return (
    <div className="flex flex-col h-full bg-[#020402] text-emerald-500 font-mono p-6 animate-in fade-in zoom-in duration-300 border-4 border-emerald-900 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
      <div className="flex justify-between items-center border-b-2 border-emerald-900 pb-4 mb-4 shrink-0">
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] uppercase text-emerald-400">BAG & GEAR</h2>
        <button onClick={onClose} className="retro-button px-6 py-3 text-base md:text-xl border-red-900 text-red-500 hover:bg-red-900 hover:text-white">EXIT [ESC]</button>
      </div>

      <div className="flex gap-2 mb-6 shrink-0">
        {party.map((p, i) => (
          <button 
            key={p.id}
            onClick={() => { onSelectChar(i); setSelectedSlot(null); setSelectedBagIndex(null); }}
            className={`flex-1 py-3 border-2 text-base md:text-xl font-black transition-all flex items-center justify-center gap-3 uppercase ${
              selectedCharIndex === i ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-black text-emerald-800 border-emerald-900 hover:bg-emerald-950/30'
            }`}
          >
            {p.avatar && <img src={p.avatar} alt="face" className="w-8 h-8 bg-black border border-emerald-900 hidden md:block" />}
            {p.class}
          </button>
        ))}
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden min-h-0">
        
        <div className="flex gap-4 flex-1 min-w-0">
            {/* Column 1: Equipment Slots */}
            <div className="w-[30%] max-w-[280px] flex flex-col gap-2 shrink-0 border-2 border-emerald-900/50 bg-black/40 p-2">
              <div className="text-base md:text-lg font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-emerald-900 pb-2 mb-1 text-center">Equipment</div>
              <div className="grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {slots.map((slot) => {
                  const item = (player as any)[slot.type] as Item | null;
                  const isActive = selectedSlot === slot.type || (bagItem?.type === slot.type);
                  const cp = item ? calculateCP(item) : 0;
                  const aptitude = getAptitude(item);
                  const isReduced = aptitude < 1.0;

                  return (
                    <div 
                      key={slot.type}
                      onClick={() => { setSelectedSlot(slot.type); setSelectedBagIndex(null); }}
                      className={`border-2 p-2 cursor-pointer transition-all flex items-center gap-3 relative min-h-[70px] ${
                        isActive ? 'ring-2 ring-white/70 brightness-110 z-10 bg-emerald-900/20' : 'hover:brightness-125 hover:bg-emerald-900/10'
                      } ${item?.rarity ? RARITY_COLORS[item.rarity] : 'border-emerald-950'} ${item?.rarity ? RARITY_BG[item.rarity] : 'bg-black/60'}`}
                    >
                      <div className="text-3xl md:text-4xl opacity-50 w-8 text-center">{slot.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] md:text-xs opacity-60 uppercase font-bold tracking-wider">{slot.label}</div>
                        <div className={`text-sm md:text-base font-bold leading-tight truncate ${item ? 'text-white' : 'text-emerald-900 italic'}`}>
                          {item ? `${RARITY_PREFIX[item.rarity || 'NORMAL']}${item.name}` : 'EMPTY'}
                        </div>
                      </div>
                      {item && (
                          <div className="absolute top-1 right-1 flex flex-col items-end">
                              <span className="text-[11px] font-black text-amber-500/80">CP {cp}</span>
                              {isReduced && <span className="text-[10px] font-bold text-red-500 bg-red-950/80 px-1 border border-red-900">{Math.round(aptitude * 100)}%</span>}
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Character Stats - CHANGED RES TO MDEF */}
            <div className="w-[25%] max-w-[240px] flex flex-col gap-2 shrink-0">
              <div className="flex justify-between items-end border-b border-emerald-900 pb-1 mb-1">
                <div className="text-base md:text-lg font-black text-emerald-600 uppercase tracking-[0.2em]">Stats</div>
                <div className="text-yellow-600 font-bold text-sm md:text-base">G {gold}</div>
              </div>
              <div className="bg-emerald-950/10 border-2 border-emerald-900 p-3 h-full overflow-y-auto custom-scrollbar flex flex-col gap-1">
                <div className="text-emerald-700 font-bold mb-2 text-sm md:text-base border-b border-emerald-900/50 pb-1">
                  {hypotheticalStats ? 'PREVIEW' : 'ATTRIBUTES'}
                </div>
                {renderStatComparison('STR', currentStats.effectiveStr, hypotheticalStats?.effectiveStr)}
                {renderStatComparison('INT', currentStats.effectiveInt, hypotheticalStats?.effectiveInt)}
                {renderStatComparison('DEX', currentStats.effectiveDex, hypotheticalStats?.effectiveDex)}
                {renderStatComparison('VIT', currentStats.effectiveVit, hypotheticalStats?.effectiveVit)}
                <div className="my-2 border-b border-emerald-900/30"></div>
                {renderStatComparison('MAX HP', currentStats.maxHp, hypotheticalStats?.maxHp)}
                {renderStatComparison('MAX MP', currentStats.maxMp, hypotheticalStats?.maxMp)}
                {renderStatComparison('ATK', currentStats.atk, hypotheticalStats?.atk)}
                {renderStatComparison('MAG', currentStats.mAtk, hypotheticalStats?.mAtk)}
                {renderStatComparison('DEF', currentStats.def, hypotheticalStats?.def)}
                {renderStatComparison('MDEF', currentStats.mDef, hypotheticalStats?.mDef)} 
                {renderStatComparison('ACC', currentStats.acc, hypotheticalStats?.acc, true)}
                {renderStatComparison('CRIT', currentStats.critChance, hypotheticalStats?.critChance, true)}
                {renderStatComparison('EVA', currentStats.eva, hypotheticalStats?.eva, true)}
              </div>
            </div>
            
            {/* Column 3: Bag */}
            <div className="flex flex-col border-2 border-emerald-900 bg-black/20 overflow-hidden flex-1 min-w-0">
              <div className="flex text-base md:text-lg font-black">
                <button 
                  onClick={() => { setActiveTab('ITEMS'); setSelectedBagIndex(null); }}
                  className={`flex-1 p-3 border-r border-b border-emerald-900 transition-colors uppercase tracking-widest ${activeTab === 'ITEMS' ? 'bg-emerald-500 text-black' : 'bg-emerald-950/20 text-emerald-800 hover:bg-emerald-900/40'}`}
                >
                  BAG ({sharedInventory.length})
                </button>
                <button 
                  onClick={() => { setActiveTab('MATERIALS'); setSelectedBagIndex(null); }}
                  className={`flex-1 p-3 border-b border-emerald-900 transition-colors uppercase tracking-widest ${activeTab === 'MATERIALS' ? 'bg-cyan-600 text-black' : 'bg-emerald-950/20 text-emerald-800 hover:bg-emerald-900/40'}`}
                >
                  POUCH ({materialsPouch.length})
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <div className="grid grid-cols-1 gap-2">
                  {activeList.map((item, i) => {
                    const itemCP = calculateCP(item);
                    return (
                    <div 
                      key={`${item.id}-${i}`}
                      onClick={() => { setSelectedBagIndex(i); setSelectedSlot(null); }}
                      className={`p-3 cursor-pointer border-2 flex flex-col transition-all relative overflow-hidden group ${
                        selectedBagIndex === i 
                          ? 'bg-emerald-500/20 border-emerald-400 text-white z-10' 
                          : `hover:bg-emerald-900/20 ${item.rarity ? RARITY_COLORS[item.rarity].split(' ')[0] : 'border-emerald-900/30'} ${item.rarity ? RARITY_BG[item.rarity] : 'bg-black/30'}`
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`truncate font-bold text-sm md:text-base ${selectedBagIndex === i ? 'text-white' : (item.rarity ? RARITY_COLORS[item.rarity].split(' ')[1] : 'text-emerald-500')}`}>
                          {RARITY_PREFIX[item.rarity || 'NORMAL']}{item.name}
                        </span>
                        {itemCP > 0 && <span className="text-[11px] font-black text-amber-500 bg-black/60 px-1.5 py-0.5 border border-amber-900/50 rounded">CP {itemCP}</span>}
                      </div>
                      <div className="flex justify-between items-center opacity-60">
                        <span className="text-[11px] uppercase tracking-tighter font-bold">{item.type}</span>
                        <span className={`text-[11px] uppercase font-black`}>{item.rarity || 'NORMAL'}</span>
                      </div>
                    </div>
                  )})}
                </div>
                {activeList.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                    <div className="text-5xl mb-4">{activeTab === 'ITEMS' ? '🎒' : '🧪'}</div>
                    <div className="text-base uppercase font-bold tracking-[0.2em]">Empty Container</div>
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* Right Side: Details Panel (Column 4) */}
        <div className="w-[35%] max-w-[450px] border-l-4 border-emerald-900 pl-6 flex flex-col justify-between shrink-0 bg-black/20">
          {selectedItem ? (
            (() => {
                const aptitude = getAptitude(selectedItem);
                const isReduced = aptitude < 1.0;
                const reqLevel = selectedItem.minLevel || 1;
                const canEquip = player.level >= reqLevel;
                
                return (
                <div className="flex flex-col h-full gap-4 animate-in slide-in-from-right duration-300">
                    {/* Item Header */}
                    <div className="border-b-2 border-emerald-900 pb-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <div className={`font-black uppercase text-2xl md:text-4xl leading-none mb-2 ${selectedItem.rarity ? RARITY_COLORS[selectedItem.rarity].split(' ')[1] : 'text-emerald-300'}`}>
                                    {selectedItem.name}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-cyan-400 border border-cyan-900 px-2 py-0.5 uppercase bg-cyan-950/20">{selectedItem.rarity || 'Common'} {selectedItem.type}</span>
                                    {selectedItem.weight && <span className="text-sm font-bold text-purple-400 border border-purple-900 px-2 py-0.5 uppercase bg-purple-950/20">{selectedItem.weight}</span>}
                                    {selectedCP > 0 && <span className="text-sm font-black text-amber-500 border border-amber-900/50 px-2 py-0.5 bg-amber-950/20">CP {selectedCP}</span>}
                                    <span className={`text-sm font-bold border px-2 py-0.5 uppercase ${canEquip ? 'text-emerald-500 border-emerald-900 bg-emerald-950/20' : 'text-red-500 border-red-900 bg-red-950/20'}`}>REQ LVL {reqLevel}</span>
                                </div>
                            </div>
                        </div>
                        {isReduced && (
                            <div className="text-sm font-bold bg-red-950/40 border border-red-900 text-red-400 px-2 py-1 mb-2">
                                ⚠ LOW APTITUDE: Stats reduced to {Math.round(aptitude * 100)}%
                            </div>
                        )}
                        <p className="text-base text-emerald-600 italic border-l-4 border-emerald-800 pl-3 py-1">"{selectedItem.description}"</p>
                    </div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-950/20 p-3 border border-emerald-900/30">
                            <div className="text-sm text-emerald-800 font-bold uppercase mb-1">Base Stat</div>
                            <div className={`text-3xl font-black ${isReduced && (selectedItem.stat||0) > 0 ? 'text-red-400' : 'text-white'}`}>
                                +{Math.floor((selectedItem.stat || 0) * aptitude)}
                                {isReduced && (selectedItem.stat || 0) > 0 && <span className="text-xs opacity-50 ml-1 line-through">{selectedItem.stat}</span>}
                            </div>
                        </div>
                        <div className="bg-emerald-950/20 p-3 border border-emerald-900/30">
                            <div className="text-sm text-emerald-800 font-bold uppercase mb-1">Mag Stat</div>
                            <div className={`text-3xl font-black ${isReduced && (selectedItem.magicStat||0) > 0 ? 'text-red-400' : 'text-white'}`}>
                                +{Math.floor((selectedItem.magicStat || 0) * aptitude)}
                                {isReduced && (selectedItem.magicStat || 0) > 0 && <span className="text-xs opacity-50 ml-1 line-through">{selectedItem.magicStat}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Mods */}
                    {selectedItem.mods && selectedItem.mods.length > 0 && (
                        <div className="flex-1">
                            <div className="text-sm text-emerald-800 font-black mb-2 uppercase tracking-widest border-b border-emerald-900/30 pb-1">Enchantments</div>
                            <div className="flex flex-col gap-2">
                                {selectedItem.mods.map((mod, mi) => (
                                    <div key={mi} className="text-base flex justify-between bg-emerald-900/10 border border-emerald-900/30 px-3 py-2 items-center">
                                        <span className="text-emerald-500 font-bold uppercase">{mod.stat}</span>
                                        <span className={`font-black ${isReduced ? 'text-red-400' : 'text-cyan-300'}`}>
                                            +{Math.floor(mod.value * aptitude)}
                                            {isReduced && <span className="text-xs ml-1 opacity-50">({mod.value})</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comparison Block */}
                    {currentEquippedInSlot && bagItem && (
                        <div className="bg-black/40 border border-emerald-900 p-3 opacity-80 mt-auto">
                            <div className="flex justify-between items-center mb-2 border-b border-emerald-900/50 pb-1">
                                <span className="text-sm text-emerald-700 font-black uppercase tracking-wider">REPLACING</span>
                                <span className={`text-sm font-bold ${cpDiff > 0 ? 'text-green-500' : 'text-red-500'}`}>{cpDiff > 0 ? `+${cpDiff} CP` : `${cpDiff} CP`}</span>
                            </div>
                            <div className="truncate font-bold text-white text-base mb-1">{currentEquippedInSlot.name}</div>
                            <div className="flex gap-4 text-sm text-emerald-600">
                                <span>BASE: <b className="text-emerald-400">+{Math.floor((currentEquippedInSlot.stat || 0) * getAptitude(currentEquippedInSlot))}</b></span>
                                <span>MAG: <b className="text-emerald-400">+{Math.floor((currentEquippedInSlot.magicStat || 0) * getAptitude(currentEquippedInSlot))}</b></span>
                            </div>
                        </div>
                    )}

                    {/* Actions - Stick to bottom */}
                    <div className="mt-auto pt-4 flex flex-col gap-2">
                        {selectedSlot && (player as any)[selectedSlot] ? (
                            <button onClick={() => { onUnequip(selectedSlot, selectedCharIndex); setSelectedSlot(null); }} className="w-full retro-button py-4 text-xl border-red-900 text-red-500 hover:bg-red-900/20">UNEQUIP</button>
                        ) : (
                            <>
                            {selectedItem.type !== 'material' && selectedItem.type !== 'consumable' ? (
                                <button disabled={!canEquip} onClick={() => { onEquip(selectedItem, selectedCharIndex); setSelectedBagIndex(null); }} className={`w-full retro-button py-4 text-xl transition-all ${canEquip ? 'border-emerald-400 bg-emerald-900/20 hover:bg-emerald-500 hover:text-black' : 'border-gray-800 text-gray-600 cursor-not-allowed bg-black'}`}>
                                    {canEquip ? 'EQUIP' : 'LEVEL TOO LOW'}
                                </button>
                            ) : selectedItem.type === 'consumable' ? (
                                <button onClick={() => { onUse(selectedItem, selectedCharIndex); setSelectedBagIndex(null); }} className="w-full retro-button py-4 text-xl border-cyan-500 text-cyan-500 hover:bg-cyan-900/20">USE</button>
                            ) : (
                                <div className="w-full py-4 text-center text-emerald-900 border border-emerald-900 bg-emerald-950/10 uppercase font-black tracking-widest text-lg">Material</div>
                            )}
                            <button onClick={() => { if (activeTab === 'ITEMS') onDrop(selectedBagIndex!); else onDropMaterial(selectedBagIndex!); setSelectedBagIndex(null); }} className="w-full border-2 border-red-900 text-red-800 text-base font-black py-2 hover:bg-red-900 hover:text-white transition-colors">DROP ITEM</button>
                            </>
                        )}
                    </div>
                </div>
            )})()
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-emerald-900 border-2 border-dashed border-emerald-950 bg-emerald-950/5 p-8 text-center animate-pulse">
                <div className="text-6xl mb-6 opacity-20">⚙️</div>
                <div className="text-base md:text-xl uppercase tracking-widest font-black italic">Select bag content or gear slot to manage</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InventoryScreen;
