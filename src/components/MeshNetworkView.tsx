import React, { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  BatteryCharging, 
  RefreshCw, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Clock, 
  Share2, 
  Activity, 
  Server,
  CheckCircle2,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { MeshNode } from '../types';
import { TacticalMapCanvas } from './TacticalMapCanvas';

interface MeshNetworkViewProps {
  nodes: MeshNode[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  onForceSync: (nodeId: string) => void;
  onAddNode?: () => void;
}

export const MeshNetworkView: React.FC<MeshNetworkViewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onForceSync,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showConnectivity, setShowConnectivity] = useState<boolean>(true);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleSyncClick = () => {
    if (!selectedNode) return;
    setIsSyncing(true);
    setTimeout(() => {
      onForceSync(selectedNode.id);
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
      {/* Left 65%: Tactical Night Satellite Map Canvas */}
      <div className="flex-1 relative min-h-[400px] lg:min-h-full flex flex-col">
        <TacticalMapCanvas
          mode="satellite-night"
          nodes={nodes}
          selectedNodeId={selectedNode?.id}
          onSelectNode={onSelectNode}
          showConnectivity={showConnectivity}
          className="flex-1 h-full"
        />
      </div>

      {/* Right 35%: Node Details & Mesh Inspector Panel (Matching Image 5) */}
      <div className="w-full lg:w-96 bg-[#0c1724] border-t lg:border-t-0 lg:border-l border-slate-800 text-slate-200 flex flex-col overflow-y-auto shrink-0 shadow-2xl p-5">
        {selectedNode ? (
          <div className="flex flex-col gap-5">
            {/* Header: NODE DETAILS & Status Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  NODE DETAILS
                </h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                selectedNode.status === 'online'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : selectedNode.status === 'alert'
                  ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                  : selectedNode.status === 'gateway'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'bg-stone-900 text-stone-400 border border-stone-700'
              }`}>
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            {/* Node ID Title */}
            <div>
              <h3 className="text-xl font-bold font-mono text-white tracking-wide">
                {selectedNode.id}
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {selectedNode.name} • {selectedNode.locationName}
              </div>
            </div>

            {/* 2 Metric Cards: Signal Strength & Battery Level */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* Signal Strength */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                  <span>Signal Strength</span>
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xs font-bold text-slate-100">
                  {selectedNode.signalQuality}
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold">
                  {selectedNode.signalStrength}
                </div>
              </div>

              {/* Battery Level */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                  <span>Battery Level</span>
                  <Battery className={`w-3.5 h-3.5 ${
                    selectedNode.battery > 50 ? 'text-emerald-400' : selectedNode.battery > 20 ? 'text-amber-400' : 'text-red-400'
                  }`} />
                </div>
                <div className="text-xs font-bold text-slate-100">
                  {selectedNode.battery}%
                </div>
                <div className="text-[11px] text-slate-400">
                  {selectedNode.batteryStatus}
                </div>
              </div>
            </div>

            {/* Mesh Synchronization Box */}
            <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col gap-3 font-mono text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                MESH SYNCHRONIZATION
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Last Sync:</span>
                <span className="text-slate-200 font-semibold">{selectedNode.lastSync}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Packets Tx/Rx:</span>
                <span className="text-cyan-400 font-semibold">{selectedNode.packetsTx} / {selectedNode.packetsRx}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Connected Peers:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.connectedPeers} Active</span>
              </div>

              <button
                id="mesh-force-sync-btn"
                onClick={handleSyncClick}
                disabled={isSyncing}
                className="w-full mt-1 py-2 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/50 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'SYNCHRONIZING...' : 'FORCE SYNC'}</span>
              </button>
            </div>

            {/* Recent Logs Table */}
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                RECENT LOGS
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg divide-y divide-slate-800/80 font-mono text-[11px] max-h-48 overflow-y-auto">
                {selectedNode.logs.map((log, idx) => (
                  <div key={idx} className="p-2.5 flex items-start justify-between gap-2">
                    <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
                    <span className={`text-right ${
                      log.type === 'error' ? 'text-red-400' : log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Node Switcher / Quick List */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Switch Target Node:
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                {nodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onSelectNode(n.id)}
                    className={`px-2 py-1.5 rounded text-left truncate transition-colors ${
                      selectedNode.id === n.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {n.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
            No node selected. Click a node on the map.
          </div>
        )}
      </div>
    </div>
  );
};
