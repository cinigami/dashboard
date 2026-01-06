import { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'default' | 'hero' | 'elevated';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  border?: boolean;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white rounded-2xl shadow-soft',
  hero: 'bg-white rounded-2xl shadow-elevated border-2 border-gray-100',
  elevated: 'bg-white rounded-2xl shadow-hover',
};

export default function Card({
  variant = 'default',
  hover = false,
  border = true,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = variant === 'default' ? variantStyles.default : variantStyles[variant];
  const borderStyles = border && variant === 'default' ? 'border border-gray-100' : '';
  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-hover hover:-translate-y-0.5 cursor-pointer' : '';

  const combinedClassName = `${baseStyles} ${borderStyles} ${hoverStyles} ${className}`;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
}
