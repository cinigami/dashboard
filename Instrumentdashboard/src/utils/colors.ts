// PETRONAS Brand Colors - DO NOT MODIFY
export const PETRONAS_COLORS = {
  // Primary Brand Colors
  emeraldGreen: '#00B1A9',
  darkBlue: '#0B3C49',
  yellow: '#FDB924',
  red: '#E31837',

  // Neutral Colors
  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  border: '#E5E7EB',
  text: '#1F2937',
  textLight: '#6B7280',
} as const;

// Status Colors - MUST be consistent across all visualizations
export const STATUS_COLORS = {
  Healthy: PETRONAS_COLORS.emeraldGreen,   // #00B1A9
  Caution: PETRONAS_COLORS.yellow,         // #FDB924
  Warning: PETRONAS_COLORS.red,            // #E31837
  Unknown: '#9CA3AF',                      // Gray for unknown status
} as const;

export type StatusColor = keyof typeof STATUS_COLORS;

// Helper function to get status color
export function getStatusColor(status: StatusColor): string {
  return STATUS_COLORS[status] || STATUS_COLORS.Unknown;
}

// Gauge color based on score
export function getGaugeColor(score: number): string {
  if (score >= 80) return PETRONAS_COLORS.emeraldGreen;
  if (score >= 60) return PETRONAS_COLORS.yellow;
  return PETRONAS_COLORS.red;
}
