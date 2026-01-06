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
        row.alarmDescription.toLowerCase().includes(searchLower)
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
        const colorClass =
          status === 'Warning'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {status}
          </span>
        );
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

  if (alertsData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts (Caution & Warning)</h2>
        <p className="text-center text-gray-500 py-8">No alerts found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Alerts (Caution & Warning)
        </h2>
        <div className="text-sm text-gray-500">
          {filteredData.length} {filteredData.length === 1 ? 'alert' : 'alerts'}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder="Search alerts..."
          className="block w-full md:w-96 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="space-y-6">
        {groupedData.map(([equipmentType, rows]) => {
          const cautionCount = rows.filter(r => r.status === 'Caution').length;
          const warningCount = rows.filter(r => r.status === 'Warning').length;

          return (
            <div key={equipmentType} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Group Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">
                    {equipmentType}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm">
                    {warningCount > 0 && (
                      <span className="text-red-700">
                        {warningCount} Warning{warningCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {cautionCount > 0 && (
                      <span className="text-yellow-700">
                        {cautionCount} Caution{cautionCount > 1 ? 's' : ''}
                      </span>
                    )}
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
    </div>
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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center space-x-1">
                  <span>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </span>
                  {header.column.getIsSorted() && (
                    <span>
                      {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
