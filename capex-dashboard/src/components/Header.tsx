import React from 'react';
import { departmentInfo } from '../data/mockData';
import { Calendar, User, FileSpreadsheet, Upload, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  onUploadClick?: () => void;
  hasUploadedData?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onUploadClick, hasUploadedData }) => {
  return (
    <header className="bg-gradient-to-r from-petronas-teal via-petronas-tealLight to-petronas-teal text-white">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* PETRONAS Logo placeholder */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-petronas-yellow">P</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-white/60 uppercase tracking-wider">PETRONAS Chemicals</p>
                  <p className="text-sm font-semibold">Fertiliser Kedah</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-petronas-yellow" />
                <span className="text-white/80">FY {departmentInfo.fiscalYear}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-petronas-yellow" />
                <span className="text-white/80">{departmentInfo.budgetController}</span>
              </div>
              {onUploadClick && (
                <button
                  onClick={onUploadClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                >
                  {hasUploadedData ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="hidden sm:inline">Data Uploaded</span>
                      <span className="sm:hidden">Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-petronas-yellow" />
                      <span className="hidden sm:inline">Upload Excel</span>
                      <span className="sm:hidden">Upload</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight">
          CAPEX MAINTENANCE 2026
        </h1>
      </div>

      {/* Decorative wave */}
      <div className="relative h-4 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-16"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </header>
  );
};
