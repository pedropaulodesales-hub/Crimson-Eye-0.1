
import React, { useRef, useEffect, useState } from 'react';
import { Position, Direction } from '../types';
import { AVATAR_TRAVELER, SPRITE_CHEST, SPRITE_STAIRS, AVATAR_GHOST } from '../constants';

interface DungeonRendererProps {
  pos: Position;
  dir: Direction;
  floor: number;
  merchantSprite: string | null;
  fountainSprite: string | null;
  villagerSprite: string | null;
  ghostSprite: string | null;
  mapData: number[][];
  wallBrickTexture?: string | null;
  wallStoneTexture?: string | null;
  wallMetalTexture?: string | null;
  wallCityTexture?: string | null;
  doorTexture?: string | null;
  stairsUpSprite?: string | null;
}

export const DungeonRenderer: React.FC<DungeonRendererProps> = ({ pos, dir, floor, merchantSprite, fountainSprite, villagerSprite, ghostSprite, mapData, wallBrickTexture, wallStoneTexture, wallMetalTexture, wallCityTexture, doorTexture, stairsUpSprite }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [merchImg, setMerchImg] = useState<HTMLImageElement | null>(null);
  const [travelerImg, setTravelerImg] = useState<HTMLImageElement | null>(null);
  const [chestImg, setChestImg] = useState<HTMLImageElement | null>(null);
  const [stairsImg, setStairsImg] = useState<HTMLImageElement | null>(null);
  const [stairsUpImg, setStairsUpImg] = useState<HTMLImageElement | null>(null);
  const [fountainImg, setFountainImg] = useState<HTMLImageElement | null>(null);
  const [villagerImg, setVillagerImg] = useState<HTMLImageElement | null>(null);
  const [ghostImg, setGhostImg] = useState<HTMLImageElement | null>(null);
  const [wallBrickImg, setWallBrickImg] = useState<HTMLImageElement | null>(null);
  const [wallStoneImg, setWallStoneImg] = useState<HTMLImageElement | null>(null);
  const [wallMetalImg, setWallMetalImg] = useState<HTMLImageElement | null>(null);
  const [wallCityImg, setWallCityImg] = useState<HTMLImageElement | null>(null);
  const [doorImg, setDoorImg] = useState<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  // Resize canvas to match container
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
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

  // Load images
  useEffect(() => {
    const loadImage = (src: string | null | undefined, setter: (img: HTMLImageElement) => void) => {
      if (src) {
        const img = new Image();
        img.src = src;
        img.onload = () => setter(img);
      }
    };
    loadImage(merchantSprite, setMerchImg);
    loadImage(AVATAR_TRAVELER, setTravelerImg);
    loadImage(SPRITE_CHEST, setChestImg);
    loadImage(SPRITE_STAIRS, setStairsImg);
    loadImage(stairsUpSprite, setStairsUpImg);
    loadImage(fountainSprite, setFountainImg);
    loadImage(villagerSprite, setVillagerImg);
    loadImage(ghostSprite, setGhostImg);
    loadImage(wallBrickTexture, setWallBrickImg);
    loadImage(wallStoneTexture, setWallStoneImg);
    loadImage(wallMetalTexture, setWallMetalImg);
    loadImage(wallCityTexture, setWallCityImg);
    loadImage(doorTexture, setDoorImg);
  }, [merchantSprite, fountainSprite, villagerSprite, ghostSprite, wallBrickTexture, wallStoneTexture, wallMetalTexture, wallCityTexture, doorTexture, stairsUpSprite]);

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
        x0: centerX - sizeX / 2, x1: centerX + sizeX / 2,
        y0: centerY - sizeY / 2, y1: centerY + sizeY / 2
      };
    };

    const drawPolygon = (points: {x: number, y: number}[], fill: string | CanvasPattern, strokeColor: string) => {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };
    
    const maxDepth = 4;
    const forward = moveVecs[dir];
    const left = moveVecs[(dir + 3) % 4];
    const right = moveVecs[(dir + 1) % 4];

    phaseRef.current += 0.05;

    for (let d = maxDepth; d >= 0; d--) {
      const near = getProjection(d);
      const far = getProjection(d + 1);
      const opacity = Math.max(0, 1 - d / (maxDepth + 1));
      
      const targetX = pos.x + forward.x * (d + 1);
      const targetY = pos.y + forward.y * (d + 1);
      const currentX = pos.x + forward.x * d;
      const currentY = pos.y + forward.y * d;

      const rawFront = getTile(targetX, targetY);
      const frontCell = rawFront === 9 ? 1 : rawFront;
      
      const rawLeft = getTile(currentX + left.x, currentY + left.y);
      const leftCell = rawLeft === 9 ? 1 : rawLeft;
      
      const rawRight = getTile(currentX + right.x, currentY + right.y);
      const rightCell = rawRight === 9 ? 1 : rawRight;

      const floorPoints = [{x: near.x0, y: near.y1}, {x: near.x1, y: near.y1}, {x: far.x1, y: far.y1}, {x: far.x0, y: far.y1}];
      drawPolygon(floorPoints, `rgba(0, ${15 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${0.1 * opacity})`);
      
      const floorTile = getTile(currentX, currentY);
      if (floorTile === 7) {
        // --- DETAILED FOUNTAIN RENDER ---
        const holeMarginNear = (near.x1 - near.x0) * 0.2;
        const holeMarginFar = (far.x1 - far.x0) * 0.2;
        
        // 1. Draw the dark pit for depth
        const pitPoints = [
            {x: near.x0 + holeMarginNear, y: near.y1},
            {x: near.x1 - holeMarginNear, y: near.y1},
            {x: far.x1 - holeMarginFar, y: far.y1},
            {x: far.x0 + holeMarginFar, y: far.y1}
        ];
        drawPolygon(pitPoints, `rgba(0,5,10, ${opacity})`, `rgba(0,0,0,0)`);

        // 2. Draw the stone rim around the pit
        const rimWidthNear = (near.x1 - near.x0) * 0.05;
        const rimWidthFar = (far.x1 - far.x0) * 0.05;
        const rimOuterPoints = [
            {x: near.x0 + holeMarginNear - rimWidthNear, y: near.y1},
            {x: near.x1 - holeMarginNear + rimWidthNear, y: near.y1},
            {x: far.x1 - holeMarginFar + rimWidthFar, y: far.y1},
            {x: far.x0 + holeMarginFar - rimWidthFar, y: far.y1}
        ];
        // Create a path for the rim (outer minus inner)
        ctx.beginPath();
        ctx.moveTo(rimOuterPoints[0].x, rimOuterPoints[0].y);
        ctx.lineTo(rimOuterPoints[1].x, rimOuterPoints[1].y);
        ctx.lineTo(rimOuterPoints[2].x, rimOuterPoints[2].y);
        ctx.lineTo(rimOuterPoints[3].x, rimOuterPoints[3].y);
        ctx.closePath();
        // Inner path (counter-clockwise to create a hole)
        ctx.moveTo(pitPoints[3].x, pitPoints[3].y);
        ctx.lineTo(pitPoints[2].x, pitPoints[2].y);
        ctx.lineTo(pitPoints[1].x, pitPoints[1].y);
        ctx.lineTo(pitPoints[0].x, pitPoints[0].y);
        ctx.closePath();
        ctx.fillStyle = `rgba(100, 100, 100, ${opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(50, 50, 50, ${opacity})`;
        ctx.stroke(new Path2D(ctx.currentPath));

        // 3. Draw the animated water on top
        const waterPhase1 = Math.sin(phaseRef.current * 2) * 8;
        const waterPhase2 = Math.cos(phaseRef.current * 1.5) * 5;
        const waterColor = `rgba(${40 + waterPhase1}, ${90 + waterPhase2}, ${180 + waterPhase1}, ${0.8 * opacity})`;
        drawPolygon(pitPoints, waterColor, `rgba(100,150,255, ${0.5 * opacity})`);
      }

      const ceilPoints = [{x: near.x0, y: near.y0}, {x: near.x1, y: near.y0}, {x: far.x1, y: far.y0}, {x: far.x0, y: far.y0}];
      drawPolygon(ceilPoints, `rgba(0, ${10 * opacity}, 0, 1)`, `rgba(51, 255, 51, ${0.05 * opacity})`);

      const drawWall = (points: {x:number, y:number}[], tileId: number) => {
        let texture: HTMLImageElement | null = null;
        
        if (tileId === 10) {
            texture = doorImg;
        } else {
            if (floor === -1) {
                texture = wallCityImg;
            } else if (floor < -1) {
                texture = wallBrickImg; // Brick for house interiors
            } else {
                texture = wallBrickImg; // Always green brick for dungeons
            }
        }
        
        const fill = texture ? ctx.createPattern(texture, 'repeat')! : `rgba(0, ${40 * opacity}, 0, 1)`;
        drawPolygon(points, fill, `rgba(51, 255, 51, ${opacity})`);
      };

      // Treat ID 1 (Wall) and ID 10 (Door) as geometry blockers
      const isLeftWall = leftCell === 1 || leftCell === 10;
      const isRightWall = rightCell === 1 || rightCell === 10;
      const isFrontWall = frontCell === 1 || frontCell === 10;

      if (isLeftWall) {
        const leftPoints = [{x: near.x0, y: near.y0}, {x: far.x0, y: far.y0}, {x: far.x0, y: far.y1}, {x: near.x0, y: near.y1}];
        drawWall(leftPoints, leftCell);
      }
      if (isRightWall) {
        const rightPoints = [{x: near.x1, y: near.y0}, {x: far.x1, y: far.y0}, {x: far.x1, y: far.y1}, {x: near.x1, y: near.y1}];
        drawWall(rightPoints, rightCell);
      }

      if (isFrontWall) {
        const frontPoints = [{x: far.x0, y: far.y0}, {x: far.x1, y: far.y0}, {x: far.x1, y: far.y1}, {x: far.x0, y: far.y1}];
        drawWall(frontPoints, frontCell);
      } else if (frontCell > 1 && frontCell !== 7) {
        ctx.save();
        const centerX = w / 2;
        const bob = Math.sin(phaseRef.current) * (5 / (d + 1));
        const centerY = h / 2 + (h * 0.08 / (d + 1)) + bob;
        const objSize = 25 / (d + 1.5);
        
        const drawSprite = (img: HTMLImageElement | null, color: string, isStatic: boolean = false) => {
          if (img) {
              const aspect = img.width / img.height;
              const drawW = objSize * 6;
              const drawH = drawW / aspect;
              
              const pulse = isStatic ? 1 : 0.75 + Math.random() * 0.25;
              ctx.globalAlpha = pulse * opacity;
              ctx.shadowBlur = isStatic ? 10 : 20;
              ctx.shadowColor = color;

              const glitchX = isStatic ? 0 : (Math.random() - 0.5) * 1.5;
              const glitchY = isStatic ? 0 : (Math.random() - 0.5) * 0.5;

              let yOffset = 0;
              if (isStatic) yOffset = drawH * 0.4;
              
              ctx.drawImage(img, centerX - drawW/2 + glitchX, centerY - drawH/2 + glitchY + yOffset, drawW, drawH);
          }
        };
        
        switch (frontCell) {
            case 2: drawSprite(villagerImg, '#ffdada'); break;
            case 3: drawSprite(stairsImg, '#00ffff', true); break;
            case 4: drawSprite(chestImg, '#FFD700', true); break;
            case 5: drawSprite(merchImg, '#33ff33'); break;
            case 6: drawSprite(travelerImg, '#d97706'); break;
            case 8: drawSprite(villagerImg, '#ffdada'); break;
            case 11: drawSprite(stairsUpImg, '#33ff33', true); break;
            case 12: drawSprite(ghostImg, '#00ffff'); break;
            default:
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(centerX, centerY, objSize * 1.5, 0, Math.PI * 2);
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
  }, [pos, dir, floor, mapData, merchImg, travelerImg, chestImg, stairsImg, stairsUpImg, fountainImg, villagerImg, ghostImg, wallBrickImg, wallStoneImg, wallMetalImg, wallCityImg, doorImg]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full image-rendering-pixelated"
      />
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none font-mono">
        <div className="bg-black/60 border border-emerald-900 px-3 py-1 backdrop-blur-sm text-[10px] text-emerald-400 font-bold">
          {floor === -1 ? 'Town' : `Dungeon B${floor + 1}`}
        </div>
      </div>
    </div>
  );
};
