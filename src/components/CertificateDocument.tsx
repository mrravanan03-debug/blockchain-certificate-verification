import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  QrCode, 
  AlertTriangle, 
  Share2, 
  ArrowRight, 
  Upload, 
  Sliders, 
  Move, 
  Sparkles, 
  Award, 
  RefreshCw, 
  Image as ImageIcon,
  Palette,
  Check,
  RotateCcw,
  FileCheck2
} from 'lucide-react';
import { CertificateData, QrPlacementConfig } from '../types';
import { truncateHash, sha256 } from '../utils/crypto';
import { blockchainService } from '../services/blockchain';

interface CertificateDocumentProps {
  certificate: CertificateData;
  onVerify: (cert: CertificateData) => void;
  onSimulateTamper: (cert: CertificateData) => void;
  onUpdateCertificate?: (cert: CertificateData) => void;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  certificate,
  onVerify,
  onSimulateTamper,
  onUpdateCertificate
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeView, setActiveView] = useState<'preview' | 'customize' | 'upload'>('preview');

  // Custom QR Stamping configuration
  const [qrConfig, setQrConfig] = useState<QrPlacementConfig>({
    xPercent: 78,
    yPercent: 74,
    preset: 'bottom-right',
    size: 112,
    style: 'gold',
    showLabel: true,
    showHash: true,
    showBorder: true
  });

  // User uploaded certificate image state
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(
    certificate.customCertificateImage || null
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const certContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize certificate changes
  useEffect(() => {
    if (certificate.customCertificateImage) {
      setUserUploadedImage(certificate.customCertificateImage);
    }
    if (certificate.qrPlacement) {
      setQrConfig(certificate.qrPlacement);
    }
  }, [certificate]);

  // Generate dynamic QR Code pointing to verification URL
  useEffect(() => {
    const generateQr = async () => {
      try {
        const verificationUrl = `${window.location.origin}?verify=${encodeURIComponent(certificate.id)}`;
        const darkColor = qrConfig.style === 'gold' ? '#8c6b24' : qrConfig.style === 'dark' ? '#10b981' : '#0f172a';
        const lightColor = qrConfig.style === 'dark' ? '#020617' : '#ffffff';

        const url = await QRCode.toDataURL(verificationUrl, {
          width: 320,
          margin: 1,
          color: {
            dark: darkColor,
            light: lightColor
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQr();
  }, [certificate, qrConfig.style]);

  // Handle Preset Position Buttons
  const setPresetPosition = (preset: QrPlacementConfig['preset']) => {
    let x = 78;
    let y = 74;

    if (preset === 'bottom-right') {
      x = 78;
      y = 74;
    } else if (preset === 'bottom-left') {
      x = 6;
      y = 74;
    } else if (preset === 'top-right') {
      x = 78;
      y = 6;
    } else if (preset === 'center-seal') {
      x = 42;
      y = 74;
    }

    const updated = { ...qrConfig, preset, xPercent: x, yPercent: y };
    setQrConfig(updated);
    saveConfig(updated);
  };

  const saveConfig = (newConfig: QrPlacementConfig) => {
    if (onUpdateCertificate) {
      const updatedCert = blockchainService.updateCertificate(certificate.id, {
        qrPlacement: newConfig,
        customCertificateImage: userUploadedImage || undefined
      });
      if (updatedCert) {
        onUpdateCertificate(updatedCert);
      }
    }
  };

  // Handle Custom Certificate File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setUserUploadedImage(dataUrl);

      // Hash the uploaded certificate file for real blockchain provenance
      const fileHash = await sha256(dataUrl);
      const updatedCert = blockchainService.updateCertificate(certificate.id, {
        customCertificateImage: dataUrl,
        certificateHash: fileHash,
        metadataNotes: `User custom certificate file uploaded (${file.name}, ${Math.round(file.size / 1024)} KB).`
      });

      if (updatedCert && onUpdateCertificate) {
        onUpdateCertificate(updatedCert);
      }
      setActiveView('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleClearUploadedImage = () => {
    setUserUploadedImage(null);
    if (onUpdateCertificate) {
      const updated = blockchainService.updateCertificate(certificate.id, {
        customCertificateImage: undefined
      });
      if (updated) {
        onUpdateCertificate(updated);
      }
    }
  };

  // Interactive Click to Place QR Code on Certificate
  const handleCertClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeView !== 'customize') return;
    const rect = certContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = Math.max(2, Math.min(88, Math.round((clickX / rect.width) * 100)));
    const yPercent = Math.max(2, Math.min(88, Math.round((clickY / rect.height) * 100)));

    const updated: QrPlacementConfig = {
      ...qrConfig,
      preset: 'custom',
      xPercent,
      yPercent
    };
    setQrConfig(updated);
    saveConfig(updated);
  };

  // Export Combined Certificate + Stamped QR Code as PNG Canvas
  const handleDownloadStampedCertificate = async () => {
    setIsExporting(true);
    try {
      const container = certContainerRef.current;
      if (!container) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set high-res canvas (1600x1100)
      canvas.width = 1600;
      canvas.height = 1100;

      if (userUploadedImage) {
        // Draw user uploaded image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = userUploadedImage;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        // Render stylized parchment certificate background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#fcfbf7');
        gradient.addColorStop(1, '#f6f3ea');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gold border
        ctx.strokeStyle = '#b38e44';
        ctx.lineWidth = 14;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

        ctx.lineWidth = 4;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

        // Text rendering
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8c6b24';
        ctx.font = 'bold 24px serif';
        ctx.fillText(certificate.issuingInstitution.toUpperCase(), canvas.width / 2, 160);

        ctx.fillStyle = '#0f172a';
        ctx.font = '900 48px serif';
        ctx.fillText(`CERTIFICATE OF ${certificate.achievementType.toUpperCase()}`, canvas.width / 2, 230);

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('THIS IS TO PROUDLY CERTIFY THAT', canvas.width / 2, 300);

        // Student Name
        ctx.fillStyle = '#020617';
        ctx.font = '900 68px serif';
        ctx.fillText(certificate.studentName, canvas.width / 2, 410);

        ctx.fillStyle = '#475569';
        ctx.font = '22px monospace';
        ctx.fillText(`Student / Reg ID: ${certificate.studentId}`, canvas.width / 2, 470);

        ctx.fillStyle = '#334155';
        ctx.font = '24px sans-serif';
        ctx.fillText('has successfully presented and demonstrated exceptional excellence in', canvas.width / 2, 540);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(certificate.eventName, canvas.width / 2, 600);

        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 22px sans-serif';
        ctx.fillText(certificate.degreeOrCourse, canvas.width / 2, 650);

        // Signatures
        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'italic 34px "Alex Brush", cursive, serif';
        ctx.fillText(certificate.issuerName, 120, 895);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(120, 905);
        ctx.lineTo(360, 905);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 20px serif';
        ctx.fillText(certificate.issuerName, 120, 935);
        ctx.fillStyle = '#475569';
        ctx.font = '16px sans-serif';
        ctx.fillText(certificate.issuerTitle, 120, 960);
        ctx.fillText(`Date: ${certificate.issueDate}`, 120, 985);
      }

      // Draw Stamped QR Code
      if (qrDataUrl) {
        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
        });

        // Calculate scaled position
        const targetX = (qrConfig.xPercent / 100) * canvas.width;
        const targetY = (qrConfig.yPercent / 100) * canvas.height;
        const scaledSize = (qrConfig.size / 112) * 220;

        // Draw QR Container Badge
        if (qrConfig.style !== 'transparent') {
          ctx.fillStyle = qrConfig.style === 'dark' ? '#020617' : '#ffffff';
          ctx.beginPath();
          ctx.roundRect(targetX - 16, targetY - 16, scaledSize + 32, scaledSize + (qrConfig.showLabel ? 68 : 32), 20);
          ctx.fill();

          if (qrConfig.showBorder) {
            ctx.strokeStyle = qrConfig.style === 'gold' ? '#b38e44' : qrConfig.style === 'dark' ? '#10b981' : '#cbd5e1';
            ctx.lineWidth = 6;
            ctx.stroke();
          }
        }

        // Draw QR Matrix
        ctx.drawImage(qrImg, targetX, targetY, scaledSize, scaledSize);

        // Draw verification label
        if (qrConfig.showLabel) {
          ctx.textAlign = 'center';
          ctx.fillStyle = qrConfig.style === 'dark' ? '#34d399' : '#0f172a';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('VERIFIED ON BLOCKCHAIN', targetX + scaledSize / 2, targetY + scaledSize + 24);

          if (qrConfig.showHash) {
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(`SERIAL: ${certificate.id}`, targetX + scaledSize / 2, targetY + scaledSize + 42);
          }
        }
      }

      // Trigger Download
      const link = document.createElement('a');
      link.download = `${certificate.studentName.replace(/\s+/g, '_')}_Certificate_with_QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download stamped certificate:', err);
      alert('Could not export image. Printing works natively.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const verificationUrl = `${window.location.origin}?verify=${encodeURIComponent(certificate.id)}`;
    navigator.clipboard.writeText(verificationUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Action & Step Bar (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mb-1">
            <span>STEP 2 OF 4</span>
            <span>&bull;</span>
            <span>CERTIFICATE &amp; QR STAMPING STUDIO</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Provide Certificate &amp; Add Verification QR Code</span>
            {userUploadedImage && (
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40">
                Custom Upload Active
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">
            Student: <span className="text-slate-200 font-semibold">{certificate.studentName}</span> &bull; Event: <span className="text-teal-300 font-semibold">{certificate.eventName}</span> &bull; Block: #{certificate.blockNumber}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle Buttons */}
          <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeView === 'preview' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveView('customize')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                activeView === 'customize' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Position QR</span>
            </button>
            <button
              onClick={() => setActiveView('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                activeView === 'upload' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Mine</span>
            </button>
          </div>

          <button
            onClick={handleDownloadStampedCertificate}
            disabled={isExporting}
            title="Download full certificate with embedded QR as high-res PNG image"
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Download Stamped PNG'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print A4</span>
          </button>

          <button
            onClick={() => onVerify(certificate)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Step 3: Verify QR</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Upload Panel (if active) */}
      {activeView === 'upload' && (
        <div className="no-print bg-slate-900/90 rounded-2xl border border-indigo-500/40 p-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Your Own Existing Certificate</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your custom certificate design (PNG, JPG, WEBP). The system will stamp the blockchain verification QR code onto it!
              </p>
            </div>

            {userUploadedImage && (
              <button
                onClick={handleClearUploadedImage}
                className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-semibold hover:bg-rose-900 transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default Template</span>
              </button>
            )}
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-950/50 hover:bg-indigo-950/20 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">Click or Drag &amp; Drop Your Certificate Here</div>
            <p className="text-xs text-slate-400 mt-1">Supports High Resolution PNG, JPG, or WEBP images</p>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono">
              After upload, you can position the verification QR anywhere on the certificate.
            </div>
          </div>
        </div>
      )}

      {/* QR Customizer & Positioner Toolbar (if customize active) */}
      {activeView === 'customize' && (
        <div className="no-print bg-slate-900/90 rounded-2xl border border-teal-500/40 p-5 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Interactive QR Code Placement &amp; Styling Studio</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click anywhere directly on the certificate below to place the QR, or use presets &amp; sliders.
              </p>
            </div>
            <div className="text-xs text-teal-300 font-mono bg-slate-800 px-3 py-1 rounded-lg">
              Position: X={qrConfig.xPercent}%, Y={qrConfig.yPercent}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Presets */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider block">
                Quick Placement Presets:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPresetPosition('bottom-right')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                    qrConfig.preset === 'bottom-right'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Bottom Right (Default)
                </button>
                <button
                  type="button"
                  onClick={() => setPresetPosition('bottom-left')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                    qrConfig.preset === 'bottom-left'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Bottom Left
                </button>
                <button
                  type="button"
                  onClick={() => setPresetPosition('top-right')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                    qrConfig.preset === 'top-right'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Top Right
                </button>
                <button
                  type="button"
                  onClick={() => setPresetPosition('center-seal')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                    qrConfig.preset === 'center-seal'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Center Seal
                </button>
              </div>
            </div>

            {/* 2. Style Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider block">
                QR Theme Style:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'gold', label: 'Gold Foil' },
                  { id: 'clean', label: 'Clean White' },
                  { id: 'dark', label: 'Cyber Dark' },
                  { id: 'transparent', label: 'Minimalist' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      const updated = { ...qrConfig, style: s.id as any };
                      setQrConfig(updated);
                      saveConfig(updated);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                      qrConfig.style === s.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400 font-semibold uppercase tracking-wider">
                <span>QR Code Size:</span>
                <span className="text-white font-mono">{qrConfig.size}px</span>
              </div>
              <input
                type="range"
                min="70"
                max="160"
                step="4"
                value={qrConfig.size}
                onChange={e => {
                  const updated = { ...qrConfig, size: Number(e.target.value) };
                  setQrConfig(updated);
                  saveConfig(updated);
                }}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Small (70px)</span>
                <span>Standard (112px)</span>
                <span>Large (160px)</span>
              </div>
            </div>

            {/* 4. Badges & Labels */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold uppercase tracking-wider block">
                Stamping Metadata:
              </label>
              <div className="space-y-1 text-slate-300">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qrConfig.showLabel}
                    onChange={e => {
                      const updated = { ...qrConfig, showLabel: e.target.checked };
                      setQrConfig(updated);
                      saveConfig(updated);
                    }}
                    className="accent-teal-500 rounded"
                  />
                  <span>Show "Scan to Verify" label</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qrConfig.showHash}
                    onChange={e => {
                      const updated = { ...qrConfig, showHash: e.target.checked };
                      setQrConfig(updated);
                      saveConfig(updated);
                    }}
                    className="accent-teal-500 rounded"
                  />
                  <span>Show ID &amp; Blockchain Hash Tag</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THE CERTIFICATE CANVAS (Interactive Print & Stamping Area) */}
      <div className="overflow-x-auto pb-6">
        <div
          ref={certContainerRef}
          onClick={handleCertClick}
          id="official-certificate-paper"
          className={`print-area min-w-[760px] sm:min-w-[840px] max-w-[900px] mx-auto relative rounded-2xl shadow-2xl transition overflow-hidden select-none ${
            activeView === 'customize' ? 'cursor-crosshair ring-2 ring-teal-500/80 ring-offset-4 ring-offset-slate-950' : ''
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
          }}
        >
          {/* OPTION A: User Uploaded Custom Certificate */}
          {userUploadedImage ? (
            <div className="relative w-full bg-slate-900">
              <img
                src={userUploadedImage}
                alt="User Uploaded Custom Certificate"
                className="w-full h-auto object-contain block pointer-events-none"
              />
            </div>
          ) : (
            /* OPTION B: System Default Golden Institutional Certificate */
            <div 
              className="bg-gradient-to-br from-[#fcfbf7] to-[#f6f3ea] text-slate-900 p-10 sm:p-12 border-8 border-double border-[#b38e44]/40"
              style={{
                boxShadow: 'inset 0 0 100px rgba(179, 142, 68, 0.05)'
              }}
            >
              {/* Inner guilloche border frame */}
              <div className="border-2 border-[#b38e44]/60 p-6 sm:p-8 rounded-lg relative overflow-hidden">
                
                {/* Watermark seal behind */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
                  <div className="w-96 h-96 rounded-full border-8 border-slate-900 flex items-center justify-center">
                    <ShieldCheck className="w-72 h-72 text-slate-900" />
                  </div>
                </div>

                {/* Certificate Header */}
                <div className="text-center relative z-10 space-y-2">
                  {/* Institutional Crest */}
                  <div className="flex justify-center mb-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#997328] to-[#cba657] p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full bg-[#fcfbf7] rounded-full flex items-center justify-center">
                        <Award className="w-8 h-8 text-[#997328]" />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm tracking-[0.25em] uppercase font-bold text-[#8c6b24]">
                    {certificate.issuingInstitution}
                  </div>

                  <h1 className="font-cinzel text-3xl sm:text-4xl font-black tracking-wider text-slate-900 uppercase pt-1">
                    CERTIFICATE OF {certificate.achievementType.toUpperCase()}
                  </h1>

                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#b38e44] to-transparent mx-auto my-3" />

                  <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
                    THIS IS TO PROUDLY CERTIFY THAT
                  </p>
                </div>

                {/* Recipient Name - prominent as in diagram */}
                <div className="text-center my-6 relative z-10">
                  <div className="font-cinzel text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-wide underline decoration-[#b38e44]/40 underline-offset-8">
                    {certificate.studentName}
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-2 font-medium">
                    Registration / Student ID: <span className="font-bold text-slate-900">{certificate.studentId}</span>
                  </div>
                </div>

                {/* Conferred Details */}
                <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10 text-sm text-slate-700 leading-relaxed">
                  <p>
                    has successfully presented and demonstrated exceptional technical excellence in
                  </p>
                  <p className="font-bold text-slate-900 text-lg tracking-wide uppercase">
                    {certificate.eventName}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 italic">
                    {certificate.degreeOrCourse}
                  </p>
                  {certificate.gradeOrScore && (
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#b38e44]/15 border border-[#b38e44]/30 text-xs font-bold text-[#8c6b24]">
                      {certificate.gradeOrScore}
                    </div>
                  )}
                </div>

                {/* Lower Section: Signatures & Traditional Bottom Info */}
                <div className="mt-10 pt-6 border-t border-[#b38e44]/30 grid grid-cols-3 items-end gap-4 relative z-10">
                  {/* Signatory Left */}
                  <div className="text-left space-y-1">
                    <div className="font-signature text-3xl sm:text-4xl text-[#1a2e3b] font-medium pl-1">
                      {certificate.issuerName || 'Dr. N. MALA'}
                    </div>
                    <div className="w-44 border-b border-slate-700/80 mb-1" />
                    <div className="text-xs font-bold text-slate-900 uppercase">
                      {certificate.issuerName}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-700 leading-tight">
                      {certificate.issuerTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Date: {certificate.issueDate}
                    </div>
                  </div>

                  {/* Center Traditional Seal */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#b38e44] flex items-center justify-center p-1 bg-[#fcfbf7] shadow-inner">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#997328] to-[#cba657] flex flex-col items-center justify-center text-white p-1">
                        <ShieldCheck className="w-5 h-5 text-amber-200" />
                        <span className="text-[8px] font-black uppercase tracking-tight">AUTHENTIC</span>
                        <span className="text-[7px] tracking-wider text-amber-100">BLOCKCHAIN</span>
                      </div>
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                      SEAL #{certificate.id}
                    </div>
                  </div>

                  {/* Right Placeholder Space if QR is positioned elsewhere */}
                  <div className="text-right text-[10px] text-slate-600 font-mono">
                    KOVAI KALAIMAGAL COLLEGE OF ARTS AND SCIENCE &bull; Autonomous
                  </div>
                </div>

                {/* Cryptographic Ledger Proof Footer */}
                <div className="mt-6 pt-3 border-t border-slate-300 text-[9px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">SHA-256 HASH:</span>
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800">
                      {certificate.certificateHash ? truncateHash(certificate.certificateHash, 10, 6) : 'Mined'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">IPFS CID:</span>
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-indigo-900">
                      {truncateHash(certificate.ipfsCid, 10, 6)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">BLOCK:</span>
                    <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                      #{certificate.blockNumber}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DYNAMICALLY STAMPED QR CODE ELEMENT (Overlaid at exact xPercent, yPercent) */}
          <div
            className={`absolute z-30 transition-all ${
              activeView === 'customize' ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-black cursor-move' : ''
            }`}
            style={{
              left: `${qrConfig.xPercent}%`,
              top: `${qrConfig.yPercent}%`,
              transform: 'translate(-10%, -10%)'
            }}
          >
            <div
              className={`p-2.5 rounded-2xl shadow-2xl flex flex-col items-center transition ${
                qrConfig.style === 'gold'
                  ? 'bg-white text-slate-900 border-2 border-[#b38e44] shadow-amber-900/20'
                  : qrConfig.style === 'dark'
                  ? 'bg-slate-950 text-white border-2 border-emerald-500/80 shadow-emerald-950/50'
                  : qrConfig.style === 'clean'
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-xl'
                  : 'bg-transparent text-slate-900'
              }`}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Dynamic Verification QR Code"
                  style={{ width: `${qrConfig.size}px`, height: `${qrConfig.size}px` }}
                  className="object-contain block pointer-events-none"
                />
              ) : (
                <div 
                  style={{ width: `${qrConfig.size}px`, height: `${qrConfig.size}px` }}
                  className="bg-slate-100 flex items-center justify-center text-xs text-slate-400"
                >
                  Generating QR...
                </div>
              )}

              {qrConfig.showLabel && (
                <div className="mt-1.5 text-center leading-tight">
                  <div className={`text-[9px] font-black uppercase tracking-wider flex items-center justify-center space-x-1 ${
                    qrConfig.style === 'dark' ? 'text-emerald-400' : 'text-slate-900'
                  }`}>
                    <QrCode className="w-2.5 h-2.5" />
                    <span>VERIFICATION QR</span>
                  </div>
                  {qrConfig.showHash && (
                    <div className="text-[8px] font-mono font-bold text-slate-700 mt-0.5 max-w-[130px] truncate" title={certificate.id}>
                      {certificate.id}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hint tag when in custom positioning mode */}
            {activeView === 'customize' && (
              <div className="no-print -mt-1 bg-teal-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded text-center shadow">
                QR Position Anchor
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helpful Stamping & Next Steps Ribbon */}
      <div className="no-print bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">QR Code Stamped &amp; Ready for Audit</h4>
            <p className="text-xs text-slate-400">
              The QR code links directly to Step 3 &amp; 4. Anyone (HR, employers, verifiers) scanning it triggers immediate blockchain consensus verification.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>{copySuccess ? 'Link Copied!' : 'Copy Verify URL'}</span>
          </button>

          <button
            onClick={() => onVerify(certificate)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20 whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Proceed to Step 3 Verification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
