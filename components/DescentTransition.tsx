
import React from 'react';
import { sounds } from '../soundManager';

interface FountainMenuProps {
  isTown: boolean;
  onSave: () => void;
  onTravel: () => void;
  onDrink: () => void;
  onClose: () => void;
}

const FountainMenu: React.FC<FountainMenuProps> = ({ isTown, onSave, onTravel, onDrink, onClose }) => {

  const handleAction = (action: () => void) => {
    sounds.playEffect('menu_select');
    action();
  };
  
  const handleClose = () => {
    sounds.playEffect('turn');
    onClose();
  };

  return (
    <div 
        className="absolute inset-0 z-[100] bg-black/80 flex items-center justify-center p-8 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
    >
      <div 
        className="bg-[#020402] border-4 border-cyan-500 p-8 w-full shadow-[0_0_80px_rgba(0,255,255,0.2)] flex flex-col items-center gap-8 max-w-md relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-cyan-400" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-cyan-400" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-cyan-400" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-cyan-400" />
        
        <div className="text-center flex flex-col items-center">
            <div className="text-6xl mb-4 animate-pulse">💧</div>
            <h3 className="text-3xl font-black text-cyan-300 tracking-[0.2em] uppercase mb-2 text-shadow-glow">Fountain of Memory</h3>
            <p className="text-sm text-cyan-600 leading-relaxed font-bold">The water shimmers with echoes of the past and future. What will you do?</p>
        </div>

        <div className="flex flex-col gap-4 w-full">
            <button onClick={() => handleAction(onSave)} className="w-full retro-button py-4 text-base md:text-lg border-emerald-400 hover:scale-105 transition-transform text-emerald-300 hover:bg-emerald-900/40">
                Imprint Memory (Save)
            </button>
            {isTown ? (
                <button onClick={() => handleAction(onTravel)} className="w-full retro-button py-4 text-base md:text-lg border-purple-400 hover:scale-105 transition-transform text-purple-300 hover:bg-purple-900/40">
                    Recall Destination (Travel)
                </button>
            ) : (
                <button onClick={() => handleAction(onTravel)} className="w-full retro-button py-4 text-base md:text-lg border-purple-400 hover:scale-105 transition-transform text-purple-300 hover:bg-purple-900/40">
                    Recall Destination (Travel)
                </button>
            )}
            <button onClick={() => handleAction(onDrink)} className="w-full retro-button py-4 text-base md:text-lg border-blue-400 hover:scale-105 transition-transform text-blue-300 hover:bg-blue-900/40">
                Drink Water (Heal)
            </button>
            <button onClick={handleClose} className="w-full retro-button py-3 text-base md:text-lg border-red-900 text-red-500 hover:bg-red-900/40 mt-4">
                Step Away
            </button>
        </div>
      </div>
    </div>
  );
};

export default FountainMenu;
