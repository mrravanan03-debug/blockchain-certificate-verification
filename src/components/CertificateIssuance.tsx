import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Send, 
  Sparkles, 
  Globe2, 
  Boxes, 
  CheckCircle, 
  ArrowRight, 
  Cpu, 
  FileCheck2, 
  RefreshCw,
  Lock,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { CertificateData } from '../types';
import { blockchainService } from '../services/blockchain';
import { sha256, createCanonicalCertPayload, generateIpfsCid } from '../utils/crypto';

interface CertificateIssuanceProps {
  onCertificateIssued: (cert: CertificateData) => void;
  onNavigateToCertificate: (cert: CertificateData) => void;
}

export const CertificateIssuance: React.FC<CertificateIssuanceProps> = ({
  onCertificateIssued,
  onNavigateToCertificate
}) => {
  const [formData, setFormData] = useState({
    id: blockchainService.generateUniqueCertificateId('CERT-GENESIS-2026'),
    studentName: 'RAMANAN',
    studentEmail: 'ramanan.p@kkcas.edu.in',
    studentId: 'GEN2026-CS-892',
    eventName: 'GENESIS 2026',
    degreeOrCourse: 'National Blockchain Innovation & Engineering Summit',
    achievementType: 'Excellence' as const,
    gradeOrScore: 'First Class with Distinction (Rank #1)',
    issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
    issuerName: 'Dr. N. MALA',
    issuerTitle: 'Principal',
    issueDate: new Date().toISOString().split('T')[0],
    metadataNotes: 'Conferred and attested by Kovai Kalaimagal College of Arts and Science under Autonomous Institution Framework.'
  });

  const [isMining, setIsMining] = useState(false);
  const [miningStep, setMiningStep] = useState<string>('');
  const [lastIssued, setLastIssued] = useState<CertificateData | null>(null);

  // Guarantee that initial ID is 100% fresh and not already registered in ledger
  useEffect(() => {
    if (!formData.id || blockchainService.isIdRegistered(formData.id)) {
      setFormData(prev => ({
        ...prev,
        id: blockchainService.generateUniqueCertificateId('CERT-GENESIS-2026')
      }));
    }
  }, []);

  // Handler to roll another fresh unrepeatable serial
  const handleRollNewSerial = () => {
    setFormData(prev => ({
      ...prev,
      id: blockchainService.generateUniqueCertificateId('CERT-GENESIS-2026')
    }));
  };

  // Quick Preset Loader with guaranteed unique unrepeatable serials
  const loadPreset = (type: 'ramanan' | 'genesis_hackathon' | 'degree') => {
    if (type === 'ramanan') {
      setFormData({
        id: blockchainService.generateUniqueCertificateId('CERT-GENESIS-2026'),
        studentName: 'RAMANAN',
        studentEmail: 'ramanan.p@kkcas.edu.in',
        studentId: 'GEN2026-CS-892',
        eventName: 'GENESIS 2026',
        degreeOrCourse: 'National Blockchain Innovation & Engineering Summit',
        achievementType: 'Excellence',
        gradeOrScore: 'First Class with Distinction (Rank #1)',
        issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
        issuerName: 'Dr. N. MALA',
        issuerTitle: 'Principal',
        issueDate: new Date().toISOString().split('T')[0],
        metadataNotes: 'Official credential registered on Kovai Kalaimagal College of Arts and Science Consortium Ledger.'
      });
    } else if (type === 'genesis_hackathon') {
      setFormData({
        id: blockchainService.generateUniqueCertificateId('CERT-HACK-2026'),
        studentName: 'SARAH CONNOR',
        studentEmail: 'sarah.c@kkcas.edu.in',
        studentId: 'HACK2026-WEB3-104',
        eventName: 'GENESIS WEB3 HACKATHON 2026',
        degreeOrCourse: 'Smart Contract Architecture & Zero-Knowledge Track',
        achievementType: 'Achievement',
        gradeOrScore: 'Winner - Grand Prize (Score: 98.5/100)',
        issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
        issuerName: 'Dr. N. MALA',
        issuerTitle: 'Principal',
        issueDate: new Date().toISOString().split('T')[0],
        metadataNotes: 'Awarded for exceptional contribution to decentralized identity.'
      });
    } else {
      setFormData({
        id: blockchainService.generateUniqueCertificateId('DEGREE-2026'),
        studentName: 'ARJUN K.',
        studentEmail: 'arjun.k@kkcas.edu.in',
        studentId: 'KKCAS-2022-CS-091',
        eventName: 'ANNUAL CONVOCATION 2026',
        degreeOrCourse: 'Bachelor of Science in Computer Science',
        achievementType: 'Honor',
        gradeOrScore: 'First Class with Distinction (Rank #1)',
        issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
        issuerName: 'Dr. N. MALA',
        issuerTitle: 'Principal',
        issueDate: new Date().toISOString().split('T')[0],
        metadataNotes: 'Conferred under Kovai Kalaimagal College of Arts and Science Academic Council.'
      });
    }
    setLastIssued(null);
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMining(true);
    setLastIssued(null);

    try {
      // Step 1: Data canonicalization
      setMiningStep('Generating canonical cryptographic payload...');
      await new Promise(r => setTimeout(r, 400));

      // Step 2: IPFS Hashing
      setMiningStep('Computing SHA-256 hash & IPFS CID multihash...');
      await new Promise(r => setTimeout(r, 450));

      // Step 3: Blockchain Mining
      setMiningStep('Mining transaction into block & calculating Merkle Root...');
      await new Promise(r => setTimeout(r, 600));

      const { certificate } = await blockchainService.issueCertificate(formData);

      setMiningStep('Finalizing consensus & minting verification QR code...');
      await new Promise(r => setTimeout(r, 350));

      setLastIssued(certificate);
      onCertificateIssued(certificate);

      // Generate a brand new, unique, non-repeatable ID for next issue
      setFormData(prev => ({
        ...prev,
        id: blockchainService.generateUniqueCertificateId('CERT-GENESIS-2026')
      }));
    } catch (err) {
      console.error('Failed to issue certificate:', err);
      alert('Error issuing certificate. Please check values.');
    } finally {
      setIsMining(false);
      setMiningStep('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Flow Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 mb-2">
            <span>STEP 1 OF 4</span>
            <span>&bull;</span>
            <span>ADMIN ISSUANCE PORTAL</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-teal-400" />
            <span>Enter Student Data & Issue Certificate</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input verified student credentials. The system automatically computes the cryptographic SHA-256 hash, generates an IPFS CID, and mines the record onto the blockchain ledger.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('ramanan')}
            className="px-2.5 py-1.5 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 border border-teal-700/60 text-teal-300 text-xs font-medium transition"
          >
            RAMANAN (Genesis 2026)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('genesis_hackathon')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Web3 Hackathon
          </button>
        </div>
      </div>

      {/* Main Form & Mining Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-2">
          <form onSubmit={handleIssueCertificate} className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-5 backdrop-blur">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Certificate ID / Serial</span>
                  </label>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>IMMUTABLE &bull; NEVER REPEATS</span>
                  </span>
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3 text-emerald-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    readOnly
                    value={formData.id}
                    title="Certificate ID is cryptographically assigned and locked to prevent admin tampering or duplicate issuance."
                    className="w-full bg-slate-950/90 border border-emerald-500/40 rounded-xl pl-9 pr-24 py-2 text-sm text-emerald-300 font-mono font-bold tracking-wide cursor-not-allowed select-all shadow-inner focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleRollNewSerial}
                    title="Generate next guaranteed unique serial"
                    className="absolute right-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3 text-teal-400" />
                    <span>Roll New ID</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-slate-400">
                  <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Admin edit blocked: Serial is uniquely minted to prevent duplicate/fake certificates.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Student Registration / Roll No.
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. GEN2026-CS-892"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Student Full Name (e.g. RAMANAN)
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. RAMANAN"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Student Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.studentEmail}
                  onChange={e => setFormData({ ...formData, studentEmail: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. student@genesis.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Event / Conferred Program
                </label>
                <input
                  type="text"
                  required
                  value={formData.eventName}
                  onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. GENESIS 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category / Achievement Type
                </label>
                <select
                  value={formData.achievementType}
                  onChange={e => setFormData({ ...formData, achievementType: e.target.value as any })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                >
                  <option value="Excellence">Certificate of Excellence</option>
                  <option value="Achievement">Certificate of Achievement</option>
                  <option value="Merit">Certificate of Merit</option>
                  <option value="Completion">Certificate of Completion</option>
                  <option value="Honor">Degree of Academic Honor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Specialization / Course Description
              </label>
              <input
                type="text"
                required
                value={formData.degreeOrCourse}
                onChange={e => setFormData({ ...formData, degreeOrCourse: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                placeholder="e.g. National Blockchain Innovation & Engineering Summit"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Grade / Honors Standing
                </label>
                <input
                  type="text"
                  value={formData.gradeOrScore}
                  onChange={e => setFormData({ ...formData, gradeOrScore: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. First Class with Distinction"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Official Issue Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.issueDate}
                  onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Issuing College / Institution
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuingInstitution}
                  onChange={e => setFormData({ ...formData, issuingInstitution: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Authorized Signatory (Principal)
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuerName}
                  onChange={e => setFormData({ ...formData, issuerName: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. Dr. N. MALA"
                />
              </div>
            </div>

            {/* Optional Custom Certificate Upload */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Have your own certificate design? (Optional)</span>
                </span>
                <span className="text-[10px] text-slate-400">PNG, JPG, or WEBP</span>
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const dataUrl = ev.target?.result as string;
                    setFormData(prev => ({
                      ...prev,
                      customCertificateImage: dataUrl
                    } as any));
                  };
                  reader.readAsDataURL(file);
                }}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-900/60 file:text-teal-300 hover:file:bg-teal-800 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                You can upload your certificate now, or in Step 2, and then position and stamp the QR code directly onto it.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isMining}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isMining ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Processing Cryptographic Issuance...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Issue Certificate & Mine On Blockchain</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Cryptographic Preview & Mining Pipeline Column */}
        <div className="space-y-6">
          {/* Mining in progress modal / card */}
          {isMining && (
            <div className="bg-slate-900 border border-teal-500/50 rounded-2xl p-5 shadow-xl animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5 animate-spin" />
                </div>
                <h4 className="text-sm font-bold text-teal-400">Consensus Mining Active</h4>
              </div>
              <p className="text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                {miningStep}
              </p>
            </div>
          )}

          {/* Success card if just issued */}
          {lastIssued && (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Certificate Successfully Mined!</h4>
                  <p className="text-xs text-emerald-300">Recorded on Block #{lastIssued.blockNumber}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-900/90 p-4 rounded-xl border border-emerald-900/60 font-mono">
                <div>
                  <span className="text-slate-400">Student: </span>
                  <span className="text-white font-bold">{lastIssued.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Event: </span>
                  <span className="text-teal-300">{lastIssued.eventName}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">SHA-256 Hash: </span>
                  <span className="text-emerald-400">{lastIssued.certificateHash.slice(0, 16)}...</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">IPFS CID: </span>
                  <span className="text-indigo-400">{lastIssued.ipfsCid}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">Tx Hash: </span>
                  <span className="text-slate-300">{lastIssued.transactionHash.slice(0, 16)}...</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onNavigateToCertificate(lastIssued)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Step 2: View Certificate & QR Code</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Cryptographic Architecture Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Boxes className="w-4 h-4 text-teal-400" />
              <span>Diagram Step 1 Flow Breakdown</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>1. Canonical Data Hashing</span>
                </div>
                <p className="mt-1 text-slate-400 text-[11px]">
                  Student credentials (RAMANAN, GENESIS 2026) are serialized in RFC 8785 JSON format and hashed via SHA-256 Web Crypto API.
                </p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Globe2 className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>2. IPFS CID Assignment</span>
                </div>
                <p className="mt-1 text-slate-400 text-[11px]">
                  Creates a deterministic Base58 Content Identifier (CIDv0) ensuring metadata cannot be surreptitiously replaced.
                </p>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Boxes className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>3. Blockchain Ledger Mining</span>
                </div>
                <p className="mt-1 text-slate-400 text-[11px]">
                  New block mines with previous block hash, timestamp, Merkle tree root, and cryptographic authority signature.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
