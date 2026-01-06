import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import FileUploader from './components/FileUploader';
import FiltersBar from './components/FiltersBar';
import GaugeCard from './components/GaugeCard';
import DonutGrid from './components/DonutGrid';
import AlertsTableGrouped from './components/AlertsTableGrouped';
import ObsolescenceTable from './components/ObsolescenceTable';
import ExportModal from './components/ExportModal';
import { generateTemplate } from './utils/templateGenerator';
import { filterAndSortData, getUniqueEquipmentTypes } from './utils/filterData';
import { saveFilterState, loadFilterState, saveUploadMetadata, loadUploadMetadata } from './utils/storage';
import type { InstrumentRow, FilterState, Status, UploadMetadata } from './utils/types';

const INITIAL_FILTERS: FilterState = {
  areas: ['Ammonia', 'Utility', 'Urea', 'System', 'Turbomachinery'],
  equipmentTypes: [],
  statuses: [],
  dateFrom: null,
  dateTo: null,
  searchText: '',
  sortBy: 'date-desc',
};

function App() {
  const [rawData, setRawData] = useState<InstrumentRow[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [uploadMetadata, setUploadMetadata] = useState<UploadMetadata | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedFilters = loadFilterState();
    if (savedFilters) {
      setFilters(prev => ({ ...prev, ...savedFilters }));
    }

    const savedMetadata = loadUploadMetadata();
    if (savedMetadata) {
      setUploadMetadata(savedMetadata);
    }
  }, []);

  // Save filters when they change
  useEffect(() => {
    if (rawData.length > 0) {
      saveFilterState(filters);
    }
  }, [filters, rawData.length]);

  // Get available equipment types from raw data
  const availableEquipmentTypes = useMemo(() => {
    return getUniqueEquipmentTypes(rawData);
  }, [rawData]);

  // Apply filters and sorting
  const filteredData = useMemo(() => {
    return filterAndSortData(rawData, filters);
  }, [rawData, filters]);

  const handleDataLoaded = (data: InstrumentRow[], filename: string) => {
    setRawData(data);

    const metadata: UploadMetadata = {
      filename,
      timestamp: new Date(),
    };
    setUploadMetadata(metadata);
    saveUploadMetadata(metadata);

    // Reset filters to default
    setFilters(INITIAL_FILTERS);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleStatusToggle = (status: Status) => {
    setFilters(prev => {
      const newStatuses = prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status];
      return { ...prev, statuses: newStatuses };
    });
  };

  const handleDownloadTemplate = () => {
    generateTemplate();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Instrument Asset Healthiness
              </h1>
              {uploadMetadata && (
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {format(uploadMetadata.timestamp, 'PPpp')} ({uploadMetadata.filename})
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleDownloadTemplate}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Download Excel Template
              </button>

              {rawData.length > 0 && (
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded text-sm font-medium text-white hover:bg-blue-700"
                >
                  Export
                </button>
              )}
            </div>
          </div>

          {rawData.length === 0 && (
            <div className="mt-6">
              <FileUploader onDataLoaded={handleDataLoaded} />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {rawData.length > 0 ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <FiltersBar
            filters={filters}
            availableEquipmentTypes={availableEquipmentTypes}
            onFiltersChange={handleFiltersChange}
          />

          {/* Empty State */}
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to see more data.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Overall Equipment Healthiness - FULL WIDTH, TOP, MOST PROMINENT */}
              <GaugeCard data={filteredData} />

              {/* 2. Status Donut Charts - DIRECTLY BELOW */}
              <DonutGrid
                data={filteredData}
                filters={filters}
                onStatusToggle={handleStatusToggle}
              />

              {/* 3. Alerts Panel */}
              <AlertsTableGrouped data={filteredData} />

              {/* 4. Obsolescence Panel */}
              <ObsolescenceTable data={filteredData} />

              {/* Upload New File Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upload New Data
                </h2>
                <FileUploader onDataLoaded={handleDataLoaded} />
              </div>
            </div>
          )}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Upload an Excel file to get started
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Download the template to see the required format
            </p>
          </div>
        </main>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        allData={rawData}
        currentFilters={{
          areas: filters.areas,
          equipmentTypes: filters.equipmentTypes,
          statuses: filters.statuses,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        }}
      />
    </div>
  );
}

export default App;
