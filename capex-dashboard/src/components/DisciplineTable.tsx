import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { DisciplineData, Status } from '../types';
import { formatCurrency, formatPercentage, getStatusColor } from '../utils/formatters';
import { ChevronUp, ChevronDown, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface DisciplineTableProps {
  data: DisciplineData[];
  loading?: boolean;
}

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Healthy':
        return {
          bg: 'bg-status-healthy',
          text: 'text-white',
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      case 'Caution':
        return {
          bg: 'bg-status-caution',
          text: 'text-petronas-teal',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      case 'Overrun':
        return {
          bg: 'bg-status-overrun',
          text: 'text-white',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-gray-400',
          text: 'text-white',
          icon: null,
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}
    >
      {styles.icon}
      {status}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; status: Status }> = ({ value, status }) => {
  const clampedValue = Math.min(value, 120);
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{formatPercentage(value, 1)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === 'Healthy'
              ? 'bg-status-healthy'
              : status === 'Caution'
              ? 'bg-status-caution'
              : 'bg-status-overrun'
          }`}
          style={{ width: `${Math.min(clampedValue, 100)}%` }}
        />
        {value > 100 && (
          <div
            className="h-full bg-status-overrun/30 -mt-2"
            style={{ width: `${clampedValue - 100}%`, marginLeft: '100%', transform: 'translateX(-100%)' }}
          />
        )}
      </div>
    </div>
  );
};

const columnHelper = createColumnHelper<DisciplineData>();

export const DisciplineTable: React.FC<DisciplineTableProps> = ({ data, loading }) => {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'approvedBudget', desc: true }
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('discipline', {
        header: 'Discipline',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: getStatusColor(info.row.original.status) }}
            />
            <div>
              <span className="font-semibold text-petronas-teal">{info.getValue()}</span>
              <p className="text-xs text-gray-500">{info.row.original.projectCount} projects</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('approvedBudget', {
        header: 'Approved Budget',
        cell: (info) => (
          <span className="font-medium text-petronas-teal">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('actualSpend', {
        header: 'Actual Spend',
        cell: (info) => (
          <span className="font-medium text-petronas-emerald">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('variance', {
        header: 'Variance',
        cell: (info) => {
          const value = info.getValue();
          const isNegative = value < 0;
          return (
            <span
              className={`font-medium ${
                isNegative ? 'text-status-overrun' : 'text-gray-600'
              }`}
            >
              {isNegative ? '-' : ''}
              {formatCurrency(Math.abs(value))}
            </span>
          );
        },
      }),
      columnHelper.accessor('utilization', {
        header: 'Utilization',
        cell: (info) => (
          <ProgressBar value={info.getValue()} status={info.row.original.status} />
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="animate-pulse h-6 w-48 bg-gray-200 rounded" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-petronas-teal">Discipline Exception Summary</h3>
        <p className="text-sm text-gray-500 mt-1">Budget status and variance by discipline</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="text-petronas-emerald">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">No data available for selected filters</p>
        </div>
      )}
    </div>
  );
};
