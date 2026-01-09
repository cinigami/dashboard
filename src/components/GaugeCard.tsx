import { calculateOverallScore, getStatusCounts } from '../utils/scoring';
import { PETRONAS_COLORS, getGaugeColor } from '../utils/colors';
import type { InstrumentRow } from '../utils/types';
import { Card, Chip } from './ui';

interface GaugeCardProps {
  data: InstrumentRow[];
}

export default function GaugeCard({ data }: GaugeCardProps) {
  const score = calculateOverallScore(data);
  const counts = getStatusCounts(data);

  const scoreColor = getGaugeColor(score);

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const scoreLabel = getScoreLabel(score);

  // Calculate gauge arc angle (0-180 degrees for semicircle)
  const angle = (score / 100) * 180;

  return (
    <Card variant="hero" className="p-8 animate-fade-in">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-3" style={{ color: PETRONAS_COLORS.darkBlue }}>
          Overall Equipment Healthiness
        </h1>
        <p className="text-gray-500 text-lg">Live Status Overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Gauge Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg h-72 mb-8">
            <svg viewBox="0 0 320 200" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 40 160 A 120 120 0 0 1 280 160"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="32"
                strokeLinecap="round"
              />
              {/* Score arc with animation */}
              <path
                d="M 40 160 A 120 120 0 0 1 280 160"
                fill="none"
                stroke={scoreColor}
                strokeWidth="32"
                strokeLinecap="round"
                strokeDasharray={`${(angle / 180) * 377} 377`}
                style={{
                  transition: 'stroke-dasharray 0.8s ease-out, stroke 0.5s ease',
                  '--gauge-value': `${(angle / 180) * 377}`
                } as any}
              />
              {/* Center score text */}
              <text
                x="160"
                y="140"
                textAnchor="middle"
                className="text-6xl font-bold"
                fill={scoreColor}
              >
                {score}
              </text>
              <text
                x="160"
                y="165"
                textAnchor="middle"
                className="text-lg font-medium"
                fill="#9CA3AF"
              >
                / 100
              </text>
              <text
                x="160"
                y="185"
                textAnchor="middle"
                className="text-base font-medium"
                fill="#6B7280"
              >
                {scoreLabel}
              </text>
            </svg>
          </div>

          {/* Mini breakdown chips */}
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Chip
              status="Healthy"
              count={counts.Healthy}
              showDot
              borderColor="emerald"
            />
            <Chip
              status="Caution"
              count={counts.Caution}
              showDot
              borderColor="yellow"
            />
            <Chip
              status="Warning"
              count={counts.Warning}
              showDot
              borderColor="red"
            />
          </div>

          {/* Trend indicator */}
          <div className="text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Based on current filters • Total Assets: <span className="font-semibold text-gray-900">{data.length}</span>
              {counts.Unknown > 0 && (
                <span className="text-gray-400 text-xs">
                  ({counts.Unknown} unknown)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Status Legend Section - Premium Cards */}
        <div className="grid grid-cols-1 gap-6">
          {/* Healthy */}
          <div
            className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-6 border-l-4 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: PETRONAS_COLORS.emeraldGreen }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: PETRONAS_COLORS.emeraldGreen + '20' }}
                >
                  <svg className="w-7 h-7" style={{ color: PETRONAS_COLORS.emeraldGreen }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-700">Healthy</p>
                  <p className="text-sm text-gray-500">Operating Normally</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold" style={{ color: PETRONAS_COLORS.emeraldGreen }}>{counts.Healthy}</p>
                <p className="text-sm text-gray-500 font-medium">{data.length > 0 ? Math.round((counts.Healthy / data.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>

          {/* Caution */}
          <div
            className="bg-gradient-to-r from-yellow-50 to-white rounded-xl p-6 border-l-4 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: PETRONAS_COLORS.yellow }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: PETRONAS_COLORS.yellow + '20' }}
                >
                  <svg className="w-7 h-7" style={{ color: PETRONAS_COLORS.yellow }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-700">Caution</p>
                  <p className="text-sm text-gray-500">Requires Attention</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold" style={{ color: PETRONAS_COLORS.yellow }}>{counts.Caution}</p>
                <p className="text-sm text-gray-500 font-medium">{data.length > 0 ? Math.round((counts.Caution / data.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div
            className="bg-gradient-to-r from-red-50 to-white rounded-xl p-6 border-l-4 transition-all duration-200 hover:shadow-md"
            style={{ borderColor: PETRONAS_COLORS.red }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: PETRONAS_COLORS.red + '20' }}
                >
                  <svg className="w-7 h-7" style={{ color: PETRONAS_COLORS.red }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-700">Warning</p>
                  <p className="text-sm text-gray-500">Critical Action Required</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold" style={{ color: PETRONAS_COLORS.red }}>{counts.Warning}</p>
                <p className="text-sm text-gray-500 font-medium">{data.length > 0 ? Math.round((counts.Warning / data.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
