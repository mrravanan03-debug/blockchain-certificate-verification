import React from 'react';
import { 
  UserCheck, 
  FileText, 
  Globe2, 
  Boxes, 
  QrCode, 
  Smartphone, 
  Database, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { TabMode } from '../types';

interface FlowOverviewProps {
  onNavigate: (tab: TabMode) => void;
  onQuickVerifyRamanan: () => void;
}

export const FlowOverview: React.FC<FlowOverviewProps> = ({
  onNavigate,
  onQuickVerifyRamanan
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
          Blockchain Certificate Verification System
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Official tamper-proof student credential ecosystem attested by Principal Dr. N. MALA. Features collision-proof serial issuance, decentralized IPFS pinning, and instant public QR validation.
        </p>

        {/* Quick Demo CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('issuance')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-600/20 flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Step 1: Enter Student Data</span>
          </button>

          <button
            onClick={onQuickVerifyRamanan}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-medium text-sm transition flex items-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Step 4: Test Ramanan Genesis 2026</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Interactive Process Pipeline Diagram */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 lg:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header split indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-800 text-center">
          <div className="bg-slate-800/40 py-2 rounded-xl border border-slate-700/50">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>ISSUANCE PHASE (College Admin)</span>
            </span>
          </div>
          <div className="bg-slate-800/40 py-2 rounded-xl border border-slate-700/50">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>VERIFICATION PHASE (HR / Employer / Public)</span>
            </span>
          </div>
        </div>

        {/* Pipeline Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          
          {/* STEP 1 */}
          <div 
            onClick={() => onNavigate('issuance')}
            className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/60 rounded-2xl p-5 cursor-pointer transition shadow-lg hover:shadow-teal-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                STEP 1
              </span>
              <UserCheck className="w-5 h-5 text-teal-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">ENTER STUDENT DATA</h3>
            <p className="text-xs text-slate-400 mb-4">
              e.g., <strong className="text-slate-200">RAMANAN</strong>, Event: <strong className="text-slate-200">GENESIS 2026</strong>. Protected by unrepeatable, immutable Serial IDs that admin cannot tamper or duplicate.
            </p>

            {/* Sub modules */}
            <div className="space-y-2 text-xs border-t border-slate-700/60 pt-3">
              <div className="flex items-center space-x-2 text-slate-300">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Immutable Zero-Collision Serial</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>IPFS CID Cryptographic Hash</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                <span>Blockchain Ledger Mining</span>
              </div>
            </div>

            <div className="mt-4 flex items-center text-xs text-teal-400 font-medium group-hover:translate-x-1 transition">
              <span>Open Issuance Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* STEP 2 */}
          <div 
            onClick={() => onNavigate('certificate')}
            className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 rounded-2xl p-5 cursor-pointer transition shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                STEP 2
              </span>
              <QrCode className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">ADD QR CODE &amp; PRINT</h3>
            <p className="text-xs text-slate-400 mb-4">
              Upload your own custom certificate or use the institutional template. Position &amp; stamp dynamic verification QR anywhere with live controls.
            </p>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/50 flex items-center justify-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center">
                <QrCode className="w-8 h-8 text-slate-900" />
              </div>
              <div className="text-[11px] text-slate-300">
                <div className="font-semibold text-emerald-400">Custom QR Stamping</div>
                <div className="text-slate-500 font-mono">Upload &bull; Drag &bull; Print</div>
              </div>
            </div>

            <div className="mt-auto flex items-center text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition">
              <span>Open QR Stamping Studio</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* STEP 3 */}
          <div 
            onClick={() => onNavigate('verify')}
            className="group relative bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/60 rounded-2xl p-5 cursor-pointer transition shadow-lg hover:shadow-blue-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                STEP 3
              </span>
              <Search className="w-5 h-5 text-blue-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">SCAN QR CODE</h3>
            <p className="text-xs text-slate-400 mb-4">
              HR recruiter or public verifier scans physical/digital QR code using mobile camera or uploads certificate file.
            </p>

            {/* Analysis Box */}
            <div className="space-y-1.5 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
              <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wide">PORTAL ANALYZES:</div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>Cross-reference College DB</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                <span>Validate Blockchain Ledger</span>
              </div>
            </div>

            <div className="mt-4 flex items-center text-xs text-blue-400 font-medium group-hover:translate-x-1 transition">
              <span>Open Scanner / Verifier</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* STEP 4 */}
          <div 
            onClick={onQuickVerifyRamanan}
            className="group relative bg-emerald-950/30 hover:bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 rounded-2xl p-5 cursor-pointer transition shadow-lg hover:shadow-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STEP 4
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">RESULT VERIFIED</h3>
            <p className="text-xs text-slate-400 mb-3">
              Instant mobile smartphone or desktop verification badge displaying confirmed student data.
            </p>

            {/* Step 4 Screen Mockup Mini */}
            <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30 text-center space-y-1">
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 mb-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">STATUS: VERIFIED</div>
              <div className="text-xs font-bold text-white">RAMANAN</div>
              <div className="text-[10px] text-slate-400">Event: GENESIS 2026</div>
              <div className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-extrabold text-[9px] uppercase tracking-wider">
                AUTHENTIC RECORD
              </div>
            </div>

            <div className="mt-4 flex items-center text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition">
              <span>View Full Result</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/40">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Boxes className="w-4 h-4 text-teal-400" />
              <span>Immutable Ledger</span>
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Cryptographic SHA-256 hash chains ensure any altered grade, name, or date permanently breaks block validity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/40">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <span>IPFS Content Addressing</span>
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Certificates receive deterministic Content Identifiers (CIDs) guaranteeing document authenticity without centralized servers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/40">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Instant Public Auditing</span>
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Zero login required for employers: scan the printed certificate or upload a digital snapshot to verify authenticity in under 500ms.
            </p>
          </div>
        </div>

        {/* Tech Suite Interactive Banner */}
        <div 
          onClick={() => onNavigate('techsuite')}
          className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-teal-950/50 via-slate-900 to-indigo-950/50 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:border-teal-500/60 transition group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">Advanced Cryptographic Tech Suite Active</h4>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
                  NEW
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero-Knowledge Proofs (zk-SNARKs selective disclosure) &bull; Solidity Smart Contract ABI &bull; EIP-712 Principal Dr. N. MALA Signatures &bull; Batch Merkle Trees
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-teal-300 group-hover:translate-x-1 transition whitespace-nowrap">
            <span>Explore Cryptographic Suite</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
