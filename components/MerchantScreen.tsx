
import React, { useState } from 'react';
import { Item, ItemRarity, Player, DerivedStats } from '../types';
import { calculateCP } from './InventoryScreen'; // Import the centralized/precise function from Inventory

interface MerchantScreenProps {
  merchantInventory: Item[];
  playerInventory: Item[];
  gold: number;
  merchantSprite: string | null;
  onBuy: (item: Item) => void;
  onSell: (item: Item) => void;
  onClose: () => void;
  party: Player[];
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

const MerchantScreen: React.FC<MerchantScreenProps> = ({ 
  merchantInventory, 
  playerInventory, 
  gold, 
  merchantSprite,
  onBuy, 
  onSell, 
  onClose,
  party,
  calculateStats
}) => {
  const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);

  const inventory = activeTab === 'BUY' ? merchantInventory : playerInventory;
  const activeChar = party[selectedCharIndex];

  // Determine comparison items
  let currentEquipped: Item | null = null;
  let cpDiff = 0;
  
  if (selectedItem && activeChar && selectedItem.type !== 'consumable' && selectedItem.type !== 'material') {
      const slot = selectedItem.type as keyof Player;
      // TS hint: we know slot is a valid key for Item | null on Player because we filtered consumable/material
      currentEquipped = (activeChar as any)[slot] as Item | null;
      
      const newCP = calculateCP(selectedItem);
      const oldCP = currentEquipped ? calculateCP(currentEquipped) : 0;
      cpDiff = newCP - oldCP;
  }

  const renderItemCard = (item: Item | null, title: string) => {
    if (!item) return (
       <div className="border-2 border-dashed border-emerald-900/30 bg-black/40 h-full flex items-center justify-center text-emerald-900 uppercase font-bold tracking-widest text-sm">
           {title}: Empty
       </div>
    );
    
    const cp = calculateCP(item);
    return (
        <div className={`h-full border-2 flex flex-col p-3 relative overflow-hidden ${item.rarity ? RARITY_COLORS[item.rarity].split(' ')[0] : 'border-emerald-900'} ${item.rarity ? RARITY_BG[item.rarity] : 'bg-black/60'}`}>
            <div className="flex justify-between items-start mb-2 relative z-10">
               <div>
                  <div className="text-xs uppercase font-bold opacity-70 tracking-wider mb-1">{title}</div>
                  <div className={`font-black uppercase text-base md:text-xl leading-tight ${item.rarity ? RARITY_COLORS[item.rarity].split(' ')[1] : 'text-emerald-400'}`}>{item.name}</div>
               </div>
               {cp > 0 && <div className="text-amber-500 font-black text-sm border border-amber-900/50 px-1 bg-black/60">CP {cp}</div>}
            </div>
            
            <div className="flex-1 space-y-2 relative z-10">
                 <div className="flex justify-between items-center text-base">
                    <span className="text-emerald-700 font-bold">TYPE</span>
                    <span className="text-emerald-400 font-bold uppercase">{item.type}</span>
                 </div>
                 {(item.stat || 0) > 0 && (
                     <div className="flex justify-between items-center text-base border-b border-white/10 pb-1">
                        <span className="text-emerald-600 font-bold">BASE PWR</span>
                        <span className="text-white font-black text-xl">+{item.stat}</span>
                     </div>
                 )}
                 {(item.magicStat || 0) > 0 && (
                     <div className="flex justify-between items-center text-base border-b border-white/10 pb-1">
                        <span className="text-emerald-600 font-bold">MAGIC PWR</span>
                        <span className="text-cyan-300 font-black text-xl">+{item.magicStat}</span>
                     </div>
                 )}
                 {item.mods && item.mods.length > 0 && (
                     <div className="mt-2">
                        {item.mods.map((m, i) => (
                            <div key={i} className="flex justify-between text-sm py-0.5">
                                <span className="text-emerald-500/80 uppercase">{m.stat}</span>
                                <span className="text-cyan-400 font-bold">+{m.value}</span>
                            </div>
                        ))}
                     </div>
                 )}
            </div>
            
            <div className="text-xs italic text-emerald-600/60 mt-2 border-t border-white/5 pt-2 relative z-10">
                "{item.description}"
            </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#020402] text-emerald-500 font-mono p-4 animate-in fade-in zoom-in duration-300 border-4 border-emerald-900 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes merch-glitch {
          0% { transform: translate(0); filter: brightness(1); }
          20% { transform: translate(-2px, 1px); filter: brightness(1.2); }
          40% { transform: translate(2px, -1px); filter: brightness(0.9); }
          60% { transform: translate(-1px, -2px); filter: brightness(1.1); }
          80% { transform: translate(1px, 2px); filter: brightness(1); }
          100% { transform: translate(0); filter: brightness(1); }
        }
        .animate-merch-glitch {
            animation: merch-glitch 0.2s infinite;
        }
      `}} />

      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-emerald-900 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-4">
          {merchantSprite ? (
            <div className="w-16 h-16 border-2 border-emerald-900 bg-emerald-950/20 p-1 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <img src={merchantSprite} className="w-full h-full object-contain pixelated animate-merch-glitch scale-125 translate-y-2" alt="M" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,255,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
            </div>
          ) : (
            <div className="text-4xl">💎</div>
          )}
          <div>
              <h2 className="text-2xl md:text-4xl font-black tracking-[0.2em] uppercase text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">MERCHANT</h2>
              <div className="text-emerald-700 text-sm tracking-widest uppercase font-bold">Secure Trading Node v9.0</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
            <div className="text-yellow-500 font-black text-2xl md:text-4xl tracking-widest text-shadow-glow">{gold} G</div>
            <button onClick={onClose} className="mt-2 retro-button px-4 py-2 text-sm md:text-base border-red-900 text-red-500 hover:bg-red-950/50">CLOSE CONNECTION</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 min-h-0 overflow-hidden">
          
          {/* LEFT COLUMN: Inventory List */}
          <div className="flex-1 flex flex-col min-w-0 border-2 border-emerald-900/50 bg-black/20">
              {/* Tabs */}
              <div className="flex border-b-2 border-emerald-900">
                <button 
                  onClick={() => { setActiveTab('BUY'); setSelectedItem(null); }}
                  className={`flex-1 py-3 text-base md:text-lg font-black transition-all uppercase tracking-wider ${activeTab === 'BUY' ? 'bg-emerald-600 text-black' : 'bg-black text-emerald-800 hover:bg-emerald-900/20'}`}
                >
                  ACQUIRE
                </button>
                <button 
                  onClick={() => { setActiveTab('SELL'); setSelectedItem(null); }}
                  className={`flex-1 py-3 text-base md:text-lg font-black transition-all uppercase tracking-wider ${activeTab === 'SELL' ? 'bg-cyan-600 text-black' : 'bg-black text-cyan-800 hover:bg-cyan-900/20'}`}
                >
                  LIQUIDATE
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                 <div className="grid grid-cols-1 gap-2">
                    {inventory.map((item, i) => {
                        const cp = calculateCP(item);
                        return (
                            <div 
                                key={`${item.id}-${i}`}
                                onClick={() => setSelectedItem(item)}
                                className={`
                                    p-3 md:p-4 cursor-pointer border-2 flex items-center gap-4 transition-all relative group
                                    ${selectedItem === item ? 'bg-emerald-900/40 border-emerald-400 translate-x-2' : `hover:bg-emerald-900/10 hover:translate-x-1 border-emerald-900/30 bg-black/40`}
                                `}
                            >
                                {/* Icon / CP Box */}
                                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 border-2 flex flex-col items-center justify-center ${item.rarity ? RARITY_BG[item.rarity] : 'bg-emerald-950/30'} ${item.rarity ? RARITY_COLORS[item.rarity].split(' ')[0] : 'border-emerald-800'}`}>
                                    <span className="text-xl md:text-2xl">{item.type === 'weapon' ? '⚔️' : item.type === 'consumable' ? '🧪' : item.type === 'material' ? '📦' : '🛡️'}</span>
                                    {cp > 0 && <span className="text-[11px] font-black mt-1 text-amber-500">{cp}</span>}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold text-base md:text-xl truncate ${selectedItem === item ? 'text-white' : (item.rarity ? RARITY_COLORS[item.rarity].split(' ')[1] : 'text-emerald-400')}`}>
                                            {item.name}
                                        </span>
                                        <span className="text-yellow-500 font-black text-base md:text-lg whitespace-nowrap">
                                            {activeTab === 'BUY' ? item.value : Math.floor(item.value * 0.5)} G
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <div className="text-xs md:text-sm uppercase font-bold text-emerald-700 flex gap-2">
                                            <span>{item.type}</span>
                                            <span className="text-emerald-900">|</span>
                                            <span className={`${item.rarity ? RARITY_COLORS[item.rarity].split(' ')[1] : 'text-emerald-600'}`}>{item.rarity || 'COMMON'}</span>
                                        </div>
                                        {/* Mod Preview Dots */}
                                        {item.mods && (
                                            <div className="flex gap-1">
                                                {item.mods.map((_, idx) => <div key={idx} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Selection Indicator */}
                                {selectedItem === item && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                    {inventory.length === 0 && (
                        <div className="h-40 flex flex-col items-center justify-center text-emerald-800 uppercase font-bold tracking-widest opacity-50">
                            <span className="text-4xl mb-2">∅</span>
                            Inventory Depleted
                        </div>
                    )}
                 </div>
              </div>
          </div>

          {/* RIGHT COLUMN: Equipment Comparison */}
          <div className="w-[45%] max-w-[600px] flex flex-col min-w-0 border-l-4 border-emerald-900 pl-6 gap-4 bg-black/40">
              
              {/* Character Selector */}
              <div className="flex gap-2 shrink-0 bg-black/60 p-2 border border-emerald-900/50">
                  {party.map((p, i) => (
                      <button 
                        key={p.id}
                        onClick={() => setSelectedCharIndex(i)}
                        className={`flex-1 border-2 p-1 flex items-center justify-center gap-2 transition-all ${selectedCharIndex === i ? 'bg-emerald-600 border-emerald-400' : 'bg-black border-emerald-900 opacity-60 hover:opacity-100'}`}
                      >
                         <img src={p.avatar} className="w-8 h-8 md:w-10 md:h-10 bg-black object-contain pixelated" alt={p.class} />
                         <span className={`text-sm font-black uppercase hidden md:inline ${selectedCharIndex === i ? 'text-white' : 'text-emerald-700'}`}>{p.class}</span>
                      </button>
                  ))}
              </div>

              {selectedItem ? (
                 <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-right duration-300">
                    <div className="text-center font-bold text-emerald-800 text-sm uppercase tracking-[0.3em] mb-2 border-b border-emerald-900/50 pb-1">
                        Equipment Comparison Analysis
                    </div>

                    {/* Comparison Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 mb-4">
                        {/* Current Item */}
                        <div className="flex flex-col h-full min-h-0">
                            <div className="text-center text-xs uppercase font-bold text-red-400 mb-1 tracking-wider">Currently Equipped</div>
                            <div className="flex-1 min-h-0">
                                {renderItemCard(currentEquipped, "OLD")}
                            </div>
                        </div>

                        {/* New Item */}
                        <div className="flex flex-col h-full min-h-0">
                            <div className="text-center text-xs uppercase font-bold text-green-400 mb-1 tracking-wider">Selected Item</div>
                            <div className="flex-1 min-h-0 relative">
                                {renderItemCard(selectedItem, "NEW")}
                                
                                {/* Difference Badge */}
                                {(selectedItem.type !== 'consumable' && selectedItem.type !== 'material') && (
                                    <div className={`absolute -top-3 right-2 px-2 py-1 text-sm font-black border-2 shadow-lg z-20 ${cpDiff > 0 ? 'bg-green-600 text-white border-green-400' : cpDiff < 0 ? 'bg-red-600 text-white border-red-400' : 'bg-gray-600 text-white border-gray-400'}`}>
                                        {cpDiff > 0 ? `+${cpDiff} CP` : `${cpDiff} CP`}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Button Area */}
                    <div className="shrink-0 mt-auto">
                         <div className="flex justify-between items-end mb-2 px-2">
                             <div className="text-sm uppercase font-bold text-emerald-700">Transaction Value</div>
                             <div className={`text-3xl font-black ${activeTab === 'BUY' && gold < selectedItem.value ? 'text-red-500' : 'text-yellow-500'}`}>
                                 {activeTab === 'BUY' ? selectedItem.value : Math.floor(selectedItem.value * 0.5)} G
                             </div>
                         </div>
                         <button 
                            onClick={() => {
                                if (activeTab === 'BUY') onBuy(selectedItem);
                                else onSell(selectedItem);
                                setSelectedItem(null);
                            }}
                            disabled={activeTab === 'BUY' && gold < selectedItem.value}
                            className={`w-full py-4 text-xl md:text-2xl font-black border-2 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                                activeTab === 'BUY' 
                                ? (gold >= selectedItem.value ? 'bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500 hover:scale-[1.02]' : 'bg-red-950/40 text-red-700 border-red-900 opacity-50 cursor-not-allowed')
                                : 'bg-yellow-600 text-black border-yellow-400 hover:bg-yellow-500 hover:scale-[1.02]'
                            }`}
                        >
                            {activeTab === 'BUY' ? (gold < selectedItem.value ? 'INSUFFICIENT FUNDS' : 'CONFIRM PURCHASE') : 'CONFIRM SALE'}
                        </button>
                    </div>

                 </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-900/30 bg-black/20 text-center p-8 opacity-50 animate-pulse">
                      <div className="text-6xl mb-4">⚖️</div>
                      <div className="text-xl font-black uppercase tracking-widest mb-2">Awaiting Selection</div>
                      <div className="text-base">Select an item from the list to analyze specifications.</div>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};

export default MerchantScreen;
