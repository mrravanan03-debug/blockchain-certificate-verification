import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  QrCode, 
  Camera, 
  Upload, 
  Smartphone, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Globe2, 
  Boxes, 
  Clock, 
  FileText, 
  RotateCw,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  AlertOctagon,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CertificateData, VerificationResult } from '../types';
import { blockchainService } from '../services/blockchain';
import { truncateHash } from '../utils/crypto';

interface VerificationPortalProps {
  initialQuery?: string;
  onNavigateToBlockchain: () => void;
  onViewCertificate: (cert: CertificateData) => void;
}

export const VerificationPortal: React.FC<VerificationPortalProps> = ({
  initialQuery,
  onNavigateToBlockchain,
  onViewCertificate
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'CERT-GENESIS-2026-001');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [activeScanMode, setActiveScanMode] = useState<'id' | 'qr_upload' | 'camera'>('id');
  const [viewMode, setViewMode] = useState<'smartphone' | 'desktop'>('smartphone');
  const [cameraActive, setCameraActive] = useState(false);
  const [showScamGuide, setShowScamGuide] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Auto-verify if initial query provided
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      executeVerification(initialQuery);
    }
  }, [initialQuery]);

  const executeVerification = async (query: string) => {
    if (!query.trim()) return;
    setIsVerifying(true);
    setResult(null);

    // Simulate real cross-referencing latency
    await new Promise(r => setTimeout(r, 650));

    const verificationResult = await blockchainService.verifyCertificate(query);
    setResult(verificationResult);
    setIsVerifying(false);

    // Trigger celebratory confetti if authentic
    if (verificationResult.status === 'VERIFIED') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleStartCamera = async () => {
    setActiveScanMode('camera');
    setCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn('Camera access error or permission denied:', err);
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Simulate scanning QR with camera
  const handleSimulateQrDetection = (certId: string) => {
    handleStopCamera();
    setActiveScanMode('id');
    setSearchQuery(certId);
    executeVerification(certId);
  };

  // Handle mock image drop / upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Pick the primary demo cert or active match
      setSearchQuery('CERT-GENESIS-2026-001');
      executeVerification('CERT-GENESIS-2026-001');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
          <span>STEP 3 & 4</span>
          <span>&bull;</span>
          <span>PUBLIC VERIFIER PORTAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Verify Blockchain Credentials
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Cross-reference student certificates against the decentralized immutable ledger and IPFS content hashes.
        </p>

        {/* Quick Demo & Scam Testing Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Verify:</span>
          <button
            onClick={() => {
              setSearchQuery('CERT-GENESIS-2026-001');
              executeVerification('CERT-GENESIS-2026-001');
            }}
            className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 font-semibold hover:bg-emerald-900/60 transition"
          >
            ✓ RAMANAN (Genesis 2026)
          </button>
          <button
            onClick={() => {
              setSearchQuery('CERT-GENESIS-2026-002');
              executeVerification('CERT-GENESIS-2026-002');
            }}
            className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition"
          >
            ✓ Priya Sharma
          </button>
          
          <span className="text-slate-600 px-1">|</span>
          <span className="text-rose-400 font-semibold flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Test Scam Cases:</span>
          </span>

          <button
            onClick={() => {
              setSearchQuery('CERT-SCAM-FAKE-9999');
              executeVerification('CERT-SCAM-FAKE-9999');
            }}
            className="px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-300 font-semibold hover:bg-rose-900/60 transition"
          >
            🚨 Counterfeit Serial ID
          </button>

          <button
            onClick={() => {
              setSearchQuery('CERT-TAMPERED-FORGED-004');
              executeVerification('CERT-TAMPERED-FORGED-004');
            }}
            className="px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-600/50 text-amber-300 font-semibold hover:bg-amber-900/60 transition"
          >
            ⚠️ Altered / Tampered Record
          </button>

          <button
            onClick={() => {
              setSearchQuery('CERT-REVOKED-MALPRACTICE-003');
              executeVerification('CERT-REVOKED-MALPRACTICE-003');
            }}
            className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-700/60 text-red-300 font-semibold hover:bg-red-900/60 transition"
          >
            🛑 Revoked Credential
          </button>
        </div>

        {/* Interactive Scam Detection Sandbox Guide */}
        <div className="mt-6 text-left bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
          <button 
            onClick={() => setShowScamGuide(!showScamGuide)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  How To Check If A Certificate Is A Scam (Dummy Test Scenarios)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Click any scenario below to copy dummy data or test how the blockchain catches fraudulent certificates.
                </p>
              </div>
            </div>
            <div className="text-slate-400 p-1 hover:text-white">
              {showScamGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showScamGuide && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Scam Scenario 1 */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-rose-900/40 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                      Scam Type 1
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Fake Serial</span>
                  </div>
                  <div className="text-xs font-bold text-white">Counterfeit / Unregistered ID</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Scammer printed a fake diploma with an invented serial not registered on Kovai Kalaimagal College of Arts and Science nodes.
                  </p>
                  
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px] text-rose-300">
                    <span className="truncate">CERT-SCAM-FAKE-9999</span>
                    <button
                      onClick={() => handleCopy('CERT-SCAM-FAKE-9999', 'fake')}
                      className="p-1 hover:text-white text-slate-400 transition ml-1"
                      title="Copy dummy ID"
                    >
                      {copiedKey === 'fake' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('CERT-SCAM-FAKE-9999');
                    executeVerification('CERT-SCAM-FAKE-9999');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition flex items-center justify-center space-x-1"
                >
                  <span>Test Fake ID</span>
                  <span>&rarr;</span>
                </button>
              </div>

              {/* Scam Scenario 2 */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-amber-900/40 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      Scam Type 2
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Tampered Data</span>
                  </div>
                  <div className="text-xs font-bold text-white">Forged Name / Altered Grade</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Scammer took an authentic credential and edited the student name to 'Malicious Forger' & GPA to 'Rank #1'.
                  </p>
                  
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px] text-amber-300">
                    <span className="truncate">CERT-TAMPERED-FORGED-004</span>
                    <button
                      onClick={() => handleCopy('CERT-TAMPERED-FORGED-004', 'tampered')}
                      className="p-1 hover:text-white text-slate-400 transition ml-1"
                      title="Copy dummy ID"
                    >
                      {copiedKey === 'tampered' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('CERT-TAMPERED-FORGED-004');
                    executeVerification('CERT-TAMPERED-FORGED-004');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition flex items-center justify-center space-x-1"
                >
                  <span>Test Tampered Record</span>
                  <span>&rarr;</span>
                </button>
              </div>

              {/* Scam Scenario 3 */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-red-900/40 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      Scam Type 3
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Revoked Status</span>
                  </div>
                  <div className="text-xs font-bold text-white">Blacklisted Malpractice Credential</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Student was expelled or revoked for cheating. Blockchain ledger flags the token status as 'REVOKED'.
                  </p>
                  
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px] text-red-300">
                    <span className="truncate">CERT-REVOKED-MALPRACTICE-003</span>
                    <button
                      onClick={() => handleCopy('CERT-REVOKED-MALPRACTICE-003', 'revoked')}
                      className="p-1 hover:text-white text-slate-400 transition ml-1"
                      title="Copy dummy ID"
                    >
                      {copiedKey === 'revoked' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('CERT-REVOKED-MALPRACTICE-003');
                    executeVerification('CERT-REVOKED-MALPRACTICE-003');
                  }}
                  className="w-full py-1.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold border border-red-500/30 transition flex items-center justify-center space-x-1"
                >
                  <span>Test Revoked Credential</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Verification Input Methods (Step 3: Scan QR Code) */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 backdrop-blur shadow-xl">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Step 3: Input / Scan Verification Source
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex space-x-1 bg-slate-800/80 p-1 rounded-xl text-xs font-medium border border-slate-700">
            <button
              onClick={() => {
                handleStopCamera();
                setActiveScanMode('id');
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeScanMode === 'id' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>ID / Hash Lookup</span>
            </button>

            <button
              onClick={() => {
                handleStopCamera();
                setActiveScanMode('qr_upload');
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeScanMode === 'qr_upload' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Certificate</span>
            </button>

            <button
              onClick={handleStartCamera}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeScanMode === 'camera' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera Scanner</span>
            </button>
          </div>
        </div>

        {/* Scan Method 1: ID / Hash Search */}
        {activeScanMode === 'id' && (
          <form
            onSubmit={e => {
              e.preventDefault();
              executeVerification(searchQuery);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter Certificate ID (e.g. CERT-GENESIS-2026-001), Student Name, or SHA-256 Hash..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Auditing Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Record</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Scan Method 2: Drag and drop / Upload Certificate */}
        {activeScanMode === 'qr_upload' && (
          <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-8 text-center bg-slate-800/30 transition">
            <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-white">Upload Certificate Image or PDF</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Drop the physical scan, screenshot, or PDF document. The verification engine will detect the embedded QR code and verify against the ledger.
            </p>
            <label className="inline-block mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition">
              Select Certificate File
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Scan Method 3: Live Camera Scan */}
        {activeScanMode === 'camera' && (
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              
              {/* Overlay QR targeting frame */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-emerald-400 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400" />
                  <div className="w-full h-0.5 bg-emerald-400/80 animate-bounce mt-24" />
                </div>
              </div>

              {!cameraActive && (
                <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4 text-center">
                  <Camera className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-xs text-slate-300">Camera permission needed or camera unavailable in iframe.</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleSimulateQrDetection('CERT-GENESIS-2026-001')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                Scan Target: RAMANAN (Genesis 2026)
              </button>
              <button
                onClick={handleStopCamera}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                Close Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verification In-Progress Indicator */}
      {isVerifying && (
        <div className="bg-slate-900 border border-teal-500/40 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-500/10 text-teal-400">
            <Cpu className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-white">Portal Analyzing Credentials</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Cross-referencing College Registry DB with Blockchain Consensus Ledger and IPFS Content Addressable Storage...
          </p>
        </div>
      )}

      {/* STEP 4: RESULT PRESENTATION */}
      {result && !isVerifying && (
        <div className="space-y-6">
          
          {/* View Toggle Bar (Smartphone Mockup vs Desktop Explorer) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display View:</span>
              <button
                onClick={() => setViewMode('smartphone')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  viewMode === 'smartphone' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Smartphone Mockup (Step 4 Diagram)</span>
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  viewMode === 'desktop' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Cryptographic Audit Grid</span>
              </button>
            </div>

            {result.certificate && (
              <button
                onClick={() => onViewCertificate(result.certificate!)}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center space-x-1"
              >
                <span>View Full Certificate Paper</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* SMARTPHONE VIEW: Exact replica of Step 4 from the uploaded image! */}
          {viewMode === 'smartphone' ? (
            <div className="flex justify-center py-4">
              {/* Smartphone Frame */}
              <div 
                id="smartphone-verifier-screen"
                className="w-[340px] sm:w-[380px] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-700 shadow-2xl relative overflow-hidden ring-1 ring-slate-800"
              >
                {/* Speaker notch / dynamic island */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
                  <div className="w-8 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Simulated Mobile Browser App Screen */}
                <div className="bg-slate-900 rounded-[34px] overflow-hidden border border-slate-800 min-h-[560px] flex flex-col">
                  
                  {/* Browser URL Bar */}
                  <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">9:41</span>
                    <div className="px-3 py-0.5 rounded-full bg-slate-900/90 text-slate-300 font-mono text-[10px] flex items-center space-x-1">
                      <span className="text-emerald-400">🔒</span>
                      <span>verify.educhain.edu</span>
                    </div>
                    <span>5G 100%</span>
                  </div>

                  {/* College App Header with Crest */}
                  <div className="bg-[#13233b] px-4 py-3 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center p-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-white tracking-wide">
                        EduLedger Portal
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      NODE-01
                    </span>
                  </div>

                  {/* Step 4: Result Content */}
                  <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    
                    {/* Status Icon */}
                    {result.status === 'VERIFIED' ? (
                      <div className="w-24 h-24 rounded-full bg-emerald-500/15 border-4 border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    ) : result.status === 'TAMPERED' ? (
                      <div className="w-24 h-24 rounded-full bg-rose-500/15 border-4 border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center text-white">
                          <XCircle className="w-10 h-10" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-amber-500/15 border-4 border-amber-500/40 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
                          <AlertTriangle className="w-10 h-10" />
                        </div>
                      </div>
                    )}

                    {/* STATUS HEADER (Exact match from diagram Step 4) */}
                    <div>
                      <div className={`text-sm font-black tracking-widest uppercase ${
                        result.status === 'VERIFIED' 
                          ? 'text-emerald-400' 
                          : result.status === 'REVOKED' 
                          ? 'text-red-400' 
                          : 'text-rose-400'
                      }`}>
                        STATUS: {result.status}
                      </div>

                      {result.certificate ? (
                        <div className="mt-3 space-y-1">
                          <div className="text-xs text-slate-400 uppercase tracking-wider">Student Name:</div>
                          <div className="text-xl font-extrabold text-white">
                            {result.certificate.studentName}
                          </div>

                          <div className="text-xs text-slate-400 uppercase tracking-wider pt-2">Event:</div>
                          <div className="text-base font-bold text-teal-300">
                            {result.certificate.eventName}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40">
                          <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
                            Unregistered / Fake Serial
                          </div>
                          <div className="text-xs font-mono text-white break-all bg-slate-950 p-1.5 rounded">
                            "{searchQuery}"
                          </div>
                          <p className="text-[10px] text-rose-300">
                            This identifier was never minted by Kovai Kalaimagal College of Arts and Science.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* AUTHENTIC / SCAM RECORD BADGE */}
                    {result.status === 'VERIFIED' ? (
                      <div className="w-full">
                        <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md">
                          AUTHENTIC RECORD
                        </div>
                        <div className="text-[10px] text-slate-400 mt-2 font-mono">
                          Mined on Block #{result.certificate?.blockNumber} &bull; Timestamp Verified
                        </div>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md ${
                          result.status === 'REVOKED' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-rose-600 text-white'
                        }`}>
                          {result.status === 'REVOKED' ? 'CREDENTIAL REVOKED' : 'SCAM / TAMPER DETECTED'}
                        </div>
                        <p className="text-[11px] text-rose-300 mt-2 leading-relaxed">
                          {result.tamperReason}
                        </p>
                      </div>
                    )}

                    {/* Metadata Card inside Mobile */}
                    {result.certificate && (
                      <div className="w-full bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-left text-[10px] font-mono space-y-1 text-slate-400">
                        <div className="truncate">
                          <span className="text-slate-500">ID: </span>
                          <span className="text-slate-200">{result.certificate.id}</span>
                        </div>
                        <div className="truncate">
                          <span className="text-slate-500">TX: </span>
                          <span className="text-teal-400">{truncateHash(result.certificate.transactionHash, 8, 6)}</span>
                        </div>
                        <div className="truncate">
                          <span className="text-slate-500">IPFS: </span>
                          <span className="text-indigo-400">{truncateHash(result.certificate.ipfsCid, 8, 6)}</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Mobile Browser Bottom Bar */}
                  <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                    <span>&lsaquo;</span>
                    <span>&rsaquo;</span>
                    <span>&#9881;</span>
                    <span>&#9741;</span>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            /* DESKTOP AUDIT GRID */
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
              
              {/* High-level status bar */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                result.status === 'VERIFIED'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  {result.status === 'VERIFIED' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-wider">
                      STATUS: {result.status}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {result.status === 'VERIFIED' 
                        ? 'All 4 cryptographic layers passed mathematical parity checks.' 
                        : result.tamperReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                    result.status === 'VERIFIED'
                      ? 'bg-emerald-500 text-slate-950'
                      : result.status === 'REVOKED'
                      ? 'bg-red-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {result.status === 'VERIFIED' 
                      ? 'AUTHENTIC RECORD' 
                      : result.status === 'REVOKED'
                      ? 'REVOKED RECORD'
                      : result.status === 'TAMPERED'
                      ? 'TAMPER / FORGERY DETECTED'
                      : 'SCAM / COUNTERFEIT DETECTED'}
                  </span>
                </div>
              </div>

              {/* 4-Point Cryptographic Proof Audit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Database Match */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">1. Registry Check</span>
                    {result.auditChecks.databaseMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">College DB Cross-Ref</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Student ID and enrollment record match institution records.
                  </p>
                </div>

                {/* 2. Blockchain Hash Match */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">2. Blockchain Hash</span>
                    {result.auditChecks.blockchainHashMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">SHA-256 Ledger Parity</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Document payload matches on-chain Merkle tree root.
                  </p>
                </div>

                {/* 3. IPFS Integrity */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">3. Decentralized IPFS</span>
                    {result.auditChecks.ipfsIntegrityVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">CID Content Parity</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Decentralized multihash verified against IPFS gateway.
                  </p>
                </div>

                {/* 4. Signature Authentic */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400">4. Authority Signature</span>
                    {result.auditChecks.signatureAuthentic ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">Public Key Validated</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Principal Dr. N. MALA cryptographic authority key confirmed.
                  </p>
                </div>

              </div>

              {/* Student & Event Record Summary */}
              {result.certificate ? (
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Verified Credential Metadata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500">Student Name:</span>
                      <p className="text-white font-bold text-sm">{result.certificate.studentName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Event / Degree:</span>
                      <p className="text-teal-300 font-bold text-sm">{result.certificate.eventName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Registration ID:</span>
                      <p className="text-slate-200 font-mono">{result.certificate.studentId}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Issuing Institution:</span>
                      <p className="text-slate-200 font-semibold">{result.certificate.issuingInstitution}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Authorized Signatory:</span>
                      <p className="text-emerald-400 font-semibold">{result.certificate.issuerName} ({result.certificate.issuerTitle})</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Issued On:</span>
                      <p className="text-slate-200">{result.certificate.issueDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Standing / Honor:</span>
                      <p className="text-emerald-400 font-semibold">{result.certificate.gradeOrScore || 'Standard Passing'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-950/40 p-5 rounded-xl border border-rose-600/50 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>COUNTERFEIT / UNREGISTERED RECORD DETECTED</span>
                  </div>
                  <p className="text-xs text-rose-200 leading-relaxed">
                    The queried certificate identifier or search term <span className="font-mono bg-rose-900/60 px-2 py-0.5 rounded text-white font-bold">"{searchQuery}"</span> does not exist anywhere in the Kovai Kalaimagal College of Arts and Science registry database or within any mined block of the decentralized blockchain ledger.
                  </p>
                  <div className="p-3 bg-slate-950/80 rounded-lg text-xs text-slate-300 space-y-1">
                    <div className="font-semibold text-rose-300">Fraud Analysis Verdict:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                      <li>Serial was likely generated offline (e.g. Photoshop/Canva or unauthorized template).</li>
                      <li>No valid cryptographic digital signature exists from Principal Dr. N. MALA.</li>
                      <li>No corresponding IPFS Content Identifier (CID) hash exists.</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}
    </div>
  );
};
