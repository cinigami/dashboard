import { describe, it, expect } from 'vitest';
import { calculateOverallScore, getStatusScore, getStatusCounts } from '../scoring';
import type { InstrumentRow } from '../types';

describe('scoring utilities', () => {
  describe('calculateOverallScore', () => {
    it('should return 0 for empty array', () => {
      expect(calculateOverallScore([])).toBe(0);
    });

    it('should calculate correct average score for healthy items', () => {
      const data: InstrumentRow[] = [
        { status: 'Healthy' } as InstrumentRow,
        { status: 'Healthy' } as InstrumentRow,
      ];
      expect(calculateOverallScore(data)).toBe(100);
    });

    it('should calculate correct average score for mixed statuses', () => {
      const data: InstrumentRow[] = [
        { status: 'Healthy' } as InstrumentRow, // 100
        { status: 'Caution' } as InstrumentRow, // 60
        { status: 'Warning' } as InstrumentRow, // 20
      ];
      // Average: (100 + 60 + 20) / 3 = 60
      expect(calculateOverallScore(data)).toBe(60);
    });

    it('should exclude Unknown status from calculation', () => {
      const data: InstrumentRow[] = [
        { status: 'Healthy' } as InstrumentRow, // 100
        { status: 'Unknown' } as InstrumentRow, // excluded
      ];
      expect(calculateOverallScore(data)).toBe(100);
    });

    it('should return 0 if all items are Unknown', () => {
      const data: InstrumentRow[] = [
        { status: 'Unknown' } as InstrumentRow,
        { status: 'Unknown' } as InstrumentRow,
      ];
      expect(calculateOverallScore(data)).toBe(0);
    });
  });

  describe('getStatusScore', () => {
    it('should return correct scores for each status', () => {
      expect(getStatusScore('Healthy')).toBe(100);
      expect(getStatusScore('Caution')).toBe(60);
      expect(getStatusScore('Warning')).toBe(20);
      expect(getStatusScore('Unknown')).toBe(0);
    });
  });

  describe('getStatusCounts', () => {
    it('should return zero counts for empty array', () => {
      const counts = getStatusCounts([]);
      expect(counts).toEqual({
        Healthy: 0,
        Caution: 0,
        Warning: 0,
        Unknown: 0,
      });
    });

    it('should count statuses correctly', () => {
      const data: InstrumentRow[] = [
        { status: 'Healthy' } as InstrumentRow,
        { status: 'Healthy' } as InstrumentRow,
        { status: 'Caution' } as InstrumentRow,
        { status: 'Warning' } as InstrumentRow,
        { status: 'Unknown' } as InstrumentRow,
      ];

      const counts = getStatusCounts(data);
      expect(counts).toEqual({
        Healthy: 2,
        Caution: 1,
        Warning: 1,
        Unknown: 1,
      });
    });
  });
});
