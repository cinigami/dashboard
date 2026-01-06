import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveFilterState,
  loadFilterState,
  saveUploadMetadata,
  loadUploadMetadata,
} from '../storage';
import type { FilterState, UploadMetadata } from '../types';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('filter state persistence', () => {
    it('should save and load filter state', () => {
      const filters: FilterState = {
        areas: ['Ammonia', 'Utility'],
        equipmentTypes: ['Flow Transmitter'],
        statuses: ['Healthy', 'Caution'],
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-12-31'),
        searchText: 'test',
        sortBy: 'date-desc',
      };

      saveFilterState(filters);
      const loaded = loadFilterState();

      expect(loaded).toBeTruthy();
      expect(loaded?.areas).toEqual(filters.areas);
      expect(loaded?.equipmentTypes).toEqual(filters.equipmentTypes);
      expect(loaded?.statuses).toEqual(filters.statuses);
      expect(loaded?.searchText).toBe(filters.searchText);
      expect(loaded?.sortBy).toBe(filters.sortBy);
      expect(loaded?.dateFrom).toBeTruthy();
      expect(loaded?.dateTo).toBeTruthy();
      if (loaded?.dateFrom && filters.dateFrom) {
        expect(loaded.dateFrom.toISOString()).toBe(filters.dateFrom.toISOString());
      }
      if (loaded?.dateTo && filters.dateTo) {
        expect(loaded.dateTo.toISOString()).toBe(filters.dateTo.toISOString());
      }
    });

    it('should handle null dates', () => {
      const filters: FilterState = {
        areas: ['Ammonia'],
        equipmentTypes: [],
        statuses: [],
        dateFrom: null,
        dateTo: null,
        searchText: '',
        sortBy: 'date-desc',
      };

      saveFilterState(filters);
      const loaded = loadFilterState();

      expect(loaded?.dateFrom).toBeNull();
      expect(loaded?.dateTo).toBeNull();
    });

    it('should return null when no saved state exists', () => {
      const loaded = loadFilterState();
      expect(loaded).toBeNull();
    });
  });

  describe('upload metadata persistence', () => {
    it('should save and load upload metadata', () => {
      const metadata: UploadMetadata = {
        filename: 'test.xlsx',
        timestamp: new Date('2024-01-15T10:30:00Z'),
      };

      saveUploadMetadata(metadata);
      const loaded = loadUploadMetadata();

      expect(loaded).toBeTruthy();
      expect(loaded?.filename).toBe(metadata.filename);
      expect(loaded?.timestamp.toISOString()).toBe(metadata.timestamp.toISOString());
    });

    it('should return null when no saved metadata exists', () => {
      const loaded = loadUploadMetadata();
      expect(loaded).toBeNull();
    });
  });
});
