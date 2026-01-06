import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PETRONAS_COLORS, STATUS_COLORS } from '../utils/colors';
import type { InstrumentRow, Status, FilterState } from '../utils/types';

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

  const equipmentTypes = Object.keys(equipmentTypeGroups).sort();

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
      <div key={equipmentType} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold mb-1 text-center" style={{ color: PETRONAS_COLORS.darkBlue }}>
          {equipmentType}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          {total} {total === 1 ? 'asset' : 'assets'}
        </p>

        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                onClick={(entry) => {
                  onStatusToggle(entry.name as Status);
                }}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name as Status]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  return [`${value} (${props.payload.percentage}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center total */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-3xl font-bold" style={{ color: PETRONAS_COLORS.darkBlue }}>{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: STATUS_COLORS[item.name as Status] }}
                ></div>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-900">
                {item.value} <span className="text-gray-500 text-xs">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Status Distribution by Equipment Type
        </h2>
        <p className="text-center text-gray-500 py-12">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Status Distribution by Equipment Type
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Click on any segment to filter by status
        </p>
      </div>

      {showSingleDonut ? (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {renderDonut(filters.equipmentTypes[0], equipmentTypeGroups[filters.equipmentTypes[0]])}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentTypes.map(type => renderDonut(type, equipmentTypeGroups[type]))}
        </div>
      )}
    </div>
  );
}
