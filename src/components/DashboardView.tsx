import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Plus, 
  Activity, 
  Wifi, 
  Zap, 
  AlertTriangle, 
  ShieldCheck, 
  Package, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Server,
  RefreshCw
} from 'lucide-react';
import { Incident, SupplyItem, NavigationTab } from '../types';

interface DashboardViewProps {
  incidents: Incident[];
  supplies: SupplyItem[];
  onOpenBroadcast: () => void;
  onOpenRequestResource: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectIncident: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incidents,
  supplies,
  onOpenBroadcast,
  onOpenRequestResource,
  onNavigate,
  onSelectIncident,
}) => {
  const [sysTime, setSysTime] = useState<string>('05:48:58 UTC');
  const [radarAngle, setRadarAngle] = useState<number>(0);

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setSysTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Radar sweep angle
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== 'Resolved').slice(0, 3);

  const telemetryFeed = [
    { time: '14:32:05', type: 'INFO', node: 'ND-91-DELHI', text: 'Beacon heartbeat confirmed (RSSI -45dBm)' },
    { time: '14:31:40', type: 'WARN', node: 'ND-774-ALPHA', text: 'Substation battery below 15% threshold' },
    { time: '14:30:12', type: 'INFO', node: 'GATEWAY-44', text: 'Satellite uplink synched with 0 packet drops' },
    { time: '14:28:50', type: 'INFO', node: 'RESCUE-ALPHA', text: 'Mobile tactical unit registered in Sector 7G' },
    { time: '14:26:30', type: 'WARN', node: 'ND-211-BETA', text: 'High latency detected during multi-hop relay' },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 bg-slate-50 overflow-y-auto">
      {/* Top Title Bar with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>System Overview</span>
          </h1>
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYS_TIME: {sysTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="dashboard-broadcast-alert"
            onClick={onOpenBroadcast}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-red-600 border border-red-300 rounded-md text-xs font-bold shadow-xs transition-all"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Broadcast Alert</span>
          </button>

          <button
            id="dashboard-request-resource"
            onClick={onOpenRequestResource}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Request Resource</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Card 1: Network Topology & Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Network Topology & Status
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  NOMINAL
                </span>
                <span className="text-slate-400">LAST SYNC: 2s AGO</span>
              </div>
            </div>

            {/* Radar / Topology Visual Display */}
            <div className="relative my-4 h-48 bg-[#091522] rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Concentric Radar Rings */}
              <div className="absolute w-40 h-40 rounded-full border border-cyan-500/20"></div>
              <div className="absolute w-28 h-28 rounded-full border border-cyan-500/30"></div>
              <div className="absolute w-14 h-14 rounded-full border border-cyan-500/40"></div>
              <div className="absolute w-full h-px bg-cyan-500/20"></div>
              <div className="absolute h-full w-px bg-cyan-500/20"></div>

              {/* Radar Sweep Needle */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `conic-gradient(from ${radarAngle}deg at 50% 50%, rgba(6, 182, 212, 0.4) 0deg, transparent 45deg, transparent 360deg)`,
                }}
              />

              {/* Node points on radar */}
              <div className="absolute top-[32%] left-[45%] flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400 animate-ping"></span>
                <span className="text-[8px] font-mono text-cyan-300 font-bold mt-0.5">HUB-01</span>
              </div>
              <div className="absolute top-[55%] left-[28%] flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-[8px] font-mono text-slate-300">ND-91</span>
              </div>
              <div className="absolute top-[65%] left-[70%] flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-[8px] font-mono text-slate-300">ND-112</span>
              </div>
              <div className="absolute top-[25%] left-[75%] flex flex-col items-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-[8px] font-mono text-blue-300">ALPHA</span>
              </div>

              {/* Stats overlay inside radar container */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-700/60">
                <span className="text-cyan-400 font-bold">1,256 NODES ACTIVE</span>
                <span>LATENCY: 12ms</span>
                <span className="text-emerald-400">4.5 TB/s FLOW</span>
              </div>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center font-mono text-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase">PRIMARY HUB</div>
              <div className="font-bold text-emerald-600">ONLINE</div>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase">MESH STABILITY</div>
              <div className="font-bold text-blue-600">95% OPTIMAL</div>
            </div>
            <div className="p-2 rounded bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase">THREATS DETECTED</div>
              <div className="font-bold text-slate-700">0</div>
            </div>
          </div>
        </div>

        {/* Card 2: Active Incidents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active Incidents
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[11px] font-mono font-bold">
                {incidents.filter((i) => i.status !== 'Resolved').length} ACTIVE
              </span>
            </div>

            {/* List of Incidents matching Image 13 & 14 */}
            <div className="flex flex-col gap-2.5 my-3">
              <div 
                onClick={() => {
                  onSelectIncident('REQ-8892');
                  onNavigate('rescue');
                }}
                className="p-3 rounded-lg border border-red-200 bg-red-50/40 hover:bg-red-50 cursor-pointer transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1 shrink-0 animate-pulse"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-red-900">INC-992-ALPHA</span>
                      <span className="text-[10px] text-slate-400 font-mono">10m ago</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      Sector 4 Power Failure
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      Main substation down, backup generator failed. Priority hospital feed offline.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-600 shrink-0 mt-2" />
              </div>

              <div 
                onClick={() => {
                  onSelectIncident('REQ-8891');
                  onNavigate('rescue');
                }}
                className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-amber-900">INC-991-BETA</span>
                      <span className="text-[10px] text-slate-400 font-mono">45m ago</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      Comms Relay Degraded
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      Node 4A experiencing high packet loss. Relay squad dispatched.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 shrink-0 mt-2" />
              </div>

              <div 
                onClick={() => {
                  onSelectIncident('REQ-8885');
                  onNavigate('rescue');
                }}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 cursor-pointer transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-900">INC-990-GAMMA</span>
                      <span className="text-[10px] text-slate-400 font-mono">2h ago</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">
                      Perimeter Supply Requisition
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      Shelter C Point water reservoir replenishment en route.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('rescue')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View All Incidents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Critical Supplies */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Critical Supplies
                </h2>
              </div>
              <button 
                onClick={onOpenRequestResource}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                MANAGE INVENTORY
              </button>
            </div>

            <div className="flex flex-col gap-4 my-4">
              {supplies.map((item) => (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      {item.name}
                      {item.isCritical && (
                        <span className="text-[10px] text-red-600 bg-red-100 px-1 py-0.2 rounded font-bold">
                          [CRITICAL]
                        </span>
                      )}
                    </span>
                    <span className={item.isCritical ? 'text-red-600 font-bold' : 'text-slate-600 font-bold'}>
                      {item.percentage.toFixed(1)}% ({item.current} / {item.max} {item.unit})
                    </span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isCritical 
                          ? 'bg-red-500' 
                          : item.percentage > 70 
                          ? 'bg-emerald-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">Automatic Restock Protocol:</span>
            <span className="font-mono text-emerald-600 font-bold">ENABLED (Threshold 30%)</span>
          </div>
        </div>

        {/* Card 4: System Telemetry Log */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  System Telemetry Log
                </h2>
              </div>
              <button 
                onClick={() => onNavigate('reports')}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                LIVE FEED &rarr;
              </button>
            </div>

            <div className="flex flex-col gap-2 font-mono text-[11px] my-3">
              {telemetryFeed.map((log, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2 p-2 rounded bg-slate-50 hover:bg-slate-100/80 border border-slate-100/80"
                >
                  <span className="text-slate-400 shrink-0">{log.time}</span>
                  <span className={`px-1 rounded text-[10px] font-bold shrink-0 ${
                    log.type === 'WARN' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    [{log.type}]
                  </span>
                  <span className="font-bold text-slate-700 shrink-0">{log.node}:</span>
                  <span className="text-slate-600 truncate">{log.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-100">
            <span>Buffer: 1,420 lines stored</span>
            <span className="text-emerald-600 font-semibold">Streaming via WebSocket</span>
          </div>
        </div>
      </div>
    </div>
  );
};
