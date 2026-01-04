import { memo } from 'react';
import type { TooltipInfo } from '../types';

interface TooltipProps {
  info: TooltipInfo | null;
}

function Tooltip({ info }: TooltipProps) {
  if (!info || !info.country) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg"
      style={{
        left: info.x + 10,
        top: info.y + 10,
        transform: 'translateY(-50%)',
      }}
    >
      <div className="font-medium">{info.country.name}</div>
      <div className="text-xs text-gray-300">
        {info.isVisited ? '✓ Visited' : 'Not visited'}
      </div>
    </div>
  );
}

export default memo(Tooltip);
