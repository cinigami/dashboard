import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parseExcelFile, type ParseResult } from '../utils/excelParser';
import type { Project } from '../types';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (projects: Project[]) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  const processFile = useCallback(async (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    const validExtensions = ['.xlsx', '.xls', '.csv'];

    const hasValidExtension = validExtensions.some(ext =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError('Please upload an Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const parseResult = await parseExcelFile(file);
      setResult(parseResult);

      if (parseResult.successCount === 0) {
        setError('No valid projects found in the file. Please check the column headers.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleConfirmUpload = useCallback(() => {
    if (result && result.successCount > 0) {
      onUpload(result.projects);
      handleClose();
    }
  }, [result, onUpload, handleClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-petronas-teal to-petronas-tealLight px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-petronas-yellow" />
            <h2 className="text-lg font-semibold text-white">Upload Excel Data</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result && !isLoading && (
            <>
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${isDragging
                    ? 'border-petronas-teal bg-petronas-teal/5'
                    : 'border-gray-300 hover:border-petronas-teal hover:bg-gray-50'
                  }
                `}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-petronas-teal' : 'text-gray-400'}`} />
                <p className="text-gray-700 font-medium mb-1">
                  Drop your Excel file here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-3">
                  Supports .xlsx, .xls, and .csv files
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Expected format hint */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Expected columns:</p>
                <p className="text-xs text-gray-500">
                  Name, Discipline, Original Budget, Current Budget, Actual Spend, Planned Spend, Start Date, End Date, Vendor, Project Manager, Priority, Status
                </p>
              </div>
            </>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 mx-auto text-petronas-teal animate-spin mb-4" />
              <p className="text-gray-600">Parsing Excel file...</p>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-gray-900">File parsed successfully</p>
                  <p className="text-sm text-gray-500">
                    {result.successCount} of {result.totalRows} rows imported
                  </p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    {result.errors.length} row(s) skipped:
                  </p>
                  <ul className="text-xs text-yellow-700 max-h-20 overflow-y-auto">
                    {result.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>...and {result.errors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Preview (first 3 projects):</p>
                <div className="space-y-2">
                  {result.projects.slice(0, 3).map((project, i) => (
                    <div key={i} className="text-xs bg-white rounded p-2 border">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-gray-500 ml-2">• {project.discipline}</span>
                      <span className="text-gray-500 ml-2">
                        • RM {(project.currentBudget / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {result && result.successCount > 0 && (
            <button
              onClick={handleConfirmUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-petronas-teal hover:bg-petronas-tealDark rounded-lg transition-colors"
            >
              Upload {result.successCount} Projects
            </button>
          )}
          {!result && !isLoading && (
            <button
              onClick={resetState}
              className="px-4 py-2 text-sm font-medium text-white bg-petronas-teal hover:bg-petronas-tealDark rounded-lg transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
