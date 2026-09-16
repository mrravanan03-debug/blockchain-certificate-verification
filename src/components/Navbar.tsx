import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  SearchCode, 
  Boxes, 
  Database, 
  Layers, 
  RotateCcw,
  Sparkles,
  Cpu
} from 'lucide-react';
import { TabMode } from '../types';

interface NavbarProps {
  currentTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  blockHeight: number;
  totalCerts: number;
  onResetLedger: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  blockHeight,
  totalCerts,
  onResetLedger
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('overview')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center group-hover:bg-slate-800 transition">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                  KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                  Live Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                Autonomous Institution &bull; Office of Principal Dr. N. MALA &bull; Blockchain Credential Portal
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300">
              <Boxes className="w-3.5 h-3.5 text-teal-400" />
              <span>Block Height:</span>
              <span className="font-mono font-bold text-teal-300">#{blockHeight}</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Records:</span>
              <span className="font-mono font-bold text-emerald-300">{totalCerts}</span>
            </div>
          </div>

          {/* Reset Action */}
          <button
            onClick={() => {
              if (confirm('Reset blockchain and registry back to factory state?')) {
                onResetLedger();
              }
            }}
            title="Reset Ledger to Default State"
            className="text-xs text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Ledger</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none text-sm font-medium">
          <button
            onClick={() => onSelectTab('overview')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'overview'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Process Flow Map</span>
          </button>

          <button
            onClick={() => onSelectTab('issuance')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'issuance'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>1. Issue Certificate (Admin)</span>
          </button>

          <button
            onClick={() => onSelectTab('certificate')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'certificate'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Certificate &amp; QR Studio</span>
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'verify'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <SearchCode className="w-4 h-4" />
            <span>3 &amp; 4. Verify &amp; Result (HR)</span>
          </button>

          <button
            onClick={() => onSelectTab('techsuite')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'techsuite'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>Web3 &amp; Tech Suite</span>
          </button>

          <button
            onClick={() => onSelectTab('blockchain')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'blockchain'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Blockchain Ledger</span>
          </button>

          <button
            onClick={() => onSelectTab('registry')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              currentTab === 'registry'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>College Database</span>
          </button>
        </div>
      </div>
    </header>
  );
};
