/**
 * Cryptographic utility functions using Web Crypto API (SHA-256)
 * for tamper-proof certificate hashing, IPFS CID simulation, and Merkle tree roots.
 */

// Compute SHA-256 hash using Web Crypto API
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate an IPFS CIDv0 or CIDv1 style hash from content
export async function generateIpfsCid(content: string): Promise<string> {
  const rawHash = await sha256(content);
  // Base58 characters
  const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let cid = 'Qm';
  // Derive deterministic 44 chars from hash
  for (let i = 0; i < 44; i++) {
    const byte = parseInt(rawHash.slice((i * 2) % (rawHash.length - 2), ((i * 2) % (rawHash.length - 2)) + 2), 16) || 42;
    cid += base58Chars[(byte + i * 7) % base58Chars.length];
  }
  return cid;
}

// Generate an Ethereum-style Transaction Hash (0x...)
export async function generateTxHash(blockIndex: number, certId: string, timestamp: number): Promise<string> {
  const payload = `tx:${blockIndex}:${certId}:${timestamp}`;
  const hash = await sha256(payload);
  return `0x${hash}`;
}

// Calculate Merkle Root of an array of certificate hashes
export async function calculateMerkleRoot(hashes: string[]): Promise<string> {
  if (hashes.length === 0) {
    return await sha256('empty_merkle_tree');
  }
  if (hashes.length === 1) {
    return hashes[0];
  }

  let currentLevel = [...hashes];
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      const combined = await sha256(left + right);
      nextLevel.push(combined);
    }
    currentLevel = nextLevel;
  }
  return currentLevel[0];
}

// Generate the canonical certificate payload string for cryptographic hashing
export function createCanonicalCertPayload(data: {
  id: string;
  studentName: string;
  studentId: string;
  eventName: string;
  degreeOrCourse: string;
  issuingInstitution: string;
  issueDate: string;
}): string {
  // Ordered deterministic JSON representation
  return JSON.stringify({
    id: data.id.trim(),
    name: data.studentName.trim().toUpperCase(),
    studentId: data.studentId.trim().toUpperCase(),
    event: data.eventName.trim(),
    degree: data.degreeOrCourse.trim(),
    institution: data.issuingInstitution.trim(),
    date: data.issueDate.trim()
  });
}

// Format short hash for display (e.g., 0x8a92...3f1c)
export function truncateHash(hash: string, startLen = 6, endLen = 4): string {
  if (!hash) return '';
  if (hash.length <= startLen + endLen) return hash;
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`;
}
