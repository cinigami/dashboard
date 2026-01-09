export type Area = 'Ammonia' | 'Utility' | 'Urea' | 'System' | 'Turbomachinery';

export type Status = 'Healthy' | 'Caution' | 'Warning' | 'Unknown';

export interface InstrumentRow {
  area: Area;
  equipmentType: string;
  tagNumber: string;
  equipmentDescription: string;
  status: Status;
  alarmDescription: string;
  rectification: string;
  notificationDate: Date;
  notificationDateDisplay: string;
}

export interface FilterState {
  areas: Area[];
  equipmentTypes: string[];
  statuses: Status[];
  dateFrom: Date | null;
  dateTo: Date | null;
  searchText: string;
  sortBy: SortOption;
}

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'tag-asc'
  | 'status-severity';

export interface ExcelParseResult {
  data: InstrumentRow[];
  warnings: string[];
  errors: string[];
}

export interface UploadMetadata {
  filename: string;
  timestamp: Date;
}

export interface ExportConfig {
  areas: Area[];
  equipmentTypes: string[];
  statuses: Status[];
  dateFrom: Date | null;
  dateTo: Date | null;
  columns: ExportColumn[];
  filename: string;
}

export type ExportColumn =
  | 'area'
  | 'equipmentType'
  | 'tagNumber'
  | 'equipmentDescription'
  | 'status'
  | 'alarmDescription'
  | 'rectification'
  | 'notificationDate';

export interface ExportColumnOption {
  value: ExportColumn;
  label: string;
}

export interface StatusCount {
  status: Status;
  count: number;
  percentage: number;
}

export interface EquipmentTypeStats {
  equipmentType: string;
  statusCounts: StatusCount[];
  total: number;
}
