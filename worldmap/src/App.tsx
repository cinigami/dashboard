import { useState, useCallback, useEffect, useMemo } from 'react';
import MapView from './components/MapView';
import Controls from './components/Controls';
import Tooltip from './components/Tooltip';
import MobilePopover from './components/MobilePopover';
import { loadVisitedData, saveVisitedData, resetVisitedData } from './utils/storage';
import { toggleVisited } from './utils/countries';
import type { TooltipInfo, MobilePopoverInfo, VisitedData } from './types';
import './index.css';

function App() {
  const [visitedData, setVisitedData] = useState<VisitedData>(() => loadVisitedData());
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [mobilePopoverInfo, setMobilePopoverInfo] = useState<MobilePopoverInfo>({
    country: null,
    isVisited: false,
    isOpen: false,
  });
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Create Set for O(1) lookups
  const visitedSet = useMemo(() => new Set(visitedData.visited), [visitedData.visited]);

  // Save to localStorage whenever visited data changes
  useEffect(() => {
    const result = saveVisitedData(visitedData);
    if (!result.success) {
      setSaveError(result.error || 'Failed to save data');
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setSaveError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [visitedData]);

  const handleToggleVisited = useCallback((alpha3: string) => {
    setVisitedData((prev) => ({
      visited: toggleVisited(alpha3, prev.visited),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const handleReset = useCallback(() => {
    const emptyData = resetVisitedData();
    setVisitedData(emptyData);
  }, []);

  const handleImport = useCallback((data: VisitedData) => {
    setVisitedData(data);
  }, []);

  const handleTooltipChange = useCallback((info: TooltipInfo | null) => {
    setTooltipInfo(info);
  }, []);

  const handleMobilePopoverChange = useCallback((info: MobilePopoverInfo) => {
    setMobilePopoverInfo(info);
  }, []);

  const handleMobilePopoverClose = useCallback(() => {
    setMobilePopoverInfo((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleMobilePopoverToggle = useCallback(() => {
    if (mobilePopoverInfo.country) {
      handleToggleVisited(mobilePopoverInfo.country.alpha3);
      // Update the popover state to reflect the new visited status
      setMobilePopoverInfo((prev) => ({
        ...prev,
        isVisited: !prev.isVisited,
      }));
    }
  }, [mobilePopoverInfo.country, handleToggleVisited]);

  const handleHighlight = useCallback((alpha3: string | null) => {
    setHighlightedCountry(alpha3);
  }, []);

  const dismissSaveError = useCallback(() => {
    setSaveError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Save error notification */}
      {saveError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
          <span>Failed to save: {saveError}</span>
          <button
            onClick={dismissSaveError}
            className="text-white hover:text-red-200"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            World Travel Tracker
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Map container */}
        <div className="flex-1 min-h-[400px] lg:min-h-0">
          <MapView
            visited={visitedData.visited}
            visitedSet={visitedSet}
            onToggleVisited={handleToggleVisited}
            onTooltipChange={handleTooltipChange}
            onMobilePopoverChange={handleMobilePopoverChange}
            highlightedCountry={highlightedCountry}
          />
        </div>

        {/* Sidebar controls */}
        <div className="lg:w-80 flex-shrink-0">
          <Controls
            visited={visitedData.visited}
            visitedData={visitedData}
            onToggleVisited={handleToggleVisited}
            onReset={handleReset}
            onImport={handleImport}
            onHighlight={handleHighlight}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 text-center text-sm text-gray-500">
          Click on a country to mark it as visited
        </div>
      </footer>

      {/* Tooltip (desktop only) */}
      <Tooltip info={tooltipInfo} />

      {/* Mobile popover */}
      <MobilePopover
        info={mobilePopoverInfo}
        onClose={handleMobilePopoverClose}
        onToggle={handleMobilePopoverToggle}
      />
    </div>
  );
}

export default App;
