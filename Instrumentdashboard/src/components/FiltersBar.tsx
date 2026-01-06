import React from 'react';
import type { FilterState, Area, Status, SortOption } from '../utils/types';

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

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-0 z-10 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Area Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
          <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
            {AREAS.map(area => (
              <label key={area} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.areas.includes(area)}
                  onChange={() => handleAreaToggle(area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
          <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
            {availableEquipmentTypes.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No data loaded</p>
            ) : (
              availableEquipmentTypes.map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.equipmentTypes.includes(type)}
                    onChange={() => handleEquipmentTypeToggle(type)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
          <div className="space-y-1 border border-gray-300 rounded p-2">
            {STATUSES.map(status => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => handleStatusToggle(status)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
              className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="From"
            />
            <input
              type="date"
              value={formatDateForInput(filters.dateTo)}
              onChange={handleDateToChange}
              className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
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
            className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
