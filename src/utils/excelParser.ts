import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { Area, Status, InstrumentRow, ExcelParseResult } from './types';

const REQUIRED_AREAS: Area[] = ['Ammonia', 'Utility', 'Urea', 'System', 'Turbomachinery'];

const REQUIRED_COLUMNS = [
  'Equipment Type',
  'Tag Number',
  'Equipment Description',
  'Status',
  'Alarm Description',
  'Rectification',
  'Notification Date',
];

function normalizeStatus(value: unknown): Status {
  if (!value) return 'Unknown';

  const str = String(value).trim().toLowerCase();

  if (str === 'healthy') return 'Healthy';
  if (str === 'caution') return 'Caution';
  if (str === 'warning') return 'Warning';

  return 'Unknown';
}

function parseExcelDate(value: unknown): { date: Date; display: string } {
  if (!value) {
    const now = new Date();
    return { date: now, display: format(now, 'yyyy-MM-dd') };
  }

  // Excel serial date number
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value);
    const dateObj = new Date(date.y, date.m - 1, date.d);
    return { date: dateObj, display: format(dateObj, 'yyyy-MM-dd') };
  }

  // String date
  if (typeof value === 'string') {
    try {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        return { date: parsed, display: format(parsed, 'yyyy-MM-dd') };
      }
    } catch {
      // Fall through to default
    }
  }

  // Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    return { date: value, display: format(value, 'yyyy-MM-dd') };
  }

  // Default fallback
  const now = new Date();
  return { date: now, display: format(now, 'yyyy-MM-dd') };
}

function validateColumns(headers: string[]): string[] {
  const missing: string[] = [];

  for (const required of REQUIRED_COLUMNS) {
    if (!headers.includes(required)) {
      missing.push(required);
    }
  }

  return missing;
}

export function parseExcelFile(file: ArrayBuffer): ExcelParseResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const data: InstrumentRow[] = [];

  try {
    const workbook = XLSX.read(file, { type: 'array' });

    // Check for missing sheets
    const missingSheets = REQUIRED_AREAS.filter(
      area => !workbook.SheetNames.includes(area)
    );

    if (missingSheets.length > 0) {
      warnings.push(`Missing sheets: ${missingSheets.join(', ')}`);
    }

    // Parse each area sheet
    for (const area of REQUIRED_AREAS) {
      if (!workbook.SheetNames.includes(area)) {
        continue; // Skip missing sheets
      }

      const worksheet = workbook.Sheets[area];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

      if (jsonData.length === 0) {
        warnings.push(`Sheet "${area}" is empty`);
        continue;
      }

      // Get headers from first row
      const headers = jsonData[0] as string[];
      const missingColumns = validateColumns(headers);

      if (missingColumns.length > 0) {
        errors.push(
          `Sheet "${area}" is missing required columns: ${missingColumns.join(', ')}`
        );
        continue; // Skip this sheet if columns are missing
      }

      // Create column index map
      const colIndex: Record<string, number> = {};
      headers.forEach((header, index) => {
        colIndex[header] = index;
      });

      // Parse data rows (skip header)
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as unknown[];

        if (!row || row.length === 0) continue; // Skip empty rows

        const equipmentType = String(row[colIndex['Equipment Type']] || '').trim();
        const tagNumber = String(row[colIndex['Tag Number']] || '').trim();

        // Skip rows with no equipment type or tag number
        if (!equipmentType && !tagNumber) continue;

        const status = normalizeStatus(row[colIndex['Status']]);
        const dateResult = parseExcelDate(row[colIndex['Notification Date']]);

        const instrumentRow: InstrumentRow = {
          area: area as Area,
          equipmentType,
          tagNumber,
          equipmentDescription: String(row[colIndex['Equipment Description']] || '').trim(),
          status,
          alarmDescription: String(row[colIndex['Alarm Description']] || '').trim(),
          rectification: String(row[colIndex['Rectification']] || '').trim(),
          notificationDate: dateResult.date,
          notificationDateDisplay: dateResult.display,
        };

        data.push(instrumentRow);
      }
    }

    // If we have errors, return empty data
    if (errors.length > 0) {
      return { data: [], warnings, errors };
    }

    return { data, warnings, errors };
  } catch (error) {
    errors.push(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { data: [], warnings, errors };
  }
}
