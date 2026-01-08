
import React from 'react';
import { Position, Direction } from '../types';

interface MinimapProps {
  pos: Position;
  dir: Direction;
  floor: number;
  explored: Set<string>;
  mapData: number[][];
}

// Retro SVG Icons
const IconNPC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-fuchsia-400">
    <path d="M12 2a2 2 0 100 4 2 2 0 000-4zm-3 7c-1.1 0-2 .9-2 2v4h2v7h6v-7h2v-4c0-1.1-.9-2-2-2H9z" />
  </svg>
);

const IconTraveler = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-amber-600">
    <path d="M12 2C9 2 7 3.5 7 6v4h10V6c0-2.5-2-4-5-4z M10 12h4v8h-4z" />
  </svg>
);

const IconStairs = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-cyan-400">
    <path d="M19 5v2h-4V5h4zM9 13v2H5v-2h4zm6-4v2h-4V9h4zm-2 8v2H9v-2h4zm6-4v2h-4v-2h4zM5 5v2h4V5H5zm0 14h4v-2H5v2z" />
  </svg>
);

const IconChest = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-500">
    <path d="M20 6H4V4h16v2zm2 14v-8c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-10-5c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
  </svg>
);

const IconMerchant = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-green-400">
    <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.05.5-9 4.77-9 9.95 0 5.52 4.48 10 10 10 3.53 0 6.62-1.85 8.36-4.64l-2.6-1.53C16.51 17.7 14.4 19 12 19z" />
  </svg>
);

const Minimap: React.FC<MinimapProps> = ({ pos, dir, floor, explored, mapData }) => {
  const map = mapData || [];
  const size = 7; // 7x7 view
  const half = Math.floor(size / 2);

  if (!map.length) return <div className="w-full aspect-square bg-black border border-emerald-900/50 flex items-center justify-center text-[10px] text-emerald-900">NO SIGNAL</div>;

  const renderCell = (x: number, y: number) => {
    const isPlayer = x === pos.x && y === pos.y;
    const key = `${x},${y}`;
    const isExplored = explored.has(key);
    const tile = (y >= 0 && y < map.length && x >= 0 && x < map[0].length) ? map[y][x] : 1;

    // Use full width and aspect square to let the grid dictate size
    const commonClasses = "w-full aspect-square flex items-center justify-center relative";

    if (!isExplored) {
      return (
        <div key={key} className={`${commonClasses} bg-black border-[0.5px] border-emerald-950/20`}>
          <div className="w-1 h-1 bg-emerald-900/10 rounded-full" />
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
            className="w-1/2 h-1/2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-transform duration-300 ease-out z-10 flex items-center justify-center"
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
        // Check adjacency
        const isAdjacent = Math.abs(pos.x - x) + Math.abs(pos.y - y) <= 1;
        
        if (isAdjacent) {
            // Subtle indication (slightly different background or small crack)
            return (
              <div key={key} className={`${commonClasses} bg-emerald-900/40 border border-emerald-800/50`}>
                 {/* Faint crack line */}
                 <div className="w-full h-[1px] bg-emerald-700 rotate-45 transform scale-50 opacity-50" />
                 <div className="absolute top-1 right-1 w-1 h-1 bg-emerald-600/30 rounded-full animate-pulse" />
              </div>
            );
        } else {
            // Looks like a normal wall from afar
            return (
              <div key={key} className={`${commonClasses} bg-emerald-900/40 border border-emerald-800/50 overflow-hidden`}>
                 <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#33ff33_2px,#33ff33_3px)]" />
              </div>
            );
        }
      case 1: // Wall
        return (
          <div key={key} className={`${commonClasses} bg-emerald-900/40 border border-emerald-800/50 overflow-hidden`}>
             <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#33ff33_2px,#33ff33_3px)]" />
          </div>
        );
      case 2: // NPC
        return (
          <div key={key} className={`${commonClasses} bg-fuchsia-950/20 border border-fuchsia-900/40`}>
            <IconNPC />
            <div className="absolute inset-0 bg-fuchsia-400/5 animate-pulse rounded-sm" />
          </div>
        );
      case 3: // Stairs
        return (
          <div key={key} className={`${commonClasses} bg-cyan-950/20 border border-cyan-900/40`}>
            <IconStairs />
            <div className="absolute inset-0 bg-cyan-400/5 animate-pulse rounded-sm" />
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
            <IconMerchant />
            <div className="absolute inset-0 bg-green-400/5 animate-pulse rounded-sm" />
          </div>
        );
      case 6: // Traveler
        return (
          <div key={key} className={`${commonClasses} bg-amber-950/20 border border-amber-900/40`}>
            <IconTraveler />
            <div className="absolute inset-0 bg-amber-600/5 animate-pulse rounded-sm" />
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
  for (let y = pos.y - half; y <= pos.y + half; y++) {
    for (let x = pos.x - half; x <= pos.x + half; x++) {
      grid.push(renderCell(x, y));
    }
  }

  return (
    <div className="relative group w-full max-w-[400px]">
      <div className="absolute -inset-2 border border-emerald-500/20 rounded-lg pointer-events-none" />
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-black px-2 text-[6px] text-emerald-500/60 font-black tracking-[0.3em] z-10">N</div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-black px-2 text-[6px] text-emerald-500/60 font-black tracking-[0.3em] z-10">S</div>
      <div className="relative overflow-hidden bg-black border-2 border-emerald-500/40 shadow-[0_0_20px_rgba(51,255,51,0.15)] p-0.5">
        <div className="grid grid-cols-7 gap-0 relative z-0 w-full">{grid}</div>
      </div>
    </div>
  );
};

export default Minimap;
