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
import { Modal, Button, Tabs, Tab, Card } from './ui';
import { PETRONAS_COLORS } from '../utils/colors';

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
  const [exportFormat, setExportFormat] = useState<'pdf' | 'pptx'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
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

  const handleExport = async () => {
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
    setExportStep(1);

    try {
      // Step 1: Preparing data
      await new Promise(resolve => setTimeout(resolve, 300));
      setExportStep(2);

      // Step 2: Generating document
      const config: ExportConfig = {
        areas: selectedAreas.length > 0 ? selectedAreas : AREAS,
        equipmentTypes: selectedEquipmentTypes,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : STATUSES,
        dateFrom,
        dateTo,
        columns: selectedColumns,
        filename: `${filename}.${exportFormat}`,
      };

      if (exportFormat === 'pdf') {
        exportToPdf(previewData, config);
      } else {
        exportToPowerPoint(previewData, config);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setExportStep(3);

      // Step 3: Finalizing
      await new Promise(resolve => setTimeout(resolve, 300));

      setTimeout(() => {
        setIsExporting(false);
        setExportStep(0);
        onClose();
      }, 500);
    } catch (err) {
      setError(`Failed to export: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsExporting(false);
      setExportStep(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
            Export Dashboard Data
          </h2>
          <p className="text-sm text-gray-600">
            Configure export settings and preview data before generating documents
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Settings */}
        <div className="space-y-6">
          {/* Format Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <Tabs
              value={exportFormat}
              onChange={(value) => setExportFormat(value as 'pdf' | 'pptx')}
            >
              <Tab value="pdf">PDF Document</Tab>
              <Tab value="pptx">PowerPoint Presentation</Tab>
            </Tabs>
          </div>

          {/* Export Scope */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Scope</h3>
            <div className="space-y-4">
              {/* Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Areas</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {AREAS.map(area => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedAreas.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                        className="rounded border-gray-300 text-petronas-emerald focus-premium"
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
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {availableEquipmentTypes.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No data loaded</p>
                  ) : (
                    availableEquipmentTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={selectedEquipmentTypes.includes(type)}
                          onChange={() => handleEquipmentTypeToggle(type)}
                          className="rounded border-gray-300 text-petronas-emerald focus-premium"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Statuses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statuses</label>
                <div className="space-y-2 border border-gray-300 rounded-lg p-3">
                  {STATUSES.map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={formatDateForInput(dateFrom)}
                    onChange={e => setDateFrom(e.target.value ? new Date(e.target.value) : null)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-3 py-2"
                    placeholder="From"
                  />
                  <input
                    type="date"
                    value={formatDateForInput(dateTo)}
                    onChange={e => setDateTo(e.target.value ? new Date(e.target.value) : null)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-3 py-2"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Columns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Columns to Include</label>
                <div className="grid grid-cols-1 gap-2 border border-gray-300 rounded-lg p-3">
                  {ALL_COLUMNS.map(col => (
                    <label key={col.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(col.value)}
                        onChange={() => handleColumnToggle(col.value)}
                        className="rounded border-gray-300 text-petronas-emerald focus-premium"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Generated Filename</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-mono text-gray-900">
                {filename}.<span style={{ color: PETRONAS_COLORS.emeraldGreen }}>{exportFormat}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Data Preview</h3>
              <span className="text-sm text-gray-600">
                {previewData.length} {previewData.length === 1 ? 'row' : 'rows'}
              </span>
            </div>

            {previewData.length > 2000 && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 rounded" style={{ borderColor: PETRONAS_COLORS.yellow }}>
                <p className="text-sm" style={{ color: PETRONAS_COLORS.yellow }}>
                  Warning: Exporting {previewData.length} rows may take a while and result in a large file.
                </p>
              </div>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="table-executive">
                <thead>
                  <tr>
                    {selectedColumns.map(col => (
                      <th key={col}>
                        {ALL_COLUMNS.find(c => c.value === col)?.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      {selectedColumns.map(col => (
                        <td key={col} className="whitespace-nowrap">
                          {col === 'notificationDate' ? row.notificationDateDisplay : String(row[col] || '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 10 && (
                <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center border-t border-gray-200">
                  Showing 10 of {previewData.length} rows
                </div>
              )}
            </div>
          </Card>

          {/* Loading Progress */}
          {isExporting && (
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Export Progress</h4>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-2 rounded ${exportStep >= 1 ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${exportStep >= 1 ? 'bg-petronas-emerald' : 'bg-gray-300'}`}>
                    {exportStep > 1 ? (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Preparing data...</span>
                </div>

                <div className={`flex items-center gap-3 p-2 rounded ${exportStep >= 2 ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${exportStep >= 2 ? 'bg-petronas-emerald' : 'bg-gray-300'}`}>
                    {exportStep > 2 ? (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : exportStep === 2 ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    ) : null}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Generating document...</span>
                </div>

                <div className={`flex items-center gap-3 p-2 rounded ${exportStep >= 3 ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${exportStep >= 3 ? 'bg-petronas-emerald' : 'bg-gray-300'}`}>
                    {exportStep === 3 && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Finalizing...</span>
                </div>
              </div>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card>
              <div className="p-4 bg-red-50 border-l-4 rounded" style={{ borderColor: PETRONAS_COLORS.red }}>
                <p className="text-sm" style={{ color: PETRONAS_COLORS.red }}>{error}</p>
              </div>
            </Card>
          )}
        </div>
      </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleExport}
            disabled={isExporting || previewData.length === 0 || selectedColumns.length === 0}
            isLoading={isExporting}
          >
            {isExporting
              ? `Generating ${exportFormat.toUpperCase()}...`
              : `Export ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
