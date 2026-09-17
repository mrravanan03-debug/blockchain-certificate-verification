import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  SearchCode, 
  Boxes, 
  Database, 
  Layers, 
  RotateCcw,
  Sparkles,
  Cpu,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Search,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Monitor,
  Layout,
  CheckCircle2,
  Hash,
  Award
} from 'lucide-react';
import { TabMode } from '../types';

interface NavbarProps {
  currentTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  blockHeight: number;
  totalCerts: number;
  onResetLedger: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
  onQuickVerifyRamanan?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  blockHeight,
  totalCerts,
  onResetLedger,
  isFullscreen,
  onToggleFullscreen,
  isFullWidth,
  onToggleFullWidth,
  onQuickVerifyRamanan
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
      if (e.altKey && e.key.toLowerCase() === 'm') {
        setIsMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const navItems: { id: TabMode; title: string; subtitle: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      title: 'Process Flow Map',
      subtitle: 'Complete 4-step institutional architecture and diagram',
      icon: <Layers className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'issuance',
      title: '1. Issue Certificate',
      subtitle: 'Principal Dr. N. MALA signatory issuance & block mining',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      badge: 'Admin'
    },
    {
      id: 'certificate',
      title: '2. Certificate & QR Studio',
      subtitle: 'Preview official parchment, QR placement & print PDF',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      badge: 'Studio'
    },
    {
      id: 'verify',
      title: '3 & 4. Verify & Result Portal',
      subtitle: 'Public employer verification, mobile mockup & fraud audit',
      icon: <SearchCode className="w-5 h-5 text-sky-400" />,
      badge: 'Public'
    },
    {
      id: 'techsuite',
      title: 'Web3 & Tech Suite',
      subtitle: 'Cryptographic hashing, IPFS CID inspector & mathematical audit',
      icon: <Cpu className="w-5 h-5 text-teal-400" />,
      badge: 'Web3'
    },
    {
      id: 'blockchain',
      title: 'Blockchain Ledger Explorer',
      subtitle: 'Decentralized chain, Merkle trees & live tamper attack simulator',
      icon: <Boxes className="w-5 h-5 text-purple-400" />,
      badge: 'Ledger'
    },
    {
      id: 'registry',
      title: 'College Database Registry',
      subtitle: 'Institutional student credentials database & records archive',
      icon: <Database className="w-5 h-5 text-blue-400" />,
      badge: 'Database'
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.title.toLowerCase().includes(menuSearch.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(menuSearch.toLowerCase())
  );

  return (
    <>
      {/* Fullscreen Notification Strip if in fullscreen */}
      {isFullscreen && (
        <div className="no-print bg-emerald-950/90 border-b border-emerald-700/60 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold uppercase tracking-wider">
              Autonomous Institutional Command Mode (Full Screen)
            </span>
            <span className="text-emerald-500">•</span>
            <span className="hidden sm:inline text-emerald-400">
              Press Esc or click Minimize to exit
            </span>
          </div>
          <button 
            onClick={onToggleFullscreen}
            className="flex items-center space-x-1 font-semibold text-white bg-emerald-800/60 hover:bg-emerald-700/80 px-2.5 py-0.5 rounded transition"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        </div>
      )}

      <header className="no-print sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 ${isFullWidth ? 'max-w-full px-6 lg:px-10' : 'max-w-7xl'}`}>
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Left: Brand & Institution */}
            <div 
              onClick={() => onSelectTab('overview')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center group-hover:bg-slate-800 transition">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black tracking-tight text-white text-sm sm:text-base lg:text-lg uppercase">
                    KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE
                  </span>
                  <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                    Autonomous Node #01
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 hidden md:block">
                  Principal Dr. N. MALA &bull; SHA-256 Ledger &bull; Merkle Verified Credentials
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              
              {/* Telemetry Pills (Hidden on mobile) */}
              <div className="hidden lg:flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono">
                  <Boxes className="w-3.5 h-3.5 text-teal-400" />
                  <span>Block:</span>
                  <span className="font-bold text-teal-300">#{blockHeight}</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Certs:</span>
                  <span className="font-bold text-emerald-300">{totalCerts}</span>
                </div>
              </div>

              {/* Layout Width Toggle (Boxed vs Edge-to-Edge) */}
              <button
                onClick={onToggleFullWidth}
                title={isFullWidth ? "Switch to standard centered layout" : "Switch to complete full-page width layout"}
                className={`p-2 rounded-xl border text-xs font-medium transition flex items-center space-x-1.5 ${
                  isFullWidth 
                    ? 'bg-emerald-950/70 border-emerald-600/60 text-emerald-300' 
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {isFullWidth ? <Layout className="w-4 h-4 text-emerald-400" /> : <Monitor className="w-4 h-4" />}
                <span className="hidden xl:inline">{isFullWidth ? 'Full Width: ON' : 'Full Width'}</span>
              </button>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit Full Screen mode" : "Enter Complete Full Screen mode"}
                className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center space-x-1.5 ${
                  isFullscreen
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-white'
                }`}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Full Screen</span>
                  </>
                )}
              </button>

              {/* Reset Ledger Button */}
              <button
                onClick={() => {
                  if (confirm('Reset blockchain and registry back to factory state?')) {
                    onResetLedger();
                  }
                }}
                title="Reset Ledger to Factory State"
                className="hidden sm:flex text-xs text-slate-400 hover:text-rose-300 p-2 rounded-xl bg-slate-800/40 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-800/50 transition items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>

              {/* Comprehensive Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition"
                title="Open Complete Full-Page Navigation Menu"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline uppercase tracking-wider">Menu</span>
              </button>
            </div>
          </div>

          {/* Quick Tab Strip for Instant Access */}
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-slate-800/60 scrollbar-none text-xs sm:text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* FULL PAGE / FULL SCREEN SLIDE-OVER MENU DRAWER */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                      <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base uppercase tracking-wider">
                        Institutional Navigation Menu
                      </h3>
                      <p className="text-xs text-slate-400">
                        KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Close Menu (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search in Menu */}
                <div className="mt-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Search sections, verification, tools, or ledger..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  {menuSearch && (
                    <button 
                      onClick={() => setMenuSearch('')}
                      className="text-xs text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                
                {/* Section 1: Main Platform Navigation */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    System Workflows &amp; Portals
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredNavItems.map((item) => {
                      const isActive = currentTab === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectTab(item.id);
                            setIsMenuOpen(false);
                          }}
                          className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                            isActive
                              ? 'bg-emerald-950/50 border-emerald-500/50 shadow-md shadow-emerald-950'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className={`p-2.5 rounded-xl border ${
                              isActive ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-slate-900 border-slate-800'
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Display & Screen Controls */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Display &amp; Viewport Controls
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onToggleFullscreen}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        isFullscreen
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {isFullscreen ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Full Screen Mode</div>
                        <div className="text-[11px] text-slate-400">Expand across monitor</div>
                      </div>
                    </button>

                    <button
                      onClick={onToggleFullWidth}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        isFullWidth
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        {isFullWidth ? <Layout className="w-4 h-4 text-emerald-400" /> : <Monitor className="w-4 h-4 text-slate-400" />}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {isFullWidth ? 'FLUID 100%' : 'STANDARD'}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Full Page Width</div>
                        <div className="text-[11px] text-slate-400">Edge-to-edge layout</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section 3: Quick Testing & Fraud Sandbox */}
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Testing &amp; Scam Simulation</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        onSelectTab('verify');
                        if (onQuickVerifyRamanan) onQuickVerifyRamanan();
                        setIsMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60 text-emerald-300 font-semibold text-left transition flex items-center justify-between"
                    >
                      <span>✓ Verify RAMANAN (Genesis)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onSelectTab('verify');
                        setIsMenuOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-700/50 hover:bg-rose-900/50 text-rose-300 font-semibold text-left transition flex items-center justify-between"
                    >
                      <span>🚨 Test Counterfeit &amp; Tamper Scams</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Section 4: Live Node Telemetry */}
                <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Autonomous Node Telemetry
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Ledger State</span>
                      <span className="text-emerald-400 font-bold">● Synchronized</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Consensus</span>
                      <span className="text-teal-300 font-bold">PoA Merkle Root</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Signatory</span>
                      <span className="text-slate-300 font-bold truncate block">Dr. N. MALA, Principal</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Blocks Mined</span>
                      <span className="text-amber-300 font-bold">#{blockHeight}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => {
                    if (confirm('Reset ledger to default state?')) {
                      onResetLedger();
                      setIsMenuOpen(false);
                    }
                  }}
                  className="hover:text-rose-300 flex items-center space-x-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Ledger</span>
                </button>
                <div className="text-[11px]">
                  Autonomous Institutional Portal &bull; 2026
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

