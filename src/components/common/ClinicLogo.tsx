import React, { useState, useEffect } from 'react';
import defaultLogoAsset from '../../assets/images/regenerated_image_1787009419254.png';

interface ClinicLogoProps {
  variant?: 'header' | 'sidebar' | 'login' | 'certificate' | 'large';
  showSubtitle?: boolean;
  className?: string;
  onLogoClick?: () => void;
}

const DEFAULT_LOGO_SRC = defaultLogoAsset || '/LogoJC.png';

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  variant = 'header',
  className = '',
  onLogoClick,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    return localStorage.getItem('jc_clinic_logo') || DEFAULT_LOGO_SRC;
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('jc_clinic_logo');
      if (stored) setLogoSrc(stored);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const sizeStyles = {
    header: 'h-14 sm:h-16 max-h-16 w-auto max-w-[260px]',
    sidebar: 'h-12 max-h-12 w-auto max-w-[190px]',
    login: 'h-32 sm:h-44 max-h-48 w-auto max-w-[360px]',
    certificate: 'h-20 max-h-24 w-auto max-w-[280px]',
    large: 'h-36 sm:h-48 max-h-52 w-auto max-w-[360px]',
  };

  return (
    <div
      onClick={onLogoClick}
      className={`inline-flex items-center justify-center select-none ${
        onLogoClick ? 'cursor-pointer group' : ''
      } ${className}`}
      title="Jucelino Castro Fisioterapia & Quiropraxia"
    >
      <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
        <img
          src={logoSrc}
          alt="Jucelino Castro Fisioterapia"
          referrerPolicy="no-referrer"
          className={`${sizeStyles[variant]} object-contain drop-shadow-xs`}
          onError={(e) => {
            if (logoSrc !== DEFAULT_LOGO_SRC) {
              setLogoSrc(DEFAULT_LOGO_SRC);
            }
          }}
        />
      </div>
    </div>
  );
};

