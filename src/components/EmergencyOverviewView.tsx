import React from 'react';
import { 
  Flame, 
  Clock, 
  Truck, 
  Radio, 
  ShieldAlert, 
  Lock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  Activity, 
  AlertCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Incident, NavigationTab } from '../types';

interface EmergencyOverviewViewProps {
  incidents: Incident[];
  onDeclareIncident: () => void;
  onOpenBroadcast: () => void;
  onOpenDispatch: () => void;
  onSelectIncident: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenEmergencyProtocol: () => void;
}

export const EmergencyOverviewView: React.FC<EmergencyOverviewViewProps> = ({
  incidents,
  onDeclareIncident,
  onOpenBroadcast,
  onOpenDispatch,
  onSelectIncident,
  onNavigate,
  onOpenEmergencyProtocol,
}) => {
  const activeEmergencies = incidents.filter((i) => i.status !== 'Resolved');

  const medicalCount = incidents.filter((i) => i.category === 'medical' && i.status !== 'Resolved').length;
  const fireCount = incidents.filter((i) => i.category === 'fire' && i.status !== 'Resolved').length;
  const rescueCount = incidents.filter((i) => (i.category === 'trapped' || i.category === 'missing') && i.status !== 'Resolved').length;

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 bg-slate-50 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            Emergency Overview
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            STATUS: <span className="text-emerald-600 font-bold">SYSTEM NOMINAL</span> • LST UPDATE: 14:32:05 UTC
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenEmergencyProtocol}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-cyan-400 border border-cyan-500/40 rounded-md text-xs font-bold font-mono shadow-xs transition-all"
            title="Launch High Contrast Emergency Mesh Protocol"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SOS PROTOCOL</span>
          </button>

          <button
            id="emergency-declare-incident-btn"
            onClick={onDeclareIncident}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#c5192d] hover:bg-[#a81425] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>DECLARE INCIDENT</span>
          </button>
        </div>
      </div>

      {/* 3 Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* Card 1: Active Emergencies */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Active Emergencies
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-slate-900 font-mono">12</div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-red-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3 SINCE LAST SHIFT</span>
            </div>
          </div>
        </div>

        {/* Card 2: Avg Response Time */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Avg Response Time
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-slate-900 font-mono">4m 12s</div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 mt-1 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-15s TARGET DELTA</span>
            </div>
          </div>
        </div>

        {/* Card 3: Units Deployed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Units Deployed
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-slate-900 font-mono">47</div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-blue-600 mt-1 font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>REAL-TIME TRACKING</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Incident Classification (Left) & Emergency Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Incident Classification */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Incident Classification
            </h2>

            <div className="flex flex-col gap-3 my-4">
              {/* Medical Emergency */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                  <span className="text-xs font-semibold text-slate-800">Medical Emergency</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900">0{medicalCount || 5}</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                    PRIORITY 1
                  </span>
                </div>
              </div>

              {/* Fire & Hazard */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-semibold text-slate-800">Fire & Hazard</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900">0{fireCount || 4}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                    PRIORITY 2
                  </span>
                </div>
              </div>

              {/* Search & Rescue */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-semibold text-slate-800">Search & Rescue</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900">0{rescueCount || 3}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                    PRIORITY 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
            Auto-categorization active via LoRa telemetry beacons.
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Emergency Actions
            </h2>

            <div className="flex flex-col gap-3 my-4">
              {/* BROADCAST ALERT */}
              <button
                id="emergency-action-broadcast"
                onClick={onOpenBroadcast}
                className="w-full py-3.5 px-4 rounded-lg bg-[#c5192d] hover:bg-[#a81425] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md shadow-red-700/20 active:scale-98 transition-all"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                <span>BROADCAST ALERT</span>
              </button>

              {/* Dispatch Standby Unit */}
              <button
                id="emergency-action-dispatch"
                onClick={onOpenDispatch}
                className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Dispatch Standby Unit</span>
              </button>

              {/* Lock Down Sector */}
              <button
                onClick={() => alert('Sector Lockdown protocol initiated on mesh network perimeter.')}
                className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Lock className="w-4 h-4 text-slate-600" />
                <span>Lock Down Sector</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Encrypted Node Sync</span>
            <span className="text-emerald-600 font-semibold">100% OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Bottom Table: Critical Incident Log (Active) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs mt-5 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Critical Incident Log (Active)
          </h2>
          <button 
            onClick={() => onNavigate('rescue')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-100">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Incident ID</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">Location</th>
                <th className="px-4 py-2.5 font-semibold">Duration</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr 
                onClick={() => {
                  onSelectIncident('INC-9942');
                  onNavigate('rescue');
                }}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono font-bold text-slate-900">INC-9942</td>
                <td className="px-4 py-3 font-medium text-slate-800">Cardiac Arrest</td>
                <td className="px-4 py-3 text-slate-600">Sector 4, Plaza B</td>
                <td className="px-4 py-3 font-mono text-slate-500">00:12:45</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                    EN ROUTE
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 text-slate-400 hover:text-blue-600 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr 
                onClick={() => {
                  onSelectIncident('INC-9941');
                  onNavigate('rescue');
                }}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono font-bold text-slate-900">INC-9941</td>
                <td className="px-4 py-3 font-medium text-slate-800">Panel Fire</td>
                <td className="px-4 py-3 text-slate-600">Sub-level 2, Node C</td>
                <td className="px-4 py-3 font-mono text-slate-500">00:45:10</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">
                    CONTAINING
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 text-slate-400 hover:text-blue-600 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr 
                onClick={() => {
                  onSelectIncident('INC-9938');
                  onNavigate('rescue');
                }}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono font-bold text-slate-900">INC-9938</td>
                <td className="px-4 py-3 font-medium text-slate-800">Lost Personnel</td>
                <td className="px-4 py-3 text-slate-600">Perimeter Alpha</td>
                <td className="px-4 py-3 font-mono text-slate-500">02:15:00</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                    SEARCHING
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-1 text-slate-400 hover:text-blue-600 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
