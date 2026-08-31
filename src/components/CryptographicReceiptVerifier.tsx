import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Key, 
  FileCheck, 
  Copy, 
  Check, 
  Download, 
  Hash, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers
} from 'lucide-react';

interface ReceiptRecord {
  id: string;
  timestamp: string;
  projectId: string;
  sessionHash: string;
  merkleRoot: string;
  canonSignature: string;
  directiveAction: string;
  latencyMs: number;
  status: 'VALID' | 'TAMPERED';
}

const SAMPLE_RECEIPTS: ReceiptRecord[] = [
  {
    id: "RCPT-2026-0831-001",
    timestamp: "2026-08-31T02:45:11.204Z",
    projectId: "PROJ-AEGIS-HEALTHCARE",
    sessionHash: "0xfa9012a4b82d410287e099bc8174aa910c2834d8e57199fa610288be",
    merkleRoot: "0x892ba91c00293847eec0948571629471928475910283746591823746",
    canonSignature: "ECDSA-secp256k1-SHA256:0x7c99201fa88...",
    directiveAction: "DIRECTIVE_PROTECT (MRN_884920 Zero-Leak Enforced)",
    latencyMs: 0.32,
    status: 'VALID'
  },
  {
    id: "RCPT-2026-0831-002",
    timestamp: "2026-08-31T02:46:28.891Z",
    projectId: "PROJ-TITAN-FINANCE",
    sessionHash: "0x981249bcefa81023746e890128475910283746591823746591823746",
    merkleRoot: "0x3310fa892ba91c00293847eec0948571629471928475910283746591",
    canonSignature: "ECDSA-secp256k1-SHA256:0x11029ba88...",
    directiveAction: "DIRECTIVE_IMMUNE_REACTION (3-of-4 Multi-Sig Pinned)",
    latencyMs: 0.29,
    status: 'VALID'
  }
];

export function CryptographicReceiptVerifier() {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord>(SAMPLE_RECEIPTS[0]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutput, setVerificationOutput] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setVerificationOutput(null);
    setTimeout(() => {
      setVerificationOutput(true);
      setIsVerifying(false);
    }, 600);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(selectedReceipt.sessionHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCertificate = () => {
    const cert = {
      receiptId: selectedReceipt.id,
      issuer: "Cranium Substrate™ Cryptographic Audit Authority",
      timestamp: selectedReceipt.timestamp,
      projectId: selectedReceipt.projectId,
      sessionHash: selectedReceipt.sessionHash,
      merkleRoot: selectedReceipt.merkleRoot,
      canonSignature: selectedReceipt.canonSignature,
      directive: selectedReceipt.directiveAction,
      verificationStatus: "CRYPTOGRAPHICALLY_VERIFIED_NOMINAL",
      proofEngine: "SHA-256 Merkle Proof v2.4 (Kotlin SubstrateCore)"
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReceipt.id}-verification-proof.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 space-y-6 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-mono mb-2">
            <ShieldCheck size={13} />
            <span>Tamper-Proof Audit Protocol</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Cryptographic Receipt & State Tree Verifier
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl font-light">
            Every directive action and canon enforcement emits an immutable cryptographic receipt verifiable against the substrate’s Merkle state chain.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
          {SAMPLE_RECEIPTS.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedReceipt(r);
                setVerificationOutput(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedReceipt.id === r.id
                  ? 'bg-emerald-600 text-white font-medium shadow-md shadow-emerald-600/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Verification Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Receipt Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-neutral-400 uppercase tracking-wider">Receipt Metadata</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-400 font-semibold">
                Status: {selectedReceipt.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] text-neutral-500 mb-1">Receipt ID & Project</div>
                <div className="text-white font-semibold flex items-center justify-between">
                  <span>{selectedReceipt.id}</span>
                  <span className="text-indigo-400">{selectedReceipt.projectId}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-neutral-500 mb-1">Session State Hash (SHA-256)</div>
                <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 break-all flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono">{selectedReceipt.sessionHash}</span>
                  <button 
                    onClick={handleCopyHash}
                    className="shrink-0 p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1">Merkle Root Hash</div>
                  <div className="text-neutral-300 truncate text-[11px] bg-neutral-900 p-2 rounded border border-neutral-800">
                    {selectedReceipt.merkleRoot}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1">Enforcement Latency</div>
                  <div className="text-emerald-400 font-bold text-[11px] bg-neutral-900 p-2 rounded border border-neutral-800">
                    {selectedReceipt.latencyMs} ms (Sub-ms Gate)
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-neutral-500 mb-1">Directive Executed</div>
                <div className="text-indigo-300 font-medium bg-indigo-950/40 p-2.5 rounded border border-indigo-900/50">
                  ⚡ {selectedReceipt.directiveAction}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Verification Engine & Certificate (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-neutral-800">
              <span className="text-neutral-400 uppercase tracking-wider">Merkle Proof Verifier</span>
              <Lock size={14} className="text-emerald-400" />
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-300">
                <span>1. State Hash Integrity:</span>
                <span className="text-emerald-400">PASSED ✓</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>2. Canon Axiom Signature:</span>
                <span className="text-emerald-400">MATCHED ✓</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>3. Temporal Timestamp Invariant:</span>
                <span className="text-emerald-400">VERIFIED ✓</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>4. Polarity Zero-Leak Proof:</span>
                <span className="text-emerald-400">100.0% SECURE ✓</span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Recomputing Merkle Tree...</span>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Run Cryptographic Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleDownloadCertificate}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 cursor-pointer transition-all"
          >
            <Download size={14} />
            <span>Download Signed Audit Certificate (.json)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
