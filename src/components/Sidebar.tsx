import React from 'react';
import { 
  Radio, 
  AlertOctagon, 
  LayoutGrid, 
  AlertTriangle, 
  Network, 
  BriefcaseMedical, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  History, 
  User, 
  LogOut,
  Flame,
  X
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSOS: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSOS,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isEmergencyProtocol = currentTab === 'emergency-protocol';
  const isSettings = currentTab === 'settings';

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'emergency' as NavigationTab, label: 'Emergency', icon: AlertTriangle },
    { id: 'mesh' as NavigationTab, label: 'Mesh Network', icon: Network },
    { id: 'rescue' as NavigationTab, label: 'Rescue', icon: BriefcaseMedical },
    { id: 'communication' as NavigationTab, label: 'Communication', icon: MessageSquare },
    { id: 'reports' as NavigationTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  // If in settings screen, the left bar in Image 7 has a rich deep blue theme!
  const isBlueTheme = isSettings;
  const isDarkEmergency = isEmergencyProtocol;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 flex flex-col justify-between shrink-0 transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isDarkEmergency 
            ? 'bg-[#0b131e] text-slate-200 border-r border-slate-800' 
            : isBlueTheme 
            ? 'bg-[#004bd6] text-white' 
            : 'bg-white text-slate-700 border-r border-slate-200'
        }`}
      >
        <div className="flex flex-col p-4">
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-xs ${
                isDarkEmergency ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : isBlueTheme ? 'bg-white text-[#004bd6]' : 'bg-blue-600 text-white'
              }`}>
                <Network className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg">
                  <span className={isDarkEmergency ? 'text-cyan-400' : isBlueTheme ? 'text-white' : 'text-slate-900'}>
                    Community<span className={isDarkEmergency ? 'text-white' : isBlueTheme ? 'text-blue-200' : 'text-blue-600'}>Mesh</span>
                  </span>
                </div>
                <div className={`text-[11px] font-medium flex items-center gap-1.5 ${
                  isDarkEmergency ? 'text-cyan-400/80' : isBlueTheme ? 'text-blue-100/90' : 'text-emerald-600'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isSettings ? 'Infrastructure Management' : 'Mesh Status: Online'}
                </div>
              </div>
            </div>

            {onCloseMobile && (
              <button 
                onClick={onCloseMobile} 
                className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* SOS EMERGENCY BUTTON */}
          <button
            id="sidebar-sos-button"
            onClick={onOpenSOS}
            className={`w-full mb-5 py-3 px-4 rounded-md font-bold text-sm tracking-wider flex items-center justify-center gap-2 uppercase transition-all shadow-md active:scale-98 ${
              isDarkEmergency
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 ring-2 ring-rose-500/50 animate-pulse'
                : isBlueTheme
                ? 'bg-[#c5192d] hover:bg-[#b01426] text-white shadow-red-950/30'
                : 'bg-[#c5192d] hover:bg-[#b01426] text-white shadow-red-700/20'
            }`}
          >
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>SOS EMERGENCY</span>
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'emergency' && currentTab === 'emergency-protocol');

              let activeClasses = '';
              let inactiveClasses = '';

              if (isDarkEmergency) {
                activeClasses = 'bg-cyan-950/60 text-cyan-300 border-l-3 border-cyan-400 font-semibold';
                inactiveClasses = 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40';
              } else if (isBlueTheme) {
                activeClasses = 'bg-white/20 text-white font-semibold backdrop-blur-xs shadow-xs';
                inactiveClasses = 'text-blue-100 hover:text-white hover:bg-white/10';
              } else {
                activeClasses = 'bg-blue-50 text-blue-700 font-semibold border-l-3 border-blue-600';
                inactiveClasses = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80';
              }

              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm transition-colors text-left ${
                    isActive ? activeClasses : inactiveClasses
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? (isDarkEmergency ? 'text-cyan-400' : isBlueTheme ? 'text-white' : 'text-blue-600') : 'opacity-80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className={`p-4 border-t ${
          isDarkEmergency ? 'border-slate-800 bg-[#070d14]' : isBlueTheme ? 'border-blue-700/50 bg-[#0041b8]' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <div className="flex flex-col gap-1 text-xs mb-4">
            <button 
              onClick={() => onSelectTab('reports')}
              className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                isDarkEmergency ? 'text-slate-400 hover:text-slate-200' : isBlueTheme ? 'text-blue-100 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support & Docs</span>
            </button>
            <button 
              onClick={() => onSelectTab('reports')}
              className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                isDarkEmergency ? 'text-slate-400 hover:text-slate-200' : isBlueTheme ? 'text-blue-100 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>System Logs</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/20">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                isDarkEmergency ? 'bg-cyan-900/60 text-cyan-300' : isBlueTheme ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold leading-tight ${isDarkEmergency ? 'text-slate-200' : isBlueTheme ? 'text-white' : 'text-slate-800'}`}>
                  Admin User
                </span>
                <span className={`text-[10px] ${isDarkEmergency ? 'text-slate-400' : isBlueTheme ? 'text-blue-200' : 'text-slate-400'}`}>
                  Control Center
                </span>
              </div>
            </div>

            <button 
              title="Logout / Switch Node"
              className={`p-1.5 rounded hover:bg-black/10 transition-colors ${
                isDarkEmergency ? 'text-slate-400 hover:text-white' : isBlueTheme ? 'text-blue-100 hover:text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
