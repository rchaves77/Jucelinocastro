import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ value, size = 180, className = '' }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&margin=10&color=0f172a&bgcolor=ffffff`;

  return (
    <div className={`inline-flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-200 shadow-md ${className}`}>
      <img
        src={qrUrl}
        alt={`QR Code para ${value}`}
        width={size}
        height={size}
        className="rounded-lg object-contain"
        loading="lazy"
        onError={(e) => {
          // Fallback if offline
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <div className="mt-2 font-mono text-[10px] text-slate-500 font-semibold tracking-wider text-center max-w-[180px] truncate">
        {value}
      </div>
    </div>
  );
};
