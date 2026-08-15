import React, { useState } from 'react';
import { 
  NavigationTab, 
  Incident, 
  MeshNode, 
  ChatChannel, 
  ChatMessage, 
  TelemetryActivityLog, 
  SystemConfig, 
  SupplyItem 
} from './types';
import { 
  INITIAL_INCIDENTS, 
  MESH_NODES, 
  INITIAL_CHANNELS, 
  FIELD_UNITS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_CONFIG, 
  INITIAL_SUPPLIES 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { EmergencyOverviewView } from './components/EmergencyOverviewView';
import { EmergencyProtocolView } from './components/EmergencyProtocolView';
import { MeshNetworkView } from './components/MeshNetworkView';
import { RescueView } from './components/RescueView';
import { CommunicationsView } from './components/CommunicationsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { 
  SOSModal, 
  DeclareIncidentModal, 
  DispatchModal, 
  BroadcastAlertModal, 
  RequestResourceModal 
} from './components/Modals';

export const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core App State
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('REQ-8892');
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>(MESH_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ND-91-DELHI');
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [fieldUnits, setFieldUnits] = useState<ChatChannel[]>(FIELD_UNITS);
  const [activeChannelId, setActiveChannelId] = useState<string>('sector-7-tactical');
  const [activityLogs, setActivityLogs] = useState<TelemetryActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_CONFIG);
  const [supplies, setSupplies] = useState<SupplyItem[]>(INITIAL_SUPPLIES);

  // Modals state
  const [isSOSModalOpen, setIsSOSModalOpen] = useState<boolean>(false);
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState<boolean>(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'info' | 'alert' | 'success' } | null>(null);

  const showToast = (title: string, desc: string, type: 'info' | 'alert' | 'success' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Play tactical buzzer audio (using browser Web Audio API oscillator)
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15); // A4
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio not supported in headless mode
    }
  };

  // SOS Transmit Handler
  const handleTransmitSOS = (data: { type: string; category: Incident['category']; details: string; location: string }) => {
    playAlertChime();
    const newId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newIncident: Incident = {
      id: newId,
      title: data.type,
      type: data.type as Incident['type'],
      category: data.category,
      priority: 'CRITICAL',
      time: timeStr,
      elapsedSeconds: 0,
      location: data.location,
      coordinates: {
        lat: '40.7128° N',
        lng: '74.0060° W',
      },
      reporter: 'Civilian Distress Beacon (Local Mesh)',
      nodeId: 'MESH-BEACON-04',
      description: data.details,
      status: 'Awaiting Dispatch',
      commsLog: [
        {
          id: `c-${Date.now()}`,
          timestamp: `${timeStr}:00`,
          sender: 'MESH BEACON (Auto)',
          type: 'auto',
          text: `PRIORITY 1 SOS RECEIVED: ${data.details}`,
        },
      ],
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncidentId(newId);

    // Also add to telemetry activity logs
    const newLog: TelemetryActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: `${new Date().toISOString().replace('T', ' ').slice(0, 19)}`,
      severity: 'CRITICAL',
      nodeId: 'MESH-BEACON-04',
      eventDescription: `DISTRESS SOS: ${data.type} at ${data.location}`,
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    showToast('CRITICAL SOS BROADCASTED', `Distress payload ${newId} dispatched across 1,256 nodes.`, 'alert');
  };

  // Declare Incident Handler
  const handleDeclareIncident = (inc: Partial<Incident>) => {
    const newId = `INC-${Math.floor(9000 + Math.random() * 999)}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const fullInc: Incident = {
      id: newId,
      title: inc.title || 'New Incident',
      type: inc.type || 'Medical Emergency',
      category: inc.category || 'medical',
      priority: inc.priority || 'HIGH',
      time: timeStr,
      elapsedSeconds: 0,
      location: inc.location || 'Sector 7G, Central Grid',
      coordinates: inc.coordinates || { lat: '40.7128° N', lng: '74.0060° W' },
      reporter: inc.reporter || 'HQ Incident Command',
      nodeId: inc.nodeId || 'HQ-01',
      description: inc.description || '',
      status: 'Awaiting Dispatch',
      commsLog: [
        {
          id: `cl-${Date.now()}`,
          timestamp: `${timeStr}:00`,
          sender: 'DISPATCH HQ',
          type: 'system',
          text: `Incident ${newId} logged by incident command.`,
        },
      ],
    };

    setIncidents((prev) => [fullInc, ...prev]);
    setSelectedIncidentId(newId);
    showToast('Incident Declared', `${fullInc.id} logged in dispatch queue.`, 'info');
  };

  // Assign Team Dispatch
  const handleAssignTeam = (incidentId: string, teamName: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
          return {
            ...inc,
            status: 'Team Assigned',
            assignedTeam: teamName,
            commsLog: [
              ...inc.commsLog,
              {
                id: `c-${Date.now()}`,
                timestamp: timeStr,
                sender: 'DISPATCH (System)',
                type: 'system',
                text: `${teamName} dispatched to incident coordinates.`,
              },
            ],
          };
        }
        return inc;
      })
    );
    showToast('Team Deployed', `${teamName} assigned to ${incidentId}.`, 'success');
  };

  // Resolve Incident
  const handleResolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return { ...inc, status: 'Resolved' };
        }
        return inc;
      })
    );
    showToast('Incident Resolved', `${incidentId} marked as successfully resolved.`, 'success');
  };

  // Send message in rescue incident comms log
  const handleSendIncidentComms = (incidentId: string, text: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            commsLog: [
              ...inc.commsLog,
              {
                id: `msg-${Date.now()}`,
                timestamp: timeStr,
                sender: 'DISPATCH ALPHA (You)',
                type: 'user',
                text,
              },
            ],
          };
        }
        return inc;
      })
    );
  };

  // Send message in Communications tab
  const handleSendChatMessage = (
    channelId: string,
    text: string,
    attachment?: { name: string; size: string; type: 'pdf' | 'map' | 'image' }
  ) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'Dispatcher Alpha',
      initials: 'DA',
      role: 'HQ Control',
      time: timeStr,
      text,
      attachment,
    };

    const updateMsgInList = (list: ChatChannel[]) =>
      list.map((c) => {
        if (c.id === channelId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      });

    setChannels(updateMsgInList);
    setFieldUnits(updateMsgInList);

    // Automated simulation response after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'Cmdr. Riker',
        initials: 'CR',
        role: 'Field Commander',
        time: timeStr,
        text: 'Received loud and clear. Field telemetry calibrated.',
      };
      setChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, messages: [...c.messages, replyMsg] } : c))
      );
    }, 1200);
  };

  // Force sync on node
  const handleForceSyncNode = (nodeId: string) => {
    setMeshNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            lastSync: 'just now',
            logs: [
              { time: new Date().toLocaleTimeString(), message: 'Manual force synchronization complete', type: 'normal' },
              ...n.logs,
            ],
          };
        }
        return n;
      })
    );
    showToast('Node Synchronized', `${nodeId} state updated with 0 dropped packets.`, 'success');
  };

  // Global Broadcast
  const handleGlobalBroadcast = (message: string) => {
    playAlertChime();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Append to emergency broadcast channel
    const broadcastMsg: ChatMessage = {
      id: `bc-${Date.now()}`,
      sender: 'HQ Command',
      initials: 'HQ',
      role: 'Broadcast Admin',
      time: timeStr,
      text: `[PRIORITY BROADCAST] ${message}`,
    };

    setChannels((prev) =>
      prev.map((c) => (c.id === 'emergency-broadcast' ? { ...c, messages: [...c.messages, broadcastMsg] } : c))
    );

    showToast('BROADCAST TRANSMITTED', 'Priority mesh alert forwarded to all units and repeaters.', 'alert');
  };

  // Requisition Resource
  const handleRequestResource = (item: string, qty: number, destination: string) => {
    setSupplies((prev) =>
      prev.map((s) => {
        if (item.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(item.toLowerCase())) {
          return {
            ...s,
            current: Math.min(s.max, s.current + qty),
            percentage: Math.min(100, ((s.current + qty) / s.max) * 100),
            isCritical: false,
          };
        }
        return s;
      })
    );
    showToast('Resource Requisitioned', `${qty}x ${item} en route to ${destination}.`, 'success');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border text-xs max-w-sm flex flex-col gap-1 transition-all animate-in slide-in-from-top-3 ${
          toastMessage.type === 'alert'
            ? 'bg-red-950 text-white border-red-500 shadow-red-900/50'
            : toastMessage.type === 'success'
            ? 'bg-emerald-950 text-white border-emerald-500 shadow-emerald-900/50'
            : 'bg-slate-900 text-white border-slate-700 shadow-xl'
        }`}>
          <div className="font-bold font-mono tracking-wide uppercase flex items-center justify-between">
            <span>{toastMessage.title}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">&times;</button>
          </div>
          <div className="text-slate-200">{toastMessage.desc}</div>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSOS={() => setIsSOSModalOpen(true)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenSOS={() => setIsSOSModalOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notificationCount={3}
          onOpenNotifications={() => showToast('System Notifications', '3 new encrypted LoRa mesh packets received.', 'info')}
        />

        {/* View Routing */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentTab === 'dashboard' && (
            <DashboardView
              incidents={incidents}
              supplies={supplies}
              onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
              onOpenRequestResource={() => setIsResourceModalOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setCurrentTab('rescue');
              }}
            />
          )}

          {currentTab === 'emergency' && (
            <EmergencyOverviewView
              incidents={incidents}
              onDeclareIncident={() => setIsDeclareModalOpen(true)}
              onOpenBroadcast={() => setIsBroadcastModalOpen(true)}
              onOpenDispatch={() => setIsDispatchModalOpen(true)}
              onSelectIncident={(id) => {
                setSelectedIncidentId(id);
                setCurrentTab('rescue');
              }}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenEmergencyProtocol={() => setCurrentTab('emergency-protocol')}
            />
          )}

          {currentTab === 'emergency-protocol' && (
            <EmergencyProtocolView
              onTransmitSOS={handleTransmitSOS}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'mesh' && (
            <MeshNetworkView
              nodes={meshNodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onForceSync={handleForceSyncNode}
            />
          )}

          {currentTab === 'rescue' && (
            <RescueView
              incidents={incidents}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={setSelectedIncidentId}
              onOpenNewDispatch={() => setIsDispatchModalOpen(true)}
              onAssignTeam={handleAssignTeam}
              onResolveIncident={handleResolveIncident}
              onSendCommsMessage={handleSendIncidentComms}
            />
          )}

          {currentTab === 'communication' && (
            <CommunicationsView
              channels={channels}
              fieldUnits={fieldUnits}
              activeChannelId={activeChannelId}
              onSelectChannel={setActiveChannelId}
              onSendMessage={handleSendChatMessage}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              logs={activityLogs}
              onRefresh={() => showToast('Telemetry Refreshed', 'Synced with 1,402 mesh nodes.', 'info')}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              config={systemConfig}
              onSaveConfig={(newCfg) => setSystemConfig(newCfg)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onSubmitSOS={handleTransmitSOS}
      />

      <DeclareIncidentModal
        isOpen={isDeclareModalOpen}
        onClose={() => setIsDeclareModalOpen(false)}
        onDeclare={handleDeclareIncident}
      />

      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        incidents={incidents.filter((i) => i.status !== 'Resolved')}
        onAssignDispatch={handleAssignTeam}
      />

      <BroadcastAlertModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onBroadcast={handleGlobalBroadcast}
      />

      <RequestResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onRequestResource={handleRequestResource}
      />
    </div>
  );
};

export default App;
