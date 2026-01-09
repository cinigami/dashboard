import * as XLSX from 'xlsx';

const HEADERS = [
  'Equipment Type',
  'Tag Number',
  'Equipment Description',
  'Status',
  'Alarm Description',
  'Rectification',
  'Notification Date',
];

const SAMPLE_DATA: Record<string, unknown[][]> = {
  Ammonia: [
    ['Flow Transmitter', 'FT-1001', 'Ammonia Feed Flow', 'Healthy', '', '', '2024-01-15'],
    ['Pressure Transmitter', 'PT-1002', 'Reactor Pressure', 'Caution', 'High pressure alarm', 'Calibrate sensor', '2024-01-20'],
    ['Temperature Transmitter', 'TT-1003', 'Converter Temperature', 'Warning', 'ALS - Obsolete model', 'Replace with new model', '2024-01-25'],
    ['Level Transmitter', 'LT-1004', 'Storage Tank Level', 'Healthy', '', '', '2024-02-01'],
  ],
  Utility: [
    ['Flow Transmitter', 'FT-2001', 'Cooling Water Flow', 'Healthy', '', '', '2024-01-10'],
    ['Pressure Transmitter', 'PT-2002', 'Steam Pressure', 'Caution', 'Fluctuating readings', 'Inspect wiring', '2024-01-18'],
    ['Temperature Transmitter', 'TT-2003', 'Boiler Temperature', 'Healthy', '', '', '2024-02-05'],
    ['Valve Positioner', 'VP-2004', 'Steam Control Valve', 'Warning', 'ALS - No spare parts', 'Plan replacement', '2024-01-28'],
  ],
  Urea: [
    ['Flow Transmitter', 'FT-3001', 'Urea Solution Flow', 'Healthy', '', '', '2024-01-12'],
    ['Pressure Transmitter', 'PT-3002', 'Synthesis Pressure', 'Warning', 'Sensor drift detected', 'Replace sensor', '2024-01-22'],
    ['Analyzer', 'AT-3003', 'Urea Concentration', 'Caution', 'ALS - Limited support', 'Evaluate alternatives', '2024-02-03'],
    ['Level Transmitter', 'LT-3004', 'Product Tank Level', 'Healthy', '', '', '2024-02-08'],
  ],
  System: [
    ['DCS Controller', 'DC-4001', 'Main Process Controller', 'Healthy', '', '', '2024-01-05'],
    ['Safety Valve', 'SV-4002', 'Emergency Relief Valve', 'Caution', 'Maintenance due', 'Schedule inspection', '2024-01-16'],
    ['Actuator', 'AC-4003', 'Emergency Shutdown Valve', 'Warning', 'ALS - Obsolete firmware', 'Upgrade firmware', '2024-01-30'],
    ['Power Supply', 'PS-4004', 'Instrument Power Supply', 'Healthy', '', '', '2024-02-02'],
  ],
  Turbomachinery: [
    ['Vibration Monitor', 'VM-5001', 'Compressor Vibration', 'Healthy', '', '', '2024-01-08'],
    ['Speed Sensor', 'SS-5002', 'Turbine Speed', 'Caution', 'Signal noise', 'Check grounding', '2024-01-19'],
    ['Temperature Sensor', 'TS-5003', 'Bearing Temperature', 'Warning', 'ALS - Out of production', 'Source replacement', '2024-01-26'],
    ['Pressure Sensor', 'PS-5004', 'Discharge Pressure', 'Healthy', '', '', '2024-02-06'],
  ],
};

export function generateTemplate(): void {
  const workbook = XLSX.utils.book_new();

  const areas = ['Ammonia', 'Utility', 'Urea', 'System', 'Turbomachinery'];

  areas.forEach(area => {
    const sampleData = SAMPLE_DATA[area] || [];
    const sheetData = [HEADERS, ...sampleData];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Equipment Type
      { wch: 12 }, // Tag Number
      { wch: 25 }, // Equipment Description
      { wch: 10 }, // Status
      { wch: 30 }, // Alarm Description
      { wch: 25 }, // Rectification
      { wch: 15 }, // Notification Date
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, area);
  });

  XLSX.writeFile(workbook, 'Instrument_Asset_Healthiness_Template.xlsx');
}
