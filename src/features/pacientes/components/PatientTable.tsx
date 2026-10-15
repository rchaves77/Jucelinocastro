import React from 'react';
import { Patient } from '../../../types';
import { DropdownMenu, DropdownItem } from '../../../components/common/DropdownMenu';
import { Eye, Edit, Printer, UserX, Phone, FileText, MessageCircle, Star } from 'lucide-react';
import { openWhatsApp } from '../../../utils/whatsappMessages';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onZoomImage: (title: string, url: string) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
  onEditPatient,
  onZoomImage,
}) => {
  const handleOpenWhatsApp = (patient: Patient, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const firstName = patient.name ? patient.name.split(' ')[0] : 'Paciente';
    const text = `Olá, ${firstName}! Tudo bem? Falo da Jucelino Castro Fisioterapia.`;
    openWhatsApp({
      phone: patient.phone,
      text,
    });
  };

  const handleSendGoogleReview = (patient: Patient, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nameToUse = patient.name ? patient.name.split(' ')[0] : 'Paciente';
    const text = `Olá, ${nameToUse}! Tudo bem? Gostaria de saber como foi sua experiência no tratamento na Jucelino Castro Fisioterapia. Poderia avaliar nosso atendimento no Google? Link: https://maps.app.goo.gl/TmRZvfBndpP6XB3A6`;
    openWhatsApp({
      phone: patient.phone,
      text,
    });
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Paciente</th>
              <th className="px-4 py-3.5">CPF & Contato</th>
              <th className="px-4 py-3.5">Fisioterapeuta</th>
              <th className="px-4 py-3.5">Queixa Principal</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {patients.map((patient) => {
              const dropdownItems: DropdownItem[] = [
                {
                  label: 'Enviar WhatsApp (App/Web)',
                  icon: <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />,
                  onClick: () => handleOpenWhatsApp(patient),
                },
                {
                  label: 'Convidar p/ Avaliação Google (WhatsApp)',
                  icon: <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />,
                  onClick: () => handleSendGoogleReview(patient),
                },
                {
                  label: 'Ver Prontuário Eletrônico',
                  icon: <Eye className="h-3.5 w-3.5" />,
                  onClick: () => onSelectPatient(patient),
                },
                {
                  label: 'Editar Cadastro',
                  icon: <Edit className="h-3.5 w-3.5" />,
                  onClick: () => onEditPatient(patient),
                },
                {
                  label: 'Imprimir Ficha',
                  icon: <Printer className="h-3.5 w-3.5" />,
                  onClick: () => alert(`Gerando ficha cadastral de ${patient.name}...`),
                },
                {
                  label: 'Inativar Paciente',
                  icon: <UserX className="h-3.5 w-3.5 text-rose-400" />,
                  variant: 'danger',
                  onClick: () => alert(`Paciente ${patient.name} arquivado.`),
                },
              ];

              return (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-800/60 transition-colors group cursor-pointer"
                  onClick={() => onSelectPatient(patient)}
                >
                  {/* Photo Thumbnail + Name */}
                  <td className="px-4 py-3.5 font-medium text-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.photoUrl}
                        alt={patient.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onZoomImage(`Foto: ${patient.name}`, patient.photoUrl);
                        }}
                        className="h-9 w-9 rounded-full object-cover border border-slate-700 shadow-sm hover:ring-2 hover:ring-emerald-400 transition-all cursor-zoom-in"
                        title="Clique para dar zoom na foto"
                      />
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{patient.gender}</div>
                      </div>
                    </div>
                  </td>

                  {/* CPF & Phone */}
                  <td className="px-4 py-3.5">
                    <div className="font-mono text-[11px] text-slate-300 font-semibold">{patient.cpf}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-500" />
                        {patient.phone}
                      </span>
                      <button
                        onClick={(e) => handleOpenWhatsApp(patient, e)}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        title="Enviar WhatsApp direto"
                      >
                        <MessageCircle className="h-2.5 w-2.5" />
                        <span>Whats</span>
                      </button>
                      <button
                        onClick={(e) => handleSendGoogleReview(patient, e)}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 transition-colors"
                        title="Enviar convite de Avaliação do Google no WhatsApp"
                      >
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        <span>Avaliar Google</span>
                      </button>
                    </div>
                  </td>

                  {/* Assigned Physio */}
                  <td className="px-4 py-3.5 font-medium text-slate-200">
                    {patient.assignedPhysioName}
                  </td>

                  {/* Main Complaint */}
                  <td className="px-4 py-3.5 max-w-xs truncate text-slate-400">
                    {patient.mainComplaint}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        patient.status === 'Ativo'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : patient.status === 'Em Pausa'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu items={dropdownItems} id={`pat-menu-${patient.id}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
