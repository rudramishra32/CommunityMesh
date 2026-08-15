import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Layers, Crosshair, Radio, Shield, AlertTriangle, Wifi, RefreshCw } from 'lucide-react';
import { MeshNode, Incident } from '../types';

interface TacticalMapCanvasProps {
  mode?: 'satellite-night' | 'tactical-gray' | 'radar-topology';
  nodes?: MeshNode[];
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  showConnectivity?: boolean;
  selectedIncident?: Incident;
  className?: string;
  showControls?: boolean;
}

export const TacticalMapCanvas: React.FC<TacticalMapCanvasProps> = ({
  mode = 'satellite-night',
  nodes = [],
  selectedNodeId,
  onSelectNode,
  showConnectivity = true,
  selectedIncident,
  className = '',
  showControls = true,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [radarAngle, setRadarAngle] = useState<number>(0);

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Tactical Gray mode (used in Rescue screen Image 1)
  if (mode === 'tactical-gray') {
    return (
      <div 
        id="tactical-rescue-map"
        className={`relative w-full h-full min-h-[220px] bg-slate-900 rounded-md overflow-hidden select-none border border-slate-700/60 ${className}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background Grayscale Street / Satellite Texture */}
        <div 
          className="absolute inset-0 opacity-70 bg-cover bg-center transition-transform duration-100"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.9)), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)`,
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          }}
        >
          {/* Tactical roads & street grid lines */}
          <svg className="w-full h-full absolute inset-0 opacity-40">
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <line x1="80%" y1="10%" x2="20%" y2="90%" stroke="#64748b" strokeWidth="4" />
            <line x1="30%" y1="10%" x2="85%" y2="40%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="15%" y1="65%" x2="95%" y2="65%" stroke="#64748b" strokeWidth="3" />
            <rect x="25%" y="30%" width="12%" height="18%" fill="rgba(100,116,139,0.25)" stroke="#64748b" strokeWidth="1" />
            <rect x="58%" y="45%" width="20%" height="22%" fill="rgba(100,116,139,0.25)" stroke="#64748b" strokeWidth="1" />
            <rect x="62%" y="20%" width="14%" height="15%" fill="rgba(100,116,139,0.2)" stroke="#475569" strokeWidth="1" />
          </svg>

          {/* Rescue Team ALPHA Marker */}
          <div className="absolute top-[42%] left-[34%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-white/95 text-slate-900 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider border border-slate-300">
              ALPHA
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30 animate-pulse mt-0.5"></div>
          </div>

          {/* Critical Incident Target Marker */}
          <div className="absolute top-[52%] left-[62%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-500/40 animate-ping absolute inset-0"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600 ring-2 ring-white flex items-center justify-center text-white relative">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </div>
            </div>
            <div className="bg-slate-900/90 text-white font-mono text-[8px] px-1.5 py-0.5 rounded mt-1 border border-slate-700 whitespace-nowrap shadow-lg">
              CRITICAL INCIDENT LOC (Warehouse 14-A, Sector 7A)
            </div>
          </div>

          {/* Dotted Tactical Response Vector */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            <path
              d="M 34% 42% Q 48% 44% 62% 52%"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Tactical Coordinates Grid Marks on Corners */}
        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-slate-400/80 bg-slate-900/80 px-1 py-0.5 rounded">
          LAT 40.7128° N | LNG 74.0060° W
        </div>
        <div className="absolute top-2 left-2 text-[9px] font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>LIVE TRACKING ACTIVE</span>
        </div>

        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
            <button
              onClick={handleZoomIn}
              className="w-6 h-6 rounded bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-600 text-xs shadow-md"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-6 h-6 rounded bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-600 text-xs shadow-md"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRecenter}
              className="w-6 h-6 rounded bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-600 text-xs shadow-md"
              title="Recenter"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Satellite Night Map mode (Used in Mesh Network View Image 5)
  return (
    <div 
      id="mesh-network-tactical-map"
      className={`relative w-full h-full min-h-[480px] bg-[#071318] overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Night Satellite Earth Map Canvas Layer */}
      <div 
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      >
        {/* Dark night satellite backdrop with continent lights & topology */}
        <div 
          className="absolute inset-0 bg-[#08131d]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 40%, #0d2836 0%, #051017 70%, #02070a 100%)`,
          }}
        >
          {/* Night Lights Satellite Simulation with SVG vector continents & topography */}
          <svg className="w-full h-full absolute inset-0 opacity-70" viewBox="0 0 1000 700">
            <defs>
              <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffea9f" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              <filter id="glowEffect">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Landmass Outlines (Subcontinent / Coastal & Mountain regions) */}
            <path
              d="M 380 120 Q 520 80 620 160 Q 680 260 620 400 Q 550 560 500 660 Q 460 560 400 420 Q 320 300 340 180 Z"
              fill="#0b1d28"
              stroke="#16384c"
              strokeWidth="2"
            />
            <path
              d="M 500 660 Q 520 680 540 650 Q 530 630 500 660 Z"
              fill="#0f2635"
              stroke="#1b4157"
              strokeWidth="1.5"
            />
            {/* Bay of Bengal label */}
            <text x="600" y="520" fill="#1f4459" fontSize="18" fontStyle="italic" fontFamily="serif" opacity="0.6">
              Bay of Bengal
            </text>
            <text x="320" y="520" fill="#1f4459" fontSize="18" fontStyle="italic" fontFamily="serif" opacity="0.6">
              Arabian Sea
            </text>
            <text x="560" y="240" fill="#1f4459" fontSize="16" fontStyle="italic" fontFamily="serif" opacity="0.6">
              Himalayan Range
            </text>

            {/* Night City Lights clusters */}
            <circle cx="480" cy="245" r="28" fill="url(#cityGlow)" />
            <circle cx="480" cy="245" r="6" fill="#fffbeb" />
            <circle cx="520" cy="265" r="18" fill="url(#cityGlow)" />
            <circle cx="440" cy="280" r="16" fill="url(#cityGlow)" />
            <circle cx="380" cy="420" r="24" fill="url(#cityGlow)" />
            <circle cx="540" cy="360" r="22" fill="url(#cityGlow)" />
            <circle cx="460" cy="480" r="20" fill="url(#cityGlow)" />
            <circle cx="500" cy="540" r="20" fill="url(#cityGlow)" />

            {/* Topographic Elevation Contour lines */}
            <path d="M 400 150 Q 500 120 650 180" fill="none" stroke="#163545" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 420 180 Q 520 150 670 210" fill="none" stroke="#163545" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 440 210 Q 540 180 690 240" fill="none" stroke="#163545" strokeWidth="1" strokeDasharray="3 3" />

            {/* High Risk Zone Polygon (Orange shaded area) */}
            <polygon
              points="490,230 560,250 550,300 480,280"
              fill="rgba(249, 115, 22, 0.15)"
              stroke="#f97316"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Active Link Mesh Lines between nodes */}
            {showConnectivity && (
              <g id="connectivity-lines">
                {/* Solid green active links */}
                <line x1="480" y1="245" x2="520" y2="265" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="480" y1="245" x2="440" y2="280" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="520" y1="265" x2="540" y2="360" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                <line x1="440" y1="280" x2="380" y2="420" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

                {/* Dashed weak signal links */}
                <line x1="520" y1="265" x2="540" y2="250" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="480" y1="245" x2="500" y2="540" stroke="#64748b" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
              </g>
            )}
          </svg>

          {/* Interactive HTML Node Markers */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isAlert = node.status === 'alert';
            const isGateway = node.status === 'gateway';
            const isOffline = node.status === 'offline';

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectNode) onSelectNode(node.id);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-20 group`}
                style={{ top: `${node.y}%`, left: `${node.x}%` }}
              >
                {/* Alert Glow Ring */}
                {isAlert && (
                  <div className="absolute -inset-4 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></div>
                )}

                {/* Selection ring */}
                {isSelected && (
                  <div className="absolute -inset-2 rounded-full border-2 border-cyan-400 animate-pulse pointer-events-none"></div>
                )}

                {/* Node Dot / Icon */}
                {isGateway ? (
                  <div className="w-6 h-6 rounded bg-slate-900/90 border border-cyan-400 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-900/50">
                    <Radio className="w-3.5 h-3.5" />
                  </div>
                ) : isAlert ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  </div>
                ) : isOffline ? (
                  <div className="w-4 h-4 rounded-full bg-stone-400 border-2 border-slate-800 shadow-md"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-900/50 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-white"></span>
                  </div>
                )}

                {/* Tooltip on hover */}
                <div className="hidden group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-950/95 text-white font-mono text-[10px] px-2 py-1 rounded shadow-xl border border-slate-700 whitespace-nowrap z-30 flex-col">
                  <span className="font-bold text-cyan-400">{node.id}</span>
                  <span className="text-slate-300">{node.locationName}</span>
                  <span className="text-[9px] text-slate-400">Sig: {node.signalStrength} • Bat: {node.battery}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Left Options: Show Connectivity Path Toggle */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/85 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-700 text-xs text-slate-200">
        <input
          type="checkbox"
          id="toggle-connectivity"
          checked={showConnectivity}
          readOnly
          className="rounded text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-600"
        />
        <label htmlFor="toggle-connectivity" className="font-medium cursor-pointer">
          Show Connectivity Path
        </label>
      </div>

      {/* Top Right Zoom Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/85 backdrop-blur-xs p-1 rounded-md border border-slate-700">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-center text-sm transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-center text-sm transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleRecenter}
            className="w-7 h-7 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-center text-sm transition-colors"
            title="Recenter Map"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Left: Network Legend Overlay (Exact match to Image 5) */}
      <div className="absolute bottom-4 left-4 z-20 w-52 bg-[#09151e]/90 backdrop-blur-md p-3.5 rounded-lg border border-slate-700/80 text-slate-300 font-mono text-[11px] shadow-2xl">
        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-slate-700/70 pb-1.5 mb-2">
          NETWORK LEGEND
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Active Node</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400 shrink-0"></span>
            <span>Offline Node</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-400/40 shrink-0"></span>
            <span>Emergency Alert</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Community Gateway</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-0.5 bg-emerald-500 shrink-0"></span>
            <span>Active Link</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-0.5 border-t border-dashed border-slate-400 shrink-0"></span>
            <span>Weak Signal Link</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-orange-500/40 border border-orange-500 rounded-xs shrink-0"></span>
            <span>High Risk Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
