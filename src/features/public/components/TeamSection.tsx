import React from 'react';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  HeartHandshake,
  Building2,
} from 'lucide-react';
import { TEAM_MEMBERS, CLINIC_VALUES } from '../data/teamData';
import { CLINIC_INFO } from '../data/servicesData';
import { ClinicLogo } from '../../../components/common/ClinicLogo';

interface TeamSectionProps {
  whatsappUrl: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ whatsappUrl }) => {
  return (
    <section id="equipe" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f]">
            <Users className="h-4 w-4 text-[#dc2626]" />
            <span>Corpo Clínico & Estrutura</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Excelência Médica e Cuidado Humanizado
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Conheça os profissionais dedicados à sua recuperação integral, liderados pelo Dr. Jucelino Castro em Rio Branco/AC.
          </p>
        </div>

        {/* Lead Doctor Spotlight Card (Dr. Jucelino Castro) */}
        {TEAM_MEMBERS.filter((m) => m.isLead).map((lead) => (
          <div
            key={lead.id}
            className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-4 relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border border-slate-200 shadow-md">
                <img
                  src={lead.imageUrl}
                  alt={lead.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback to high quality medical portrait if local file is pending
                    const target = e.currentTarget;
                    if (target.src !== 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80') {
                      target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#0f3e8f] text-white p-3 rounded-2xl shadow-lg border-2 border-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-300" />
                <div className="text-left">
                  <div className="text-xs font-black">15+ Anos</div>
                  <div className="text-[10px] text-blue-200">Experiência Clínica</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0f3e8f] text-xs font-bold border border-blue-200">
                  {lead.crefito}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 pt-2">
                  {lead.name}
                </h3>
                <div className="text-xs sm:text-sm font-bold text-[#b91c1c]">
                  {lead.role}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {lead.bio}
              </p>

              {/* Specialties */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Áreas de Especialização Principal:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lead.specialties.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <CheckCircle2 className="h-4 w-4 text-[#dc2626] shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`${whatsappUrl}&text=Olá Dr. Jucelino Castro, gostaria de agendar uma avaliação na clínica.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#0f3e8f] hover:bg-[#0c2f6d] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Agendar Avaliação com o Dr. Jucelino
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Other Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEAM_MEMBERS.filter((m) => !m.isLead).map((member) => (
            <div
              key={member.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-xs">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = member.id === 'dra-leticia'
                      ? 'https://images.unsplash.com/photo-1594824813581-2a7e7bc8c242?auto=format&fit=crop&w=800&q=80'
                      : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80';
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
              </div>

              <div className="space-y-2.5 flex-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {member.crefito}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-1">
                    {member.name}
                  </h4>
                  <div className="text-xs font-bold text-[#0f3e8f]">
                    {member.role}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {member.bio}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {member.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0f3e8f] text-[10px] font-semibold border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinic Values & Infrastructure Bento */}
        <div className="pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <h3 className="text-xl font-black text-slate-900">
              Nossos Compromissos com Você
            </h3>
            <p className="text-xs text-slate-600">
              Padrões clínicos que garantem segurança e resolutividade em cada atendimento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLINIC_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 text-left hover:border-blue-300 transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0f3e8f] flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5 text-[#0f3e8f]" />
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  {val.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
