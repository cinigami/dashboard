import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import type {
  InstrumentRow,
  Area,
  Status,
  ExportColumn,
  ExportColumnOption,
  ExportConfig,
} from '../utils/types';
import { exportToPdf } from '../utils/exportPdf';
import { exportToPowerPoint } from '../utils/exportPpt';
import { filterAndSortData } from '../utils/filterData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  allData: InstrumentRow[];
  currentFilters: {
    areas: Area[];
    equipmentTypes: string[];
    statuses: Status[];
    dateFrom: Date | null;
    dateTo: Date | null;
  };
}

const AREAS: Area[] = ['Ammonia', 'Utility', 'Urea', 'System', 'Turbomachinery'];
const STATUSES: Status[] = ['Healthy', 'Caution', 'Warning'];

const ALL_COLUMNS: ExportColumnOption[] = [
  { value: 'area', label: 'Area' },
  { value: 'equipmentType', label: 'Equipment Type' },
  { value: 'tagNumber', label: 'Tag Number' },
  { value: 'equipmentDescription', label: 'Equipment Description' },
  { value: 'status', label: 'Status' },
  { value: 'alarmDescription', label: 'Alarm Description' },
  { value: 'rectification', label: 'Rectification' },
  { value: 'notificationDate', label: 'Notification Date' },
];

export default function ExportModal({
  isOpen,
  onClose,
  allData,
  currentFilters,
}: ExportModalProps) {
  const [selectedAreas, setSelectedAreas] = useState<Area[]>(currentFilters.areas);
  const [selectedEquipmentTypes, setSelectedEquipmentTypes] = useState<string[]>(
    currentFilters.equipmentTypes
  );
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(
    currentFilters.statuses
  );
  const [dateFrom, setDateFrom] = useState<Date | null>(currentFilters.dateFrom);
  const [dateTo, setDateTo] = useState<Date | null>(currentFilters.dateTo);
  const [selectedColumns, setSelectedColumns] = useState<ExportColumn[]>(
    ALL_COLUMNS.map(c => c.value)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableEquipmentTypes = useMemo(() => {
    const types = new Set(allData.map(row => row.equipmentType));
    return Array.from(types).sort();
  }, [allData]);

  // Calculate preview data
  const previewData = useMemo(() => {
    const filtered = filterAndSortData(allData, {
      areas: selectedAreas.length > 0 ? selectedAreas : AREAS,
      equipmentTypes: selectedEquipmentTypes,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : STATUSES,
      dateFrom,
      dateTo,
      searchText: '',
      sortBy: 'date-desc',
    });

    return filtered;
  }, [allData, selectedAreas, selectedEquipmentTypes, selectedStatuses, dateFrom, dateTo]);

  // Generate filename
  const filename = useMemo(() => {
    const areasPart = selectedAreas.length > 0 && selectedAreas.length < AREAS.length
      ? selectedAreas.join('-')
      : 'All';
    const datePart = format(new Date(), 'yyyy-MM-dd');
    return `Instrument_Asset_Healthiness_${areasPart}_${datePart}`;
  }, [selectedAreas]);

  const handleAreaToggle = (area: Area) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleEquipmentTypeToggle = (type: string) => {
    setSelectedEquipmentTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleStatusToggle = (status: Status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleColumnToggle = (column: ExportColumn) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(c => c !== column) : [...prev, column]
    );
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleExport = async (format: 'pdf' | 'pptx') => {
    if (selectedColumns.length === 0) {
      setError('Please select at least one column');
      return;
    }

    if (previewData.length === 0) {
      setError('No data to export');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const config: ExportConfig = {
        areas: selectedAreas.length > 0 ? selectedAreas : AREAS,
        equipmentTypes: selectedEquipmentTypes,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : STATUSES,
        dateFrom,
        dateTo,
        columns: selectedColumns,
        filename: `${filename}.${format}`,
      };

      if (format === 'pdf') {
        exportToPdf(previewData, config);
      } else {
        exportToPowerPoint(previewData, config);
      }

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError(`Failed to export: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isExporting}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Filters */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Scope</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Areas</label>
                <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                  {AREAS.map(area => (
                    <label key={area} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAreas.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Equipment Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Types
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                  {availableEquipmentTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEquipmentTypes.includes(type)}
                        onChange={() => handleEquipmentTypeToggle(type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Statuses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statuses</label>
                <div className="space-y-1 border border-gray-300 rounded p-2">
                  {STATUSES.map(status => (
                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={formatDateForInput(dateFrom)}
                    onChange={e => setDateFrom(e.target.value ? new Date(e.target.value) : null)}
                    className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="date"
                    value={formatDateForInput(dateTo)}
                    onChange={e => setDateTo(e.target.value ? new Date(e.target.value) : null)}
                    className="block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Columns */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
                <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded p-2">
                  {ALL_COLUMNS.map(col => (
                    <label key={col.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(col.value)}
                        onChange={() => handleColumnToggle(col.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filename Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filename Preview</h3>
            <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">
              {filename}.<span className="text-blue-600">pdf | pptx</span>
            </p>
          </div>

          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <span className="text-sm text-gray-600">
                {previewData.length} {previewData.length === 1 ? 'row' : 'rows'}
              </span>
            </div>

            {previewData.length > 2000 && (
              <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  Warning: Exporting {previewData.length} rows may take a while and result in a large file.
                </p>
              </div>
            )}

            <div className="border border-gray-200 rounded overflow-hidden max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {selectedColumns.map(col => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        {ALL_COLUMNS.find(c => c.value === col)?.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      {selectedColumns.map(col => (
                        <td key={col} className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                          {col === 'notificationDate' ? row.notificationDateDisplay : String(row[col] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center">
                  Showing 10 of {previewData.length} rows
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting || previewData.length === 0}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <span>Export PDF</span>
            )}
          </button>
          <button
            onClick={() => handleExport('pptx')}
            disabled={isExporting || previewData.length === 0}
            className="px-4 py-2 bg-green-600 border border-transparent rounded text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating PowerPoint...</span>
              </>
            ) : (
              <span>Export PowerPoint</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
