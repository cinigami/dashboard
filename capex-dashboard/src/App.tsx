import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { Filters } from './components/Filters';
import { DisciplineCharts } from './components/DisciplineCharts';
import { DisciplineTable } from './components/DisciplineTable';
import { TrendChart } from './components/TrendChart';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { useFilteredData } from './hooks/useFilteredData';
import { projectsData, monthlySpendData } from './data/mockData';
import { FilterState, Project } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    disciplines: [],
    dateRange: { start: null, end: null },
    statuses: [],
  });
  const [uploadedProjects, setUploadedProjects] = useState<Project[] | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Use uploaded data if available, otherwise use mock data
  const activeProjects = uploadedProjects || projectsData;

  const disciplines = useMemo(() => {
    const uniqueDisciplines = [...new Set(activeProjects.map(p => p.discipline))];
    return uniqueDisciplines.sort();
  }, [activeProjects]);

  const { disciplineData, kpiData } = useFilteredData(activeProjects, filters);

  const handleUpload = useCallback((projects: Project[]) => {
    setUploadedProjects(projects);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleOpenUploadModal = useCallback(() => {
    setIsUploadModalOpen(true);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onUploadClick={handleOpenUploadModal} hasUploadedData={uploadedProjects !== null} />

      {/* Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onUpload={handleUpload}
      />

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Filters */}
        <Filters
          filters={filters}
          onFiltersChange={setFilters}
          disciplines={disciplines}
        />

        {/* Hero KPIs */}
        <section>
          <KPICards data={kpiData} loading={loading} />
        </section>

        {/* Charts Section */}
        <section>
          <DisciplineCharts data={disciplineData} loading={loading} />
        </section>

        {/* Table Section */}
        <section>
          <DisciplineTable data={disciplineData} loading={loading} />
        </section>

        {/* Trend Chart */}
        <section>
          <TrendChart data={monthlySpendData} loading={loading} />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            CAPEX Dashboard • Maintenance & Reliability Department • PETRONAS Chemicals Fertiliser Kedah
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Data refreshed: January 19, 2026 • Fiscal Year 2026
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
