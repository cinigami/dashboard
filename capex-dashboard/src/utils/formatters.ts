import { Status } from '../types';

export const formatCurrency = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1000000) {
      return `RM ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `RM ${(value / 1000).toFixed(0)}K`;
    }
    return `RM ${value.toFixed(0)}`;
  }
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'Healthy':
      return '#00B1A9';
    case 'Caution':
      return '#FDB924';
    case 'Overrun':
      return '#E31837';
    default:
      return '#6B7280';
  }
};

export const getStatusBgColor = (status: Status): string => {
  switch (status) {
    case 'Healthy':
      return 'bg-status-healthy';
    case 'Caution':
      return 'bg-status-caution';
    case 'Overrun':
      return 'bg-status-overrun';
    default:
      return 'bg-gray-400';
  }
};

export const getStatusTextColor = (status: Status): string => {
  switch (status) {
    case 'Healthy':
      return 'text-white';
    case 'Caution':
      return 'text-petronas-teal';
    case 'Overrun':
      return 'text-white';
    default:
      return 'text-white';
  }
};

export const calculateStatus = (utilization: number): Status => {
  if (utilization <= 80) return 'Healthy';
  if (utilization <= 95) return 'Caution';
  return 'Overrun';
};

export const abbreviateNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const getDisciplineColor = (discipline: string): string => {
  const colors: Record<string, string> = {
    'Electrical': '#00B1A9',
    'Instrument': '#0B3C49',
    'Mechanical': '#1A5566',
    'Melamine': '#FDB924',
    'Rotating': '#33C4BD',
    'TA': '#E31837',
  };
  return colors[discipline] || '#6B7280';
};

export const chartColors = {
  approved: '#0B3C49',
  actual: '#00B1A9',
  planned: '#33C4BD',
  remaining: '#E8F4F3',
  variance: '#FDB924',
};
