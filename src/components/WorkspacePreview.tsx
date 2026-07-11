'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, WorkspaceState, getProductById } from '../data/products';
import { Move, RefreshCw, RotateCw, Layers, Check, Maximize2, Minimize2 } from 'lucide-react';

interface WorkspacePreviewProps {
  state: WorkspaceState;
}

interface DraggableItem {
  id: string;
  name: string;
  image: string;
  x: number; // percentage of container width
  y: number; // percentage of container height
  width: number;
  height: number;
  zIndex: number;
}

// Scene layout configuration presets for Middle, Corner, and Window views
const SCENE_LAYOUTS = {
  middle: {
    'table-black': { x: 50, y: 68 },
    'chair-ergo': { x: 50, y: 84 },
    'chair-leather': { x: 50, y: 85 },
    'chair-back': { x: 50, y: 82 },
    'monitor-curved': { x: 50, y: 40 },
    'monitor-normal': { x: 38, y: 44 },
    'monitor-sidestand': { x: 62, y: 43 },
    'stand-monitor': { x: 50, y: 56 },
    'laptop-mac': { x: 42, y: 59 },
    'laptop-win': { x: 58, y: 59 },
    'sidetable-teak': { x: 20, y: 74 },
    'sidetable-metal': { x: 80, y: 74 },
    'acc-purifier-smart': { x: 68, y: 60 },
    'acc-coffee-espresso': { x: 32, y: 60 },
    'acc-hub-mav': { x: 51, y: 63 },
    'acc-purifier-dehumidifier': { x: 16, y: 74 },
    'acc-whiteboard': { x: 12, y: 64 },
    'acc-mic': { x: 49, y: 62 },
    'acc-ps5': { x: 65, y: 57 },
    'acc-exercisebike': { x: 86, y: 76 }
  },
  corner: {
    'table-black': { x: 28, y: 74 },
    'chair-ergo': { x: 32, y: 88 },
    'chair-leather': { x: 32, y: 89 },
    'chair-back': { x: 32, y: 86 },
    'monitor-curved': { x: 28, y: 46 },
    'monitor-normal': { x: 20, y: 50 },
    'monitor-sidestand': { x: 36, y: 49 },
    'stand-monitor': { x: 28, y: 62 },
    'laptop-mac': { x: 22, y: 65 },
    'laptop-win': { x: 34, y: 65 },
    'sidetable-teak': { x: 12, y: 80 },
    'sidetable-metal': { x: 48, y: 80 },
    'acc-purifier-smart': { x: 42, y: 66 },
    'acc-coffee-espresso': { x: 16, y: 66 },
    'acc-hub-mav': { x: 29, y: 69 },
    'acc-purifier-dehumidifier': { x: 10, y: 80 },
    'acc-whiteboard': { x: 54, y: 70 },
    'acc-mic': { x: 27, y: 68 },
    'acc-ps5': { x: 39, y: 63 },
    'acc-exercisebike': { x: 78, y: 82 }
  },
  window: {
    'table-black': { x: 72, y: 74 },
    'chair-ergo': { x: 68, y: 88 },
    'chair-leather': { x: 68, y: 89 },
    'chair-back': { x: 68, y: 86 },
    'monitor-curved': { x: 72, y: 46 },
    'monitor-normal': { x: 64, y: 50 },
    'monitor-sidestand': { x: 80, y: 49 },
    'stand-monitor': { x: 72, y: 62 },
    'laptop-mac': { x: 66, y: 65 },
    'laptop-win': { x: 78, y: 65 },
    'sidetable-teak': { x: 52, y: 80 },
    'sidetable-metal': { x: 88, y: 80 },
    'acc-purifier-smart': { x: 86, y: 66 },
    'acc-coffee-espresso': { x: 60, y: 66 },
    'acc-hub-mav': { x: 73, y: 69 },
    'acc-purifier-dehumidifier': { x: 48, y: 80 },
    'acc-whiteboard': { x: 46, y: 70 },
    'acc-mic': { x: 71, y: 68 },
    'acc-ps5': { x: 83, y: 63 },
    'acc-exercisebike': { x: 22, y: 82 }
  }
};

export default function WorkspacePreview({ state }: WorkspacePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // User-dragged position percentage coordinates mapped by ID
  const [customPositions, setCustomPositions] = useState<{ [id: string]: { x: number; y: number } }>({});
  // User custom 3D rotation values mapped by ID (X, Y, Z axis)
  const [customRotationsX, setCustomRotationsX] = useState<{ [id: string]: number }>({});
  const [customRotationsY, setCustomRotationsY] = useState<{ [id: string]: number }>({});
  const [customRotationsZ, setCustomRotationsZ] = useState<{ [id: string]: number }>({});
  
  // User custom scaling values mapped by ID (1.0 default)
  const [customScales, setCustomScales] = useState<{ [id: string]: number }>({});
  // Track active dragging item ID
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  // Track currently selected item for editing size/rotation
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Synchronize dynamic product lists when desks/chairs/accessories/zones change or scene changes
  useEffect(() => {
    const list: DraggableItem[] = [];
    const layout = SCENE_LAYOUTS[state.roomScene];

    // Helper to get coordinates (prefers custom dragged coordinates over preset scene coordinates)
    const getCoords = (prodId: string) => {
      if (customPositions[prodId]) {
        return customPositions[prodId];
      }
      return (layout as any)[prodId] || { x: 50, y: 50 };
    };

    // Selected Desk
    const deskCoords = getCoords(state.desk.id);
    list.push({
      id: state.desk.id,
      name: state.desk.name,
      image: state.desk.image,
      x: deskCoords.x,
      y: deskCoords.y,
      width: state.desk.visualInfo.width,
      height: state.desk.visualInfo.height,
      zIndex: state.desk.visualInfo.zIndex
    });

    // Selected Chair
    const chairCoords = getCoords(state.chair.id);
    list.push({
      id: state.chair.id,
      name: state.chair.name,
      image: state.chair.image,
      x: chairCoords.x,
      y: chairCoords.y,
      width: state.chair.visualInfo.width,
      height: state.chair.visualInfo.height,
      zIndex: state.chair.visualInfo.zIndex
    });

    // Added Accessories
    state.accessories.forEach(accId => {
      const acc = getProductById(accId);
      if (acc) {
        const accCoords = getCoords(accId);
        list.push({
          id: acc.id,
          name: acc.name,
          image: acc.image,
          x: accCoords.x,
          y: accCoords.y,
          width: acc.visualInfo.width,
          height: acc.visualInfo.height,
          zIndex: acc.visualInfo.zIndex
        });
      }
    });

    // Added Zones
    state.zones.forEach(zoneId => {
      const zone = getProductById(zoneId);
      if (zone) {
        const zoneCoords = getCoords(zoneId);
        list.push({
          id: zone.id,
          name: zone.name,
          image: zone.image,
          x: zoneCoords.x,
          y: zoneCoords.y,
          width: zone.visualInfo.width,
          height: zone.visualInfo.height,
          zIndex: zone.visualInfo.zIndex
        });
      }
    });

    setItems(list);
  }, [state.desk, state.chair, state.accessories, state.zones, state.roomScene, customPositions]);

  const handleResetPositions = () => {
    setCustomPositions({});
    setCustomRotationsX({});
    setCustomRotationsY({});
    setCustomRotationsZ({});
    setCustomScales({});
    setActiveDragId(null);
    setEditingItemId(null);
  };

  // Pointer drag event handlers for lag-free, snap-free dragging
  const handlePointerDown = (itemId: string, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveDragId(itemId);
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (itemId: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDragId !== itemId || !containerRef.current) return;
    
    const parentWidth = containerRef.current.offsetWidth;
    const parentHeight = containerRef.current.offsetHeight;
    const rect = containerRef.current.getBoundingClientRect();
    
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const pctX = (relativeX / parentWidth) * 100;
    const pctY = (relativeY / parentHeight) * 100;

    const constrainedX = Math.max(2, Math.min(98, pctX));
    const constrainedY = Math.max(2, Math.min(98, pctY));

    setCustomPositions(prev => ({
      ...prev,
      [itemId]: { x: constrainedX, y: constrainedY }
    }));
  };

  const handlePointerUp = (itemId: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDragId === itemId) {
      setActiveDragId(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Quick Z-Axis rotation toggle (increases Z by 30 degrees)
  const handleRotateQuick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomRotationsZ(prev => {
      const current = prev[itemId] || 0;
      return {
        ...prev,
        [itemId]: (current + 30) % 360
      };
    });
  };

  // Handle double click to toggle edit panel for item resizing & 3D rotating
  const handleDoubleClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemId(itemId);
  };

  const getBgImage = () => {
    if (state.customBgUrl) {
      return state.customBgUrl;
    }
    if (state.roomScene === 'window') {
      return '/wall/window-room.jpg';
    }
    if (state.roomScene === 'corner') {
      return '/wall/corner-image.webp';
    }
    return '/wall/bright-interior-empty-room-with-white-walls-and-wooden-floor-minimalist-design-ready-for-mockup-photo.jpeg';
  };

  const renderWallPolygons = () => {
    if (state.customBgUrl) {
      return (
        <polygon 
          points="0,0 100,0 100,75 0,75" 
          fill={state.wallColor} 
          style={{ mixBlendMode: 'multiply', opacity: 0.65 }} 
        />
      );
    }
    if (state.roomScene === 'window') {
      return (
        <polygon 
          points="0,0 100,0 100,62 0,62" 
          fill={state.wallColor} 
          style={{ mixBlendMode: 'multiply', opacity: 0.65 }} 
        />
      );
    }
    if (state.roomScene === 'corner') {
      // Merged single closed polygon to avoid fractional split-lines between two walls
      return (
        <polygon 
          points="0,0 100,0 100,72 50,82 0,72" 
          fill={state.wallColor} 
          style={{ mixBlendMode: 'multiply', opacity: 0.7 }} 
        />
      );
    }
    return (
      <polygon 
        points="0,0 100,0 100,66 0,66" 
        fill={state.wallColor} 
        style={{ mixBlendMode: 'multiply', opacity: 0.7 }} 
      />
    );
  };

  // Determine background camera scaling/pan translation based on roomScene
  const getCameraTransform = () => {
    return { scale: 1.0, x: '0%', y: '0%' };
  };

  // Render Blueprint Model vs Photo filter style (transparent PNGs require no mask, only JPGs do)
  const getFilterStyle = (itemId: string, isCustomPNG: boolean) => {
    // If the image is locally converted transparent PNG, it has NO background, so bypass mask!
    const isPreCropped = isCustomPNG || itemId.includes('stool') || itemId.includes('espresso') || itemId.includes('surf');
    let baseFilter = isPreCropped ? '' : 'url(#remove-white-bg)';

    if (state.renderMode === 'model') {
      return {
        filter: `${baseFilter} grayscale(100%) contrast(150%) brightness(105%) opacity(0.85)`
      };
    }
    return {
      filter: baseFilter || 'none'
    };
  };

  // Dynamic multi-angle sprite image renderer pointing to transparent background PNG assets
  const getItemImageDetails = (itemId: string, rotateZ: number) => {
    const item = getProductById(itemId);
    return { src: item ? item.image : '', flipX: false, isCustom: false };
  };

  // Find active editing item name to display in the corner inspector panel
  const editingItem = items.find(i => i.id === editingItemId);

  return (
    <>
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998] pointer-events-none" />
      )}
      <div 
        className={isFullscreen 
          ? "fixed inset-4 bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl flex flex-col items-center justify-end z-[9999]" 
          : "relative w-full h-[520px] lg:h-[580px] bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm flex flex-col items-center justify-end"
        }
        style={isFullscreen ? { maxWidth: '1200px', maxHeight: '800px', margin: 'auto' } : {}}
      >
        
        {/* 1. Camera scene wrapper (Background + SVG Wall paint color) */}
        <motion.div
          animate={getCameraTransform()}
          transition={{ type: 'spring', damping: 26, stiffness: 90 }}
          className="absolute inset-0 w-full h-full origin-center pointer-events-none z-0"
        >
          {/* Background Room Scene Image */}
          <img
            src={getBgImage()}
            alt="Bali Room Background"
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          {/* Wall paint dynamic colorization overlay - wall SVG polygons only */}
          {state.wallColor && (
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              {renderWallPolygons()}
            </svg>
          )}
        </motion.div>

        {/* Ambient shadow gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-200/10 via-transparent to-transparent pointer-events-none z-0" />

        {/* Header configurations banner */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-40 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-zinc-200 shadow-sm text-[10px] font-extrabold text-zinc-800 tracking-wider">
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>SCENE POSITION: {state.roomScene.toUpperCase()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetPositions}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-zinc-50 border border-zinc-200 text-[10px] font-bold text-zinc-700 hover:text-zinc-950 transition-all shadow-sm active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reset Layout</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-zinc-50 border border-zinc-200 text-[10px] font-bold text-zinc-700 hover:text-zinc-950 transition-all shadow-sm active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-zinc-500" /> : <Maximize2 className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* 2. Floating Corner Inspector Panel for editing size/rotation */}
        {editingItemId && editingItem && (
          <div 
            className="absolute top-16 right-4 w-52 bg-white/95 border border-zinc-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3.5 z-[100] cursor-default pointer-events-auto text-zinc-800"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-black tracking-wide uppercase">3D Inspector</span>
                <span className="text-[10px] font-bold text-zinc-900 truncate max-w-[130px]">{editingItem.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingItemId(null)}
                className="bg-black hover:bg-zinc-800 text-white p-1 rounded-full transition-colors shadow-sm"
              >
                <Check className="w-3 h-3 stroke-[3px]" />
              </button>
            </div>

            {/* Size / Scale Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                <span>SCALE SIZE</span>
                <span className="text-black font-extrabold">{Math.round((customScales[editingItemId] || 1.0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.2"
                step="0.05"
                value={customScales[editingItemId] || 1.0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCustomScales(prev => ({ ...prev, [editingItemId]: val }));
                }}
                className="w-full accent-black bg-zinc-100 h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3D X-Axis Tilt Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                <span>X-AXIS TILT (PITCH)</span>
                <span className="text-black font-extrabold">{customRotationsX[editingItemId] || 0}°</span>
              </div>
              <input
                type="range"
                min="-75"
                max="75"
                step="2"
                value={customRotationsX[editingItemId] || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomRotationsX(prev => ({ ...prev, [editingItemId]: val }));
                }}
                className="w-full accent-black bg-zinc-100 h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3D Y-Axis Tilt Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                <span>Y-AXIS YAW (SKEW)</span>
                <span className="text-black font-extrabold">{customRotationsY[editingItemId] || 0}°</span>
              </div>
              <input
                type="range"
                min="-75"
                max="75"
                step="2"
                value={customRotationsY[editingItemId] || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomRotationsY(prev => ({ ...prev, [editingItemId]: val }));
                }}
                className="w-full accent-black bg-zinc-100 h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3D Z-Axis Roll Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                <span>Z-AXIS SPIN (ROLL)</span>
                <span className="text-black font-extrabold">{customRotationsZ[editingItemId] || 0}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="2"
                value={customRotationsZ[editingItemId] || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCustomRotationsZ(prev => ({ ...prev, [editingItemId]: val }));
                }}
                className="w-full accent-black bg-zinc-100 h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

      {/* Main Draggable Workspace Area (perspectives 3D wrapper) */}
      <div 
        ref={containerRef}
        style={{ perspective: 1200 }}
        className="relative w-full h-full max-w-[700px] flex items-end justify-center select-none z-10"
      >
        {isClient && (
          <AnimatePresence>
            {items.map((item) => {
              const rotateX = customRotationsX[item.id] || 0;
              const rotateY = customRotationsY[item.id] || 0;
              const rotateZ = customRotationsZ[item.id] || 0;
              const scaleValue = customScales[item.id] || 1.0;
              const isDragging = activeDragId === item.id;
              const isEditing = editingItemId === item.id;

              const imageDetails = getItemImageDetails(item.id, rotateZ);

              return (
                <div
                  key={item.id}
                  onPointerDown={(e) => handlePointerDown(item.id, e)}
                  onPointerMove={(e) => handlePointerMove(item.id, e)}
                  onPointerUp={(e) => handlePointerUp(item.id, e)}
                  onDoubleClick={(e) => handleDoubleClick(item.id, e)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    // 3D rotation transform combining pitch tilt (X), yaw tilt (Y), and roll spin (Z)
                    transform: `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scaleValue * (isDragging ? 1.06 : 1.0)})`,
                    transformStyle: 'preserve-3d',
                    width: item.width,
                    height: item.height,
                    zIndex: isDragging ? 100 : (isEditing ? 90 : item.zIndex),
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out, left 0.15s ease-out, top 0.15s ease-out',
                    transformOrigin: 'center'
                  }}
                  className={`group select-none rounded-lg ${isEditing ? 'ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.3)]' : ''}`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    
                    {/* Standard Hover badge tools (Name + Quick Rotate button) */}
                    {!isEditing && (
                      <div className="absolute top-[-34px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-zinc-950 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl text-[9px] font-bold text-white whitespace-nowrap z-50 shadow-lg flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Move className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{item.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleRotateQuick(item.id, e)}
                          className="pointer-events-auto bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 p-1 rounded-md transition-colors text-zinc-300"
                          title="Quick spin 30Â°"
                        >
                          <RotateCw className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[8px] text-zinc-500 px-1 border-l border-zinc-800">Double Click to Edit 3D</span>
                      </div>
                    )}

                    {/* Background-removed product image */}
                    <img
                      src={imageDetails.src}
                      alt={item.name}
                      draggable={false}
                      className="max-w-full max-h-full object-contain pointer-events-none select-none transition-all duration-300"
                      style={{
                        transform: imageDetails.flipX ? 'scaleX(-1)' : 'none',
                        ...getFilterStyle(item.id, imageDetails.isCustom)
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* SVG filter definition for white background removal */}
      <svg className="absolute w-0 h-0 pointer-events-none" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="remove-white-bg" colorInterpolationFilters="sRGB">
            <feColorMatrix 
              type="matrix" 
              in="SourceGraphic" 
              result="mask" 
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0.333 0.333 0.333 0 0" 
            />
            <feComponentTransfer in="mask" result="thresholdedMask">
              <feFuncA type="table" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0" />
            </feComponentTransfer>
            <feComposite operator="in" in="SourceGraphic" in2="thresholdedMask" />
          </filter>
        </defs>
      </svg>

    </div>
    </>
  );
}

