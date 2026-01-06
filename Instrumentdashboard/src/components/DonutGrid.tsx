import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PETRONAS_COLORS, STATUS_COLORS } from '../utils/colors';
import type { InstrumentRow, Status, FilterState } from '../utils/types';
import { Card } from './ui';

interface DonutGridProps {
  data: InstrumentRow[];
  filters: FilterState;
  onStatusToggle: (status: Status) => void;
}

export default function DonutGrid({ data, filters, onStatusToggle }: DonutGridProps) {
  // Group by equipment type
  const equipmentTypeGroups = data.reduce((acc, row) => {
    if (!acc[row.equipmentType]) {
      acc[row.equipmentType] = [];
    }
    acc[row.equipmentType].push(row);
    return acc;
  }, {} as Record<string, InstrumentRow[]>);

  // Process equipment types: Top 6 + Others
  const processEquipmentTypes = () => {
    const grouped = Object.entries(equipmentTypeGroups);
    const sorted = grouped.sort((a, b) => b[1].length - a[1].length);

    // If filtering by specific equipment types, show only those
    if (filters.equipmentTypes.length > 0) {
      return sorted.filter(([type]) => filters.equipmentTypes.includes(type));
    }

    // Otherwise show top 6 + others
    if (sorted.length <= 6) {
      return sorted;
    }

    const top6 = sorted.slice(0, 6);
    const othersRows = sorted.slice(6).flatMap(([_, rows]) => rows);

    if (othersRows.length > 0) {
      return [...top6, ['Others', othersRows] as [string, InstrumentRow[]]];
    }

    return top6;
  };

  const displayedTypes = processEquipmentTypes();

  // Determine if we should show single or multiple donuts
  const showSingleDonut = filters.equipmentTypes.length === 1;

  const renderDonut = (equipmentType: string, rows: InstrumentRow[]) => {
    // Count by status
    const statusCounts: Record<Status, number> = {
      Healthy: 0,
      Caution: 0,
      Warning: 0,
      Unknown: 0,
    };

    rows.forEach(row => {
      statusCounts[row.status]++;
    });

    // Convert to chart data
    const chartData = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        percentage: Math.round((count / rows.length) * 100),
      }));

    if (chartData.length === 0) return null;

    const total = rows.length;

    return (
      <Card
        key={equipmentType}
        hover
        className="p-6 cursor-pointer group"
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-center mb-1" style={{ color: PETRONAS_COLORS.darkBlue }}>
            {equipmentType}
          </h3>
          <p className="text-sm text-gray-500 text-center">
            {total} {total === 1 ? 'asset' : 'assets'}
          </p>
        </div>

        {/* Donut Chart */}
        <div className="relative mb-6">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                onClick={(entry) => {
                  onStatusToggle(entry.name as Status);
                }}
                className="transition-all duration-200"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name as Status]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  return [`${value} assets (${props.payload.percentage}%)`, name];
                }}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center total */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-4xl font-bold mb-1" style={{ color: PETRONAS_COLORS.darkBlue }}>
              {total}
            </p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Total
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{
                    backgroundColor: STATUS_COLORS[item.name as Status],
                  }}
                />
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-500 font-medium">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Equipment type indicator for "Others" */}
        {equipmentType === 'Others' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Combined from {Object.keys(equipmentTypeGroups).length - 6} equipment types
            </p>
          </div>
        )}
      </Card>
    );
  };

  if (data.length === 0) {
    return (
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Status Distribution by Equipment Type
        </h2>
        <p className="text-center text-gray-500 py-12">No data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Status Distribution by Equipment Type
        </h2>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Click on any segment to filter by status
          </p>
          {!showSingleDonut && filters.equipmentTypes.length === 0 && Object.keys(equipmentTypeGroups).length > 6 && (
            <p className="text-sm text-gray-500 italic">
              Showing top 6 equipment types by volume
            </p>
          )}
        </div>
      </div>

      {/* Donut Grid */}
      {showSingleDonut ? (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {renderDonut(filters.equipmentTypes[0], equipmentTypeGroups[filters.equipmentTypes[0]])}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTypes.map(([type, rows]) => renderDonut(type, rows))}
        </div>
      )}
    </Card>
  );
}
