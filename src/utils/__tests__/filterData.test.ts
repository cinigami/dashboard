import { describe, it, expect } from 'vitest';
import { filterAndSortData, getUniqueEquipmentTypes } from '../filterData';
import type { FilterState } from '../types';
import { mockInstrumentRows } from '../../tests/mockData';

describe('filterData utilities', () => {
  describe('filterAndSortData', () => {
    const defaultFilters: FilterState = {
      areas: [],
      equipmentTypes: [],
      statuses: [],
      dateFrom: null,
      dateTo: null,
      searchText: '',
      sortBy: 'date-desc',
    };

    it('should return all data when no filters applied', () => {
      const result = filterAndSortData(mockInstrumentRows, defaultFilters);
      expect(result).toHaveLength(mockInstrumentRows.length);
    });

    it('should filter by area', () => {
      const filters: FilterState = {
        ...defaultFilters,
        areas: ['Ammonia'],
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result).toHaveLength(2);
      expect(result.every(row => row.area === 'Ammonia')).toBe(true);
    });

    it('should filter by equipment type', () => {
      const filters: FilterState = {
        ...defaultFilters,
        equipmentTypes: ['Flow Transmitter'],
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result).toHaveLength(1);
      expect(result[0].equipmentType).toBe('Flow Transmitter');
    });

    it('should filter by status', () => {
      const filters: FilterState = {
        ...defaultFilters,
        statuses: ['Warning'],
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result).toHaveLength(2);
      expect(result.every(row => row.status === 'Warning')).toBe(true);
    });

    it('should filter by date range', () => {
      const filters: FilterState = {
        ...defaultFilters,
        dateFrom: new Date('2024-01-20'),
        dateTo: new Date('2024-01-30'),
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result).toHaveLength(3);
    });

    it('should filter by search text', () => {
      const filters: FilterState = {
        ...defaultFilters,
        searchText: 'ALS',
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result).toHaveLength(2);
      expect(result.every(row => row.alarmDescription.includes('ALS'))).toBe(true);
    });

    it('should sort by date descending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortBy: 'date-desc',
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result[0].tagNumber).toBe('LT-3004'); // 2024-02-01
      expect(result[result.length - 1].tagNumber).toBe('FT-1001'); // 2024-01-15
    });

    it('should sort by date ascending', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortBy: 'date-asc',
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result[0].tagNumber).toBe('FT-1001'); // 2024-01-15
      expect(result[result.length - 1].tagNumber).toBe('LT-3004'); // 2024-02-01
    });

    it('should sort by tag number', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortBy: 'tag-asc',
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result[0].tagNumber).toBe('AC-4003');
      expect(result[result.length - 1].tagNumber).toBe('TT-2003');
    });

    it('should sort by status severity', () => {
      const filters: FilterState = {
        ...defaultFilters,
        sortBy: 'status-severity',
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      // Warning first, then Caution, then Healthy
      expect(result[0].status).toBe('Warning');
      expect(result[1].status).toBe('Warning');
      expect(result[2].status).toBe('Caution');
    });

    it('should apply multiple filters together', () => {
      const filters: FilterState = {
        ...defaultFilters,
        areas: ['Ammonia', 'Utility'],
        statuses: ['Caution', 'Warning'],
      };
      const result = filterAndSortData(mockInstrumentRows, filters);
      expect(result).toHaveLength(2);
    });
  });

  describe('getUniqueEquipmentTypes', () => {
    it('should return unique equipment types sorted', () => {
      const types = getUniqueEquipmentTypes(mockInstrumentRows);
      expect(types).toEqual([
        'Actuator',
        'Flow Transmitter',
        'Level Transmitter',
        'Pressure Transmitter',
        'Temperature Transmitter',
      ]);
    });

    it('should return empty array for empty data', () => {
      const types = getUniqueEquipmentTypes([]);
      expect(types).toEqual([]);
    });
  });
});
