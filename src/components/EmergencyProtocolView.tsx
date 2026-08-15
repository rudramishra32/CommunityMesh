import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Cross, 
  Flame, 
  AlertOctagon, 
  UserCheck, 
  Radio, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Volume2
} from 'lucide-react';
import { Incident, NavigationTab } from '../types';

interface EmergencyProtocolViewProps {
  onTransmitSOS: (data: { type: string; category: Incident['category']; details: string; location: string }) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const EmergencyProtocolView: React.FC<EmergencyProtocolViewProps> = ({
  onTransmitSOS,
  onNavigate,
}) => {
  const [selectedType, setSelectedType] = useState<string>('MEDICAL');
  const [details, setDetails] = useState<string>('');
  const [location, setLocation] = useState<string>('Sector 7G, Industrial District (Mesh Beacon #4A)');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [transmitted, setTransmitted] = useState<boolean>(false);

  const emergencyTypes = [
    { id: 'MEDICAL', label: 'MEDICAL', icon: Cross, desc: 'Severe trauma, cardiac, unconscious' },
    { id: 'FIRE / HAZMAT', label: 'FIRE / HAZMAT', icon: Flame, desc: 'Structure fire, toxic chemical leak' },
    { id: 'TRAPPED', label: 'TRAPPED', icon: AlertOctagon, desc: 'Building collapse, elevator, vehicle' },
    { id: 'MISSING PERSON', label: 'MISSING PERSON', icon: UserCheck, desc: 'Lost child, separated civilian/scout' },
  ];

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);

    setTimeout(() => {
      let category: Incident['category'] = 'medical';
      if (selectedType === 'FIRE / HAZMAT') category = 'fire';
      if (selectedType === 'TRAPPED') category = 'trapped';
      if (selectedType === 'MISSING PERSON') category = 'missing';

      onTransmitSOS({
        type: selectedType === 'MEDICAL' ? 'Medical Emergency' : selectedType === 'FIRE / HAZMAT' ? 'Panel Fire' : selectedType === 'TRAPPED' ? 'Trapped Person' : 'Lost Personnel',
        category,
        details: details || 'Urgent SOS distress beacon triggered from mesh node.',
        location,
      });

      setIsTransmitting(false);
      setTransmitted(true);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 bg-[#070e17] text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('emergency')}
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Back to Emergency Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-cyan-400 font-mono">
              EMERGENCY PROTOCOL
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Broadcasting on local mesh network. Ensure details are accurate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-rose-950/60 border border-rose-700/80 text-rose-300 font-mono text-xs font-bold animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            ACTIVE DISTRESS BEACON READY
          </span>
        </div>
      </div>

      {/* Main SOS Form / Transmit Area */}
      <div className="max-w-2xl mx-auto w-full mt-6">
        {transmitted ? (
          <div className="bg-[#0c1622] rounded-xl border border-emerald-500/50 p-8 flex flex-col items-center justify-center text-center gap-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold font-mono text-white">
              SOS DISTRESS PACKET BROADCASTED
            </h2>
            <p className="text-xs text-slate-300 max-w-md">
              Your distress payload has been propagated across 1,256 active mesh nodes. Response team dispatch queue updated.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => onNavigate('rescue')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono rounded-lg transition-all"
              >
                VIEW DISPATCH HUD
              </button>
              <button
                onClick={() => setTransmitted(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition-all"
              >
                SEND ANOTHER SOS
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendSOS} className="bg-[#0b1420] rounded-xl border border-cyan-500/30 p-6 shadow-2xl flex flex-col gap-6">
            {/* Mega Header Alert Banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-rose-950/40 border border-rose-600/40">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
                <span className="font-mono font-bold text-xs text-rose-300 uppercase tracking-wider">
                  PRIORITY LEVEL 1 OVERRIDE MODE
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">915MHz LoRa</span>
            </div>

            {/* 1. Select Emergency Type */}
            <div>
              <label className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider mb-3 block">
                1. Select Emergency Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;

                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-950/50'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-cyan-400 shadow-md shadow-cyan-400' : 'bg-slate-700'}`} />
                      </div>
                      <div className="font-bold text-sm font-mono tracking-wide">{type.label}</div>
                      <div className="text-[11px] text-slate-400">{type.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider mb-1.5 block">
                Target Node / Coordinates
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 shadow-inner"
              />
            </div>

            {/* 2. Additional Details */}
            <div>
              <label className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider mb-1.5 block">
                2. Additional Details
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Enter specific details (e.g. 'Trapped under rubble, 2 people injured'). Keep it brief."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 resize-none placeholder-slate-500 font-sans shadow-inner"
              />
            </div>

            {/* Warning Message */}
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-[11px] font-mono text-rose-300">
              WARNING: FALSE ALARMS ON THE MESH NETWORK DELAY REAL EMERGENCY RESPONSES.
            </div>

            {/* Transmit Button */}
            <button
              id="emergency-protocol-submit-sos"
              type="submit"
              disabled={isTransmitting}
              className="w-full py-4 bg-[#c5192d] hover:bg-[#a81425] text-white rounded-xl font-bold text-base font-mono tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/80 active:scale-98 transition-all disabled:opacity-50"
            >
              {isTransmitting ? (
                <span>BROADCASTING DISTRESS PACKETS...</span>
              ) : (
                <>
                  <Radio className="w-5 h-5 animate-pulse" />
                  <span>TRANSMIT MESH SOS NOW</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
