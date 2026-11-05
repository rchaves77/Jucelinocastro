export const CONTACT = {
  whatsappNumber: '5568992449425',
  whatsappDisplay: '(68) 99244-9425',
  whatsappUrl: 'https://wa.me/5568992449425',

  landlineNumber: '556832236165',
  landlineDisplay: '(68) 3223-6165',
  landlineUrl: 'tel:+556832236165',

  instagram: 'https://www.instagram.com/jucelinocastrofisioterapia/',
  mapsUrl: 'https://maps.app.goo.gl/TmRZvfBndpP6XB3A6',
  address: 'Rua Quintino Bocaiuva, 1848 - Bosque, Rio Branco - AC, 69900-670',
} as const;

export const HOURS = {
  weekdays: 'Seg a Sex: 07:30 às 18:00',
  lunchBreak: 'Almoço: 11:30 às 13:30',
  saturday: 'Sábado: 07:30 às 11:00',
  sunday: 'Domingo: Fechado',
  full: 'Seg a Sex: 07:30 às 18:00 • Sáb: 07:30 às 11:00',
} as const;

/** Slots de 30 min — manhã (todos os dias úteis, inclusive sábado) */
export const MORNING_SLOTS = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
];

/** Slots de 30 min — tarde (seg–sex titular + encaixe; sábado apenas encaixe) */
export const AFTERNOON_SLOTS = [
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

/** Limite de agendamentos por horário: 1 titular + 1 encaixe. */
export const SLOT_CAPACITY = {
  titular: 1,
  encaixe: 1,
} as const;

export interface SlotConfig {
  /** Slots exibidos na grade. */
  morning: string[];
  afternoon: string[];
  /** Se o horário aceita agendamento titular. */
  allowTitular: boolean;
  /** Se o horário aceita encaixe. */
  allowEncaixe: boolean;
  /** Texto de aviso para a grade, quando houver. */
  notice?: string;
}

/**
 * Retorna a configuração de slots para uma data (YYYY-MM-DD).
 * Sábado: manhã com titular + encaixe, tarde apenas encaixe.
 * Domingo: fechado.
 */
export function getSlotConfig(dateISO: string): SlotConfig {
  const day = new Date(`${dateISO}T00:00:00`).getDay();

  if (day === 0) {
    return {
      morning: [],
      afternoon: [],
      allowTitular: false,
      allowEncaixe: false,
      notice: 'Domingo: clínica fechada.',
    };
  }

  if (day === 6) {
    return {
      morning: MORNING_SLOTS,
      afternoon: AFTERNOON_SLOTS,
      allowTitular: true,
      allowEncaixe: true,
      notice:
        'Sábado: manhã com titular e encaixe. À tarde a agenda fica aberta apenas para encaixes.',
    };
  }

  return {
    morning: MORNING_SLOTS,
    afternoon: AFTERNOON_SLOTS,
    allowTitular: true,
    allowEncaixe: true,
  };
}

/** Compatibilidade: retorna apenas os arrays de slots. */
export function getSlotsForDate(dateISO: string): { morning: string[]; afternoon: string[] } {
  const { morning, afternoon } = getSlotConfig(dateISO);
  return { morning, afternoon };
}

/** Verifica se a clínica abre na data informada. */
export function isOpenOn(dateISO: string): boolean {
  return new Date(`${dateISO}T00:00:00`).getDay() !== 0;
}

export function buildWhatsAppLink(message?: string): string {
  const base = CONTACT.whatsappUrl;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
