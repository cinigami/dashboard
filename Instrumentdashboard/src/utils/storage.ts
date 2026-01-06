import type { FilterState, UploadMetadata } from './types';

const FILTER_STATE_KEY = 'instrument-healthiness-filters';
const UPLOAD_METADATA_KEY = 'instrument-healthiness-upload-metadata';

export function saveFilterState(state: FilterState): void {
  try {
    const serialized = {
      areas: state.areas,
      equipmentTypes: state.equipmentTypes,
      statuses: state.statuses,
      dateFrom: state.dateFrom?.toISOString() || null,
      dateTo: state.dateTo?.toISOString() || null,
      searchText: state.searchText,
      sortBy: state.sortBy,
    };
    localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save filter state:', error);
  }
}

export function loadFilterState(): Partial<FilterState> | null {
  try {
    const stored = localStorage.getItem(FILTER_STATE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return {
      areas: parsed.areas,
      equipmentTypes: parsed.equipmentTypes,
      statuses: parsed.statuses,
      dateFrom: parsed.dateFrom ? new Date(parsed.dateFrom) : null,
      dateTo: parsed.dateTo ? new Date(parsed.dateTo) : null,
      searchText: parsed.searchText,
      sortBy: parsed.sortBy,
    };
  } catch (error) {
    console.error('Failed to load filter state:', error);
    return null;
  }
}

export function saveUploadMetadata(metadata: UploadMetadata): void {
  try {
    const serialized = {
      filename: metadata.filename,
      timestamp: metadata.timestamp.toISOString(),
    };
    localStorage.setItem(UPLOAD_METADATA_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Failed to save upload metadata:', error);
  }
}

export function loadUploadMetadata(): UploadMetadata | null {
  try {
    const stored = localStorage.getItem(UPLOAD_METADATA_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return {
      filename: parsed.filename,
      timestamp: new Date(parsed.timestamp),
    };
  } catch (error) {
    console.error('Failed to load upload metadata:', error);
    return null;
  }
}
