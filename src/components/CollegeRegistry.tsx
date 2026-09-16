import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck,
  FileText,
  UserCheck,
  QrCode
} from 'lucide-react';
import { CertificateData } from '../types';
import { blockchainService } from '../services/blockchain';
import { truncateHash } from '../utils/crypto';

interface CollegeRegistryProps {
  certificates: CertificateData[];
  onRefresh: () => void;
  onViewCertificate: (cert: CertificateData) => void;
  onVerifyCertificate: (cert: CertificateData) => void;
}

export const CollegeRegistry: React.FC<CollegeRegistryProps> = ({
  certificates,
  onRefresh,
  onViewCertificate,
  onVerifyCertificate
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = certificates.filter(cert => {
    const matchesSearch =
      cert.studentName.toLowerCase().includes(search.toLowerCase()) ||
      cert.eventName.toLowerCase().includes(search.toLowerCase()) ||
      cert.id.toLowerCase().includes(search.toLowerCase()) ||
      cert.studentId.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && cert.status === filterStatus;
  });

  const handleToggleRevoke = (certId: string) => {
    blockchainService.toggleRevocation(certId);
    onRefresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20 mb-2">
            <span>KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Database className="w-6 h-6 text-teal-400" />
            <span>Academic Registry Database</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official student credentials catalog certified by Principal Dr. N. MALA and cross-referenced by the public cryptographic verification portal.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Records: </span>
            <span className="font-bold text-white font-mono">{certificates.length}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
            <span className="text-emerald-400">Active: </span>
            <span className="font-bold text-emerald-300 font-mono">
              {certificates.filter(c => c.status === 'VERIFIED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Student Name (e.g. RAMANAN), ID, or Event..."
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500 transition"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-teal-500"
        >
          <option value="all">All Statuses</option>
          <option value="VERIFIED">Verified & Active</option>
          <option value="REVOKED">Revoked</option>
          <option value="TAMPERED">Tampered / Alert</option>
        </select>
      </div>

      {/* Records Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Student / Recipient</th>
                <th className="px-5 py-3.5">Event / Conferred Award</th>
                <th className="px-5 py-3.5">Certificate ID</th>
                <th className="px-5 py-3.5">Block / Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filtered.map(cert => (
                  <tr key={cert.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{cert.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{cert.studentId}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-teal-300">{cert.eventName}</div>
                      <div className="text-[11px] text-slate-400">{cert.degreeOrCourse}</div>
                    </td>

                    <td className="px-5 py-4 font-mono text-slate-400">
                      <div>{cert.id}</div>
                      <div className="text-[10px] text-indigo-400">IPFS: {truncateHash(cert.ipfsCid, 6, 4)}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-200">Block #{cert.blockNumber}</div>
                      <div className="text-[11px] text-slate-400">{cert.issueDate}</div>
                    </td>

                    <td className="px-5 py-4">
                      {cert.status === 'VERIFIED' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Active / Mined</span>
                        </span>
                      ) : cert.status === 'REVOKED' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                          <XCircle className="w-3 h-3 text-amber-400" />
                          <span>Revoked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Tampered</span>
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewCertificate(cert)}
                          title="View Official Certificate"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          <FileText className="w-4 h-4 text-teal-400" />
                        </button>

                        <button
                          onClick={() => onVerifyCertificate(cert)}
                          title="Run Step 4 Verification Audit"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </button>

                        <button
                          onClick={() => handleToggleRevoke(cert.id)}
                          title={cert.status === 'REVOKED' ? 'Reinstate Certificate' : 'Revoke Certificate'}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                            cert.status === 'REVOKED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/60 hover:bg-rose-900'
                          }`}
                        >
                          {cert.status === 'REVOKED' ? 'Unrevoke' : 'Revoke'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
