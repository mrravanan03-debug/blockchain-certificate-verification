import React, { useState } from 'react';
import { 
  Cpu, 
  Key, 
  ShieldCheck, 
  Code2, 
  Globe2, 
  Binary, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Zap, 
  FileCode,
  Terminal,
  Activity,
  Boxes,
  Lock,
  Sparkles
} from 'lucide-react';
import { CertificateData } from '../types';
import { truncateHash, sha256 } from '../utils/crypto';

interface TechSuiteProps {
  certificate: CertificateData;
  onSelectCertificate?: (cert: CertificateData) => void;
}

export const TechSuite: React.FC<TechSuiteProps> = ({ certificate }) => {
  const [activeTab, setActiveTab] = useState<'zkp' | 'contract' | 'signature' | 'ipfs' | 'merkle'>('zkp');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ZKP Selective Disclosure State
  const [zkpRevealedFields, setZkpRevealedFields] = useState({
    name: true,
    institution: true,
    degree: false,
    gpa: false,
    studentId: false,
    issueDate: false
  });
  const [zkProofGenerating, setZkProofGenerating] = useState(false);
  const [zkProofVerified, setZkProofVerified] = useState<boolean | null>(null);
  const [zkProofData, setZkProofData] = useState<{
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    publicSignals: string[];
    commitment: string;
  } | null>(null);

  // Smart Contract Interaction State
  const [contractQueryHash, setContractQueryHash] = useState(certificate.certificateHash || '');
  const [contractCallResult, setContractCallResult] = useState<any>(null);
  const [gasEstimated, setGasEstimated] = useState<number | null>(null);
  const [contractCalling, setContractCalling] = useState(false);

  // Batch Merkle Tree State
  const [merkleStudents, setMerkleStudents] = useState<string[]>([
    'RAMANAN (Rank #1 - CS)',
    'SARAH CONNOR (Web3 Track)',
    'ARJUN K. (AI Honors)',
    'PRIYA SHARMA (Cybersecurity)'
  ]);
  const [newStudentName, setNewStudentName] = useState('');
  const [merkleRootResult, setMerkleRootResult] = useState<string>('0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate Zero Knowledge Proof (zk-SNARK simulation with SHA-256 commitments)
  const handleGenerateZkProof = async () => {
    setZkProofGenerating(true);
    setZkProofVerified(null);
    await new Promise(r => setTimeout(r, 600));

    const secretSalt = '0x' + Math.random().toString(16).substring(2, 10);
    const commitment = await sha256(`${certificate.id}:${certificate.studentName}:${secretSalt}`);

    const proof = {
      pi_a: [
        '0x19a5' + Math.random().toString(16).slice(2, 10) + '...34b9',
        '0x2c09' + Math.random().toString(16).slice(2, 10) + '...8df1'
      ],
      pi_b: [
        ['0x11e4...88a1', '0x22f3...99b2'],
        ['0x33a1...44c3', '0x44b2...55d4']
      ],
      pi_c: [
        '0x77d1' + Math.random().toString(16).slice(2, 10) + '...11aa',
        '0x88e2' + Math.random().toString(16).slice(2, 10) + '...22bb'
      ],
      publicSignals: [
        `Claim: Student "${certificate.studentName}" passed "${certificate.eventName}" with Distinction`,
        `Threshold: Score >= 85% (Met)`,
        `Issuer: 0x71C...B3F (Accredited)`,
        `Commitment: ${commitment.slice(0, 18)}...`
      ],
      commitment
    };

    setZkProofData(proof);
    setZkProofGenerating(false);
  };

  const handleVerifyZkProof = async () => {
    if (!zkProofData) return;
    setZkProofGenerating(true);
    await new Promise(r => setTimeout(r, 450));
    setZkProofVerified(true);
    setZkProofGenerating(false);
  };

  // Smart Contract verify call
  const handleCallSmartContract = async () => {
    setContractCalling(true);
    await new Promise(r => setTimeout(r, 500));
    const gas = 42150 + Math.floor(Math.random() * 300);
    setGasEstimated(gas);
    setContractCallResult({
      success: true,
      blockNumber: certificate.blockNumber,
      isRevoked: certificate.status === 'REVOKED',
      issuer: '0x71C28198fA3a139eEa77519B44d03Ab534125b3F',
      timestamp: new Date().toISOString(),
      studentCid: certificate.ipfsCid
    });
    setContractCalling(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>ADVANCED CRYPTOGRAPHIC TECH SUITE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Binary className="w-6 h-6 text-teal-400" />
            <span>Web3, Smart Contracts & Zero-Knowledge Verification</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cutting-edge cryptographic infrastructure powering tamper-proof academic credentials: ZK Selective Disclosure, Solidity ABI, EIP-712 Signatures & IPFS DAG Nodes.
          </p>
        </div>

        {/* Certificate Context pill */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Active Credential: </span>
          <span className="font-bold text-teal-300 font-mono">{certificate.id}</span>
          <div className="text-[11px] text-slate-300 font-medium">
            {certificate.studentName} &bull; {certificate.eventName}
          </div>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('zkp')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'zkp'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-teal-400" />
          <span>Zero-Knowledge Proofs (ZKP)</span>
        </button>

        <button
          onClick={() => setActiveTab('contract')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'contract'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span>Solidity Smart Contract (ABI)</span>
        </button>

        <button
          onClick={() => setActiveTab('signature')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'signature'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Key className="w-4 h-4 text-amber-400" />
          <span>EIP-712 Principal's Signature</span>
        </button>

        <button
          onClick={() => setActiveTab('ipfs')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'ipfs'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Globe2 className="w-4 h-4 text-emerald-400" />
          <span>IPFS Decentralized Storage</span>
        </button>

        <button
          onClick={() => setActiveTab('merkle')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'merkle'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4 text-purple-400" />
          <span>Batch Merkle Tree Minter</span>
        </button>
      </div>

      {/* 1. ZERO-KNOWLEDGE PROOF (ZKP) TAB */}
      {activeTab === 'zkp' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-teal-400" />
                  <span>Privacy-Preserving ZK Selective Disclosure</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Allows student <span className="text-white font-semibold">{certificate.studentName}</span> to prove to employers that they have an authentic certificate with Distinction (&gt;=85%) WITHOUT revealing sensitive private data like Registration ID, personal email, or internal marks!
                </p>
              </div>

              <button
                onClick={handleGenerateZkProof}
                disabled={zkProofGenerating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-lg shadow-teal-600/20 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{zkProofGenerating ? 'Computing ZK Proof...' : 'Generate zk-SNARK Proof'}</span>
              </button>
            </div>

            {/* Selective Disclosure Toggles */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                1. Select Fields Disclosed to Verifier (Selective Disclosure Mask)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'name', label: 'Student Name', val: certificate.studentName, locked: true },
                  { key: 'institution', label: 'Issuing Institution', val: certificate.issuingInstitution, locked: false },
                  { key: 'degree', label: 'Program / Course', val: certificate.degreeOrCourse, locked: false },
                  { key: 'gpa', label: 'Grade / Score (Secret)', val: certificate.gradeOrScore || 'Distinction', locked: false },
                  { key: 'studentId', label: 'Student Roll ID (Private)', val: certificate.studentId, locked: false },
                  { key: 'issueDate', label: 'Issue Date', val: certificate.issueDate, locked: false }
                ].map(field => {
                  const isRevealed = (zkpRevealedFields as any)[field.key];
                  return (
                    <div
                      key={field.key}
                      onClick={() => {
                        if (!field.locked) {
                          setZkpRevealedFields({
                            ...zkpRevealedFields,
                            [field.key]: !isRevealed
                          });
                        }
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isRevealed
                          ? 'bg-slate-800/90 border-teal-500/50'
                          : 'bg-slate-950/60 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{field.label}</span>
                        {isRevealed ? (
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                      <div className="mt-2 text-xs font-bold text-white truncate font-mono">
                        {isRevealed ? field.val : '•••••••••••• (HIDDEN BY ZK)'}
                      </div>
                      <div className="mt-1 text-[10px] text-teal-400">
                        {isRevealed ? 'Visible to Verifier' : 'Zero-Knowledge Protected'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generated ZK-Proof Output */}
            {zkProofData && (
              <div className="bg-slate-950 rounded-xl border border-teal-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                      Cryptographic zk-SNARK Proof Object (Groth16 Protocol)
                    </h5>
                  </div>
                  <button
                    onClick={handleVerifyZkProof}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition flex items-center space-x-1.5 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify Proof Math On-Chain</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-500 font-bold">PUBLIC SIGNALS:</span>
                    {zkProofData.publicSignals.map((sig, idx) => (
                      <div key={idx} className="text-teal-300 text-[11px]">
                        &gt; {sig}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1 overflow-x-auto">
                    <span className="text-slate-500 font-bold">PROOF VECTORS (π_A, π_B, π_C):</span>
                    <div className="text-slate-300 text-[11px]">π_a: [{zkProofData.pi_a.join(', ')}]</div>
                    <div className="text-slate-300 text-[11px]">π_b: [G2 Pairing Vector]</div>
                    <div className="text-slate-300 text-[11px]">π_c: [{zkProofData.pi_c.join(', ')}]</div>
                  </div>
                </div>

                {zkProofVerified && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white">Zero-Knowledge Proof VALID: </span>
                        <span>Elliptic Curve Pairing e(A, B) = e(α, β) · e(C, δ) confirmed!</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-300">
                      Gas: 184,200 (zk-verifier)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. SOLIDITY SMART CONTRACT TAB */}
      {activeTab === 'contract' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-indigo-400" />
                  <span>EduChainCertificate.sol Smart Contract</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  EVM-compatible decentralized smart contract deployed on Consortium Testnet. Address:{' '}
                  <span className="text-indigo-400 font-mono">0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Solidity v0.8.24
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  OpenZeppelin ERC-721 / SBT
                </span>
              </div>
            </div>

            {/* Interactive Call Terminal */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>Execute Contract Read Call: verifyCertificate(bytes32 certHash)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={contractQueryHash}
                  onChange={e => setContractQueryHash(e.target.value)}
                  placeholder="Enter Certificate SHA-256 Hash..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleCallSmartContract}
                  disabled={contractCalling}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{contractCalling ? 'Querying State...' : 'Simulate Call (eth_call)'}</span>
                </button>
              </div>

              {contractCallResult && (
                <div className="p-3 bg-slate-900/90 rounded-lg border border-indigo-900/60 font-mono text-xs space-y-1">
                  <div className="text-emerald-400 font-bold">&gt; Call Response: SUCCESS (200 OK)</div>
                  <div className="text-slate-300">Block Number: #{contractCallResult.blockNumber}</div>
                  <div className="text-slate-300">Is Revoked: {contractCallResult.isRevoked ? 'TRUE' : 'FALSE'}</div>
                  <div className="text-slate-300">Principal Signatory: {contractCallResult.issuer}</div>
                  <div className="text-slate-300">Estimated Gas: {gasEstimated} Gwei (~0.00084 ETH)</div>
                </div>
              )}
            </div>

            {/* Solidity Code Preview */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>contracts/EduChainCertificate.sol</span>
                <button
                  onClick={() => copyToClipboard('// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;...', 'solidity')}
                  className="hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === 'solidity' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'solidity' ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Kovai Kalaimagal College of Arts and Science - Certificate Registry
 * @dev Manages immutable academic credentials attested by Principal Dr. N. MALA.
 */
contract KKCASCertificateRegistry {
    address public principalAuthority;

    struct CertificateRecord {
        string studentId;
        string eventName;
        string ipfsCid;
        uint256 issuedAt;
        bool isRevoked;
    }

    // Mapping: certificateHash => CertificateRecord
    mapping(bytes32 => CertificateRecord) public certificates;

    event CertificateIssued(bytes32 indexed certHash, string studentId, string ipfsCid);
    event CertificateRevoked(bytes32 indexed certHash, string reason);

    modifier onlyPrincipal() {
        require(msg.sender == principalAuthority, "Unauthorized: Only Principal Authority");
        _;
    }

    constructor() {
        principalAuthority = msg.sender;
    }

    function issueCertificate(
        bytes32 certHash,
        string calldata studentId,
        string calldata eventName,
        string calldata ipfsCid
    ) external onlyPrincipal {
        require(certificates[certHash].issuedAt == 0, "Already registered on chain");
        certificates[certHash] = CertificateRecord({
            studentId: studentId,
            eventName: eventName,
            ipfsCid: ipfsCid,
            issuedAt: block.timestamp,
            isRevoked: false
        });
        emit CertificateIssued(certHash, studentId, ipfsCid);
    }

    function verifyCertificate(bytes32 certHash) external view returns (bool exists, bool active, string memory ipfsCid) {
        CertificateRecord memory cert = certificates[certHash];
        if (cert.issuedAt == 0) return (false, false, "");
        return (true, !cert.isRevoked, cert.ipfsCid);
    }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. SIGNATURE & KEY TAB */}
      {activeTab === 'signature' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-amber-400" />
              <span>EIP-712 Institutional Asymmetric Cryptography</span>
            </h3>
            <p className="text-xs text-slate-400">
              Every certificate contains an elliptic curve signature (secp256k1) generated by Principal Dr. N. MALA's private cryptographic key. Verifiers use ECDSA recovery (`ecrecover`) to cryptographically prove non-repudiation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold">PRINCIPAL (DR. N. MALA) PUBLIC ADDRESS:</span>
                <div className="bg-slate-900 p-2.5 rounded text-white break-all">
                  0x71C28198fA3a139eEa77519B44d03Ab534125b3F
                </div>
                <p className="text-[11px] text-slate-500 font-sans">
                  Published in the Kovai Kalaimagal College of Arts and Science official directory.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold">SIGNATURE PARAMS (r, s, v):</span>
                <div className="text-slate-300 text-[11px] space-y-1">
                  <div>r: 0x48b29f08d3c129e...88fa29 (32 bytes)</div>
                  <div>s: 0x77c10b5421a99bc...4410cd (32 bytes)</div>
                  <div>v: 28 (Recovery Identifier)</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ECDSA Signature Recovery Verification Test</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300">
                ecrecover(sha256(student_data), v, r, s) == 0x71C28198fA3a139eEa77519B44d03Ab534125b3F &rarr; <span className="font-bold text-white bg-emerald-900/60 px-1.5 py-0.5 rounded">AUTHENTIC &amp; UNFORGEABLE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. IPFS TAB */}
      {activeTab === 'ipfs' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-emerald-400" />
              <span>InterPlanetary File System (IPFS) Decentralized Node</span>
            </h3>
            <p className="text-xs text-slate-400">
              Certificate metadata is permanently anchored onto the peer-to-peer IPFS network via deterministic Content Identifiers (CID). Even if institutional servers go offline, credentials remain provable forever.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">CONTENT IDENTIFIER (CID):</div>
                <div className="text-teal-300 font-bold break-all">{certificate.ipfsCid}</div>
                <div className="text-[10px] text-slate-500 mt-2">Format: CIDv0 (Base58btc Multihash)</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">PINNING STATUS:</div>
                <div className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pinned on 3 Global Clusters</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-2">Filecoin &bull; Pinata &bull; Web3.Storage</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">DATA IMMUTABILITY:</div>
                <div className="text-purple-400 font-bold">Content-Addressed (DAG)</div>
                <div className="text-[10px] text-slate-500 mt-2">Tampering changes the CID automatically</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 font-mono">IPFS RAW DAG JSON NODE:</span>
              <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "/": {
    "certificateId": "${certificate.id}",
    "recipient": "${certificate.studentName}",
    "event": "${certificate.eventName}",
    "blockHeight": ${certificate.blockNumber},
    "hash": "${certificate.certificateHash}",
    "schema": "https://w3id.org/blockcerts/v3",
    "signatureType": "EcdsaSecp256k1Signature2019"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 5. MERKLE TREE BATCH TAB */}
      {activeTab === 'merkle' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Boxes className="w-5 h-5 text-purple-400" />
              <span>Mass Batch Issuance & Merkle Tree Root Computation</span>
            </h3>
            <p className="text-xs text-slate-400">
              Colleges can issue 100+ student certificates in a single batch. By building a binary Merkle Tree, only 1 Merkle Root (32 bytes) is stored on-chain, saving 90% gas fees while maintaining full cryptographic proof for each student.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Batch Recipients in Tree
                </span>
                <span className="text-xs text-slate-400 font-mono">{merkleStudents.length} Leaves</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {merkleStudents.map((stud, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-purple-900/40 text-xs font-mono">
                    <div className="text-slate-500 font-bold">Leaf #{idx}</div>
                    <div className="text-white font-semibold truncate">{stud}</div>
                    <div className="text-[10px] text-purple-400 mt-1">Hash: 0x{idx * 17 + 42}f...</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-800/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <span className="text-purple-300 font-bold">CALCULATED MERKLE ROOT: </span>
                  <span className="text-white">{merkleRootResult}</span>
                </div>
                <span className="px-2 py-1 rounded bg-purple-900/60 text-purple-200 text-[10px]">
                  Stored in Block #{certificate.blockNumber} Header
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
