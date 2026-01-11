
import React from 'react';
import { sounds } from '../soundManager';

interface TravelMenuProps {
  discoveredFountains: number[];
  onTravel: (floor: number) => void;
  onClose: () => void;
}

const TravelMenu: React.FC<TravelMenuProps> = ({ discoveredFountains, onTravel, onClose }) => {
  
  const handleTravel = (floor: number) => {
    sounds.playEffect('teleport');
    onTravel(floor);
  };
  
  const handleClose = () => {
    sounds.playEffect('turn');
    onClose();
  };

  const checkpoints = Array.from(new Set([-1, ...discoveredFountains])).sort((a, b) => a - b);

  return (
    <div 
        className="absolute inset-0 z-[110] bg-black/80 flex items-center justify-center p-8 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
    >
      <div 
        className="bg-[#020402] border-4 border-purple-500 p-8 w-full shadow-[0_0_80px_rgba(168,85,247,0.2)] flex flex-col items-center gap-6 max-w-lg relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-purple-400" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-purple-400" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-purple-400" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-purple-400" />
        
        <div className="text-center flex flex-col items-center">
            <div className="text-5xl mb-4 animate-pulse">🌀</div>
            <h3 className="text-3xl font-black text-purple-300 tracking-[0.2em] uppercase mb-2 text-shadow-glow">Recall Destination</h3>
            <p className="text-sm text-purple-600 leading-relaxed font-bold">Focus on an echo of a place you have been before.</p>
        </div>

        <div className="w-full flex-1 overflow-y-auto custom-scrollbar pr-4 -mr-4" style={{ maxHeight: '50vh' }}>
          <div className="flex flex-col gap-3 w-full">
            {checkpoints.map(floor => {
                const isTown = floor === -1;
                return (
                    <button 
                        key={floor}
                        onClick={() => handleTravel(floor)} 
                        className={`w-full retro-button py-3 text-base md:text-lg border-purple-400 transition-all text-purple-300 hover:bg-purple-900/40 flex justify-between items-center px-4`}
                    >
                        <span>{isTown ? 'Town Fountain' : `Dungeon B${floor + 1}`}</span>
                        <span className={`text-xs font-bold ${isTown ? 'text-green-500' : 'text-cyan-500'}`}>
                            {isTown ? 'SAFE HAVEN' : 'WAYPOINT'}
                        </span>
                    </button>
                );
            })}
          </div>
        </div>
        
        <button onClick={handleClose} className="w-full retro-button py-3 text-base md:text-lg border-red-900 text-red-500 hover:bg-red-900/40 mt-4">
            Cancel
        </button>
      </div>
    </div>
  );
};

export default TravelMenu;
