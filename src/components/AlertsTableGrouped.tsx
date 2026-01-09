import React, { useState, useMemo } from 'react';
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

interface AlertsTableGroupedProps {
  data: InstrumentRow[];
}

const columnHelper = createColumnHelper<InstrumentRow>();

export default function AlertsTableGrouped({ data }: AlertsTableGroupedProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'notificationDate', desc: true },
  ]);

  // Filter for Caution and Warning only
  const alertsData = useMemo(() => {
    return data.filter(row => row.status === 'Caution' || row.status === 'Warning');
  }, [data]);

  // Apply local search
  const filteredData = useMemo(() => {
    if (!localSearch.trim()) return alertsData;

    const searchLower = localSearch.toLowerCase();
    return alertsData.filter(
      row =>
        row.tagNumber.toLowerCase().includes(searchLower) ||
        row.equipmentDescription.toLowerCase().includes(searchLower) ||
        row.rectification.toLowerCase().includes(searchLower)
    );
  }, [alertsData, localSearch]);

  // Group by equipment type
  const groupedData = useMemo(() => {
    const groups: Record<string, InstrumentRow[]> = {};

    filteredData.forEach(row => {
      if (!groups[row.equipmentType]) {
        groups[row.equipmentType] = [];
      }
      groups[row.equipmentType].push(row);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredData]);

  const columns = [
    columnHelper.accessor('area', {
      header: 'Area',
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
    columnHelper.accessor('rectification', {
      header: 'Rectification',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('notificationDate', {
      header: 'Notification Date',
      cell: info => info.row.original.notificationDateDisplay,
    }),
  ];

  if (alertsData.length === 0) {
    return (
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Alerts (Caution & Warning)
        </h2>
        <p className="text-center text-gray-500 py-12">No alerts found</p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
            Alerts (Caution & Warning)
          </h2>
          <p className="text-sm text-gray-600">
            Critical items requiring attention
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{filteredData.length}</p>
          <p className="text-sm text-gray-500">
            {filteredData.length === 1 ? 'Alert' : 'Alerts'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search by tag, description, or rectification..."
          className="block w-full md:w-96 rounded-lg border-gray-300 shadow-sm focus-premium text-sm px-4 py-2.5"
        />
      </div>

      {/* Grouped Tables */}
      <div className="space-y-6">
        {groupedData.map(([equipmentType, rows]) => {
          const cautionCount = rows.filter(r => r.status === 'Caution').length;
          const warningCount = rows.filter(r => r.status === 'Warning').length;

          return (
            <div key={equipmentType} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Group Header with Accent */}
              <div className="group-header-accent px-6 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {equipmentType}
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    {warningCount > 0 && (
                      <span style={{ color: PETRONAS_COLORS.red }}>
                        Warning: {warningCount}
                      </span>
                    )}
                    {cautionCount > 0 && (
                      <span style={{ color: PETRONAS_COLORS.yellow }}>
                        Caution: {cautionCount}
                      </span>
                    )}
                    <span className="text-gray-600">
                      Total: {rows.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Group Table */}
              <div className="overflow-x-auto">
                <GroupTable rows={rows} columns={columns} sorting={sorting} setSorting={setSorting} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function GroupTable({
  rows,
  columns,
  sorting,
  setSorting,
}: {
  rows: InstrumentRow[];
  columns: any[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}) {
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
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
  );
}
