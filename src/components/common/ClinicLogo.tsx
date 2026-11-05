import React from 'react';

interface ClinicLogoProps {
  variant?: string;
  onLogoClick?: () => void;
  className?: string;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  variant,
  onLogoClick,
  className = '',
}) => {
  const sizeClass =
    variant === 'large' ? 'h-16' : variant === 'login' ? 'h-20' : 'h-11';

  return (
    <div
      className={`flex items-center gap-4 ${onLogoClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onLogoClick}
      role={onLogoClick ? 'button' : undefined}
      tabIndex={onLogoClick ? 0 : undefined}
    >
      <img
        src="/JC-removebg-preview.png"
        alt="Jucelino Castro Fisioterapia"
        className={`${sizeClass} w-auto object-contain rounded-lg`}
      />
    </div>
  );
};
