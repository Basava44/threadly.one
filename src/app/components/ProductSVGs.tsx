export function getTextColor(bgHex: string) {
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1A1A1A" : "#F5F0E8";
}

export function CapSVG({ color, text, textColor }: { color: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full">
      <ellipse cx="100" cy="140" rx="85" ry="20" fill={color} opacity="0.3" />
      <path d="M40 100 C40 55, 160 55, 160 100 L155 115 C155 120, 145 130, 100 130 C55 130, 45 120, 45 115 Z" fill={color} stroke={color} strokeWidth="1" />
      <path d="M35 105 C35 105, 30 115, 35 120 C40 125, 55 132, 100 132 C145 132, 160 125, 165 120 C170 115, 165 105, 165 105" fill={color} stroke={color === "#1A1A1A" ? "#333" : "#00000015"} strokeWidth="0.5" />
      <text x="100" y="98" textAnchor="middle" fill={textColor} fontSize="18" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="300" letterSpacing="1">
        {text || "A|K"}
      </text>
    </svg>
  );
}

export function TeeSVG({ color, text, textColor }: { color: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <ellipse cx="100" cy="200" rx="60" ry="10" fill={color} opacity="0.2" />
      <path d="M70 40 L50 40 L25 70 L45 80 L55 65 L55 185 L145 185 L145 65 L155 80 L175 70 L150 40 L130 40 C130 40, 125 55, 100 55 C75 55, 70 40, 70 40 Z" fill={color} stroke={color === "#1A1A1A" ? "#333" : "#00000010"} strokeWidth="0.5" />
      <text x="100" y="120" textAnchor="middle" fill={textColor} fontSize="16" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="300" letterSpacing="1">
        {text || "A|K"}
      </text>
    </svg>
  );
}

export function ToteSVG({ color, text, textColor }: { color: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full">
      <ellipse cx="100" cy="205" rx="55" ry="8" fill={color} opacity="0.2" />
      <path d="M65 60 C65 30, 135 30, 135 60" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <rect x="45" y="60" width="110" height="140" rx="3" fill={color} stroke={color === "#1A1A1A" ? "#333" : "#00000010"} strokeWidth="0.5" />
      <text x="100" y="140" textAnchor="middle" fill={textColor} fontSize="16" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="300" letterSpacing="1">
        {text || "R|S"}
      </text>
    </svg>
  );
}

export const productSVGs = { cap: CapSVG, tee: TeeSVG, tote: ToteSVG };
