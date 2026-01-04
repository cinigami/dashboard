import { memo } from 'react';
import type { MobilePopoverInfo } from '../types';

interface MobilePopoverProps {
  info: MobilePopoverInfo;
  onClose: () => void;
  onToggle: () => void;
}

function MobilePopover({ info, onClose, onToggle }: MobilePopoverProps) {
  if (!info.isOpen || !info.country) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl p-4 pb-8 animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {info.country.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {info.country.alpha3}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onToggle}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                info.isVisited
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {info.isVisited ? 'Mark as Not Visited' : 'Mark as Visited'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(MobilePopover);
