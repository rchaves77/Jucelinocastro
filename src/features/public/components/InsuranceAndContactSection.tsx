import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { CONTACT, buildWhatsAppLink } from '../../../config/contact';

export const InsuranceAndContactSection: React.FC<{ whatsappUrl?: string }> = () => {
  const insurances = ['CASSI', 'FUSEX', 'GEAP', 'CBMAC', 'REEMBOLSO'];

  const whatsappContact = buildWhatsAppLink(
    'Olá! Vim pelo site e gostaria de saber sobre convênios e agendamento.'
  );

  return (
    <section id="contato" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-10"
          >
            <div>
              <span className="text-red-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
                Facilidades
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-6">
                Atendimento e <br />
                <span className="text-red-600">Convênios.</span>
              </h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                Aceitamos os principais planos de saúde e oferecemos sistema de reembolso com nota
                fiscal e laudo clínico detalhado.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {insurances.map((ins, i) => (
                <motion.div
                  key={ins}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2.5 group hover:bg-slate-900 hover:border-slate-900 transition-all cursor-default"
                >
                  <ShieldCheck size={16} className="text-red-600" />
                  <span className="text-[11px] font-bold text-slate-700 group-hover:text-white uppercase tracking-widest">
                    {ins}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.a
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              title="Abrir localização no Google Maps"
            >
              <iframe
                title="Localização Jucelino Castro Fisioterapia"
                src="https://www.google.com/maps?q=Rua+Quintino+Bocaiuva,+1848,+Bosque,+Rio+Branco+-+AC,+69900-670&output=embed"
                className="w-full h-64 border-0 pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-white/95 backdrop-blur px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-4 w-4 text-red-600 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-800 truncate">
                    Rua Quintino Bocaiuva, 1848 — Bosque
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-900 shrink-0">
                  Abrir
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="bg-slate-900 rounded-[40px] sm:rounded-[60px] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10 space-y-8">

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-600/40">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black tracking-tighter mb-2">Onde estamos</h4>
                  <a
                    href={CONTACT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 text-sm leading-relaxed hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
                  >
                    Rua Quintino Bocaiuva, 1848, Bosque
                    <br />
                    Rio Branco - AC, 69900-670
                  </a>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/40">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black tracking-tighter mb-2">WhatsApp</h4>
                  <a
                    href={whatsappContact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white text-sm font-bold hover:text-emerald-400 transition-colors"
                  >
                    {CONTACT.whatsappDisplay}
                  </a>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700">
                  <Phone size={22} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black tracking-tighter mb-2">Telefone Fixo</h4>
                  <a
                    href={CONTACT.landlineUrl}
                    className="text-slate-300 text-sm hover:text-white transition-colors"
                  >
                    {CONTACT.landlineDisplay}
                  </a>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-700">
                  <Clock size={22} className="text-red-500" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black tracking-tighter mb-2">Horário</h4>
                  <p className="text-slate-300 text-sm">Seg a Sex: 07:30 às 18:00</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={whatsappContact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-emerald-500 w-full py-5 rounded-2xl font-black text-base text-slate-950 hover:bg-emerald-400 active:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
                >
                  <MessageCircle size={20} fill="currentColor" />
                  AGENDAR NO WHATSAPP
                </a>

                <a
                  href={CONTACT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-2 border-slate-700 w-full py-4 rounded-2xl font-bold text-xs text-slate-200 hover:bg-slate-800 hover:text-white active:bg-slate-800 active:text-white transition-all"
                >
                  <Navigation size={16} />
                  COMO CHEGAR
                </a>
              </div>
            </div>

            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
