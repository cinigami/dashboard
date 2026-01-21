import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';
import { DisciplineData } from '../types';
import { formatCurrency, abbreviateNumber, formatPercentage } from '../utils/formatters';

interface DisciplineChartsProps {
  data: DisciplineData[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="font-semibold text-petronas-teal mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const DonutChart: React.FC<{ discipline: DisciplineData }> = ({ discipline }) => {
  const data = [
    { name: 'Spent', value: discipline.actualSpend, color: '#00B1A9' },
    { name: 'Remaining', value: discipline.remaining > 0 ? discipline.remaining : 0, color: '#E8F4F3' },
  ];

  // Handle overrun case
  if (discipline.remaining < 0) {
    data[1] = { name: 'Overrun', value: Math.abs(discipline.remaining), color: '#E31837' };
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-petronas-teal">{discipline.discipline}</h4>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            discipline.status === 'Healthy'
              ? 'bg-status-healthy/10 text-status-healthy'
              : discipline.status === 'Caution'
              ? 'bg-status-caution/10 text-status-caution'
              : 'bg-status-overrun/10 text-status-overrun'
          }`}
        >
          {discipline.status}
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0" style={{ width: 80, height: 80 }}>
          <PieChart width={80} height={80}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={24}
              outerRadius={36}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value={formatPercentage(discipline.utilization, 0)}
                position="center"
                fill="#0B3C49"
                style={{ fontSize: '14px', fontWeight: 'bold' }}
              />
            </Pie>
          </PieChart>
        </div>
        
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Approved</span>
            <span className="font-medium text-petronas-teal">{formatCurrency(discipline.approvedBudget, true)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Spent</span>
            <span className="font-medium text-petronas-emerald">{formatCurrency(discipline.actualSpend, true)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Remaining</span>
            <span className={`font-medium ${discipline.remaining < 0 ? 'text-status-overrun' : 'text-gray-600'}`}>
              {formatCurrency(discipline.remaining, true)}
            </span>
          </div>
          <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
            <span className="text-gray-500">Projects</span>
            <span className="font-medium text-petronas-teal">{discipline.projectCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DisciplineCharts: React.FC<DisciplineChartsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-100 rounded-2xl h-80" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-40" />
          ))}
        </div>
      </div>
    );
  }

  // Prepare data for bar chart
  const barChartData = data.map(d => ({
    name: d.discipline,
    'Actual Spend': d.actualSpend,
    'Remaining': d.remaining > 0 ? d.remaining : 0,
    'Overrun': d.remaining < 0 ? Math.abs(d.remaining) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-petronas-teal">CAPEX Utilization by Discipline</h3>
            <p className="text-sm text-gray-500">Approved vs Actual Spend comparison</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-petronas-emerald" />
              <span className="text-xs text-gray-600">Actual Spend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E8F4F3]" />
              <span className="text-xs text-gray-600">Remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-overrun" />
              <span className="text-xs text-gray-600">Overrun</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#0B3C49', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(value) => abbreviateNumber(value)}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="Actual Spend"
                stackId="a"
                fill="#00B1A9"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Remaining"
                stackId="a"
                fill="#E8F4F3"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Overrun"
                stackId="a"
                fill="#E31837"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut Charts Grid */}
      <div>
        <h3 className="text-lg font-semibold text-petronas-teal mb-4">Discipline Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {data.map((discipline) => (
            <DonutChart key={discipline.discipline} discipline={discipline} />
          ))}
        </div>
      </div>
    </div>
  );
};
