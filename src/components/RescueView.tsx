import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Plus, 
  Clock, 
  MapPin, 
  Radio, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  ShieldAlert, 
  ChevronRight,
  RefreshCw,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Incident, PriorityLevel } from '../types';
import { TacticalMapCanvas } from './TacticalMapCanvas';

interface RescueViewProps {
  incidents: Incident[];
  selectedIncidentId: string;
  onSelectIncident: (id: string) => void;
  onOpenNewDispatch: () => void;
  onAssignTeam: (incidentId: string, teamName: string) => void;
  onResolveIncident: (incidentId: string) => void;
  onSendCommsMessage: (incidentId: string, text: string) => void;
}

export const RescueView: React.FC<RescueViewProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onOpenNewDispatch,
  onAssignTeam,
  onResolveIncident,
  onSendCommsMessage,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [teamSelection, setTeamSelection] = useState<string>('');
  const [commsInput, setCommsInput] = useState<string>('');
  const [elapsedTimer, setElapsedTimer] = useState<number>(932);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Elapsed timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} ELAPSED`;
  };

  const handleDispatch = () => {
    if (selectedIncident && teamSelection) {
      onAssignTeam(selectedIncident.id, teamSelection);
    }
  };

  const handleSendComms = (e: React.FormEvent) => {
    e.preventDefault();
    if (commsInput.trim() && selectedIncident) {
      onSendCommsMessage(selectedIncident.id, commsInput.trim());
      setCommsInput('');
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    if (filterPriority === 'ALL') return true;
    return inc.priority === filterPriority;
  });

  const criticalCount = incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'Resolved').length;

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 bg-slate-50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            Active Response Coordinator
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {incidents.filter((i) => i.status !== 'Resolved').length} Active Incidents | <span className="text-red-600 font-bold">{criticalCount} Critical Priority</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter dropdown */}
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 appearance-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High</option>
              <option value="MED">Medium</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            id="rescue-new-dispatch-btn"
            onClick={onOpenNewDispatch}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Queue (1/3) and Right Incident Command Console (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 flex-1">
        {/* Left Column: Incident Queue */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Incident Queue
            </h2>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono font-bold text-[10px]">
              {criticalCount} CRIT
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const isCrit = inc.priority === 'CRITICAL';
              const isHigh = inc.priority === 'HIGH';

              return (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-blue-600 shadow-xs'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCrit 
                        ? 'bg-red-100 text-red-800' 
                        : isHigh 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inc.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{inc.time}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 leading-tight">
                    {inc.type}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {inc.location}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60 text-[10px] font-mono">
                    <span className="text-slate-400 font-semibold">ID: {inc.id}</span>
                    <span className={`font-semibold ${
                      inc.status === 'Resolved'
                        ? 'text-slate-400'
                        : inc.status === 'Awaiting Dispatch'
                        ? 'text-red-600 animate-pulse'
                        : 'text-blue-600'
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Incident Command Console */}
        {selectedIncident ? (
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Top Critical Header Box */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-xs font-bold tracking-wider uppercase shadow-xs">
                    {selectedIncident.priority} INCIDENT
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {selectedIncident.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{selectedIncident.time}:15 AM</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {formatElapsed(elapsedTimer)}
                  </span>
                </div>
              </div>

              {/* Title & Reporter */}
              <div className="mt-3">
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedIncident.title}
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {selectedIncident.reporter}
                </div>
              </div>

              {/* Location & Description 2-Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                {/* Location */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                    LOCATION DATA
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-700">
                    LAT: {selectedIncident.coordinates.lat} | LNG: {selectedIncident.coordinates.lng}
                  </div>
                  <div className="text-xs text-slate-700 mt-1">
                    {selectedIncident.location}
                  </div>
                </div>

                {/* Description */}
                <div className="p-3 rounded-lg bg-red-50/60 border border-red-200/80 text-red-950">
                  <div className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider mb-1">
                    INCIDENT DESCRIPTION
                  </div>
                  <p className="text-xs leading-relaxed text-red-900">
                    {selectedIncident.description}
                  </p>
                </div>
              </div>

              {/* Dispatch Assignment Bar */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide shrink-0">
                    DISPATCH ASSIGNMENT:
                  </span>
                  <select
                    value={teamSelection || selectedIncident.assignedTeam || ''}
                    onChange={(e) => setTeamSelection(e.target.value)}
                    className="flex-1 max-w-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Select Rescue Team...</option>
                    <option value="Team Alpha">Team Alpha (Tactical SAR)</option>
                    <option value="Medic Unit 1">Medic Unit 1 (Advanced Paramedics)</option>
                    <option value="Rescue Squad 4">Rescue Squad 4 (Extrication)</option>
                    <option value="Eng Team Beta">Eng Team Beta (Substation Restoration)</option>
                    <option value="Logistics Unit 2">Logistics Unit 2 (Water Tender)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="rescue-dispatch-team-btn"
                    onClick={handleDispatch}
                    disabled={!teamSelection && !selectedIncident.assignedTeam}
                    className="px-4 py-1.5 bg-[#c5192d] hover:bg-[#a81425] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-xs transition-all disabled:opacity-50"
                  >
                    DISPATCH TEAM
                  </button>

                  <button
                    id="rescue-resolve-btn"
                    onClick={() => onResolveIncident(selectedIncident.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    MARK RESOLVED
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tactical Map (Left) & Comms Log (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tactical Map */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>TACTICAL MAP</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Tracking Active
                  </span>
                </div>

                <div className="flex-1 min-h-[220px]">
                  <TacticalMapCanvas mode="tactical-gray" selectedIncident={selectedIncident} />
                </div>
              </div>

              {/* Comms Log */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                      <Radio className="w-3.5 h-3.5 text-slate-700" />
                      <span>COMMS LOG</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      SECURE LORAN-915
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto font-mono text-[11px] pr-1">
                    {selectedIncident.commsLog.map((log) => (
                      <div key={log.id} className="p-2 rounded bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-bold text-slate-700">{log.sender}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-800 text-xs font-sans">
                          {log.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input box */}
                <form onSubmit={handleSendComms} className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={commsInput}
                    onChange={(e) => setCommsInput(e.target.value)}
                    placeholder="Transmit message to assigned team..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600 placeholder-slate-400 font-sans"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    title="Transmit"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            Select an incident from the queue to view tactical dispatch details.
          </div>
        )}
      </div>
    </div>
  );
};
