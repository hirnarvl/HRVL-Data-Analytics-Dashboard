import React from 'react';
import officialSealImg from '../assets/images/hrvl_official_seal_1786578080497.jpg';
import emblemImg from '../assets/images/hrvl_logo_emblem_1786577273721.jpg';

interface LogoProps {
  className?: string;
  sizeClassName?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  sizeClassName = 'w-full h-full',
  alt = 'Hirna Regional Veterinary Diagnostic Laboratory (HRVL) Official Seal',
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <img
        src={officialSealImg}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`${sizeClassName} object-contain`}
      />
    </div>
  );
};

export const HRVL_LOGO_URL = officialSealImg;
export const HRVL_EMBLEM_URL = emblemImg;


