import pptxgen from 'pptxgenjs';
import { format } from 'date-fns';
import type { InstrumentRow, ExportConfig } from './types';
import { calculateOverallScore, getStatusCounts } from './scoring';

export function exportToPowerPoint(data: InstrumentRow[], config: ExportConfig): void {
  const pptx = new pptxgen();

  // Slide 1: Title and Summary
  const slide1 = pptx.addSlide();

  // Title - Using PETRONAS Dark Blue
  slide1.addText('Instrument Asset Healthiness Report', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 0.8,
    fontSize: 32,
    bold: true,
    color: '0B3C49', // PETRONAS Dark Blue
    align: 'center',
  });

  // Timestamp
  slide1.addText(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, {
    x: 0.5,
    y: 1.4,
    w: 9,
    h: 0.4,
    fontSize: 12,
    color: '666666',
    align: 'center',
  });

  // Filter Summary
  const filterLines: string[] = [];

  if (config.areas.length > 0) {
    filterLines.push(`Areas: ${config.areas.join(', ')}`);
  }
  if (config.equipmentTypes.length > 0) {
    filterLines.push(`Equipment Types: ${config.equipmentTypes.slice(0, 5).join(', ')}${config.equipmentTypes.length > 5 ? '...' : ''}`);
  }
  if (config.statuses.length > 0) {
    filterLines.push(`Statuses: ${config.statuses.join(', ')}`);
  }
  if (config.dateFrom || config.dateTo) {
    const fromStr = config.dateFrom ? format(config.dateFrom, 'yyyy-MM-dd') : 'Start';
    const toStr = config.dateTo ? format(config.dateTo, 'yyyy-MM-dd') : 'End';
    filterLines.push(`Date Range: ${fromStr} to ${toStr}`);
  }

  slide1.addText('Applied Filters', {
    x: 0.5,
    y: 2.2,
    w: 4,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '0B3C49', // PETRONAS Dark Blue
  });

  slide1.addText(filterLines.join('\n'), {
    x: 0.5,
    y: 2.7,
    w: 4,
    h: 2,
    fontSize: 11,
    color: '333333',
  });

  // Summary Stats
  const score = calculateOverallScore(data);
  const counts = getStatusCounts(data);

  slide1.addText('Summary', {
    x: 5.5,
    y: 2.2,
    w: 4,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '0B3C49', // PETRONAS Dark Blue
  });

  // Gauge visual using PETRONAS colors
  const gaugeColor = score >= 80 ? '00B1A9' : score >= 60 ? 'FDB924' : 'E31837'; // PETRONAS colors

  slide1.addShape('roundRect', {
    x: 6.5,
    y: 2.8,
    w: 1.5,
    h: 1.5,
    fill: { color: gaugeColor },
  });

  slide1.addText(String(score), {
    x: 6.5,
    y: 3.2,
    w: 1.5,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
  });

  // Status counts
  slide1.addText(
    `Healthy: ${counts.Healthy}\nCaution: ${counts.Caution}\nWarning: ${counts.Warning}\nTotal: ${data.length}`,
    {
      x: 5.5,
      y: 4.5,
      w: 4,
      h: 1,
      fontSize: 12,
      color: '333333',
    }
  );

  // Slide 2: Status Distribution by Equipment Type
  const slide2 = pptx.addSlide();

  slide2.addText('Status Distribution by Equipment Type', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '0B3C49', // PETRONAS Dark Blue
  });

  // Group by equipment type and get top 6
  const equipmentGroups: Record<string, InstrumentRow[]> = {};
  data.forEach(row => {
    if (!equipmentGroups[row.equipmentType]) {
      equipmentGroups[row.equipmentType] = [];
    }
    equipmentGroups[row.equipmentType].push(row);
  });

  const sortedEquipmentTypes = Object.entries(equipmentGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6);

  // Create simple table showing top equipment types
  // Use PETRONAS Dark Blue for table headers
  const tableData: any[] = [
    [
      { text: 'Equipment Type', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
      { text: 'Healthy', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
      { text: 'Caution', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
      { text: 'Warning', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
      { text: 'Total', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
    ],
  ];

  sortedEquipmentTypes.forEach(([type, rows]) => {
    const typeCounts = getStatusCounts(rows);
    tableData.push([
      type,
      String(typeCounts.Healthy),
      String(typeCounts.Caution),
      String(typeCounts.Warning),
      String(rows.length),
    ]);
  });

  if (Object.keys(equipmentGroups).length > 6) {
    tableData.push([
      { text: 'Others combined', options: { italic: true } },
      '-',
      '-',
      '-',
      '-',
    ]);
  }

  slide2.addTable(tableData, {
    x: 1,
    y: 1.2,
    w: 8,
    fontSize: 11,
    border: { pt: 1, color: 'CCCCCC' },
  });

  // Slide 3+: Alerts Table (Caution & Warning)
  const alertsData = data.filter(row => row.status === 'Caution' || row.status === 'Warning');

  if (alertsData.length > 0) {
    const slide3 = pptx.addSlide();

    slide3.addText('Alerts (Caution & Warning)', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: '0B3C49', // PETRONAS Dark Blue
    });

    const alertsTableData: any[] = [
      [
        { text: 'Area', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
        { text: 'Equipment Type', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
        { text: 'Tag', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
        { text: 'Status', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
        { text: 'Alarm', options: { bold: true, fill: '0B3C49', color: 'FFFFFF' } },
      ],
    ];

    // Add up to 20 rows per slide
    const rowsPerSlide = 15;
    const alertsToShow = alertsData.slice(0, rowsPerSlide);

    alertsToShow.forEach(row => {
      alertsTableData.push([
        row.area,
        row.equipmentType,
        row.tagNumber,
        row.status,
        row.alarmDescription.substring(0, 50) + (row.alarmDescription.length > 50 ? '...' : ''),
      ]);
    });

    slide3.addTable(alertsTableData, {
      x: 0.5,
      y: 1.2,
      w: 9,
      fontSize: 9,
      border: { pt: 1, color: 'CCCCCC' },
    });

    if (alertsData.length > rowsPerSlide) {
      slide3.addText(`Showing ${rowsPerSlide} of ${alertsData.length} alerts`, {
        x: 0.5,
        y: 5.2,
        w: 9,
        h: 0.3,
        fontSize: 10,
        color: '666666',
        italic: true,
      });
    }
  }

  // Save
  pptx.writeFile({ fileName: config.filename });
}
