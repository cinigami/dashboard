import * as XLSX from 'xlsx';
import type { Project, Priority, ProjectStatus } from '../types';

interface ExcelRow {
  [key: string]: string | number | Date | undefined;
}

const COLUMN_MAPPINGS: Record<string, keyof Project> = {
  'id': 'id',
  'ID': 'id',
  'name': 'name',
  'Name': 'name',
  'Project Name': 'name',
  'project_name': 'name',
  'wbs': 'wbsNumber',
  'WBS': 'wbsNumber',
  'WBS Number': 'wbsNumber',
  'wbs_number': 'wbsNumber',
  'project_manager': 'projectManager',
  'Project Manager': 'projectManager',
  'PM': 'projectManager',
  'discipline': 'discipline',
  'Discipline': 'discipline',
  'original_budget': 'originalBudget',
  'Original Budget': 'originalBudget',
  'originalBudget': 'originalBudget',
  'contract_value': 'contractValue',
  'Contract Value': 'contractValue',
  'contractValue': 'contractValue',
  'budget_transfer_in': 'budgetTransferIn',
  'Budget Transfer In': 'budgetTransferIn',
  'budgetTransferIn': 'budgetTransferIn',
  'budget_transfer_out': 'budgetTransferOut',
  'Budget Transfer Out': 'budgetTransferOut',
  'budgetTransferOut': 'budgetTransferOut',
  'current_budget': 'currentBudget',
  'Current Budget': 'currentBudget',
  'currentBudget': 'currentBudget',
  'actual_spend': 'actualSpend',
  'Actual Spend': 'actualSpend',
  'actualSpend': 'actualSpend',
  'planned_spend': 'plannedSpend',
  'Planned Spend': 'plannedSpend',
  'plannedSpend': 'plannedSpend',
  'start_date': 'startDate',
  'Start Date': 'startDate',
  'startDate': 'startDate',
  'end_date': 'endDate',
  'End Date': 'endDate',
  'endDate': 'endDate',
  'vendor': 'vendor',
  'Vendor': 'vendor',
  'payment_terms': 'paymentTerms',
  'Payment Terms': 'paymentTerms',
  'paymentTerms': 'paymentTerms',
  'project_status': 'projectStatus',
  'Project Status': 'projectStatus',
  'projectStatus': 'projectStatus',
  'Status': 'projectStatus',
  'priority': 'priority',
  'Priority': 'priority',
  'remarks': 'remarks',
  'Remarks': 'remarks',
  'Notes': 'remarks',
};

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[,\s]/g, '').replace(/^RM\s*/i, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') {
    // Excel serial date
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return new Date(date.y, date.m - 1, date.d);
    }
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function parseProjectStatus(value: unknown): ProjectStatus {
  const str = String(value || '').toLowerCase();
  if (str.includes('active')) return 'Active';
  if (str.includes('planning')) return 'Planning';
  if (str.includes('completed') || str.includes('complete')) return 'Completed';
  if (str.includes('hold')) return 'On Hold';
  return 'Active';
}

function parsePriority(value: unknown): Priority {
  const str = String(value || '').toLowerCase();
  if (str.includes('critical')) return 'Critical';
  if (str.includes('high')) return 'High';
  if (str.includes('low')) return 'Low';
  return 'Medium';
}

function mapRowToProject(row: ExcelRow, index: number): Project | null {
  const mapped: Partial<Project> = {};

  for (const [excelCol, projectField] of Object.entries(COLUMN_MAPPINGS)) {
    if (row[excelCol] !== undefined) {
      const value = row[excelCol];

      switch (projectField) {
        case 'id':
          mapped.id = String(value || `PROJ-${index + 1}`);
          break;
        case 'name':
          mapped.name = String(value || '');
          break;
        case 'wbsNumber':
          mapped.wbsNumber = value ? String(value) : null;
          break;
        case 'projectManager':
          mapped.projectManager = String(value || 'Unassigned');
          break;
        case 'discipline':
          mapped.discipline = String(value || 'General');
          break;
        case 'originalBudget':
        case 'contractValue':
        case 'budgetTransferIn':
        case 'budgetTransferOut':
        case 'currentBudget':
        case 'actualSpend':
        case 'plannedSpend':
          mapped[projectField] = parseNumber(value);
          break;
        case 'startDate':
        case 'endDate':
          mapped[projectField] = parseDate(value);
          break;
        case 'vendor':
        case 'paymentTerms':
        case 'remarks':
          mapped[projectField] = value ? String(value) : null;
          break;
        case 'projectStatus':
          mapped.projectStatus = parseProjectStatus(value);
          break;
        case 'priority':
          mapped.priority = parsePriority(value);
          break;
      }
    }
  }

  // Validate required fields
  if (!mapped.name) {
    return null;
  }

  // Set defaults for missing fields
  return {
    id: mapped.id || `PROJ-${index + 1}`,
    name: mapped.name,
    wbsNumber: mapped.wbsNumber || null,
    projectManager: mapped.projectManager || 'Unassigned',
    discipline: mapped.discipline || 'General',
    originalBudget: mapped.originalBudget || 0,
    contractValue: mapped.contractValue || 0,
    budgetTransferIn: mapped.budgetTransferIn || 0,
    budgetTransferOut: mapped.budgetTransferOut || 0,
    currentBudget: mapped.currentBudget || mapped.originalBudget || 0,
    actualSpend: mapped.actualSpend || 0,
    plannedSpend: mapped.plannedSpend || 0,
    startDate: mapped.startDate || null,
    endDate: mapped.endDate || null,
    vendor: mapped.vendor || null,
    paymentTerms: mapped.paymentTerms || null,
    projectStatus: mapped.projectStatus || 'Active',
    priority: mapped.priority || 'Medium',
    remarks: mapped.remarks || null,
  };
}

export interface ParseResult {
  projects: Project[];
  errors: string[];
  totalRows: number;
  successCount: number;
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        // Use first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);

        const projects: Project[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
          const project = mapRowToProject(row, index);
          if (project) {
            projects.push(project);
          } else {
            errors.push(`Row ${index + 2}: Missing required field 'name'`);
          }
        });

        resolve({
          projects,
          errors,
          totalRows: rows.length,
          successCount: projects.length,
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}
