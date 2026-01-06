import { HTMLAttributes } from 'react';
import type { Status } from '../../utils/types';
import { STATUS_COLORS } from '../../utils/colors';

export interface ChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label?: string;
  status?: Status;
  count?: number;
  showDot?: boolean;
  borderColor?: 'emerald' | 'yellow' | 'red' | 'gray';
  onRemove?: () => void;
}

const borderColorMap = {
  emerald: STATUS_COLORS.Healthy,
  yellow: STATUS_COLORS.Caution,
  red: STATUS_COLORS.Warning,
  gray: '#9CA3AF',
};

export default function Chip({
  label,
  status,
  count,
  showDot = false,
  borderColor,
  onRemove,
  className = '',
  ...props
}: ChipProps) {
  const displayLabel = label || status;
  const colorValue = borderColor ? borderColorMap[borderColor] : (status ? STATUS_COLORS[status] : '#6B7280');

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border transition-all duration-200 hover:shadow-sm ${className}`}
      style={{ borderColor: colorValue }}
      {...props}
    >
      {showDot && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colorValue }}
        />
      )}
      <span className="text-sm font-medium text-gray-700">
        {displayLabel}
        {count !== undefined && <span className="ml-1 font-semibold">{count}</span>}
      </span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Remove"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
