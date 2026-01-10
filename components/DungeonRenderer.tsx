
import React, { useRef, useEffect, useState } from 'react';
import { Position, Direction } from '../types';
import { AVATAR_TRAVELER, SPRITE_CHEST, SPRITE_STAIRS } from '../constants';

interface DungeonRendererProps {
  pos: Position;
  dir: Direction;
  floor: number;
  merchantSprite: string | null;
  mapData: number[][];
}

const DungeonRenderer: React.FC<DungeonRendererProps> = ({ pos, dir, floor, merchantSprite, mapData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [merchImg, setMerchImg] = useState<HTMLImageElement | null>(null);
  const [travelerImg, setTravelerImg] = useState<HTMLImageElement | null>(null);
  const [chestImg, setChestImg] = useState<HTMLImageElement | null>(null);
  const [stairsImg, setStairsImg] = useState<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  // Resize canvas to match container
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        // Use requestAnimationFrame to prevent a ResizeObserver loop error.
        window.requestAnimationFrame(() => {
          if (!canvasRef.current) return;
          canvasRef.current.width = entry.contentRect.width;
          canvasRef.current.height = entry.contentRect.height;
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Load merchant image
  useEffect(() => {
    if (merchantSprite) {
      const img = new Image();
      img.src = merchantSprite;
      img.onload = () => setMerchImg(img);
    }
  }, [merchantSprite]);

  // Load traveler image
  useEffect(() => {
    const img = new Image();
    img.src = AVATAR_TRAVELER;
    img.onload = () => setTravelerImg(img);
  }, []);

  // Load chest image
  useEffect(() => {
    const img = new Image();
    img.src = SPRITE_CHEST;
    img.onload = () => setChestImg(img);
  }, []);

  // Load stairs image
  useEffect(() => {
    const img = new Image();
    img.src = SPRITE_STAIRS;
    img.onload = () => setStairsImg(img);
  }, []);

  // Grid vectors for N, E, S, W
  const moveVecs = [
    { x: 0, y: -1 }, // N
    { x: 1, y: 0 },  // E
    { x: 0, y: 1 },  // S
    { x: -1, y: 0 }  // W
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const currentMap = mapData || []; 

    // Clear background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    if (!currentMap.length) return;

    const getTile = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= currentMap[0].length || y >= currentMap.length) return 1;
      return currentMap[y][x];
    };

    const getProjection = (dist: number) => {
      const scale = 1 / (dist + 1);
      const centerX = w / 2;
      const centerY = h / 2;
      const sizeX = w * scale;
      const sizeY = h * scale;
      return {
        x0: centerX - sizeX / 2,
        x1: centerX + sizeX / 2,
        y0: centerY - sizeY / 2,
        y1: centerY + sizeY / 2
      };
    };

    const drawPolygon = (points: {x: number, y: number}[], color: string, strokeColor: string) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const maxDepth = 4;
    const forward = moveVecs[dir];
    const left = moveVecs[(dir + 3) % 4];
    const right = moveVecs[(dir + 1) % 4];

    // Increment animation phase
    phaseRef.current += 0.05;

    // Painter's algorithm: draw from back to front
    for (let d = maxDepth; d >= 0; d--) {
      const near = getProjection(d);
      const far = getProjection(d + 1);
      const opacity = Math.max(0, 1 - d / (maxDepth + 1));
      
      const targetX = pos.x + forward.x * (d + 1);
      const targetY = pos.y + forward.y * (d + 1);
      const currentX = pos.x + forward.x * d;
      const currentY = pos.y + forward.y * d;

      // VISUAL HACK: Treat 9 (Secret Wall) exactly like 1 (Wall)
      const rawFront = getTile(targetX, targetY);
      const frontCell = rawFront === 9 ? 1 : rawFront;

      const rawLeft = getTile(currentX + left.x, currentY + left.y);
      const leftCell = rawLeft === 9 ? 1 : rawLeft;

      const rawRight = getTile(currentX + right.x, currentY + right.y);
      const rightCell = rawRight === 9 ? 1 : rawRight;

      // Floor & Ceiling
      const floorPoints = [
        {x: near.x0, y: near.y1}, {x: near.x1, y: near.y1},
        {x: far.x1, y: far.y1}, {x: far.x0, y: far.y1}
      ];
      
      // If the tile is stairs (3), draw a dark void on the floor
      if (frontCell === 3) {
          drawPolygon(floorPoints, `rgba(10, 10, 10, 1)`, `rgba(0, 255, 255, ${0.3 * opacity})`);
      } else {
          drawPolygon(floorPoints, `rgba(0, ${15 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${0.1 * opacity})`);
      }

      const ceilPoints = [
        {x: near.x0, y: near.y0}, {x: near.x1, y: near.y0},
        {x: far.x1, y: far.y0}, {x: far.x0, y: far.y0}
      ];
      drawPolygon(ceilPoints, `rgba(0, ${10 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${0.05 * opacity})`);

      // Side Walls
      if (leftCell === 1) {
        const leftPoints = [
          {x: near.x0, y: near.y0}, {x: far.x0, y: far.y0},
          {x: far.x0, y: far.y1}, {x: near.x0, y: near.y1}
        ];
        drawPolygon(leftPoints, `rgba(0, ${40 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${opacity})`);
      }
      if (rightCell === 1) {
        const rightPoints = [
          {x: near.x1, y: near.y0}, {x: far.x1, y: far.y0},
          {x: far.x1, y: far.y1}, {x: near.x1, y: near.y1}
        ];
        drawPolygon(rightPoints, `rgba(0, ${40 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${opacity})`);
      }

      // Front Interactables
      if (frontCell === 1) {
        const frontPoints = [
          {x: far.x0, y: far.y0}, {x: far.x1, y: far.y0},
          {x: far.x1, y: far.y1}, {x: far.x0, y: far.y1}
        ];
        drawPolygon(frontPoints, `rgba(0, ${30 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${opacity})`);
      } else if (frontCell > 1) {
        ctx.save();
        const centerX = w / 2;
        // Animation: Bobbing effect for the hologram
        const bob = Math.sin(phaseRef.current) * (5 / (d + 1));
        const centerY = h / 2 + (h * 0.08 / (d + 1)) + bob;
        const objSize = 25 / (d + 1.5);
        let objColor = '#fff';
        
        if (frontCell === 3) objColor = '#00ffff'; // Stairs
        else if (frontCell === 5) objColor = '#33ff33'; // Merchant (Emerald Green)
        else if (frontCell === 2) objColor = '#ff00ff'; // NPC
        else if (frontCell === 6) objColor = '#d97706'; // Traveler (Amber/Brown)
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = objColor;
        ctx.fillStyle = objColor;
        
        if (frontCell === 4) { // Chest
          if (chestImg) {
            const aspect = chestImg.width / chestImg.height;
            const drawW = objSize * 4; 
            const drawH = drawW / aspect;
            
            // Chest specific flicker
            const flicker = 0.8 + Math.random() * 0.2;
            ctx.globalAlpha = flicker * opacity;
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#FFD700"; // Gold Glow
            
            ctx.drawImage(chestImg, centerX - drawW/2, centerY - drawH/2 + (drawH * 0.2), drawW, drawH);
          } else {
             // Fallback if image fails
             ctx.fillStyle = '#ffd700';
             ctx.fillRect(centerX - objSize, centerY, objSize * 2, objSize);
          }
        } else if (frontCell === 3) { // Stairs
          if (stairsImg) {
            const aspect = stairsImg.width / stairsImg.height;
            const drawW = objSize * 6; // Wider
            const drawH = drawW / aspect;
            
            // Stairs static + slight glow pulse
            const pulse = 0.9 + Math.sin(phaseRef.current * 0.5) * 0.1;
            ctx.globalAlpha = pulse * opacity;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00ffff"; 
            
            // Position lower to look like it's on the ground/trapdoor
            // centerY is roughly horizon/middle. Moving it down (+) places it on the floor.
            const floorOffset = drawH * 0.4;
            
            ctx.drawImage(stairsImg, centerX - drawW/2, centerY - drawH/2 + floorOffset, drawW, drawH);
          } else {
            // Fallback
            ctx.beginPath();
            ctx.moveTo(centerX - objSize, centerY + objSize);
            ctx.lineTo(centerX + objSize, centerY + objSize);
            ctx.lineTo(centerX, centerY - objSize);
            ctx.fill();
          }
        } else if (frontCell === 5 || frontCell === 6) {
          const img = frontCell === 5 ? merchImg : travelerImg;
          if (img) {
            const aspect = img.width / img.height;
            const drawW = objSize * 6;
            const drawH = drawW / aspect;
            
            // Increased digital flicker
            const flicker = 0.75 + Math.random() * 0.25;
            ctx.globalAlpha = flicker * opacity;
            ctx.shadowBlur = 20;
            ctx.shadowColor = frontCell === 5 ? "#33ff33" : "#d97706";
            
            // Digital "offset" jitter
            const glitchX = (Math.random() - 0.5) * 1.5;
            const glitchY = (Math.random() - 0.5) * 0.5;
            
            ctx.drawImage(img, centerX - drawW/2 + glitchX, centerY - drawH/2 + glitchY, drawW, drawH);
          }
        } else {
          ctx.beginPath();
          ctx.arc(centerX, centerY, objSize * 1.5, 0, Math.PI * 2); // Increased default size
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.fillStyle = `rgba(0, 0, 0, ${1 - opacity})`;
      ctx.fillRect(0, 0, w, h);
    }
  };

  useEffect(() => {
    const frame = () => {
        draw();
        animationFrameRef.current = requestAnimationFrame(frame);
    };
    animationFrameRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [pos, dir, floor, mapData, merchImg, travelerImg, chestImg, stairsImg]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full image-rendering-pixelated"
      />
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none font-mono">
        <div className="bg-black/60 border border-emerald-900 px-3 py-1 backdrop-blur-sm text-[10px] text-emerald-400 font-bold">
          FLOOR B{floor + 1}
        </div>
        <div className="bg-black/60 border border-emerald-900 px-3 py-1 backdrop-blur-sm text-[10px] text-emerald-400 font-bold">
          {Direction[dir]}
        </div>
      </div>
    </div>
  );
};

export default DungeonRenderer;
