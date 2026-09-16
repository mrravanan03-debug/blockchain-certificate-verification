import React, { useState } from 'react';
import { 
  Boxes, 
  Link, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  AlertTriangle, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { Block, CertificateData } from '../types';
import { blockchainService } from '../services/blockchain';
import { truncateHash } from '../utils/crypto';

interface BlockchainExplorerProps {
  blocks: Block[];
  onRefresh: () => void;
  onSelectCertificate: (cert: CertificateData) => void;
}

export const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({
  blocks,
  onRefresh,
  onSelectCertificate
}) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(blocks[1] || blocks[0] || null);
  const [tamperInput, setTamperInput] = useState('FAKE STUDENT (MALICIOUS EDIT)');
  const [tamperSuccess, setTamperSuccess] = useState(false);

  const handleSimulateTamper = (blockIndex: number) => {
    blockchainService.simulateTamperBlock(blockIndex, tamperInput);
    setTamperSuccess(true);
    onRefresh();
    setTimeout(() => setTamperSuccess(false), 3000);
  };

  const handleRestoreChain = async () => {
    await blockchainService.resetLedger();
    onRefresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 mb-2">
            <span>KKCAS &bull; DECENTRALIZED LEDGER EXPLORER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Boxes className="w-6 h-6 text-teal-400" />
            <span>Immutable Blockchain Ledger</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual inspection of mined cryptographic blocks, SHA-256 hash chains, Merkle trees, and proof-of-authority consensus.
          </p>
        </div>

        <button
          onClick={handleRestoreChain}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4 text-teal-400" />
          <span>Restore Original Chain</span>
        </button>
      </div>

      {/* Visual Block Chain Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Active Chain Linkage (Genesis to Latest Block):</span>
          <span>{blocks.length} Blocks Mined</span>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-4 pt-2">
          {blocks.map((block, idx) => {
            const isSelected = selectedBlock?.index === block.index;
            return (
              <React.Fragment key={block.index}>
                <div
                  onClick={() => setSelectedBlock(block)}
                  className={`shrink-0 w-64 p-4 rounded-2xl border cursor-pointer transition shadow-lg ${
                    block.isTampered
                      ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                      : isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-500/20 text-white'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      Block #{block.index}
                    </span>
                    {block.isTampered ? (
                      <span className="text-[10px] font-bold text-rose-400 uppercase">Tampered</span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Valid</span>
                    )}
                  </div>

                  <div className="text-xs font-bold truncate">
                    {block.index === 0
                      ? 'Genesis Block'
                      : block.data[0]?.studentName
                      ? `${block.data[0].studentName} (${block.data[0].eventName})`
                      : 'Empty Payload'}
                  </div>

                  <div className="mt-2 text-[10px] font-mono text-slate-400 space-y-1">
                    <div className="truncate">
                      Hash: {truncateHash(block.hash, 6, 4)}
                    </div>
                    <div className="truncate text-slate-500">
                      Prev: {truncateHash(block.previousHash, 6, 4)}
                    </div>
                  </div>
                </div>

                {/* Link Arrow */}
                {idx < blocks.length - 1 && (
                  <div className="shrink-0 flex items-center text-teal-400">
                    <Link className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Block Deep Dive & Tamper Simulator */}
      {selectedBlock && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Block Data Inspector */}
          <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-5 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Block #{selectedBlock.index} Inspector</h3>
                  <p className="text-xs text-slate-400">Validator: {selectedBlock.validator}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedBlock.isTampered ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedBlock.isTampered ? 'Hash Mismatch / Broken' : 'Cryptographically Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Block Hash:</span>
                <span className="text-teal-400 break-all">{selectedBlock.hash}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Previous Block Hash:</span>
                <span className="text-slate-300 break-all">{selectedBlock.previousHash}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Merkle Tree Root:</span>
                <span className="text-indigo-400 break-all">{selectedBlock.merkleRoot}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Nonce / Timestamp:</span>
                <span className="text-slate-300">
                  Nonce: {selectedBlock.nonce} &bull; {new Date(selectedBlock.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Included Certificate Transactions */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Transactions Inside Block ({selectedBlock.data.length})
              </h4>

              {selectedBlock.data.length === 0 ? (
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                  Genesis anchor record. No external certificates in initial block.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedBlock.data.map(cert => (
                    <div 
                      key={cert.id} 
                      className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{cert.studentName}</span>
                          <span className="text-xs text-slate-400">&bull; {cert.eventName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          ID: {cert.id} &bull; IPFS CID: {truncateHash(cert.ipfsCid, 8, 4)}
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectCertificate(cert)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold transition flex items-center space-x-1 self-start sm:self-auto"
                      >
                        <span>Inspect Certificate</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tamper Simulation Lab */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 backdrop-blur">
            <div className="flex items-center space-x-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-sm font-bold uppercase tracking-wider">Tamper Attack Simulator</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Test how blockchain immutability defends against fraudulent certificate alterations. Modifying any field without consensus consensus breaks the SHA-256 hash chaining!
            </p>

            {selectedBlock.index === 0 ? (
              <div className="p-3 bg-slate-800/40 rounded-xl text-xs text-slate-400">
                Select Block #1 (RAMANAN) or above to simulate an attack.
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Inject Malicious Student Name:
                  </label>
                  <input
                    type="text"
                    value={tamperInput}
                    onChange={e => setTamperInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  onClick={() => handleSimulateTamper(selectedBlock.index)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Execute Tamper Attack</span>
                </button>

                {tamperSuccess && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/60 text-xs text-rose-300">
                    Tamper injected! Block #{selectedBlock.index} is now invalid. Notice how verification in Step 4 immediately turns RED!
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-slate-800 pt-4">
              <button
                onClick={handleRestoreChain}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center justify-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                <span>Reset & Resync Ledger</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
