import React, { useState } from 'react';
import { X, Printer, ShieldCheck, Copy, Check, ExternalLink, Calendar, Clock, UserCheck, Award } from 'lucide-react';
import { AttendanceCertificate } from '../../../types';
import { QRCode } from '../../../components/common/QRCode';
import { ClinicLogo } from '../../../components/common/ClinicLogo';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: AttendanceCertificate | null;
  onOpenValidation?: (code: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  onOpenValidation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const validationLink = certificate.validationUrl || `${window.location.origin}?validar=${certificate.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(validationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date nicely (DD/MM/YYYY)
  const formatDateBR = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) return `${day}/${month}/${year}`;
    } catch (e) {}
    return dateStr;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-6 relative max-h-[92vh] overflow-y-auto print:max-h-none print:bg-white print:text-black print:p-8 print:shadow-none print:border-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Award className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Declaração de Comparecimento
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  Emitida
                </span>
              </h2>
              <p className="text-xs text-slate-400">Comprovante de presença com QR Code e link de validação digital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div
          id="printable-certificate-area"
          className="rounded-2xl border border-slate-800 bg-slate-950/60 p-7 sm:p-8 space-y-5 print:space-y-4 print:border-2 print:border-slate-400 print:bg-white print:text-slate-900 print:p-6 print:m-0 print:rounded-none"
        >
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center justify-center text-center border-b border-slate-800 print:border-slate-300 pb-4 print:pb-3 space-y-1.5">
            <ClinicLogo variant="certificate" className="mb-0.5 max-h-12 print:max-h-11" />
            <div>
              <h1 className="text-lg sm:text-xl font-black text-emerald-400 print:text-emerald-800 tracking-wider uppercase">
                JUCELINO CASTRO FISIOTERAPIA
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-700 font-medium">
                Clínica de Fisioterapia Ortopédica, Traumatologia & Pilates Clínico
              </p>
              <p className="text-[11px] text-slate-500 print:text-slate-600 font-mono">
                CNPJ: 24.868.183/0001-20 • Fone: (68) 99244-9425
              </p>
              <p className="text-[10px] text-slate-500 print:text-slate-600">
                R. Quintino Bocaiuva, 1848 - Bosque, Rio Branco - AC, 69900-670
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-1">
            <h2 className="text-base sm:text-lg font-bold uppercase text-slate-100 print:text-slate-900 tracking-widest border-b-2 border-emerald-500 inline-block pb-0.5">
              DECLARAÇÃO DE COMPARECIMENTO
            </h2>
          </div>

          {/* Certificate Official Text */}
          <div className="text-xs sm:text-sm leading-relaxed text-slate-300 print:text-slate-900 text-justify px-1 sm:px-2 py-2 print:py-1 space-y-3 print:space-y-2.5">
            <p>
              Declaramos, para os devidos fins de comprovação de presença junto a órgãos trabalhistas, educacionais ou
              administrativos, que o(a) paciente <strong className="text-emerald-300 print:text-slate-950 font-bold underline decoration-emerald-500">{certificate.patientName}</strong>, inscrito(a) sob o CPF nº <strong className="text-slate-100 print:text-slate-950 font-mono">{certificate.patientCpf}</strong>, compareceu a esta unidade de atendimento no dia <strong className="text-slate-100 print:text-slate-950">{formatDateBR(certificate.appointmentDate)}</strong>, no período das <strong className="text-slate-100 print:text-slate-950">{certificate.timeSlot}</strong>.
            </p>

            <p>
              O paciente esteve sob cuidados fisioterapêuticos do(a) profissional <strong className="text-slate-100 print:text-slate-950">{certificate.physioName}</strong> ({certificate.physioCrefito || 'CREFITO-3/184920-F'}), sendo a presente declaração expedida sob responsabilidade do setor de recepção por <strong className="text-slate-100 print:text-slate-950">{certificate.receptionistName}</strong>.
            </p>
          </div>

          {/* QR Code & Digital Signature Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center border-t border-slate-800 print:border-slate-300 pt-4 print:pt-3">
            
            {/* QR Code Box */}
            <div className="flex items-center gap-3 bg-slate-900 print:bg-slate-50 p-3 rounded-2xl border border-slate-800 print:border-slate-300">
              <QRCode value={validationLink} size={92} className="shrink-0 print:w-[84px] print:h-[84px]" />
              <div className="space-y-1 text-xs">
                <span className="flex items-center gap-1 font-bold text-emerald-400 print:text-emerald-800 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5" /> Autenticidade Digital
                </span>
                <p className="text-[10px] text-slate-400 print:text-slate-600 leading-tight">
                  Escaneie o QR Code ao lado ou acesse o validador para verificar este documento em tempo real:
                </p>
                <div className="font-mono text-[9px] bg-slate-950 print:bg-white p-1 rounded border border-slate-800 print:border-slate-300 text-slate-300 print:text-slate-800 break-all font-semibold">
                  CÓDIGO: <span className="text-emerald-400 print:text-emerald-800">{certificate.id}</span>
                </div>
                <a
                  href={validationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (onOpenValidation) {
                      e.preventDefault();
                      onOpenValidation(certificate.id);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 print:text-emerald-800 underline cursor-pointer"
                  title="Clique para validar esta declaração diretamente no sistema"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span>Validar Online no Sistema</span>
                </a>
              </div>
            </div>

            {/* Signatures */}
            <div className="text-center space-y-4 print:space-y-3 pt-1">
              <div className="border-t border-slate-700 print:border-slate-400 pt-1.5 w-4/5 mx-auto">
                <p className="font-bold text-xs text-slate-200 print:text-slate-950">{certificate.receptionistName}</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">Recepção & Validação Geral</p>
              </div>

              <div className="border-t border-slate-700 print:border-slate-400 pt-1.5 w-4/5 mx-auto">
                <p className="font-bold text-xs text-slate-200 print:text-slate-950">{certificate.physioName}</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">{certificate.physioCrefito || 'CREFITO-3/184920-F'}</p>
              </div>
            </div>

          </div>

          {/* Footer Timestamp */}
          <div className="text-center text-[9px] text-slate-500 print:text-slate-500 pt-1.5 border-t border-slate-800/50 print:border-slate-200 font-mono">
            Documento emitido digitalmente em {new Date(certificate.issuedAt).toLocaleString('pt-BR')} • Válido em todo o território nacional
          </div>
        </div>

        {/* Footer Link & Actions Bar (Hidden on print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800 print:hidden text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link de Validação'}</span>
            </button>

            {onOpenValidation && (
              <button
                onClick={() => onOpenValidation(certificate.id)}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-emerald-400 hover:bg-emerald-500/20 transition-colors font-semibold"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Testar Validador</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Link direto: <span className="font-mono text-emerald-400 underline">{certificate.id}</span>
          </p>
        </div>

      </div>
    </div>
  );
};
