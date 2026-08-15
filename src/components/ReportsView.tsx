import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Server, 
  TrendingUp,
  PieChart,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal
} from 'lucide-react';
import { TelemetryActivityLog } from '../types';

interface ReportsViewProps {
  logs: TelemetryActivityLog[];
  onRefresh?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ logs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('24 Hours');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (onRefresh) onRefresh();
      setIsRefreshing(false);
    }, 600);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "communitymesh_telemetry_report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.nodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.eventDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 bg-slate-50 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            Reports & Statistics
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-0.5">
            System Telemetry Live Feed | <span className="text-blue-600 font-semibold">T+ 04:22:11</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Network Uptime</span>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-slate-900">99.98%</div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0.02%</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Nodes</span>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-slate-900">1,402</div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 mt-1 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pending Alerts</span>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-slate-900">47</div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-blue-600 mt-1 font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-5</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Critical Incidents</span>
          <div className="mt-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-red-600">3</div>
            <div className="text-[11px] font-mono text-red-600 mt-1 font-bold">
              [ACTION REQ]
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Network Performance Area Chart (Left) & Resource Allocation Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Network Performance SVG Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Network Performance
              </h2>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="24 Hours">24 Hours</option>
              <option value="7 Days">7 Days</option>
              <option value="30 Days">30 Days</option>
            </select>
          </div>

          {/* Interactive SVG Chart Rendering */}
          <div className="h-56 w-full my-3 relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="190" x2="600" y2="190" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area fill */}
              <path
                d="M 0 160 Q 100 140 180 80 T 360 90 T 480 50 T 600 70 L 600 200 L 0 200 Z"
                fill="url(#areaGradient)"
              />

              {/* Spline Line */}
              <path
                d="M 0 160 Q 100 140 180 80 T 360 90 T 480 50 T 600 70"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="180" cy="80" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <circle cx="360" cy="90" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <circle cx="480" cy="50" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Tooltip on peak point */}
            <div className="absolute top-[18%] left-[76%] -translate-x-1/2 bg-slate-900 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg flex flex-col items-center pointer-events-none">
              <span className="font-bold">14:00 - 4.8 TB/s</span>
              <span className="text-emerald-400">99.9% packet delivery</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Resource Allocation Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resource Allocation
            </h2>
          </div>

          {/* SVG Donut Visual */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              {/* Medical 45% (Blue) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#2563eb"
                strokeWidth="14"
                strokeDasharray="107 238"
                strokeDashoffset="0"
              />
              {/* Logistics 25% (Emerald) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="14"
                strokeDasharray="60 238"
                strokeDashoffset="-107"
              />
              {/* Security 20% (Amber) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="14"
                strokeDasharray="48 238"
                strokeDashoffset="-167"
              />
              {/* Unallocated 10% (Slate) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="14"
                strokeDasharray="23 238"
                strokeDashoffset="-215"
              />
            </svg>

            {/* Inner text inside donut hole */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono text-slate-900">8.4k</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">TOTAL UNITS</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Medical (45%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Logistics (25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Security (20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span>Unallocated (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: System Activity Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs mt-5 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            System Activity Log
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by node or keyword..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] uppercase border-b border-slate-100">
              <tr>
                <th className="px-4 py-2.5 font-semibold">TIMESTAMP (UTC)</th>
                <th className="px-4 py-2.5 font-semibold">SEVERITY</th>
                <th className="px-4 py-2.5 font-semibold">NODE ID</th>
                <th className="px-4 py-2.5 font-semibold">EVENT DESCRIPTION</th>
                <th className="px-4 py-2.5 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-600">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      log.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-800'
                        : log.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{log.nodeId}</td>
                  <td className="px-4 py-3 text-slate-700">{log.eventDescription}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {log.severity === 'CRITICAL' ? (
                        <button 
                          onClick={() => alert(`Investigating telemetry anomaly on ${log.nodeId}`)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold font-mono uppercase"
                        >
                          INVESTIGATE
                        </button>
                      ) : (
                        <button 
                          onClick={() => alert(`Inspection details for ${log.nodeId}`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold font-mono uppercase"
                        >
                          VIEW
                        </button>
                      )}
                      <button className="p-1 text-slate-400 hover:text-slate-700">
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Showing 1-4 of 1,204 logs</span>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 disabled:opacity-50">
              &lt; Prev
            </button>
            <span className="font-bold text-slate-800">1</span>
            <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600">
              Next &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
