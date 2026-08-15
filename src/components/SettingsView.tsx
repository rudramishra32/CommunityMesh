import React, { useState } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  SlidersHorizontal,
  Bell, 
  HelpCircle,
  RotateCcw,
  Save
} from 'lucide-react';
import { SystemConfig } from '../types';

interface SettingsViewProps {
  config: SystemConfig;
  onSaveConfig: (newConfig: SystemConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ config, onSaveConfig }) => {
  const [formData, setFormData] = useState<SystemConfig>({ ...config });
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRevert = () => {
    setFormData({ ...config });
  };

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 bg-slate-50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            System Configuration
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Node parameters, encryption keys, and hardware mesh settings
          </p>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <button className="p-2 rounded-md hover:bg-slate-200/70" title="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-slate-200/70" title="Help">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {savedSuccess && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration applied successfully and synchronized across mesh coordinator nodes.</span>
        </div>
      )}

      {/* Main Form Grid: 2 Columns */}
      <form onSubmit={handleApply} className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Column: Account Settings (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Account Settings
            </h2>

            <div className="flex flex-col gap-4 my-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Administrator ID</label>
                <input
                  type="text"
                  readOnly
                  value={formData.adminId}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-100 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>2FA Hardware Token Active</span>
          </div>
        </div>

        {/* Right Column: Network Configuration (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Network Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Mesh Frequency (MHz)
                </label>
                <select
                  value={formData.meshFrequency}
                  onChange={(e) => setFormData({ ...formData, meshFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option value="915.0 - LoRa Standard">915.0 - LoRa Standard (US/Americas)</option>
                  <option value="868.0 - EU Standard">868.0 - EU Standard</option>
                  <option value="433.0 - Asian Standard">433.0 - Asian Standard</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Encryption Protocol
                </label>
                <select
                  value={formData.encryptionProtocol}
                  onChange={(e) => setFormData({ ...formData, encryptionProtocol: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option value="AES-256-GCM">AES-256-GCM (Hardware Accelerated)</option>
                  <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 (Low Power)</option>
                  <option value="RSA-4096-ECC">RSA-4096-ECC (Elliptic Curve)</option>
                </select>
              </div>
            </div>

            {/* Slider: Beacon Interval */}
            <div className="my-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                <span>Node Discovery Beacon Interval</span>
                <span className="font-mono text-blue-600 font-bold">{formData.beaconInterval}s</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={formData.beaconInterval}
                onChange={(e) => setFormData({ ...formData, beaconInterval: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>10s (High Bandwidth)</span>
                <span>300s (Battery Saver)</span>
              </div>
            </div>

            {/* System Preferences Toggles (Exact Match to Image 7 & 8) */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                System Preferences
              </h3>

              <div className="flex flex-col gap-3">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Critical Alerts Override</div>
                    <div className="text-[11px] text-slate-500">
                      Bypass silent mode for SOS network events
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.criticalAlertsOverride}
                      onChange={(e) => setFormData({ ...formData, criticalAlertsOverride: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Telemetry Logging</div>
                    <div className="text-[11px] text-slate-500">
                      Store local node connection metrics
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.telemetryLogging}
                      onChange={(e) => setFormData({ ...formData, telemetryLogging: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleRevert}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert Changes</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Update Administrator Password</h3>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Password updated successfully.');
                  setShowPasswordModal(false);
                }}
                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
