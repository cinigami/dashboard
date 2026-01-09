import type { InstrumentRow, Status } from './types';

const STATUS_SCORES: Record<Status, number> = {
  Healthy: 100,
  Caution: 60,
  Warning: 20,
  Unknown: 0,
};

export function calculateOverallScore(data: InstrumentRow[]): number {
  if (data.length === 0) return 0;

  // Filter out Unknown status for scoring
  const validRows = data.filter(row => row.status !== 'Unknown');

  if (validRows.length === 0) return 0;

  const totalScore = validRows.reduce((sum, row) => sum + STATUS_SCORES[row.status], 0);
  return Math.round(totalScore / validRows.length);
}

export function getStatusScore(status: Status): number {
  return STATUS_SCORES[status];
}

export function getStatusCounts(data: InstrumentRow[]): Record<Status, number> {
  const counts: Record<Status, number> = {
    Healthy: 0,
    Caution: 0,
    Warning: 0,
    Unknown: 0,
  };

  data.forEach(row => {
    counts[row.status]++;
  });

  return counts;
}
