export type WhatsAppMode = 'windows' | 'web' | 'universal';

/**
 * Calculates the recommended next confirmation target date:
 * - If today is Saturday (6), target is next Monday (+2 days)
 * - If today is Sunday (0), target is Monday (+1 day)
 * - If today is Friday (5), target is Monday (+3 days) or Saturday (+1 day)
 * - Otherwise (Monday-Thursday), target is tomorrow (+1 day)
 */
export function getSuggestedConfirmationTargetDate(baseDate: Date = new Date()): {
  targetDateStr: string;
  isMonday: boolean;
  isSaturday: boolean;
  dayLabel: string;
  formattedTargetDate: string;
} {
  const currentDayOfWeek = baseDate.getDay(); // 0 = Sun, 6 = Sat
  let daysToAdd = 1;

  if (currentDayOfWeek === 6) {
    // Saturday -> Monday
    daysToAdd = 2;
  } else if (currentDayOfWeek === 0) {
    // Sunday -> Monday
    daysToAdd = 1;
  } else if (currentDayOfWeek === 5) {
    // Friday -> next Monday
    daysToAdd = 3;
  }

  const targetDate = new Date(baseDate);
  targetDate.setDate(targetDate.getDate() + daysToAdd);

  const targetDateStr = targetDate.toISOString().split('T')[0];
  const isMonday = targetDate.getDay() === 1;
  const isSaturday = currentDayOfWeek === 6;

  const weekdayNames = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  const dayLabel = weekdayNames[targetDate.getDay()];

  const [year, month, day] = targetDateStr.split('-');
  const formattedTargetDate = `${day}/${month}/${year}`;

  return {
    targetDateStr,
    isMonday,
    isSaturday,
    dayLabel,
    formattedTargetDate,
  };
}

/**
 * Clean phone number to digits and prepend 55 (Brazil) if needed
 */
export function cleanPhoneDigits(phoneStr?: string): string {
  if (!phoneStr) return '';
  const raw = phoneStr.replace(/\D/g, '');
  if (!raw) return '';
  if (raw.length === 10 || raw.length === 11) {
    return `55${raw}`;
  }
  return raw;
}

interface FormatConfirmationParams {
  patientName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "07:30"
  physioName?: string;
  room?: string;
  isEncaixe?: boolean;
}

/**
 * Generates the ideal WhatsApp confirmation message from one day to another (D-1),
 * including specialized messaging for Saturday -> Monday (starting at 07:30).
 */
export function formatAppointmentConfirmationMessage({
  patientName,
  date,
  timeSlot,
  physioName = 'Dr. Jucelino Castro',
  room = 'Quiropraxia - Sala 01',
  isEncaixe = false,
}: FormatConfirmationParams): string {
  const firstName = patientName ? patientName.trim().split(' ')[0] : 'Paciente';

  // Parse appointment date
  const dateObj = new Date(date + 'T12:00:00');
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ...
  const [year, month, day] = date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const weekdayNames = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  const weekday = weekdayNames[dayOfWeek] || 'dia';

  // If appointment is on a Monday
  if (dayOfWeek === 1) {
    let slotNote = '';
    if (timeSlot === '07:30') {
      slotNote = '\n⏰ *Atenção ao horário:* Seu atendimento é no primeiro horário do dia (às 07:30 pontualmente).';
    } else {
      slotNote = '\n⏰ *Lembrete:* Nossos atendimentos na segunda-feira iniciam às 07:30.';
    }

    return (
      `Olá, ${firstName}! ☀️\n\n` +
      `Passando para *confirmar a sua consulta* na *Jucelino Castro Fisioterapia* para *Segunda-feira (${formattedDate}) às ${timeSlot}* com ${physioName}.\n` +
      `📍 Sala: ${room}${isEncaixe ? ' (Encaixe de Horário)' : ''}.${slotNote}\n\n` +
      `Podemos confirmar a sua presença? Por favor, responda com *SIM* para garantirmos seu horário ou nos avise com antecedência caso precise remarcar. Obrigado!`
    );
  }

  // Regular D-1 / Weekday confirmation message
  return (
    `Olá, ${firstName}! 🩺\n\n` +
    `Passando para *confirmar seu atendimento* na *Jucelino Castro Fisioterapia* para *amanhã, ${weekday} (${formattedDate}) às ${timeSlot}* com ${physioName}.\n` +
    `📍 Sala: ${room}${isEncaixe ? ' (Encaixe de Horário)' : ''}.\n\n` +
    `Podemos confirmar sua presença? Por favor, responda com *SIM* para garantirmos seu horário ou nos avise caso precise reagendar. Obrigado!`
  );
}

/**
 * Dispatches a message to WhatsApp using the preferred mode (Windows App, Web, or Universal link)
 */
export function openWhatsApp({
  phone,
  text,
  mode,
}: {
  phone: string;
  text: string;
  mode?: WhatsAppMode;
}): void {
  const preferredMode: WhatsAppMode =
    mode || (localStorage.getItem('jc_wa_send_mode') as WhatsAppMode) || 'windows';

  const cleanedPhone = cleanPhoneDigits(phone);
  if (!cleanedPhone) {
    alert('⚠️ Por favor, informe um número de telefone com DDD válido.');
    return;
  }

  const encodedText = encodeURIComponent(text);

  let targetUrl = '';
  if (preferredMode === 'windows') {
    targetUrl = `whatsapp://send?phone=${cleanedPhone}&text=${encodedText}`;
    window.location.href = targetUrl;
  } else if (preferredMode === 'web') {
    targetUrl = `https://web.whatsapp.com/send?phone=${cleanedPhone}&text=${encodedText}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  } else {
    targetUrl = `https://wa.me/${cleanedPhone}?text=${encodedText}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
}
