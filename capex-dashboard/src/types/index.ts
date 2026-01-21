export type Status = 'Healthy' | 'Caution' | 'Overrun';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ProjectStatus = 'Active' | 'Planning' | 'Completed' | 'On Hold';

export interface Project {
  id: string;
  name: string;
  wbsNumber: string | null;
  projectManager: string;
  discipline: string;
  originalBudget: number;
  contractValue: number;
  budgetTransferIn: number;
  budgetTransferOut: number;
  currentBudget: number;
  actualSpend: number;
  plannedSpend: number;
  startDate: Date | null;
  endDate: Date | null;
  vendor: string | null;
  paymentTerms: string | null;
  projectStatus: ProjectStatus;
  priority: Priority;
  remarks: string | null;
}

export interface DisciplineData {
  discipline: string;
  approvedBudget: number;
  actualSpend: number;
  plannedSpend: number;
  remaining: number;
  utilization: number;
  variance: number;
  status: Status;
  projectCount: number;
  projects: Project[];
}

export interface MonthlySpend {
  month: string;
  planned: number;
  actual: number;
  cumPlanned: number;
  cumActual: number;
}

export interface KPIData {
  totalApproved: number;
  actualSpend: number;
  remaining: number;
  utilization: number;
  overrun: number;
  healthyCount: number;
  cautionCount: number;
  overrunCount: number;
  totalProjects: number;
  activeProjects: number;
}

export interface FilterState {
  disciplines: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  statuses: Status[];
}
