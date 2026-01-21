import { useMemo } from 'react';
import { Project, DisciplineData, KPIData, FilterState } from '../types';
import { calculateDisciplineData } from '../data/mockData';

export const useFilteredData = (
  projects: Project[],
  filters: FilterState
): {
  filteredProjects: Project[];
  disciplineData: DisciplineData[];
  kpiData: KPIData;
} => {
  return useMemo(() => {
    // Apply filters
    let filteredProjects = [...projects];
    
    // Filter by disciplines
    if (filters.disciplines.length > 0) {
      filteredProjects = filteredProjects.filter(
        project => filters.disciplines.includes(project.discipline)
      );
    }
    
    // Filter by date range
    if (filters.dateRange.start) {
      filteredProjects = filteredProjects.filter(project => {
        if (!project.startDate) return true;
        return project.startDate >= filters.dateRange.start!;
      });
    }
    
    if (filters.dateRange.end) {
      filteredProjects = filteredProjects.filter(project => {
        if (!project.endDate) return true;
        return project.endDate <= filters.dateRange.end!;
      });
    }
    
    // Calculate discipline data
    const disciplineData = calculateDisciplineData(filteredProjects);
    
    // Filter by status
    let filteredDisciplineData = disciplineData;
    if (filters.statuses.length > 0) {
      filteredDisciplineData = disciplineData.filter(
        d => filters.statuses.includes(d.status)
      );
    }
    
    // Calculate KPIs
    const totalApproved = filteredDisciplineData.reduce((sum, d) => sum + d.approvedBudget, 0);
    const actualSpend = filteredDisciplineData.reduce((sum, d) => sum + d.actualSpend, 0);
    const remaining = totalApproved - actualSpend;
    const utilization = totalApproved > 0 ? (actualSpend / totalApproved) * 100 : 0;
    const overrun = actualSpend > totalApproved ? actualSpend - totalApproved : 0;
    
    const healthyCount = filteredDisciplineData.filter(d => d.status === 'Healthy').length;
    const cautionCount = filteredDisciplineData.filter(d => d.status === 'Caution').length;
    const overrunCount = filteredDisciplineData.filter(d => d.status === 'Overrun').length;
    
    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter(p => p.projectStatus === 'Active').length;
    
    return {
      filteredProjects,
      disciplineData: filteredDisciplineData,
      kpiData: {
        totalApproved,
        actualSpend,
        remaining,
        utilization,
        overrun,
        healthyCount,
        cautionCount,
        overrunCount,
        totalProjects,
        activeProjects,
      },
    };
  }, [projects, filters]);
};
