import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Flame, 
  Cross, 
  UserCheck, 
  Send, 
  Radio, 
  ShieldAlert, 
  Truck, 
  Package, 
  KeyRound, 
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { Incident, PriorityLevel } from '../types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSOS: (data: { type: string; category: Incident['category']; details: string; location: string }) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, onSubmitSOS }) => {
  const [selectedType, setSelectedType] = useState<string>('MEDICAL');
  const [details, setDetails] = useState<string>('');
  const [location, setLocation] = useState<string>('Sector 7G, Industrial District (Beacon #4A)');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [successSent, setSuccessSent] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    setTimeout(() => {
      let category: Incident['category'] = 'medical';
      if (selectedType === 'FIRE / HAZMAT') category = 'fire';
      if (selectedType === 'TRAPPED') category = 'trapped';
      if (selectedType === 'MISSING PERSON') category = 'missing';

      onSubmitSOS({
        type: selectedType === 'MEDICAL' ? 'Medical Emergency' : selectedType === 'FIRE / HAZMAT' ? 'Panel Fire' : selectedType === 'TRAPPED' ? 'Trapped Person' : 'Lost Personnel',
        category,
        details: details || 'Urgent SOS distress beacon triggered from mesh node.',
        location,
      });
      setIsTransmitting(false);
      setSuccessSent(true);
      setTimeout(() => {
        setSuccessSent(false);
        onClose();
      }, 1200);
    }, 800);
  };

  const types = [
    { id: 'MEDICAL', label: 'MEDICAL', icon: Cross, desc: 'Injury, unconscious, cardiac' },
    { id: 'FIRE / HAZMAT', label: 'FIRE / HAZMAT', icon: Flame, desc: 'Fire, smoke, gas leak' },
    { id: 'TRAPPED', label: 'TRAPPED', icon: AlertOctagon, desc: 'Debris, elevator, cave-in' },
    { id: 'MISSING PERSON', label: 'MISSING PERSON', icon: UserCheck, desc: 'Lost scout, separated' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0c1622] text-slate-100 rounded-xl border border-cyan-500/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#070e17]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wider text-cyan-400 font-mono">
                EMERGENCY SOS TRANSMISSION
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                BROADCASTING ON LOCAL 915MHz MESH NETWORK
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successSent ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">SOS SIGNAL BROADCASTED</h3>
            <p className="text-xs text-slate-300">
              Mesh nodes and emergency dispatch coordinators have acknowledged your distress beacon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            {/* Step 1: Emergency Type */}
            <div>
              <label className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider mb-2 block">
                1. Select Emergency Type
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {types.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedType === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 text-white ring-1 ring-cyan-400/50'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-transparent'}`} />
                      </div>
                      <span className="font-bold text-xs font-mono tracking-wide">{t.label}</span>
                      <span className="text-[10px] text-slate-400">{t.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider mb-1 block">
                Location & Node ID
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Additional details */}
            <div>
              <label className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider mb-1 block">
                2. Additional Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Enter specific details (e.g. 'Trapped under rubble, 2 people injured'). Keep it brief."
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 resize-none placeholder-slate-500"
              />
            </div>

            {/* Warning note */}
            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-[11px] font-mono text-rose-300">
              WARNING: FALSE ALARMS ON THE MESH NETWORK DELAY REAL EMERGENCY RESPONSES.
            </div>

            {/* Transmit Button */}
            <button
              type="submit"
              disabled={isTransmitting}
              className="w-full py-3 bg-[#c5192d] hover:bg-[#a81425] text-white rounded-lg font-bold text-sm font-mono tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 active:scale-98 transition-all disabled:opacity-50"
            >
              {isTransmitting ? (
                <span>BROADCASTING DISTRESS PACKETS...</span>
              ) : (
                <>
                  <Radio className="w-4 h-4 animate-pulse" />
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

interface DeclareIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeclare: (incident: Partial<Incident>) => void;
}

export const DeclareIncidentModal: React.FC<DeclareIncidentModalProps> = ({ isOpen, onClose, onDeclare }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Incident['type']>('Medical Emergency');
  const [priority, setPriority] = useState<PriorityLevel>('CRITICAL');
  const [location, setLocation] = useState('Sector 7G, Sub-Station 4');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    let category: Incident['category'] = 'medical';
    if (type.includes('Fire')) category = 'fire';
    if (type.includes('Trapped')) category = 'trapped';
    if (type.includes('Supply')) category = 'logistics';
    if (type.includes('Lost')) category = 'missing';

    onDeclare({
      title,
      type,
      category,
      priority,
      location,
      description: description || 'New emergency incident declared via coordinator console.',
      reporter: 'HQ Incident Command (Console)',
      nodeId: 'HQ-HUB-01',
      coordinates: {
        lat: '40.7180° N',
        lng: '74.0020° W',
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Declare Emergency Incident</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Incident Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sector 4 Structural Fracture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Incident Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Incident['type'])}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Panel Fire">Panel Fire / Hazard</option>
                <option value="Trapped Person">Trapped Person</option>
                <option value="Cardiac Arrest">Cardiac Arrest</option>
                <option value="Lost Personnel">Lost Personnel</option>
                <option value="Supply Request: Water">Supply Request</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-2.5 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MED">MED</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Sector / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Situation Brief</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Immediate threats, victim count, access impediments..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#c5192d] hover:bg-[#a81425] text-white text-xs font-bold rounded-md shadow-xs"
            >
              DECLARE INCIDENT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onAssignDispatch: (incidentId: string, teamName: string) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  incidents,
  onAssignDispatch,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [selectedTeam, setSelectedTeam] = useState<string>('Rescue Squad 4');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIncidentId && selectedTeam) {
      onAssignDispatch(selectedIncidentId, selectedTeam);
      onClose();
    }
  };

  const teams = [
    { name: 'Team Alpha', type: 'Tactical Search & Rescue' },
    { name: 'Medic Unit 1', type: 'Advanced Mobile Paramedics' },
    { name: 'Rescue Squad 4', type: 'Heavy Extrication & Hazmat' },
    { name: 'Eng Team Beta', type: 'Infrastructure & Power' },
    { name: 'Logistics Unit 2', type: 'Supplies & Water Tender' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Dispatch Response Team</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Target Incident</label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600 bg-white"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  [{inc.priority}] {inc.id} - {inc.title} ({inc.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Select Unit to Deploy</label>
            <div className="flex flex-col gap-2">
              {teams.map((t) => (
                <label
                  key={t.name}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedTeam === t.name
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="team"
                      value={t.name}
                      checked={selectedTeam === t.name}
                      onChange={() => setSelectedTeam(t.name)}
                      className="text-blue-600 focus:ring-0"
                    />
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    AVAILABLE
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-xs"
            >
              CONFIRM DISPATCH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BroadcastAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (message: string) => void;
}

export const BroadcastAlertModal: React.FC<BroadcastAlertModalProps> = ({ isOpen, onClose, onBroadcast }) => {
  const [alertText, setAlertText] = useState('All units switch to Tactical Frequency 915.2 MHz. Severe weather alert active.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertText) {
      onBroadcast(alertText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Broadcast Mesh Alert</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <p className="text-xs text-slate-600">
            This message will be propagated over all interconnected LoRa/WiFi mesh repeater nodes.
          </p>

          <textarea
            rows={3}
            value={alertText}
            onChange={(e) => setAlertText(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-red-600 resize-none font-mono"
            placeholder="Type priority mesh broadcast..."
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>TRANSMIT ALL NODES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RequestResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestResource: (item: string, qty: number, destination: string) => void;
}

export const RequestResourceModal: React.FC<RequestResourceModalProps> = ({
  isOpen,
  onClose,
  onRequestResource,
}) => {
  const [resource, setResource] = useState('Medical Kits (Tier 1)');
  const [quantity, setQuantity] = useState(25);
  const [destination, setDestination] = useState('Sector 7G Medical Triage Point');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestResource(resource, quantity, destination);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Request Critical Supply / Resource</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Resource Category</label>
            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600 bg-white"
            >
              <option value="Medical Kits (Tier 1)">Medical Kits (Tier 1)</option>
              <option value="Rations (Pallets)">Rations (Pallets)</option>
              <option value="Portable Generators">Portable Generators (5kW Diesel)</option>
              <option value="Potable Water Bladders (500 gal)">Potable Water Bladders (500 gal)</option>
              <option value="LoRa Relay Repeaters">LoRa Relay Repeaters</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Quantity Required</label>
            <input
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Delivery Drop Point</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-xs"
            >
              SUBMIT REQUISITION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
