import React from 'react';
import type { FilterState, Area, Status, SortOption } from '../utils/types';
import { Card, Chip, Button } from './ui';
import { PETRONAS_COLORS } from '../utils/colors';

interface FiltersBarProps {
  filters: FilterState;
  availableEquipmentTypes: string[];
  onFiltersChange: (filters: FilterState) => void;
}

const AREAS: Area[] = ['Ammonia', 'Utility', 'Urea', 'System', 'Turbomachinery'];
const STATUSES: Status[] = ['Healthy', 'Caution', 'Warning'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Notification Date (Newest)' },
  { value: 'date-asc', label: 'Notification Date (Oldest)' },
  { value: 'tag-asc', label: 'Tag Number (A-Z)' },
  { value: 'status-severity', label: 'Status Severity' },
];

export default function FiltersBar({
  filters,
  availableEquipmentTypes,
  onFiltersChange,
}: FiltersBarProps) {
  const handleAreaToggle = (area: Area) => {
    const newAreas = filters.areas.includes(area)
      ? filters.areas.filter(a => a !== area)
      : [...filters.areas, area];
    onFiltersChange({ ...filters, areas: newAreas });
  };

  const handleEquipmentTypeToggle = (type: string) => {
    const newTypes = filters.equipmentTypes.includes(type)
      ? filters.equipmentTypes.filter(t => t !== type)
      : [...filters.equipmentTypes, type];
    onFiltersChange({ ...filters, equipmentTypes: newTypes });
  };

  const handleStatusToggle = (status: Status) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onFiltersChange({ ...filters, dateFrom: date });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onFiltersChange({ ...filters, dateTo: date });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchText: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, sortBy: e.target.value as SortOption });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      areas: AREAS,
      equipmentTypes: [],
      statuses: [],
      dateFrom: null,
      dateTo: null,
      searchText: '',
      sortBy: 'date-desc',
    });
  };

  // Quick Filter handlers
  const handleQuickFilter = (type: 'warnings' | 'cautions' | '7days' | 'als') => {
    switch (type) {
      case 'warnings':
        onFiltersChange({
          ...filters,
          statuses: filters.statuses.includes('Warning') ? [] : ['Warning'],
        });
        break;
      case 'cautions':
        onFiltersChange({
          ...filters,
          statuses: filters.statuses.includes('Caution') ? [] : ['Caution'],
        });
        break;
      case '7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        onFiltersChange({
          ...filters,
          dateFrom: sevenDaysAgo,
          dateTo: new Date(),
        });
        break;
      case 'als':
        onFiltersChange({
          ...filters,
          searchText: filters.searchText.toLowerCase().includes('als') ? '' : 'ALS',
        });
        break;
    }
  };

  // Count active filters
  const activeFilterCount =
    (filters.areas.length < AREAS.length ? 1 : 0) +
    (filters.equipmentTypes.length > 0 ? 1 : 0) +
    (filters.statuses.length > 0 ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0) +
    (filters.searchText ? 1 : 0);

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: PETRONAS_COLORS.darkBlue }}>
            Filters
          </h2>
          <p className="text-sm text-gray-600">Refine your data view</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
        >
          Clear All {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">Quick Filters</label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.statuses.includes('Warning') ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleQuickFilter('warnings')}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Warnings Only
          </Button>
          <Button
            variant={filters.statuses.includes('Caution') ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleQuickFilter('cautions')}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Cautions Only
          </Button>
          <Button
            variant={(filters.dateFrom || filters.dateTo) ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleQuickFilter('7days')}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            }
          >
            Last 7 Days
          </Button>
          <Button
            variant={filters.searchText.toLowerCase().includes('als') ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleQuickFilter('als')}
            leftIcon={
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            }
          >
            ALS Only
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Active Filters</label>
          <div className="flex flex-wrap gap-2">
            {filters.statuses.map(status => (
              <Chip
                key={status}
                status={status}
                onRemove={() => handleStatusToggle(status)}
              />
            ))}
            {filters.equipmentTypes.map(type => (
              <Chip
                key={type}
                label={type}
                onRemove={() => handleEquipmentTypeToggle(type)}
                borderColor="gray"
              />
            ))}
            {filters.searchText && (
              <Chip
                label={`Search: "${filters.searchText}"`}
                onRemove={() => onFiltersChange({ ...filters, searchText: '' })}
                borderColor="gray"
              />
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <Chip
                label={`Date: ${formatDateForInput(filters.dateFrom) || '...'} to ${formatDateForInput(filters.dateTo) || '...'}`}
                onRemove={() => onFiltersChange({ ...filters, dateFrom: null, dateTo: null })}
                borderColor="gray"
              />
            )}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {AREAS.map(area => (
              <label key={area} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.areas.includes(area)}
                  onChange={() => handleAreaToggle(area)}
                  className="rounded border-gray-300 text-petronas-emerald focus-premium"
                />
                <span className="text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Equipment Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment Type
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {availableEquipmentTypes.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No data loaded</p>
            ) : (
              availableEquipmentTypes.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={filters.equipmentTypes.includes(type)}
                    onChange={() => handleEquipmentTypeToggle(type)}
                    className="rounded border-gray-300 text-petronas-emerald focus-premium"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2 border border-gray-300 rounded-lg p-3">
            {STATUSES.map(status => (
              <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => handleStatusToggle(status)}
                  className="rounded border-gray-300 text-petronas-emerald focus-premium"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={formatDateForInput(filters.dateFrom)}
              onChange={handleDateFromChange}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-3 py-2"
              placeholder="From"
            />
            <input
              type="date"
              value={formatDateForInput(filters.dateTo)}
              onChange={handleDateToChange}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-3 py-2"
              placeholder="To"
            />
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            value={filters.searchText}
            onChange={handleSearchChange}
            placeholder="Tag, Description, Alarm..."
            className="block w-full rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-3 py-2"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-3 py-2"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
