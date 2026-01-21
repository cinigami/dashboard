import React from 'react';
import { FilterState, Status } from '../types';
import { Filter, X, Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  disciplines: string[];
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFiltersChange,
  disciplines,
}) => {
  const [showDisciplineDropdown, setShowDisciplineDropdown] = React.useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);
  
  const statusOptions: Status[] = ['Healthy', 'Caution', 'Overrun'];

  const toggleDiscipline = (discipline: string) => {
    const newDisciplines = filters.disciplines.includes(discipline)
      ? filters.disciplines.filter((d) => d !== discipline)
      : [...filters.disciplines, discipline];
    onFiltersChange({ ...filters, disciplines: newDisciplines });
  };

  const toggleStatus = (status: Status) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const clearFilters = () => {
    onFiltersChange({
      disciplines: [],
      dateRange: { start: null, end: null },
      statuses: [],
    });
  };

  const hasActiveFilters =
    filters.disciplines.length > 0 ||
    filters.statuses.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Healthy':
        return 'bg-status-healthy';
      case 'Caution':
        return 'bg-status-caution';
      case 'Overrun':
        return 'bg-status-overrun';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Icon */}
        <div className="flex items-center gap-2 text-petronas-teal">
          <Filter className="w-5 h-5" />
          <span className="font-medium text-sm">Filters</span>
        </div>

        {/* Discipline Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDisciplineDropdown(!showDisciplineDropdown);
              setShowStatusDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
          >
            <span>
              Discipline
              {filters.disciplines.length > 0 && (
                <span className="ml-1 text-petronas-emerald">
                  ({filters.disciplines.length})
                </span>
              )}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showDisciplineDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {disciplines.map((discipline) => (
                <label
                  key={discipline}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.disciplines.includes(discipline)}
                    onChange={() => toggleDiscipline(discipline)}
                    className="w-4 h-4 rounded border-gray-300 text-petronas-emerald focus:ring-petronas-emerald"
                  />
                  <span className="text-sm text-gray-700">{discipline}</span>
                </label>
              ))}
              {disciplines.length === 0 && (
                <p className="px-4 py-2 text-sm text-gray-500">No disciplines available</p>
              )}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowDisciplineDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-colors"
          >
            <span>
              Status
              {filters.statuses.length > 0 && (
                <span className="ml-1 text-petronas-emerald">
                  ({filters.statuses.length})
                </span>
              )}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {statusOptions.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.statuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="w-4 h-4 rounded border-gray-300 text-petronas-emerald focus:ring-petronas-emerald"
                  />
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`} />
                    <span className="text-sm text-gray-700">{status}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={filters.dateRange.start ? format(filters.dateRange.start, 'yyyy-MM-dd') : ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    start: e.target.value ? new Date(e.target.value) : null,
                  },
                })
              }
              className="bg-transparent text-sm text-gray-700 focus:outline-none w-32"
              placeholder="Start date"
            />
          </div>
          <span className="text-gray-400">to</span>
          <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={filters.dateRange.end ? format(filters.dateRange.end, 'yyyy-MM-dd') : ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    end: e.target.value ? new Date(e.target.value) : null,
                  },
                })
              }
              className="bg-transparent text-sm text-gray-700 focus:outline-none w-32"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-petronas-red hover:bg-petronas-red/5 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}

        {/* Active Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {filters.disciplines.map((discipline) => (
            <span
              key={discipline}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-petronas-emerald/10 text-petronas-emerald rounded-full text-xs font-medium"
            >
              {discipline}
              <button
                onClick={() => toggleDiscipline(discipline)}
                className="hover:bg-petronas-emerald/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.statuses.map((status) => (
            <span
              key={status}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                status === 'Healthy'
                  ? 'bg-status-healthy/10 text-status-healthy'
                  : status === 'Caution'
                  ? 'bg-status-caution/10 text-status-caution'
                  : 'bg-status-overrun/10 text-status-overrun'
              }`}
            >
              {status}
              <button
                onClick={() => toggleStatus(status)}
                className="hover:opacity-70 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showDisciplineDropdown || showStatusDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDisciplineDropdown(false);
            setShowStatusDropdown(false);
          }}
        />
      )}
    </div>
  );
};
