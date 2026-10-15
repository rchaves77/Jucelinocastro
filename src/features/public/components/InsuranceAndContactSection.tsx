import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  FileText,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Instagram,
  Navigation,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/servicesData';

interface InsuranceAndContactSectionProps {
  whatsappUrl: string;
}

export const InsuranceAndContactSection: React.FC<InsuranceAndContactSectionProps> = ({
  whatsappUrl,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const insurances = [
    { name: 'CASSI', desc: 'Convênio Banco do Brasil', badge: 'Atendimento Direto' },
    { name: 'FuSEx', desc: 'Fundo de Saúde do Exército', badge: 'Atendimento Direto' },
    { name: 'Polícia Militar / Bombeiros', desc: 'Convênio Forças de Segurança AC', badge: 'Atendimento Direto' },
    { name: 'GEAP Saúde', desc: 'Fundação de Seguridade Social', badge: 'Atendimento Direto' },
    { name: 'Reembolso com Laudo', desc: 'Bradesco, SulAmérica, Unimed, Amil e outros', badge: 'Emitimos Nota & Laudo' },
  ];

  const faqs = [
    {
      q: 'Preciso de encaminhamento médico para iniciar a fisioterapia?',
      a: 'Não é obrigatório para consultas particulares ou avaliação biomecânica inicial. O fisioterapeuta é um profissional de primeiro contato habilitado a diagnosticar disfunções cinético-funcionais. Para convênios com cobertura direta, o pedido médico pode ser solicitado pelas operadoras.',
    },
    {
      q: 'Quantas sessões costumam ser necessárias para aliviar a hérnia de disco?',
      a: 'Com as técnicas de tratamento manipulativo e descompressão, a maioria dos pacientes relata alívio significativo da dor já entre a 2ª e a 5ª sessão. O ciclo completo inclui o fortalecimento estabilizador para evitar que a dor retorne.',
    },
    {
      q: 'Qual o horário de atendimento da clínica?',
      a: 'Atendemos de Segunda a Sexta-feira em dois turnos: das 07:30 às 11:30 e das 13:30 às 18:00. Aos Sábados atendemos das 07:30 às 11:00. Domingos permanecemos fechados. Todos os atendimentos são realizados com hora marcada.',
    },
    {
      q: 'Como funciona o sistema de reembolso para outros convênios?',
      a: 'Fornecemos recibo oficial com CNPJ, número de CREFITO do fisioterapeuta, laudo detalhado e relatório de evolução clínica com todos os códigos necessários para que você solicite o reembolso integral ou parcial junto ao seu plano.',
    },
  ];

  return (
    <section id="contato" className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Insurance Section */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f]">
              <CreditCard className="h-4 w-4 text-[#dc2626]" />
              <span>Facilidades de Atendimento</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Convênios Atendidos & Sistema de Reembolso
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Aceitamos os principais convênios de Rio Branco/AC e oferecemos suporte documental completo para reembolso.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {insurances.map((ins, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-all text-center space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="text-base font-black text-[#0f3e8f]">{ins.name}</div>
                  <div className="text-xs text-slate-600 leading-tight">{ins.desc}</div>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-[#dc2626] text-[11px] font-bold border border-slate-200 shadow-2xs">
                    {ins.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Map Box + FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 border-t border-slate-200 items-start">
          
          {/* Left: Contact Info & Address */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0f3e8f] uppercase tracking-wider">
                Canais de Atendimento & Endereço
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Jucelino Castro Fisioterapia
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Atendimento pontual com hora marcada no bairro Bosque em Rio Branco.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Primary Mobile / WhatsApp Contact Card (Destaque Google Meu Negócio) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-emerald-400 shadow-md space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <PhoneCall className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Canal Principal • Celular & WhatsApp</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                        {CLINIC_INFO.whatsappPhone}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Agendamentos, triagem rápida, dúvidas de convênio e atendimento direto com a clínica.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={`tel:${CLINIC_INFO.whatsappRaw}`}
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-950/20 active:scale-98 transition-all"
                    title="Ligar agora para o celular"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Ligar no Celular</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-950/20 active:scale-98 transition-all"
                    title="Chamar no WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-white" />
                    <span>Chamar no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Address & Georeferencing Card (Google Maps / Georreferenciamento) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#dc2626] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Endereço & Georreferenciamento</div>
                      <span className="text-[10px] font-mono bg-blue-100 text-[#0f3e8f] font-bold px-2 py-0.5 rounded-md">
                        GPS Ativo
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {CLINIC_INFO.address}
                    </div>
                    <div className="text-xs text-slate-600">
                      Bairro Bosque • Rio Branco - AC • CEP {CLINIC_INFO.cep}
                    </div>
                  </div>
                </div>

                {/* Exibição Técnica de Coordenadas Geográficas Solicitadas */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center gap-2 text-[11px] text-slate-700 font-bold">
                    <Compass className="h-3.5 w-3.5 text-[#0f3e8f]" />
                    <span>Coordenadas Georreferenciadas (WGS84):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400">Lat (S): </span>
                      <strong className="text-slate-800 font-semibold">-9.959388</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Lon (W): </span>
                      <strong className="text-slate-800 font-semibold">-67.810929</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-0.5 border-t border-slate-100">
                    Perfil Google Meu Negócio ID: <strong>08626748824869890584</strong>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={CLINIC_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-[#0f3e8f] hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5 text-[#0f3e8f]" />
                    <span>Abrir Perfil no Google Maps</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0f3e8f] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Horário de Atendimento</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-900 block text-xs">Segunda a Sexta-feira:</span>
                        <div className="mt-1 space-y-0.5 text-slate-700 font-semibold">
                          <div>🌅 Manhã: 07:30 – 11:30</div>
                          <div>🌇 Tarde: 13:30 – 18:00</div>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-900 block text-xs">Sábado</span>
                        <div className="mt-1 space-y-0.5">
                          <div className="text-slate-800 font-bold">🌅 Sábado: 07:30 – 11:00</div>
                          <div className="text-slate-400">🚫 Domingo: Fechado</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Channels: Landline + Instagram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Landline */}
                <a
                  href={`tel:${CLINIC_INFO.landlinePhone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0f3e8f] transition-all cursor-pointer"
                >
                  <Phone className="h-5 w-5 text-[#0f3e8f] shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-slate-500 font-bold">Telefone Fixo</div>
                    <div className="text-xs font-black text-slate-900 truncate">{CLINIC_INFO.landlinePhone}</div>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href={CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-pink-50 border border-pink-200 hover:border-pink-500 transition-all cursor-pointer"
                >
                  <Instagram className="h-5 w-5 text-pink-600 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[10px] text-pink-800 font-bold">Instagram</div>
                    <div className="text-xs font-black text-pink-950 truncate">{CLINIC_INFO.instagramHandle}</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Direct CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 text-center rounded-2xl bg-[#0f3e8f] hover:bg-[#0c2f6d] text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              Falar com a Recepção no WhatsApp
            </a>
          </div>

          {/* Right: Interactive FAQ */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="space-y-1 mb-4">
              <span className="text-xs font-bold text-[#dc2626] uppercase tracking-wider">
                Dúvidas Frequentes
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Perguntas e Respostas Rápidas
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-[#0f3e8f] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform text-slate-400 ${
                        openFaq === index ? 'rotate-180 text-[#0f3e8f]' : ''
                      }`}
                    />
                  </button>

                  {openFaq === index && (
                    <div className="p-4 pt-0 text-sm text-slate-700 leading-relaxed border-t border-slate-200/50 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Google Rating Verification Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between gap-4 mt-6">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">
                  Avaliado com Nota 5.0 no Google
                </div>
                <div className="text-xs text-slate-600">
                  Mais de 180 avaliações de pacientes verificados em Rio Branco.
                </div>
              </div>
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shrink-0 cursor-pointer"
              >
                Ver no Mapa
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
