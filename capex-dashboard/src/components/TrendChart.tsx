import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MonthlySpend } from '../types';
import { formatCurrency, abbreviateNumber } from '../utils/formatters';

interface TrendChartProps {
  data: MonthlySpend[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="font-semibold text-petronas-teal mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-petronas-teal" />
              <span className="text-sm text-gray-600">Planned</span>
            </div>
            <span className="font-medium text-petronas-teal">
              {formatCurrency(payload[0]?.value || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-petronas-emerald" />
              <span className="text-sm text-gray-600">Actual</span>
            </div>
            <span className="font-medium text-petronas-emerald">
              {formatCurrency(payload[1]?.value || 0)}
            </span>
          </div>
        </div>
        {payload[0]?.value && payload[1]?.value && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Variance</span>
              <span
                className={`text-sm font-medium ${
                  payload[1].value > payload[0].value
                    ? 'text-status-overrun'
                    : 'text-status-healthy'
                }`}
              >
                {payload[1].value > payload[0].value ? '+' : ''}
                {formatCurrency(payload[1].value - payload[0].value)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const TrendChart: React.FC<TrendChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  // Find current month (last month with actual data)
  const currentMonthIndex = data.findIndex(d => d.actual === 0) - 1;
  const currentMonth = currentMonthIndex >= 0 ? data[currentMonthIndex]?.month : null;

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-petronas-teal">Monthly CAPEX Spend Trend</h3>
          <p className="text-sm text-gray-500">Planned vs Actual spending over time</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded-full bg-gradient-to-r from-petronas-teal/20 to-petronas-teal" />
            <span className="text-xs text-gray-600">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 rounded-full bg-gradient-to-r from-petronas-emerald/20 to-petronas-emerald" />
            <span className="text-xs text-gray-600">Actual</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B3C49" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0B3C49" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B1A9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00B1A9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tickFormatter={(value) => value.split(' ')[0].substring(0, 3)}
            />
            <YAxis
              tickFormatter={(value) => abbreviateNumber(value)}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {currentMonth && (
              <ReferenceLine
                x={currentMonth}
                stroke="#FDB924"
                strokeDasharray="5 5"
                label={{
                  value: 'Current',
                  position: 'top',
                  fill: '#FDB924',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="planned"
              stroke="#0B3C49"
              strokeWidth={2}
              fill="url(#plannedGradient)"
              dot={{ r: 4, fill: '#0B3C49', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#0B3C49', strokeWidth: 2, stroke: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#00B1A9"
              strokeWidth={2}
              fill="url(#actualGradient)"
              dot={{ r: 4, fill: '#00B1A9', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#00B1A9', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">YTD Planned</p>
          <p className="text-lg font-bold text-petronas-teal">
            {formatCurrency(data[currentMonthIndex >= 0 ? currentMonthIndex : data.length - 1]?.cumPlanned || 0, true)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">YTD Actual</p>
          <p className="text-lg font-bold text-petronas-emerald">
            {formatCurrency(data[currentMonthIndex >= 0 ? currentMonthIndex : data.length - 1]?.cumActual || 0, true)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">YTD Variance</p>
          {(() => {
            const planned = data[currentMonthIndex >= 0 ? currentMonthIndex : data.length - 1]?.cumPlanned || 0;
            const actual = data[currentMonthIndex >= 0 ? currentMonthIndex : data.length - 1]?.cumActual || 0;
            const variance = actual - planned;
            return (
              <p className={`text-lg font-bold ${variance > 0 ? 'text-status-overrun' : 'text-status-healthy'}`}>
                {variance > 0 ? '+' : ''}{formatCurrency(variance, true)}
              </p>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
