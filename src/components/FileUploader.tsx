import React, { useState, useRef } from 'react';
import { parseExcelFile } from '../utils/excelParser';
import type { InstrumentRow } from '../utils/types';
import { PETRONAS_COLORS } from '../utils/colors';

interface FileUploaderProps {
  onDataLoaded: (data: InstrumentRow[], filename: string) => void;
}

export default function FileUploader({ onDataLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      setErrors(['Please upload an Excel file (.xlsx)']);
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setWarnings([]);

    try {
      const buffer = await file.arrayBuffer();
      const result = parseExcelFile(buffer);

      if (result.errors.length > 0) {
        setErrors(result.errors);
        setIsLoading(false);
        return;
      }

      if (result.warnings.length > 0) {
        setWarnings(result.warnings);
      }

      if (result.data.length === 0) {
        setErrors(['No valid data found in the Excel file']);
        setIsLoading(false);
        return;
      }

      onDataLoaded(result.data, file.name);
      setIsLoading(false);
    } catch (error) {
      setErrors([`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-petronas-emerald bg-emerald-50 shadow-glow-emerald'
            : 'border-gray-300 hover:border-petronas-emerald hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleFileInput}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div
              className="animate-spin rounded-full h-6 w-6 border-b-2"
              style={{ borderColor: PETRONAS_COLORS.emeraldGreen }}
            ></div>
            <span className="text-gray-700 font-medium">Processing file...</span>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-16 w-16 mb-4"
              style={{ color: PETRONAS_COLORS.emeraldGreen }}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-base text-gray-700 mb-2">
              <span className="font-semibold" style={{ color: PETRONAS_COLORS.emeraldGreen }}>
                Click to upload
              </span>{' '}
              <span className="text-gray-600">or drag and drop</span>
            </p>
            <p className="text-sm text-gray-500">Excel file (.xlsx) only</p>
          </div>
        )}
      </div>

      {warnings.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 rounded-lg" style={{ borderColor: PETRONAS_COLORS.yellow }}>
          <div className="flex items-start">
            <svg
              className="h-6 w-6 mt-0.5 flex-shrink-0"
              style={{ color: PETRONAS_COLORS.yellow }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Warnings</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 rounded-lg" style={{ borderColor: PETRONAS_COLORS.red }}>
          <div className="flex items-start">
            <svg
              className="h-6 w-6 mt-0.5 flex-shrink-0"
              style={{ color: PETRONAS_COLORS.red }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Errors</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
