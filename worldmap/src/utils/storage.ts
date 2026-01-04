import type { VisitedData } from '../types';
import { getCountryByAlpha3 } from './countries';

const STORAGE_KEY = 'worldmap-visited-countries';
const MAX_FILE_SIZE = 100 * 1024; // 100KB
const MAX_VISITED_COUNT = 300; // More than all countries exist

// Validate ISO date string
function isValidISODate(str: string): boolean {
  if (typeof str !== 'string') return false;
  const date = new Date(str);
  return !isNaN(date.getTime()) && str.includes('T');
}

// Validate alpha-3 code format and existence
function isValidAlpha3(code: unknown): code is string {
  if (typeof code !== 'string') return false;
  if (!/^[A-Z]{3}$/.test(code)) return false;
  return getCountryByAlpha3(code) !== null;
}

export function loadVisitedData(): VisitedData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data.visited)) {
        // Filter to only valid alpha-3 codes
        const validVisited = data.visited.filter(isValidAlpha3);
        return {
          visited: validVisited,
          lastUpdated: isValidISODate(data.lastUpdated)
            ? data.lastUpdated
            : new Date().toISOString(),
        };
      }
    }
  } catch (e) {
    console.error('Failed to load visited data:', e);
  }
  return { visited: [], lastUpdated: new Date().toISOString() };
}

export interface SaveResult {
  success: boolean;
  error?: string;
}

export function saveVisitedData(data: VisitedData): SaveResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { success: true };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.error('Failed to save visited data:', e);
    return { success: false, error: errorMessage };
  }
}

export function resetVisitedData(): VisitedData {
  const emptyData: VisitedData = { visited: [], lastUpdated: new Date().toISOString() };
  saveVisitedData(emptyData);
  return emptyData;
}

export function exportVisitedData(data: VisitedData): boolean {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visited-countries-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('Failed to export data:', e);
    return false;
  }
}

export function importVisitedData(file: File): Promise<VisitedData> {
  return new Promise((resolve, reject) => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024}KB`));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        // Validate visited array exists
        if (!Array.isArray(data.visited)) {
          throw new Error('Invalid data format: visited must be an array');
        }

        // Cap array length
        if (data.visited.length > MAX_VISITED_COUNT) {
          throw new Error(`Too many entries. Maximum is ${MAX_VISITED_COUNT}`);
        }

        // Filter to only valid alpha-3 codes
        const validVisited: string[] = [];
        const invalidCodes: string[] = [];

        for (const code of data.visited) {
          if (isValidAlpha3(code)) {
            validVisited.push(code);
          } else if (typeof code === 'string') {
            invalidCodes.push(code);
          }
        }

        if (validVisited.length === 0 && data.visited.length > 0) {
          throw new Error('No valid country codes found in file');
        }

        // Validate lastUpdated
        const lastUpdated = isValidISODate(data.lastUpdated)
          ? data.lastUpdated
          : new Date().toISOString();

        // Construct validated data (prevents prototype pollution)
        const validatedData: VisitedData = {
          visited: [...validVisited], // Create new array
          lastUpdated: String(lastUpdated),
        };

        const saveResult = saveVisitedData(validatedData);
        if (!saveResult.success) {
          throw new Error(`Failed to save: ${saveResult.error}`);
        }

        // Log warning if some codes were invalid
        if (invalidCodes.length > 0) {
          console.warn('Skipped invalid country codes:', invalidCodes);
        }

        resolve(validatedData);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
