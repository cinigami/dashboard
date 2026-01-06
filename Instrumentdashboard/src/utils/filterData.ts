import type { InstrumentRow, FilterState } from './types';

export function filterAndSortData(
  data: InstrumentRow[],
  filters: FilterState
): InstrumentRow[] {
  let filtered = [...data];

  // Apply area filter
  if (filters.areas.length > 0) {
    filtered = filtered.filter(row => filters.areas.includes(row.area));
  }

  // Apply equipment type filter
  if (filters.equipmentTypes.length > 0) {
    filtered = filtered.filter(row =>
      filters.equipmentTypes.includes(row.equipmentType)
    );
  }

  // Apply status filter
  if (filters.statuses.length > 0) {
    filtered = filtered.filter(row => filters.statuses.includes(row.status));
  }

  // Apply date range filter
  if (filters.dateFrom) {
    filtered = filtered.filter(
      row => row.notificationDate >= filters.dateFrom!
    );
  }

  if (filters.dateTo) {
    const endOfDay = new Date(filters.dateTo);
    endOfDay.setHours(23, 59, 59, 999);
    filtered = filtered.filter(row => row.notificationDate <= endOfDay);
  }

  // Apply search filter
  if (filters.searchText.trim()) {
    const searchLower = filters.searchText.toLowerCase();
    filtered = filtered.filter(
      row =>
        row.tagNumber.toLowerCase().includes(searchLower) ||
        row.equipmentDescription.toLowerCase().includes(searchLower) ||
        row.alarmDescription.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'date-desc':
        return b.notificationDate.getTime() - a.notificationDate.getTime();
      case 'date-asc':
        return a.notificationDate.getTime() - b.notificationDate.getTime();
      case 'tag-asc':
        return a.tagNumber.localeCompare(b.tagNumber);
      case 'status-severity': {
        const severityOrder = { Warning: 0, Caution: 1, Healthy: 2, Unknown: 3 };
        return severityOrder[a.status] - severityOrder[b.status];
      }
      default:
        return 0;
    }
  });

  return filtered;
}

export function getUniqueEquipmentTypes(data: InstrumentRow[]): string[] {
  const types = new Set(data.map(row => row.equipmentType));
  return Array.from(types).sort();
}
