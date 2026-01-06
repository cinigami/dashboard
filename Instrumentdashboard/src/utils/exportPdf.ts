import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { InstrumentRow, ExportConfig, ExportColumn } from './types';
import { calculateOverallScore, getStatusCounts } from './scoring';

const COLUMN_LABELS: Record<ExportColumn, string> = {
  area: 'Area',
  equipmentType: 'Equipment Type',
  tagNumber: 'Tag Number',
  equipmentDescription: 'Equipment Description',
  status: 'Status',
  alarmDescription: 'Alarm Description',
  rectification: 'Rectification',
  notificationDate: 'Notification Date',
};

export function exportToPdf(data: InstrumentRow[], config: ExportConfig): void {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Instrument Asset Healthiness Report', pageWidth / 2, yPos, {
    align: 'center',
  });
  yPos += 10;

  // Timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Generated on: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 15;

  // Filter Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Applied Filters:', 14, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const filterLines: string[] = [];

  if (config.areas.length > 0) {
    filterLines.push(`Areas: ${config.areas.join(', ')}`);
  }

  if (config.equipmentTypes.length > 0) {
    filterLines.push(`Equipment Types: ${config.equipmentTypes.join(', ')}`);
  }

  if (config.statuses.length > 0) {
    filterLines.push(`Statuses: ${config.statuses.join(', ')}`);
  }

  if (config.dateFrom || config.dateTo) {
    const fromStr = config.dateFrom ? format(config.dateFrom, 'yyyy-MM-dd') : 'Start';
    const toStr = config.dateTo ? format(config.dateTo, 'yyyy-MM-dd') : 'End';
    filterLines.push(`Date Range: ${fromStr} to ${toStr}`);
  }

  filterLines.forEach(line => {
    doc.text(`• ${line}`, 20, yPos);
    yPos += 5;
  });

  yPos += 5;

  // Overall Score and Status Counts
  const score = calculateOverallScore(data);
  const counts = getStatusCounts(data);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary:', 14, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Overall Health Score: ${score}`, 20, yPos);
  yPos += 5;
  doc.text(
    `Status Counts - Healthy: ${counts.Healthy}, Caution: ${counts.Caution}, Warning: ${counts.Warning}`,
    20,
    yPos
  );
  yPos += 10;

  // Data Table
  const headers = config.columns.map(col => COLUMN_LABELS[col]);

  const tableData = data.map(row => {
    return config.columns.map(col => {
      if (col === 'notificationDate') {
        return row.notificationDateDisplay;
      }
      return String(row[col] || '');
    });
  });

  // Convert PETRONAS Dark Blue to RGB
  const petronasBlueRGB: [number, number, number] = [11, 60, 73]; // #0B3C49

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: yPos,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: petronasBlueRGB, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });

  // Save
  doc.save(config.filename);
}
