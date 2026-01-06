import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import type { InstrumentRow } from '../utils/types';
import { Card, Badge } from './ui';
import { PETRONAS_COLORS } from '../utils/colors';

interface ObsolescenceTableProps {
  data: InstrumentRow[];
}

const columnHelper = createColumnHelper<InstrumentRow>();

export default function ObsolescenceTable({ data }: ObsolescenceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'notificationDate', desc: true },
  ]);

  // Filter for ALS items
  const alsData = useMemo(() => {
    return data.filter(row =>
      row.alarmDescription.toLowerCase().includes('als')
    );
  }, [data]);

  // Count by status
  const statusCounts = useMemo(() => {
    const counts = { Healthy: 0, Caution: 0, Warning: 0, Unknown: 0 };
    alsData.forEach(row => {
      counts[row.status]++;
    });
    return counts;
  }, [alsData]);

  const columns = [
    columnHelper.accessor('area', {
      header: 'Area',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('equipmentType', {
      header: 'Equipment Type',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('tagNumber', {
      header: 'Tag Number',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('equipmentDescription', {
      header: 'Equipment Description',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        return <Badge status={status} variant="soft" size="sm" />;
      },
    }),
    columnHelper.accessor('alarmDescription', {
      header: 'Alarm Description',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('rectification', {
      header: 'Rectification',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('notificationDate', {
      header: 'Notification Date',
      cell: info => info.row.original.notificationDateDisplay,
    }),
  ];

  const table = useReactTable({
    data: alsData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (alsData.length === 0) {
    return (
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Obsolescence Panel (ALS)
        </h2>
        <p className="text-center text-gray-500 py-12">
          No obsolescence items found
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
            Obsolescence Panel (ALS)
          </h2>
          <p className="text-sm text-gray-600">
            Assets with obsolescence indicators
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{alsData.length}</p>
          <p className="text-sm text-gray-500">
            {alsData.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>
      </div>

      {/* Status Summary */}
      {(statusCounts.Warning > 0 || statusCounts.Caution > 0) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-6 text-sm font-medium">
            {statusCounts.Warning > 0 && (
              <span style={{ color: PETRONAS_COLORS.red }}>
                Warning: {statusCounts.Warning}
              </span>
            )}
            {statusCounts.Caution > 0 && (
              <span style={{ color: PETRONAS_COLORS.yellow }}>
                Caution: {statusCounts.Caution}
              </span>
            )}
            {statusCounts.Healthy > 0 && (
              <span style={{ color: PETRONAS_COLORS.emeraldGreen }}>
                Healthy: {statusCounts.Healthy}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="table-executive">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getIsSorted() && (
                        <span className="text-petronas-emerald">
                          {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
