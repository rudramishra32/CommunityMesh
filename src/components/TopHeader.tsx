import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  User, 
  Menu, 
  AlertTriangle,
  Flame,
  Radio
} from 'lucide-react';
import { NavigationTab } from '../types';

interface TopHeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSOS: () => void;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSOS,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  notificationCount = 3,
  onOpenNotifications,
}) => {
  const isEmergencyProtocol = currentTab === 'emergency-protocol';
  const isSettings = currentTab === 'settings';

  return (
    <header className={`h-14 border-b flex items-center justify-between px-4 lg:px-6 shrink-0 transition-colors ${
      isEmergencyProtocol 
        ? 'bg-[#080e18] border-slate-800 text-slate-100' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Left side: Hamburger (mobile) + Breadcrumbs / Tab bar */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-6">
          <span 
            onClick={() => onSelectTab('dashboard')}
            className={`font-bold text-base tracking-tight cursor-pointer ${
              isEmergencyProtocol ? 'text-cyan-400' : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            CommunityMesh
          </span>

          <nav className="hidden sm:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`transition-colors pb-0.5 ${
                currentTab === 'dashboard'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : isEmergencyProtocol
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('emergency')}
              className={`transition-colors pb-0.5 ${
                currentTab === 'emergency' || currentTab === 'emergency-protocol'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : isEmergencyProtocol
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emergency
            </button>

            <button
              onClick={() => onSelectTab('communication')}
              className={`transition-colors pb-0.5 ${
                currentTab === 'communication'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : isEmergencyProtocol
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Communication
            </button>

            <button
              onClick={() => onSelectTab('rescue')}
              className={`transition-colors pb-0.5 ${
                currentTab === 'rescue'
                  ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                  : isEmergencyProtocol
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Incident
            </button>
          </nav>
        </div>
      </div>

      {/* Right side: Search, SOS button, Bell, User, Help */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search channels, units..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-md text-xs border focus:outline-none transition-colors ${
              isEmergencyProtocol
                ? 'bg-slate-900/80 border-slate-700 text-slate-200 placeholder-slate-500 focus:border-cyan-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white'
            }`}
          />
        </div>

        {/* SOS Top Button */}
        <button
          id="top-sos-button"
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#c5192d] hover:bg-[#a81425] text-white rounded text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>SOS</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className={`relative p-2 rounded-md transition-colors ${
            isEmergencyProtocol 
              ? 'text-slate-300 hover:bg-slate-800' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>

        {/* User Profile */}
        <button 
          onClick={() => onSelectTab('settings')}
          className={`p-2 rounded-md transition-colors ${
            isEmergencyProtocol ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="User Settings"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Help Tooltip */}
        <button 
          onClick={() => onSelectTab('reports')}
          className={`p-2 rounded-md transition-colors ${
            isEmergencyProtocol ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="System Help & Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
