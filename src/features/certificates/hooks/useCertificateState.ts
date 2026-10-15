import { useState, useEffect } from 'react';
import { AttendanceCertificate } from '../../../types';

const LOCAL_STORAGE_KEY = 'jc_fisioterapia_certificates_v1';

const defaultCertificates: AttendanceCertificate[] = [
  {
    id: 'JC-DECL-2026-8801',
    patientId: 'p1',
    patientName: 'Maria Silva Oliveira',
    patientCpf: '123.456.789-01',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 - 09:00',
    physioName: 'Dr. Jucelino Castro',
    physioCrefito: 'CREFITO-3/184920-F',
    receptionistName: 'Katiuscia Braga Castro',
    issuedAt: new Date().toISOString(),
    clinicName: 'Jucelino Castro Fisioterapia',
    validationUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}?validar=JC-DECL-2026-8801`,
    status: 'valid',
  },
  {
    id: 'JC-DECL-2026-2345',
    patientId: 'p_jose_rodney',
    patientName: 'JOSE RODNEY',
    patientCpf: '000.000.000-00',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '13:30',
    physioName: 'Dr. Jucelino Castro',
    physioCrefito: 'CREFITO-3/184920-F',
    receptionistName: 'Rômulo Chaves',
    issuedAt: new Date().toISOString(),
    clinicName: 'Jucelino Castro Fisioterapia',
    validationUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}?validar=JC-DECL-2026-2345`,
    status: 'valid',
  },
];

export function useCertificateState() {
  const [certificates, setCertificates] = useState<AttendanceCertificate[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure default seed certificates are present
          const existingIds = new Set(parsed.map((c: AttendanceCertificate) => c.id));
          const combined = [...parsed];
          defaultCertificates.forEach((def) => {
            if (!existingIds.has(def.id)) {
              combined.push(def);
            }
          });
          return combined;
        }
      }
    } catch (e) {
      console.error('Error loading certificates', e);
    }
    return defaultCertificates;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(certificates));
    } catch (e) {
      console.error('Error saving certificates to localStorage', e);
    }
  }, [certificates]);

  const generateCertificate = (data: {
    patientId: string;
    patientName: string;
    patientCpf?: string;
    appointmentDate?: string;
    timeSlot?: string;
    physioName?: string;
    physioCrefito?: string;
    receptionistName?: string;
  }): AttendanceCertificate => {
    const todayStr = new Date().toISOString().split('T')[0];
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const certId = `JC-DECL-${new Date().getFullYear()}-${codeNum}`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

    const newCert: AttendanceCertificate = {
      id: certId,
      patientId: data.patientId,
      patientName: data.patientName,
      patientCpf: data.patientCpf || '000.000.000-00',
      appointmentDate: data.appointmentDate || todayStr,
      timeSlot: data.timeSlot || '13:30',
      physioName: data.physioName || 'Dr. Jucelino Castro',
      physioCrefito: data.physioCrefito || 'CREFITO-3/184920-F',
      receptionistName: data.receptionistName || 'Rômulo Chaves',
      issuedAt: new Date().toISOString(),
      clinicName: 'Jucelino Castro Fisioterapia',
      validationUrl: `${baseUrl}?validar=${certId}`,
      status: 'valid',
    };

    // Synchronously update localStorage to avoid any React state async delay when validating immediately
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const currentList: AttendanceCertificate[] = saved ? JSON.parse(saved) : [];
      const updatedList = [newCert, ...currentList.filter((c) => c.id !== newCert.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Error synchronously persisting new certificate', e);
    }

    setCertificates((prev) => [newCert, ...prev.filter((c) => c.id !== newCert.id)]);
    return newCert;
  };

  const getCertificateById = (id: string): AttendanceCertificate | undefined => {
    if (!id) return undefined;

    let cleanInput = id.trim();
    if (cleanInput.includes('validar=')) {
      cleanInput = cleanInput.split('validar=')[1].split('&')[0];
    }
    const upper = cleanInput.toUpperCase();
    const stripped = upper.replace(/[^A-Z0-9]/g, '');

    // 1. Search in current memory state
    let match = certificates.find((c) => {
      if (!c || !c.id) return false;
      const certUpper = c.id.toUpperCase();
      const certStripped = certUpper.replace(/[^A-Z0-9]/g, '');
      return certUpper === upper || certStripped === stripped || certUpper.endsWith(upper);
    });
    if (match) return match;

    // 2. Search in localStorage directly (avoids any stale closure)
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: AttendanceCertificate[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          match = parsed.find((c) => {
            if (!c || !c.id) return false;
            const certUpper = c.id.toUpperCase();
            const certStripped = certUpper.replace(/[^A-Z0-9]/g, '');
            return certUpper === upper || certStripped === stripped || certUpper.endsWith(upper);
          });
          if (match) return match;
        }
      }
    } catch (e) {
      console.error('Error searching certificate in localStorage', e);
    }

    // 3. Fallback for default seed certificates (e.g. 2345, 8801)
    match = defaultCertificates.find((c) => {
      const certUpper = c.id.toUpperCase();
      const certStripped = certUpper.replace(/[^A-Z0-9]/g, '');
      return certUpper === upper || certStripped === stripped || certUpper.endsWith(upper);
    });

    return match;
  };

  return {
    certificates,
    generateCertificate,
    getCertificateById,
  };
}
