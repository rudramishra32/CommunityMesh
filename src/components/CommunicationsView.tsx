import React, { useState } from 'react';
import { 
  Hash, 
  Plus, 
  Phone, 
  Video, 
  Paperclip, 
  Mic, 
  Send, 
  FileText, 
  Download, 
  Users, 
  Truck, 
  Wrench, 
  Cross, 
  Bot, 
  Pin, 
  MoreVertical,
  CheckCheck
} from 'lucide-react';
import { ChatChannel, ChatMessage } from '../types';

interface CommunicationsViewProps {
  channels: ChatChannel[];
  fieldUnits: ChatChannel[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  onSendMessage: (channelId: string, text: string, attachment?: { name: string; size: string; type: 'pdf' | 'map' | 'image' }) => void;
  onAddChannel?: (name: string) => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({
  channels,
  fieldUnits,
  activeChannelId,
  onSelectChannel,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newChannelName, setNewChannelName] = useState<string>('');

  const allChannels = [...channels, ...fieldUnits];
  const currentChannel = allChannels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentChannel) return;

    onSendMessage(currentChannel.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-white">
      {/* Column 1: Channels & Field Units Navigation (260px) */}
      <div className="w-full lg:w-64 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0 overflow-y-auto">
        {/* Active Channels */}
        <div className="p-3">
          <div className="flex items-center justify-between px-2 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Active Channels</span>
            <button 
              onClick={() => setShowAddModal(true)}
              className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
              title="Add Channel"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {channels.map((chan) => {
              const isActive = currentChannel?.id === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => onSelectChannel(chan.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-400'}`} />
                    <span className="truncate">{chan.name}</span>
                  </div>
                  {chan.unreadCount && chan.unreadCount > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {chan.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Field Units */}
        <div className="p-3 border-t border-slate-200/80">
          <div className="px-2 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Field Units
          </div>

          <div className="flex flex-col gap-1">
            {fieldUnits.map((unit) => {
              const isActive = currentChannel?.id === unit.id;
              return (
                <button
                  key={unit.id}
                  onClick={() => onSelectChannel(unit.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {unit.iconType === 'truck' ? (
                      <Truck className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    ) : unit.iconType === 'wrench' ? (
                      <Wrench className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    ) : (
                      <Cross className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-red-500'}`} />
                    )}
                    <span className="truncate">{unit.name}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    unit.unitStatus === 'online' ? 'bg-emerald-500' : unit.unitStatus === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Column 2: Center Active Chat Room */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
        {/* Chat Room Header (Matching Image 3) */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <Hash className="w-5 h-5 text-slate-600" />
            <div>
              <div className="font-bold text-sm text-slate-900 leading-tight">
                {currentChannel ? currentChannel.name : 'sector-7-tactical'}
              </div>
              <div className="text-[11px] text-slate-400">
                {currentChannel ? currentChannel.topic : 'Coordinating rescue efforts in Sector 7 grid.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <button className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-700" title="Audio Call">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-700" title="Video Feed">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-700">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-4">
          {currentChannel?.messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                msg.isBot 
                  ? 'bg-slate-800 text-cyan-400' 
                  : msg.role?.includes('HQ') 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-emerald-600 text-white'
              }`}>
                {msg.isBot ? <Bot className="w-4 h-4" /> : msg.initials}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{msg.sender}</span>
                  {msg.isBot && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono text-[9px] font-bold">
                      BOT
                    </span>
                  )}
                  {msg.role && !msg.isBot && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({msg.role})
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                </div>

                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {msg.text}
                </p>

                {/* Attachment Card (Matching Sector7_Map.pdf card in Image 3) */}
                {msg.attachment && (
                  <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 max-w-sm flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{msg.attachment.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{msg.attachment.size}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Downloading asset: ${msg.attachment?.name}`)}
                      className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Select tactical map or PDF to attach')}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
            title="Attach File"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message #${currentChannel?.name || 'tactical-feed'}...`}
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 placeholder-slate-400"
          />

          <button
            type="button"
            onClick={() => alert('Push-to-talk microphone active')}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500"
            title="Push to talk"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Column 3: Channel Details (Right Column 280px) */}
      <div className="hidden xl:flex w-72 border-l border-slate-200 bg-slate-50/50 flex-col p-4 overflow-y-auto shrink-0 gap-5 text-xs">
        {/* About Section */}
        <div>
          <div className="font-bold text-slate-800 uppercase text-[11px] tracking-wider mb-1.5">
            About
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {currentChannel?.topic || 'Primary tactical coordination channel for Sector 7 incident management. Created Oct 12, 2023.'}
          </p>
        </div>

        {/* Participants (12) */}
        <div>
          <div className="flex items-center justify-between font-bold text-slate-800 uppercase text-[11px] tracking-wider mb-2">
            <span>Participants ({currentChannel?.participants.length || 5})</span>
            <button className="text-blue-600 hover:underline text-[10px] capitalize">View all</button>
          </div>

          <div className="flex flex-col gap-2">
            {currentChannel?.participants.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                  {p.initials}
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-bold text-slate-800 text-[11px] truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{p.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Assets */}
        <div>
          <div className="font-bold text-slate-800 uppercase text-[11px] tracking-wider mb-2">
            Shared Assets
          </div>

          <div className="flex flex-col gap-2">
            {currentChannel?.pinnedAssets.map((asset, idx) => (
              <div key={idx} className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">{asset.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{asset.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
