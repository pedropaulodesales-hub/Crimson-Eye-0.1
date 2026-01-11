
import React, { useEffect, useState } from 'react';

interface FloorTransitionProps {
  floor: number;
  type: 'descending' | 'ascending';
  onMidpoint: () => void;
  onComplete: () => void;
}

const FloorTransition: React.FC<FloorTransitionProps> = ({ floor, type, onMidpoint, onComplete }) => {
  const [opacity, setOpacity] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    // Este efeito deve ser executado apenas uma vez quando o componente é montado.
    // Os callbacks (onMidpoint, onComplete) serão chamados a partir do fechamento
    // criado na renderização inicial. A reexecução deste efeito após `onMidpoint`
    // alterar o estado pai estava causando um bug de transição de vários andares.
    
    // Fade In
    requestAnimationFrame(() => setOpacity(1));
    
    // Ponto médio - Atualiza os dados reais do andar
    const t1 = setTimeout(() => {
        onMidpoint();
        
        let newText = "";
        if (type === 'descending') {
            const newFloorIndex = floor + 1; // 'floor' é a propriedade de antes da transição
            if (newFloorIndex === 0) {
              newText = 'ENTERING THE ABYSS';
            } else {
              newText = `FLOOR B${newFloorIndex + 1}`;
            }
        } else { // ascendente
            const newFloorIndex = floor - 1;
            if (newFloorIndex < 0) {
              newText = 'RETURNING TO TOWN';
            } else {
              newText = `FLOOR B${newFloorIndex + 1}`;
            }
        }
        setText(newText);
    }, 1000);

    // Fade Out
    const t2 = setTimeout(() => {
        setOpacity(0);
    }, 2500);

    // Concluído
    const t3 = setTimeout(() => {
        onComplete();
    }, 3500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // Usar uma matriz de dependência vazia para executar apenas uma vez na montagem é crucial.

  return (
    <div 
        className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 pointer-events-none"
        style={{ opacity }}
    >
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-emerald-500 font-mono text-2xl tracking-[0.5em] animate-pulse">{type === 'descending' ? 'DESCENDING' : 'ASCENDING'}</h2>
            <div className="w-16 h-1 bg-emerald-900 overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[pulse_1s_infinite]" />
            </div>
            {text && (
                <div className="text-emerald-700 font-mono text-lg mt-4 animate-in fade-in zoom-in duration-500 font-black">
                    {text}
                </div>
            )}
        </div>
    </div>
  );
};

export default FloorTransition;
