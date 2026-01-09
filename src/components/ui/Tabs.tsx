import { ReactNode } from 'react';
import { PETRONAS_COLORS } from '../../utils/colors';

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: ReactNode;
}

export function Tabs({ value, onChange, children, className = '' }: TabsProps) {
  return (
    <div className={`flex gap-1 border-b border-gray-200 ${className}`}>
      {Array.isArray(children) ? (
        children.map((child: any) => {
          const isActive = child.props.value === value;
          return (
            <button
              key={child.props.value}
              onClick={() => onChange(child.props.value)}
              className={`px-4 py-2 font-medium text-sm transition-all duration-200 relative ${
                isActive
                  ? 'text-petronas-emerald'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{
                borderBottom: isActive ? `2px solid ${PETRONAS_COLORS.emeraldGreen}` : '2px solid transparent',
              }}
            >
              {child.props.children}
            </button>
          );
        })
      ) : (
        children
      )}
    </div>
  );
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}
