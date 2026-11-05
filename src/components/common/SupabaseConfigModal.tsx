import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, X, Terminal, Server } from 'lucide-react';
import { isSupabaseConfigured, SUPABASE_SQL_SETUP } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Banco de Dados em Nuvem (Supabase)</h3>
              <p className="text-xs text-slate-400">Armazenamento em Nuvem Seguro para Pacientes, Prontuários e Agendamentos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-5 rounded-2xl border p-4 transition-all">
          {isSupabaseConfigured ? (
            <div className="flex items-center gap-3 border-emerald-500/30 bg-emerald-500/10 p-3 rounded-xl text-emerald-300">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-xs text-emerald-300">Supabase Nuvem Ativo & Conectado!</p>
                <p className="text-[11px] text-emerald-400/80">Os dados dos pacientes e agendamentos estão sincronizados na nuvem.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 border-amber-500/30 bg-amber-500/10 p-3 rounded-xl text-amber-300">
              <AlertCircle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-amber-300">Supabase Aguardando Variáveis de Ambiente</p>
                <p className="text-[11px] text-amber-400/80">
                  Os dados estão mantidos com salvamento seguro local e prontos para sincronizar assim que preencher as chaves do Supabase em <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-200">.env.example</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              Script de Inicialização SQL (Supabase Query Editor)
            </span>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copied ? 'Copiado!' : 'Copiar Script SQL'}</span>
            </button>
          </div>

          <pre className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 p-3 text-[11px] font-mono text-emerald-400 border border-slate-800 leading-relaxed">
            {SUPABASE_SQL_SETUP}
          </pre>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline"
            >
              <span>Abrir Painel Supabase</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={onClose}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
