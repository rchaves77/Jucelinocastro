import React from 'react';
import { Patient } from '../../../types';
import { Eye, Pencil, Trash2, User } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (p: Patient) => void;
  onEditPatient: (p: Patient) => void;
  onDeletePatient?: (p: Patient) => void;
  onZoomImage: (title: string, url: string, category?: string, date?: string, notes?: string) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
  onEditPatient,
  onDeletePatient,
  onZoomImage,
}) => {
  if (!patients || patients.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
        <User className="h-10 w-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-300">Nenhum paciente encontrado</p>
        <p className="text-xs text-slate-500 mt-1">
          Ajuste os filtros ou cadastre um novo paciente.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Paciente
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                CPF
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                Telefone
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                Fisioterapeuta
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelectPatient(patient)}
                    className="flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <img
                      src={
                        patient.photoUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={patient.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (patient.photoUrl) {
                          onZoomImage(patient.name, patient.photoUrl, 'Paciente');
                        }
                      }}
                      className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                        {patient.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{patient.email}</p>
                    </div>
                  </button>
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-slate-300 font-mono">{patient.cpf}</span>
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-slate-300 font-mono">{patient.phone}</span>
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-slate-300">{patient.assignedPhysioName}</span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      patient.status === 'Ativo'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : patient.status === 'Inativo'
                        ? 'bg-slate-700 text-slate-300 border border-slate-600'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      title="Abrir prontuário"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onEditPatient(patient)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
                      title="Editar paciente"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {onDeletePatient && (
                      <button
                        onClick={() => onDeletePatient(patient)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Excluir prontuário"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
