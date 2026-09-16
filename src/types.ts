export interface QrPlacementConfig {
  xPercent: number; // 0 - 100% from left
  yPercent: number; // 0 - 100% from top
  preset: 'bottom-right' | 'bottom-left' | 'top-right' | 'center-seal' | 'custom';
  size: number; // in pixels
  style: 'gold' | 'clean' | 'dark' | 'transparent';
  showLabel: boolean;
  showHash: boolean;
  showBorder: boolean;
}

export interface CertificateData {
  id: string; // e.g. "CERT-GENESIS-2026-001"
  studentName: string; // e.g. "RAMANAN"
  studentEmail: string; // e.g. "ramanan@student.edu"
  studentId: string; // e.g. "REG2022CS108"
  eventName: string; // e.g. "GENESIS 2026"
  degreeOrCourse: string; // e.g. "B.Tech Computer Science & Engineering"
  achievementType: 'Achievement' | 'Completion' | 'Merit' | 'Excellence' | 'Honor';
  gradeOrScore?: string; // e.g. "First Class with Distinction (9.4 CGPA)"
  issuingInstitution: string; // e.g. "KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE"
  issuerName: string; // e.g. "Dr. N. MALA"
  issuerTitle: string; // e.g. "Principal"
  issueDate: string; // YYYY-MM-DD
  expiryDate?: string;
  certificateHash: string; // SHA-256 hash of student data + metadata
  ipfsCid: string; // IPFS Content Identifier (e.g. QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco)
  transactionHash: string; // 0x...
  blockNumber: number;
  status: 'VERIFIED' | 'REVOKED' | 'TAMPERED';
  metadataNotes?: string;
  customCertificateImage?: string; // User-uploaded certificate image (Data URL)
  qrPlacement?: QrPlacementConfig;
}

export interface Block {
  index: number;
  timestamp: number;
  data: CertificateData[];
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
  validator: string; // e.g. "Node-01 (College Authority)"
  isTampered?: boolean;
}

export interface VerificationResult {
  status: 'VERIFIED' | 'TAMPERED' | 'INVALID' | 'REVOKED' | 'NOT_FOUND';
  certificate?: CertificateData;
  block?: Block;
  tamperReason?: string;
  verifiedAt: number;
  auditChecks: {
    databaseMatch: boolean;
    blockchainHashMatch: boolean;
    ipfsIntegrityVerified: boolean;
    signatureAuthentic: boolean;
  };
}

export type TabMode = 'overview' | 'issuance' | 'certificate' | 'verify' | 'blockchain' | 'registry' | 'techsuite';
