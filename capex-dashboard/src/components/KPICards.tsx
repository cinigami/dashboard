import React from 'react';
import { KPIData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, CircleDollarSign, PiggyBank, Percent, AlertTriangle, CheckCircle } from 'lucide-react';

interface KPICardsProps {
  data: KPIData;
  loading?: boolean;
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'primary' | 'secondary' | 'warning' | 'danger';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'secondary',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-petronas-emerald to-petronas-emeraldDark text-white';
      case 'warning':
        return 'bg-gradient-to-br from-petronas-yellow to-amber-500 text-petronas-teal';
      case 'danger':
        return 'bg-gradient-to-br from-petronas-red to-red-600 text-white';
      default:
        return 'bg-white text-petronas-teal';
    }
  };

  const getIconBgStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-white/20';
      case 'warning':
        return 'bg-petronas-teal/10';
      case 'danger':
        return 'bg-white/20';
      default:
        return 'bg-petronas-emerald/10';
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${getVariantStyles()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${variant === 'secondary' ? 'text-gray-500' : 'opacity-80'}`}>
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight mb-1">{value}</h3>
          {subtitle && (
            <p className={`text-sm ${variant === 'secondary' ? 'text-gray-400' : 'opacity-70'}`}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`rounded-xl p-3 ${getIconBgStyles()}`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
    </div>
  );
};

const StatusBadge: React.FC<{ count: number; label: string; color: string }> = ({
  count,
  label,
  color,
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-sm text-gray-600">{count} {label}</span>
  </div>
);

export const KPICards: React.FC<KPICardsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-36" />
        ))}
      </div>
    );
  }

  const utilizationStatus = data.utilization <= 80 ? 'Healthy' : data.utilization <= 95 ? 'Caution' : 'Overrun';

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        <KPICard
          title="Total Approved CAPEX"
          value={formatCurrency(data.totalApproved, true)}
          subtitle={`${data.totalProjects} Projects`}
          icon={<Wallet className="w-6 h-6 text-petronas-emerald" />}
          variant="secondary"
        />
        
        <KPICard
          title="Actual Spend"
          value={formatCurrency(data.actualSpend, true)}
          subtitle={`${data.activeProjects} Active Projects`}
          icon={<CircleDollarSign className="w-6 h-6 text-white" />}
          variant="primary"
        />
        
        <KPICard
          title="Remaining Budget"
          value={formatCurrency(data.remaining, true)}
          subtitle="Available to Commit"
          icon={<PiggyBank className="w-6 h-6 text-petronas-emerald" />}
          variant="secondary"
        />
        
        <KPICard
          title="CAPEX Utilization"
          value={formatPercentage(data.utilization)}
          subtitle={utilizationStatus}
          icon={<Percent className="w-6 h-6 text-petronas-teal" />}
          variant={utilizationStatus === 'Healthy' ? 'primary' : utilizationStatus === 'Caution' ? 'warning' : 'danger'}
        />
        
        <KPICard
          title="Budget Overrun"
          value={data.overrun > 0 ? formatCurrency(data.overrun, true) : 'None'}
          subtitle={data.overrun > 0 ? 'Requires Attention' : 'Within Budget'}
          icon={data.overrun > 0 ? <AlertTriangle className="w-6 h-6 text-white" /> : <CheckCircle className="w-6 h-6 text-petronas-emerald" />}
          variant={data.overrun > 0 ? 'danger' : 'secondary'}
        />
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-petronas-teal">Discipline Health:</span>
            <StatusBadge count={data.healthyCount} label="Healthy" color="bg-status-healthy" />
            <StatusBadge count={data.cautionCount} label="Caution" color="bg-status-caution" />
            <StatusBadge count={data.overrunCount} label="Overrun" color="bg-status-overrun" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Last Updated: Jan 19, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
