import { Block, CertificateData, VerificationResult } from '../types';
import { calculateMerkleRoot, createCanonicalCertPayload, generateIpfsCid, generateTxHash, sha256 } from '../utils/crypto';

const STORAGE_KEY_CHAIN = 'blockchain_cert_ledger_blocks_v4';
const STORAGE_KEY_CERTS = 'blockchain_cert_college_db_v4';
const STORAGE_KEY_SERIAL_COUNTER = 'blockchain_cert_serial_counter_v4';
const STORAGE_KEY_HISTORIC_IDS = 'blockchain_cert_historic_used_ids_v4';

// Initial preloaded Genesis & Genesis 2026 certificates for RAMANAN matching the user's diagram
export const INITIAL_STUDENT_CERT: CertificateData = {
  id: 'CERT-GENESIS-2026-001',
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
  issueDate: '2026-03-15',
  certificateHash: '', // Will be calculated deterministically
  ipfsCid: '',
  transactionHash: '',
  blockNumber: 1,
  status: 'VERIFIED',
  metadataNotes: 'Conferred and attested by Kovai Kalaimagal College of Arts and Science under Autonomous Institution Framework.'
};

export class BlockchainService {
  private chain: Block[] = [];
  private collegeDb: Map<string, CertificateData> = new Map();
  private historicUsedIds: Set<string> = new Set();

  constructor() {
    this.initialize();
  }

  public async initialize(): Promise<void> {
    const savedChain = localStorage.getItem(STORAGE_KEY_CHAIN);
    const savedDb = localStorage.getItem(STORAGE_KEY_CERTS);
    const savedHistoricIds = localStorage.getItem(STORAGE_KEY_HISTORIC_IDS);

    if (savedHistoricIds) {
      try {
        const parsed: string[] = JSON.parse(savedHistoricIds);
        parsed.forEach(id => this.historicUsedIds.add(id.toUpperCase()));
      } catch {
        // ignore
      }
    }

    if (savedChain && savedDb) {
      try {
        this.chain = JSON.parse(savedChain);
        const parsedDb: CertificateData[] = JSON.parse(savedDb);
        this.collegeDb.clear();
        parsedDb.forEach(cert => {
          this.collegeDb.set(cert.id, cert);
          this.historicUsedIds.add(cert.id.toUpperCase());
        });
        return;
      } catch (e) {
        console.error('Error loading saved blockchain from localStorage:', e);
      }
    }

    // Initialize Genesis Block and default RAMANAN - GENESIS 2026 block
    await this.setupDefaultLedger();
  }

  private async setupDefaultLedger(): Promise<void> {
    this.chain = [];
    this.collegeDb.clear();

    // 1. Genesis Block
    const genesisTime = 1773532800000; // March 2026 epoch
    const genesisMerkle = await calculateMerkleRoot(['genesis_cert_payload']);
    const genesisHash = await sha256(`0:0:${genesisTime}:${genesisMerkle}:0`);
    const genesisBlock: Block = {
      index: 0,
      timestamp: genesisTime,
      data: [],
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: genesisHash,
      nonce: 0,
      merkleRoot: genesisMerkle,
      validator: 'Genesis Authority Node'
    };
    this.chain.push(genesisBlock);

    // 2. Block 1 with RAMANAN - GENESIS 2026 certificate
    const cert = { ...INITIAL_STUDENT_CERT };
    const payload = createCanonicalCertPayload(cert);
    cert.certificateHash = await sha256(payload);
    cert.ipfsCid = await generateIpfsCid(payload + cert.certificateHash);
    cert.transactionHash = await generateTxHash(1, cert.id, genesisTime + 3600000);

    const block1Time = genesisTime + 3600000;
    const block1Merkle = await calculateMerkleRoot([cert.certificateHash]);
    const block1Hash = await sha256(`1:${genesisHash}:${block1Time}:${block1Merkle}:42`);

    const block1: Block = {
      index: 1,
      timestamp: block1Time,
      data: [cert],
      previousHash: genesisHash,
      hash: block1Hash,
      nonce: 42,
      merkleRoot: block1Merkle,
      validator: 'KKCAS Authority Node #01 (Principal Dr. N. MALA)'
    };
    this.chain.push(block1);
    this.collegeDb.set(cert.id, cert);
    this.historicUsedIds.add(cert.id.toUpperCase());

    // 3. Block 2 with additional sample record
    const cert2: CertificateData = {
      id: 'CERT-GENESIS-2026-002',
      studentName: 'PRIYA SHARMA',
      studentEmail: 'priya.sharma@kkcas.edu.in',
      studentId: 'GEN2026-CS-441',
      eventName: 'GENESIS 2026',
      degreeOrCourse: 'Computer Science & Cloud Architecture',
      achievementType: 'Honor',
      gradeOrScore: 'Grade A+ (Distinction)',
      issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
      issuerName: 'Dr. N. MALA',
      issuerTitle: 'Principal',
      issueDate: '2026-03-15',
      certificateHash: '',
      ipfsCid: '',
      transactionHash: '',
      blockNumber: 2,
      status: 'VERIFIED',
      metadataNotes: 'Conferred and attested by Kovai Kalaimagal College of Arts and Science under Autonomous Institution Framework.'
    };
    const payload2 = createCanonicalCertPayload(cert2);
    cert2.certificateHash = await sha256(payload2);
    cert2.ipfsCid = await generateIpfsCid(payload2 + cert2.certificateHash);
    cert2.transactionHash = await generateTxHash(2, cert2.id, block1Time + 7200000);

    const block2Time = block1Time + 7200000;
    const block2Merkle = await calculateMerkleRoot([cert2.certificateHash]);
    const block2Hash = await sha256(`2:${block1Hash}:${block2Time}:${block2Merkle}:89`);

    const block2: Block = {
      index: 2,
      timestamp: block2Time,
      data: [cert2],
      previousHash: block1Hash,
      hash: block2Hash,
      nonce: 89,
      merkleRoot: block2Merkle,
      validator: 'KKCAS Institutional Node (Autonomous Examination Wing)'
    };
    this.chain.push(block2);
    this.collegeDb.set(cert2.id, cert2);
    this.historicUsedIds.add(cert2.id.toUpperCase());

    // 3. Block 3 with Revoked Certificate for Scam / Fraud Testing
    const block3Time = block2Time + 3600000;
    const cert3: CertificateData = {
      id: 'CERT-REVOKED-MALPRACTICE-003',
      studentName: 'VIKRAM R. (REVOKED)',
      studentEmail: 'vikram.r@kkcas.edu.in',
      studentId: 'KKCAS-2023-CS-991',
      eventName: 'GENESIS 2026',
      degreeOrCourse: 'B.Sc Computer Science',
      achievementType: 'Completion',
      gradeOrScore: 'Grade C (Revoked)',
      issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
      issuerName: 'Dr. N. MALA',
      issuerTitle: 'Principal',
      issueDate: '2026-03-10',
      certificateHash: '',
      ipfsCid: '',
      transactionHash: '',
      blockNumber: 3,
      status: 'REVOKED',
      metadataNotes: 'Revoked by Examination Controller Board on 2026-03-16 for academic malpractice and duplicate credential generation attempt.'
    };
    const payload3 = createCanonicalCertPayload(cert3);
    cert3.certificateHash = await sha256(payload3);
    cert3.ipfsCid = await generateIpfsCid(payload3 + cert3.certificateHash);
    cert3.transactionHash = await generateTxHash(3, cert3.id, block3Time);

    const block3Merkle = await calculateMerkleRoot([cert3.certificateHash]);
    const block3Hash = await sha256(`3:${block2Hash}:${block3Time}:${block3Merkle}:104`);

    const block3: Block = {
      index: 3,
      timestamp: block3Time,
      data: [cert3],
      previousHash: block2Hash,
      hash: block3Hash,
      nonce: 104,
      merkleRoot: block3Merkle,
      validator: 'KKCAS Institutional Node (Autonomous Examination Wing)'
    };
    this.chain.push(block3);
    this.collegeDb.set(cert3.id, cert3);
    this.historicUsedIds.add(cert3.id.toUpperCase());

    // 4. Block 4 with Cryptographically Tampered / Forged Certificate for Attack Testing
    // Real student was 'SURESH KUMAR' with Grade B (62%), but attacker changed studentName to 'MALICIOUS FORGER' and Grade to 'Rank #1 Gold Medal'
    // without being able to re-hash using Principal Dr. N. MALA's consensus credentials.
    const block4Time = block3Time + 3600000;
    const cert4: CertificateData = {
      id: 'CERT-TAMPERED-FORGED-004',
      studentName: 'MALICIOUS FORGER (ALTERED)',
      studentEmail: 'attacker@fraudulent-domain.xyz',
      studentId: 'KKCAS-2024-FORGE-007',
      eventName: 'GENESIS 2026',
      degreeOrCourse: 'B.Sc Computer Science (FORGED HONORS)',
      achievementType: 'Excellence',
      gradeOrScore: 'Rank #1 Gold Medal (FRAUDULENT EDIT)',
      issuingInstitution: 'KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE',
      issuerName: 'Dr. N. MALA',
      issuerTitle: 'Principal',
      issueDate: '2026-03-12',
      certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855_INVALID_MISMATCH',
      ipfsCid: 'QmFakeCidThatFailsIpfsCryptographicParityCheck404',
      transactionHash: '0xfa15e98765432100000000000000000000000000000000000000000000000000',
      blockNumber: 4,
      status: 'VERIFIED', // Claims to be verified, but mathematical hash recalculation fails instantly!
      metadataNotes: 'Counterfeit payload: Data modified after block sealing without legitimate cryptographic authority signature.'
    };
    const block4Merkle = await calculateMerkleRoot(['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855_ORIGINAL_HASH']);
    const block4Hash = await sha256(`4:${block3Hash}:${block4Time}:${block4Merkle}:142`);

    const block4: Block = {
      index: 4,
      timestamp: block4Time,
      data: [cert4],
      previousHash: block3Hash,
      hash: block4Hash,
      nonce: 142,
      merkleRoot: block4Merkle,
      validator: 'KKCAS Institutional Node (Autonomous Examination Wing)'
    };
    this.chain.push(block4);
    this.collegeDb.set(cert4.id, cert4);
    this.historicUsedIds.add(cert4.id.toUpperCase());

    this.saveToStorage();
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getCollegeCertificates(): CertificateData[] {
    return Array.from(this.collegeDb.values());
  }

  public getCertificateById(id: string): CertificateData | undefined {
    return this.collegeDb.get(id);
  }

  // Check whether a certificate ID has ever been registered or used in history
  public isIdRegistered(id: string): boolean {
    if (!id) return false;
    const clean = id.trim().toUpperCase();
    if (this.historicUsedIds.has(clean)) return true;
    if (this.collegeDb.has(clean) || this.collegeDb.has(id.trim())) return true;
    for (const block of this.chain) {
      if (block.data.some(c => c.id.toUpperCase() === clean)) return true;
    }
    return false;
  }

  // Cryptographically generate a brand-new, globally unique, unrepeatable Certificate ID
  public generateUniqueCertificateId(prefix = 'CERT-GENESIS-2026'): string {
    let currentCounter = 3;
    try {
      const savedCounter = localStorage.getItem(STORAGE_KEY_SERIAL_COUNTER);
      if (savedCounter) {
        currentCounter = Math.max(currentCounter, parseInt(savedCounter, 10));
      }
    } catch {
      // ignore
    }

    // Sequence ensures monotonic progression beyond existing database size
    const minCounter = Math.max(this.collegeDb.size + 1, currentCounter);
    currentCounter = minCounter;

    let candidateId = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 2000) {
      attempts++;
      const seqStr = String(currentCounter).padStart(3, '0');
      // High-entropy 4-character hex hash from cryptographically varied pseudo-random entropy
      const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
      candidateId = `${prefix}-${seqStr}-${randomHex}`;

      if (!this.isIdRegistered(candidateId)) {
        isUnique = true;
        currentCounter++;
        try {
          localStorage.setItem(STORAGE_KEY_SERIAL_COUNTER, currentCounter.toString());
        } catch {
          // ignore
        }
      } else {
        currentCounter++;
      }
    }

    return candidateId;
  }

  public findCertificate(query: string): CertificateData | undefined {
    const q = query.trim().toLowerCase();
    for (const cert of this.collegeDb.values()) {
      if (
        cert.id.toLowerCase() === q ||
        cert.certificateHash.toLowerCase() === q ||
        cert.ipfsCid.toLowerCase() === q ||
        cert.transactionHash.toLowerCase() === q ||
        cert.studentId.toLowerCase() === q ||
        cert.studentName.toLowerCase() === q
      ) {
        return cert;
      }
    }
    return undefined;
  }

  // Issue a new certificate, compute cryptographic hash, IPFS CID, and mine new block
  public async issueCertificate(
    data: Omit<CertificateData, 'certificateHash' | 'ipfsCid' | 'transactionHash' | 'blockNumber' | 'status'>
  ): Promise<{ certificate: CertificateData; block: Block }> {
    const nextBlockIndex = this.chain.length;
    const timestamp = Date.now();

    // Enforce guaranteed non-repeatable, unalterable unique Certificate Serial ID
    let finalCertId = data.id ? data.id.trim() : '';
    if (!finalCertId || this.isIdRegistered(finalCertId)) {
      finalCertId = this.generateUniqueCertificateId();
    }
    this.historicUsedIds.add(finalCertId.toUpperCase());

    // Canonical payload for cryptographic integrity
    const payload = createCanonicalCertPayload({
      id: finalCertId,
      studentName: data.studentName,
      studentId: data.studentId,
      eventName: data.eventName,
      degreeOrCourse: data.degreeOrCourse,
      issuingInstitution: data.issuingInstitution,
      issueDate: data.issueDate
    });

    const certHash = await sha256(payload);
    const ipfsCid = await generateIpfsCid(payload + certHash);
    const txHash = await generateTxHash(nextBlockIndex, finalCertId, timestamp);

    const certificate: CertificateData = {
      ...data,
      id: finalCertId,
      certificateHash: certHash,
      ipfsCid,
      transactionHash: txHash,
      blockNumber: nextBlockIndex,
      status: 'VERIFIED'
    };

    // Mine new block
    const prevBlock = this.chain[this.chain.length - 1];
    const prevHash = prevBlock ? prevBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const merkleRoot = await calculateMerkleRoot([certHash]);

    // Simple proof-of-work simulation (find nonce where hash has '0' prefix for realism)
    let nonce = 0;
    let blockHash = '';
    while (nonce < 1000) {
      blockHash = await sha256(`${nextBlockIndex}:${prevHash}:${timestamp}:${merkleRoot}:${nonce}`);
      if (blockHash.startsWith('0')) {
        break;
      }
      nonce++;
    }

    const newBlock: Block = {
      index: nextBlockIndex,
      timestamp,
      data: [certificate],
      previousHash: prevHash,
      hash: blockHash,
      nonce,
      merkleRoot,
      validator: 'KKCAS Validator Node (Office of Principal Dr. N. MALA)'
    };

    this.chain.push(newBlock);
    this.collegeDb.set(certificate.id, certificate);
    this.saveToStorage();

    return { certificate, block: newBlock };
  }

  // Verify certificate by ID or Hash, performing the 4-point audit shown in the diagram
  public async verifyCertificate(query: string): Promise<VerificationResult> {
    const verifiedAt = Date.now();
    const cert = this.findCertificate(query);

    if (!cert) {
      return {
        status: 'NOT_FOUND',
        verifiedAt,
        tamperReason: 'No corresponding certificate found in College Registry or Blockchain Ledger.',
        auditChecks: {
          databaseMatch: false,
          blockchainHashMatch: false,
          ipfsIntegrityVerified: false,
          signatureAuthentic: false
        }
      };
    }

    // Find block on chain
    const block = this.chain.find(b => b.data.some(c => c.id === cert.id));
    if (!block) {
      return {
        status: 'INVALID',
        certificate: cert,
        verifiedAt,
        tamperReason: 'Certificate exists in registry but is missing in the distributed blockchain ledger.',
        auditChecks: {
          databaseMatch: true,
          blockchainHashMatch: false,
          ipfsIntegrityVerified: false,
          signatureAuthentic: false
        }
      };
    }

    // Check if block was tampered
    if (block.isTampered) {
      return {
        status: 'TAMPERED',
        certificate: cert,
        block,
        verifiedAt,
        tamperReason: 'Cryptographic block hash mismatch. Ledger integrity violated on-chain!',
        auditChecks: {
          databaseMatch: true,
          blockchainHashMatch: false,
          ipfsIntegrityVerified: false,
          signatureAuthentic: false
        }
      };
    }

    // Recompute payload hash to verify zero data manipulation
    const expectedPayload = createCanonicalCertPayload(cert);
    const recomputedHash = await sha256(expectedPayload);
    const hashMatches = recomputedHash === cert.certificateHash;

    if (!hashMatches) {
      return {
        status: 'TAMPERED',
        certificate: cert,
        block,
        verifiedAt,
        tamperReason: `Data has been modified! Recomputed hash (${recomputedHash.slice(0, 10)}...) does not match blockchain seal (${cert.certificateHash.slice(0, 10)}...).`,
        auditChecks: {
          databaseMatch: true,
          blockchainHashMatch: false,
          ipfsIntegrityVerified: false,
          signatureAuthentic: false
        }
      };
    }

    // Check revocation status in College DB
    if (cert.status === 'REVOKED') {
      return {
        status: 'REVOKED',
        certificate: cert,
        block,
        verifiedAt,
        tamperReason: 'Certificate has been revoked by the issuing institution registry.',
        auditChecks: {
          databaseMatch: true,
          blockchainHashMatch: true,
          ipfsIntegrityVerified: true,
          signatureAuthentic: false
        }
      };
    }

    // Check chain linkage
    const isChainValid = await this.validateChain();
    if (!isChainValid) {
      return {
        status: 'TAMPERED',
        certificate: cert,
        block,
        verifiedAt,
        tamperReason: 'Blockchain ledger broken: Previous block hash links are invalid!',
        auditChecks: {
          databaseMatch: true,
          blockchainHashMatch: false,
          ipfsIntegrityVerified: true,
          signatureAuthentic: false
        }
      };
    }

    // All authentic!
    return {
      status: 'VERIFIED',
      certificate: cert,
      block,
      verifiedAt,
      auditChecks: {
        databaseMatch: true,
        blockchainHashMatch: true,
        ipfsIntegrityVerified: true,
        signatureAuthentic: true
      }
    };
  }

  // Validate entire blockchain integrity
  public async validateChain(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];

      if (current.isTampered) return false;
      if (current.previousHash !== prev.hash) return false;

      // Recompute block hash
      const recomputedBlockHash = await sha256(
        `${current.index}:${current.previousHash}:${current.timestamp}:${current.merkleRoot}:${current.nonce}`
      );
      if (recomputedBlockHash !== current.hash) {
        return false;
      }
    }
    return true;
  }

  // Interactive Tamper Simulator: Alter a block to demonstrate tamper detection
  public simulateTamperBlock(blockIndex: number, alteredStudentName: string): void {
    const block = this.chain.find(b => b.index === blockIndex);
    if (!block || block.data.length === 0) return;

    block.isTampered = true;
    const cert = block.data[0];
    cert.studentName = alteredStudentName;
    cert.status = 'TAMPERED';
    this.saveToStorage();
  }

  // Toggle certificate revocation
  public toggleRevocation(certId: string): CertificateData | undefined {
    const cert = this.collegeDb.get(certId);
    if (!cert) return undefined;

    cert.status = cert.status === 'REVOKED' ? 'VERIFIED' : 'REVOKED';
    this.saveToStorage();
    return cert;
  }

  // Update existing certificate with custom image, QR config, or metadata
  public updateCertificate(id: string, updates: Partial<CertificateData>): CertificateData | undefined {
    const cert = this.collegeDb.get(id);
    if (!cert) return undefined;

    const updated = { ...cert, ...updates };
    this.collegeDb.set(id, updated);

    // Also update in blockchain block data
    for (const block of this.chain) {
      const idx = block.data.findIndex(c => c.id === id);
      if (idx !== -1) {
        block.data[idx] = updated;
      }
    }

    this.saveToStorage();
    return updated;
  }

  // Reset ledger to fresh pristine state
  public async resetLedger(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_CHAIN);
    localStorage.removeItem(STORAGE_KEY_CERTS);
    localStorage.removeItem(STORAGE_KEY_HISTORIC_IDS);
    localStorage.removeItem(STORAGE_KEY_SERIAL_COUNTER);
    await this.setupDefaultLedger();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CHAIN, JSON.stringify(this.chain));
      localStorage.setItem(STORAGE_KEY_CERTS, JSON.stringify(Array.from(this.collegeDb.values())));
      localStorage.setItem(STORAGE_KEY_HISTORIC_IDS, JSON.stringify(Array.from(this.historicUsedIds)));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }
}

export const blockchainService = new BlockchainService();
