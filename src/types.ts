export type NavigationTab = 
  | 'dashboard'
  | 'emergency'
  | 'emergency-protocol'
  | 'mesh'
  | 'rescue'
  | 'communication'
  | 'reports'
  | 'settings';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MED' | 'LOW';

export interface Incident {
  id: string; // e.g. REQ-8892 or INC-9942
  title: string;
  type: 'Medical Emergency' | 'Trapped Person' | 'Supply Request: Water' | 'Panel Fire' | 'Lost Personnel' | 'Power Failure' | 'Hazard' | 'Cardiac Arrest';
  category: 'medical' | 'fire' | 'trapped' | 'missing' | 'logistics';
  priority: PriorityLevel;
  time: string;
  elapsedSeconds: number;
  location: string;
  coordinates: {
    lat: string;
    lng: string;
  };
  reporter: string;
  nodeId: string;
  description: string;
  status: 'Awaiting Dispatch' | 'Team Assigned' | 'En Route' | 'Containing' | 'Searching' | 'Resolved';
  assignedTeam?: string;
  commsLog: CommsMessage[];
}

export interface CommsMessage {
  id: string;
  timestamp: string;
  sender: string;
  type: 'auto' | 'system' | 'radio' | 'user';
  text: string;
}

export interface MeshNode {
  id: string;
  name: string;
  locationName: string;
  status: 'online' | 'offline' | 'alert' | 'gateway';
  x: number; // 0-100 percentage on tactical map
  y: number; // 0-100 percentage on tactical map
  signalStrength: string; // e.g. "-45 dBm"
  signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  battery: number; // e.g. 78
  batteryStatus: 'Discharging' | 'Charging' | 'Full';
  lastSync: string;
  packetsTx: string;
  packetsRx: string;
  connectedPeers: number;
  logs: {
    time: string;
    message: string;
    type?: 'normal' | 'warning' | 'error';
  }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  topic: string;
  unreadCount?: number;
  isFieldUnit?: boolean;
  unitStatus?: 'online' | 'busy' | 'offline';
  iconType?: 'medic' | 'truck' | 'wrench' | 'channel';
  messages: ChatMessage[];
  participants: {
    name: string;
    role: string;
    initials: string;
    isBot?: boolean;
  }[];
  pinnedAssets: {
    name: string;
    pinnedBy: string;
    size?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  initials: string;
  role?: string;
  isBot?: boolean;
  time: string;
  text: string;
  attachment?: {
    name: string;
    size: string;
    type: 'pdf' | 'map' | 'image';
  };
}

export interface TelemetryActivityLog {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'NOMINAL';
  nodeId: string;
  eventDescription: string;
}

export interface SystemConfig {
  adminId: string;
  email: string;
  meshFrequency: string;
  encryptionProtocol: string;
  beaconInterval: number;
  criticalAlertsOverride: boolean;
  telemetryLogging: boolean;
}

export interface SupplyItem {
  id: string;
  name: string;
  percentage: number;
  current: number;
  max: number;
  unit: string;
  isCritical?: boolean;
}
