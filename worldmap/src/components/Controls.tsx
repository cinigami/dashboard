import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { searchCountries, isVisited, getAllCountries } from '../utils/countries';
import { exportVisitedData, importVisitedData } from '../utils/storage';
import type { CountryData, VisitedData } from '../types';

interface ControlsProps {
  visited: string[];
  visitedData: VisitedData;
  onToggleVisited: (alpha3: string) => void;
  onReset: () => void;
  onImport: (data: VisitedData) => void;
  onHighlight: (alpha3: string | null) => void;
}

function Controls({
  visited,
  visitedData,
  onToggleVisited,
  onReset,
  onImport,
  onHighlight,
}: ControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CountryData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCountries = getAllCountries().length;

  // Cleanup highlight timeout on unmount
  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  // Handle clicking outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchCountries(query).slice(0, 10));
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, []);

  const handleResultClick = useCallback(
    (country: CountryData) => {
      onToggleVisited(country.alpha3);
      onHighlight(country.alpha3);
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);

      // Clear any existing timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      // Remove highlight after 2 seconds
      highlightTimeoutRef.current = setTimeout(() => {
        onHighlight(null);
        highlightTimeoutRef.current = null;
      }, 2000);
    },
    [onToggleVisited, onHighlight]
  );

  const handleExport = useCallback(() => {
    const success = exportVisitedData(visitedData);
    if (!success) {
      setExportError('Failed to export data');
      setTimeout(() => setExportError(null), 3000);
    }
  }, [visitedData]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setImportError(null);
      try {
        const data = await importVisitedData(file);
        onImport(data);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Import failed');
      }
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onImport]
  );

  const handleResetClick = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const handleResetConfirm = useCallback(() => {
    onReset();
    setShowResetConfirm(false);
  }, [onReset]);

  const handleResetCancel = useCallback(() => {
    setShowResetConfirm(false);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Travel Tracker</h2>
          <p className="text-sm text-gray-500">
            Visited: <span className="font-medium text-green-600">{visited.length}</span> / {totalCountries} countries
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {totalCountries > 0 ? Math.round((visited.length / totalCountries) * 100) : 0}%
          </div>
          <div className="text-xs text-gray-400">of the world</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${(visited.length / totalCountries) * 100}%` }}
        />
      </div>

      {/* Search */}
      <div ref={searchRef} className="relative">
        <label htmlFor="country-search" className="sr-only">
          Search countries
        </label>
        <input
          id="country-search"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search countries..."
          aria-expanded={showResults && searchResults.length > 0}
          aria-controls="search-results"
          aria-autocomplete="list"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {showResults && searchResults.length > 0 && (
          <ul
            id="search-results"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto"
          >
            {searchResults.map((country) => {
              const countryVisited = isVisited(country.alpha3, visited);
              return (
                <li key={country.alpha3} role="option" aria-selected={false}>
                  <button
                    onClick={() => handleResultClick(country)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    <span className="text-gray-900">{country.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        countryVisited
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {countryVisited ? 'Visited' : 'Not visited'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {showResults && searchQuery && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-4 text-center text-gray-500">
            No countries found
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          className="flex-1 min-w-[100px] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Export JSON
        </button>
        <button
          onClick={handleImportClick}
          className="flex-1 min-w-[100px] px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          Import JSON
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import JSON file"
        />
        <button
          onClick={handleResetClick}
          className="flex-1 min-w-[100px] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Import error */}
      {importError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {importError}
        </div>
      )}

      {/* Export error */}
      {exportError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
          {exportError}
        </div>
      )}

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleResetCancel}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 w-80"
          >
            <h3 id="reset-dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
              Reset All Data?
            </h3>
            <p className="text-gray-600 mb-4">
              This will clear all {visited.length} visited countries. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleResetConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                onClick={handleResetCancel}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Controls);
