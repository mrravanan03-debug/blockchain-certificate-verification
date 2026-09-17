import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FlowOverview } from './components/FlowOverview';
import { CertificateIssuance } from './components/CertificateIssuance';
import { CertificateDocument } from './components/CertificateDocument';
import { VerificationPortal } from './components/VerificationPortal';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { CollegeRegistry } from './components/CollegeRegistry';
import { TechSuite } from './components/TechSuite';
import { blockchainService, INITIAL_STUDENT_CERT } from './services/blockchain';
import { Block, CertificateData, TabMode } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabMode>('overview');
  const [chain, setChain] = useState<Block[]>([]);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData>(INITIAL_STUDENT_CERT);
  const [verifyQuery, setVerifyQuery] = useState<string>('CERT-GENESIS-2026-001');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const handleToggleFullWidth = () => {
    setIsFullWidth(prev => !prev);
  };

  // Load initial blockchain state
  const refreshLedgerState = async () => {
    await blockchainService.initialize();
    const blocks = blockchainService.getChain();
    const certs = blockchainService.getCollegeCertificates();
    setChain([...blocks]);
    setCertificates([...certs]);

    // Ensure selected certificate is current
    const current = certs.find(c => c.id === selectedCertificate?.id) || certs[0];
    if (current) {
      setSelectedCertificate(current);
    }
  };

  useEffect(() => {
    refreshLedgerState();

    // Check URL parameters for direct verification link (from QR code scan)
    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify');
    if (verifyParam) {
      setVerifyQuery(verifyParam);
      setCurrentTab('verify');
    }
  }, []);

  // Handlers
  const handleCertificateIssued = (newCert: CertificateData) => {
    refreshLedgerState();
    setSelectedCertificate(newCert);
  };

  const handleNavigateToCertificate = (cert: CertificateData) => {
    setSelectedCertificate(cert);
    setCurrentTab('certificate');
  };

  const handleVerify = (cert: CertificateData) => {
    setVerifyQuery(cert.id);
    setCurrentTab('verify');
  };

  const handleQuickVerifyRamanan = () => {
    setVerifyQuery('CERT-GENESIS-2026-001');
    setCurrentTab('verify');
  };

  const handleSimulateTamper = (cert: CertificateData) => {
    blockchainService.simulateTamperBlock(cert.blockNumber, 'UNAUTHORIZED RECIPIENT');
    refreshLedgerState();
    setCurrentTab('verify');
    setVerifyQuery(cert.id);
  };

  const handleResetLedger = async () => {
    await blockchainService.resetLedger();
    await refreshLedgerState();
    setSelectedCertificate(INITIAL_STUDENT_CERT);
    setVerifyQuery('CERT-GENESIS-2026-001');
    setCurrentTab('overview');
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white ${
      isFullWidth ? 'full-width-mode' : ''
    }`}>
      {/* Top Navigation with Fullscreen & Menu */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        blockHeight={chain.length}
        totalCerts={certificates.length}
        onResetLedger={handleResetLedger}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isFullWidth={isFullWidth}
        onToggleFullWidth={handleToggleFullWidth}
        onQuickVerifyRamanan={handleQuickVerifyRamanan}
      />

      {/* Main Content Area */}
      <main className={`flex-1 pb-16 transition-all duration-300 ${
        isFullWidth ? 'w-full px-2 sm:px-6 lg:px-10' : ''
      }`}>
        {currentTab === 'overview' && (
          <FlowOverview
            onNavigate={setCurrentTab}
            onQuickVerifyRamanan={handleQuickVerifyRamanan}
          />
        )}

        {currentTab === 'issuance' && (
          <CertificateIssuance
            onCertificateIssued={handleCertificateIssued}
            onNavigateToCertificate={handleNavigateToCertificate}
          />
        )}

        {currentTab === 'certificate' && selectedCertificate && (
          <CertificateDocument
            certificate={selectedCertificate}
            onVerify={handleVerify}
            onSimulateTamper={handleSimulateTamper}
            onUpdateCertificate={(cert) => {
              setSelectedCertificate(cert);
              refreshLedgerState();
            }}
          />
        )}

        {currentTab === 'verify' && (
          <VerificationPortal
            initialQuery={verifyQuery}
            onNavigateToBlockchain={() => setCurrentTab('blockchain')}
            onViewCertificate={handleNavigateToCertificate}
          />
        )}

        {currentTab === 'techsuite' && selectedCertificate && (
          <TechSuite
            certificate={selectedCertificate}
            onSelectCertificate={handleNavigateToCertificate}
          />
        )}

        {currentTab === 'blockchain' && (
          <BlockchainExplorer
            blocks={chain}
            onRefresh={refreshLedgerState}
            onSelectCertificate={handleNavigateToCertificate}
          />
        )}

        {currentTab === 'registry' && (
          <CollegeRegistry
            certificates={certificates}
            onRefresh={refreshLedgerState}
            onViewCertificate={handleNavigateToCertificate}
            onVerifyCertificate={handleVerify}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className={`mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isFullWidth ? 'max-w-full px-6 lg:px-10' : 'max-w-7xl'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-300">
              KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Principal Dr. N. MALA</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>SHA-256 Ledger &bull; IPFS CID &bull; Merkle Root Sealing</span>
            <button
              onClick={handleToggleFullscreen}
              className="text-slate-400 hover:text-emerald-400 transition ml-2 underline underline-offset-2"
            >
              {isFullscreen ? 'Exit Full Screen' : 'Toggle Full Screen'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
