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
        const colorClass =
          status === 'Warning'
            ? 'bg-red-100 text-red-800'
            : status === 'Caution'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800';
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Obsolescence Panel (ALS)
        </h2>
        <p className="text-center text-gray-500 py-8">
          No obsolescence items found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Obsolescence Panel (ALS)
        </h2>
        <div className="text-sm text-gray-500">
          {alsData.length} {alsData.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="overflow-x-auto">
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
      </div>
    </div>
  );
}
