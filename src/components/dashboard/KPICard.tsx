"use client";

import { type FC } from "react";

interface KPICardProps {
  icon: FC<{ className?: string }>;
  value: string | number;
  label: string;
  subtext?: string;
  trend?: { value: string; positive: boolean };
  progress?: number;
  className?: string;
}

export function KPICard({
  icon: Icon,
  value,
  label,
  subtext,
  trend,
  progress,
  className = "",
}: KPICardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
                {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="mt-1 text-sm text-slate-500">{subtext}</p>}
          {progress !== undefined && (
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 flex-shrink-0">
          <Icon className="h-6 w-6 text-sky-600" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}