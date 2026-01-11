
import React from 'react';
import { Position, Direction } from '../types';

interface MinimapProps {
  pos: Position;
  dir: Direction;
  floor: number;
  explored: Set<string>;
  mapData: number[][];
  expanded?: boolean;
}

// Retro SVG Icons
const IconStairsDown = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-[10%] text-cyan-400">
    <path d="M20 4h-4v4h-4v4h-4v4H4v4h4v-4h4v-4h4v-4h4V4z" />
  </svg>
);

const IconStairsUp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-[10%] text-emerald-400">
    <path d="M4 20h4v-4h4v-4h4V8h4V4H8v4H4v12z" />
  </svg>
);

const IconChest = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-[10%] text-yellow-500">
    <path d="M20 6H4V4h16v2zm2 14v-8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-10-5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
  </svg>
);

const IconDoor = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-[10%] text-orange-400">
        <path d="M18 4v16H6V4h12m0-2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9h-2v-2h2v2z"/>
    </svg>
);


const Minimap: React.FC<MinimapProps> = ({ pos, dir, floor, explored, mapData, expanded = false }) => {
  const map = mapData || [];
  
  if (!map.length) return <div className="w-full aspect-square bg-black border border-emerald-900/50 flex items-center justify-center text-[10px] text-emerald-900">NO SIGNAL</div>;

  const renderCell = (x: number, y: number) => {
    const isPlayer = x === pos.x && y === pos.y;
    const key = `${x},${y}`;
    const isExplored = floor === -1 || explored.has(key); // Town is always explored
    // Boundary check for small minimap logic, full map relies on loop limits
    const tile = (y >= 0 && y < map.length && x >= 0 && x < map[0].length) ? map[y][x] : 1;

    // Use full width and aspect square to let the grid dictate size
    const commonClasses = "w-full aspect-square flex items-center justify-center relative";

    if (!isExplored) {
      return (
        <div key={key} className={`${commonClasses} bg-black border-[0.5px] border-emerald-950/20`}>
          {/* Subtle grid pattern for unexplored areas in expanded view */}
          {expanded && <div className="w-0.5 h-0.5 bg-emerald-900/10 rounded-full" />}
        </div>
      );
    }

    if (isPlayer) {
      const rotations = [0, 90, 180, 270];
      return (
        <div key={key} className={`${commonClasses} bg-emerald-400/10 border-[0.5px] border-emerald-400/30 overflow-visible z-30`}>
          <div 
            className="absolute w-[200%] h-[200%] bg-emerald-500/10 blur-sm pointer-events-none transition-transform duration-300"
            style={{ 
               transform: `rotate(${rotations[dir]}deg) translateY(-25%)`,
               clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)',
               opacity: 0.6
            }}
          />
          <div 
            className="w-full h-full p-[20%] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-transform duration-300 ease-out z-10 flex items-center justify-center"
            style={{ transform: `rotate(${rotations[dir]}deg)` }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full transform translate-y-[-10%]">
               <path d="M12 4L4 20L12 16L20 20L12 4Z" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-white/10 animate-pulse rounded-sm" />
        </div>
      );
    }

    // Tile Rendering with Icons
    switch (tile) {
      case 9: // SECRET WALL
        const isAdjacent = Math.abs(pos.x - x) + Math.abs(pos.y - y) <= 1;
        if (!isAdjacent && !expanded) {
            // Render as a normal wall if not adjacent and map is not expanded
            return (
                <div key={key} className={`${commonClasses} bg-emerald-900/40 border border-emerald-800/50 overflow-hidden`}>
                   <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#33ff33_2px,#33ff33_3px)]" />
                </div>
            );
        } else {
            // Revealed on large map if explored or if adjacent
            return (
              <div key={key} className={`${commonClasses} bg-emerald-900/20 border-2 border-dashed border-emerald-700/50`}>
                 <div className="absolute top-1 right-1 w-1 h-1 bg-emerald-600/30 rounded-full animate-pulse" />
              </div>
            );
        }
      case 1: // Wall
        return (
          <div key={key} className={`${commonClasses} bg-emerald-900/40 border border-emerald-800/50 overflow-hidden`}>
             <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#33ff33_2px,#33ff33_3px)]" />
          </div>
        );
      case 3: // Stairs Down
        return (
          <div key={key} className={`${commonClasses} bg-cyan-950/20 border border-cyan-900/40`}>
            <IconStairsDown />
            <div className="absolute inset-0 bg-cyan-400/5 animate-pulse rounded-sm" />
          </div>
        );
      case 11: // Stairs Up
        return (
          <div key={key} className={`${commonClasses} bg-emerald-950/20 border border-emerald-900/40`}>
            <IconStairsUp />
            <div className="absolute inset-0 bg-emerald-400/5 animate-pulse rounded-sm" />
          </div>
        );
      case 4: // Chest
        return (
          <div key={key} className={`${commonClasses} bg-yellow-950/20 border border-yellow-900/40`}>
            <IconChest />
            <div className="absolute inset-0 bg-yellow-500/5 animate-pulse rounded-sm" />
          </div>
        );
      case 5: // Merchant
        return (
          <div key={key} className={`${commonClasses} bg-green-950/20 border border-green-900/40`}>
            <div className="w-full h-full flex items-center justify-center font-black text-xl text-green-400">!</div>
          </div>
        );
      case 2: // Generic NPC
      case 6: // Traveler
      case 8: // Villager
      case 12: // Lore NPC (Ghost)
        return (
          <div key={key} className={`${commonClasses} bg-cyan-950/20 border border-cyan-900/40`}>
            <div className="w-full h-full flex items-center justify-center font-black text-xl text-cyan-300">!</div>
          </div>
        );
      case 7: // Fountain
        return (
          <div key={key} className={`${commonClasses} bg-blue-950/20 border border-blue-900/40`}>
            <div className="w-full h-full flex items-center justify-center font-black text-xl text-red-500 animate-pulse">♥</div>
          </div>
        );
      case 10: // Door
        return (
          <div key={key} className={`${commonClasses} bg-orange-950/20 border border-orange-900/40`}>
            <IconDoor />
          </div>
        );
      default: // Empty
        return (
          <div key={key} className={`${commonClasses} bg-black border-[0.5px] border-emerald-950/30`}>
            <div className="w-[1px] h-[1px] bg-emerald-800" />
          </div>
        );
    }
  };

  const grid = [];
  
  if (expanded) {
      // Full Map Render
      for (let y = 0; y < map.length; y++) {
          for (let x = 0; x < map[0].length; x++) {
              grid.push(renderCell(x, y));
          }
      }
  } else {
      // 7x7 View
      const size = 7;
      const half = Math.floor(size / 2);
      for (let y = pos.y - half; y <= pos.y + half; y++) {
        for (let x = pos.x - half; x <= pos.x + half; x++) {
          grid.push(renderCell(x, y));
        }
      }
  }

  const mapWidth = map[0]?.length || 20;

  return (
    <div className={`relative group w-full ${expanded ? 'h-full flex flex-col' : 'max-w-[400px]'}`}>
      {!expanded && (
          <>
            <div className="absolute -inset-2 border border-emerald-500/20 rounded-lg pointer-events-none" />
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-black px-2 text-[6px] text-emerald-500/60 font-black tracking-[0.3em] z-10">N</div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black px-2 text-[6px] text-emerald-500/60 font-black tracking-[0.3em] z-10">S</div>
          </>
      )}
      
      <div className={`relative overflow-hidden bg-black border-2 border-emerald-500/40 shadow-[0_0_20px_rgba(51,255,51,0.15)] p-0.5 ${expanded ? 'h-full overflow-y-auto custom-scrollbar flex items-center justify-center' : ''}`}>
        <div 
            className="grid gap-0 relative z-0"
            style={{ 
                gridTemplateColumns: `repeat(${expanded ? mapWidth : 7}, 1fr)`,
                width: expanded ? '100%' : '100%',
                maxWidth: expanded ? '90vh' : 'auto', // Keep expanded map somewhat contained
                aspectRatio: expanded ? `${map[0].length}/${map.length}` : '1/1'
            }}
        >
            {grid}
        </div>
      </div>
    </div>
  );
};

export default Minimap;
