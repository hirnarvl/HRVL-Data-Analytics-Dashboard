import React, { useState, useEffect } from 'react';
import officialSealImg from '../assets/images/hrvl_official_seal_1786578080497.jpg';
import emblemImg from '../assets/images/hrvl_logo_emblem_1786577273721.jpg';

interface LogoProps {
  className?: string;
  sizeClassName?: string;
  alt?: string;
  transparentMode?: boolean;
}

// Global cached transparent data URL
let cachedTransparentDataUrl: string | null = null;

export const Logo: React.FC<LogoProps> = ({
  className = '',
  sizeClassName = 'w-full h-full',
  alt = 'Hirna Regional Veterinary Diagnostic Laboratory (HRVL) Official Seal',
  transparentMode = true,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(cachedTransparentDataUrl || officialSealImg);

  useEffect(() => {
    if (cachedTransparentDataUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = officialSealImg;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Make pure black and near-black background outer pixels transparent
        // Also check pure white outer background
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) / 2;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Distance from center
            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

            // Remove outer black or white background beyond circular seal
            const isNearBlack = r < 35 && g < 35 && b < 35;
            const isNearWhite = r > 235 && g > 235 && b > 235;

            if ((isNearBlack || isNearWhite) && dist > maxR * 0.88) {
              // Smooth feathering
              const feather = Math.min(1, (dist - maxR * 0.88) / (maxR * 0.12));
              data[idx + 3] = Math.max(0, Math.round(255 * (1 - feather)));
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const processedUrl = canvas.toDataURL('image/png');
        cachedTransparentDataUrl = processedUrl;
        setLogoSrc(processedUrl);
      } catch (err) {
        console.warn('Transparent canvas processing fallback:', err);
      }
    };
  }, []);

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}>
      <img
        src={logoSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`${sizeClassName} object-contain transition-all duration-300 ${
          transparentMode
            ? 'drop-shadow-[0_4px_12px_rgba(5,150,105,0.3)] dark:drop-shadow-[0_4px_16px_rgba(52,211,153,0.4)]'
            : ''
        }`}
      />
    </div>
  );
};

export const HRVL_LOGO_URL = officialSealImg;
export const HRVL_EMBLEM_URL = emblemImg;

