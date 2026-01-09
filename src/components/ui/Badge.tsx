import { HTMLAttributes } from 'react';
import type { Status } from '../../utils/types';
import { STATUS_COLORS } from '../../utils/colors';

export type BadgeVariant = 'solid' | 'outline' | 'soft';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  status: Status;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({
  status,
  variant = 'soft',
  size = 'sm',
  className = '',
  ...props
}: BadgeProps) {
  const statusColor = STATUS_COLORS[status];

  // Convert hex to RGB for background opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(statusColor);

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: statusColor,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: statusColor,
          borderWidth: '1px',
          borderColor: statusColor,
        };
      case 'soft':
      default:
        return {
          backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
          color: statusColor,
        };
    }
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      style={getVariantStyles()}
      {...props}
    >
      {status}
    </span>
  );
}
