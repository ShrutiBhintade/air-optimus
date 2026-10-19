"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Bell,
  AlertTriangle,
  Plane,
  Users,
  Fuel,
  Cloud,
  Wrench,
  X,
  Search,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  ShieldAlert,
  AlertOctagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AlertSeverity = "critical" | "high" | "medium" | "low";
type FilterSeverity = AlertSeverity | "all";

interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  affected: string;
  zone: string;
  timestamp: string;
  explanation: string;
  icon: LucideIcon;
}

const SEVERITY_ORDER: AlertSeverity[] = ["critical", "high", "medium", "low"];

const severityChip: Record<AlertSeverity, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-amber-50 text-amber-700 border-amber-200",
  medium: "bg-sky-50 text-sky-700 border-sky-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

const severityCard: Record<AlertSeverity, string> = {
  critical: "bg-red-50 border-red-200",
  high: "bg-amber-50 border-amber-200",
  medium: "bg-sky-50 border-sky-200",
  low: "bg-white border-slate-200",
};

const severityIconColor: Record<AlertSeverity, string> = {
  critical: "text-red-600",
  high: "text-amber-600",
  medium: "text-sky-600",
  low: "text-slate-500",
};

const severityMetricText: Record<AlertSeverity, string> = {
  critical: "text-red-700",
  high: "text-amber-700",
  medium: "text-sky-700",
  low: "text-slate-700",
};

const ALERTS: Alert[] = [
  {
    id: "AL-101",
    severity: "critical",
    title: "Aircraft A-07 grounded pending unscheduled service",
    affected: "Aircraft A-07 · Mission M-201 (Sector Alpha Recon)",
    zone: "Zone Alpha",
    timestamp: "06:42 Z",
    explanation:
      "A-07 failed the pre-flight inspection battery at 06:30 Z (hydraulic pressure 2,150 psi vs 3,000 psi minimum). Scheduled into the maintenance queue as the next slot; M-201 currently launches with its coverage short by one aircraft.",
    icon: Plane,
  },
  {
    id: "AL-102",
    severity: "critical",
    title: "Fuel reserve below critical launch margin",
    affected: "Main fuel farm · Missions M-201 and M-211",
    zone: "Zone Alpha",
    timestamp: "06:25 Z",
    explanation:
      "Farm reserve reads 18% against a 20% minimum for critical-priority launches. Weather-adjusted burn from the overnight patrol consumed 62% of the uplift; both critical missions are on hold until the inbound shipment docks at 08:10 Z.",
    icon: Fuel,
  },
  {
    id: "AL-103",
    severity: "high",
    title: "Severe weather cell over approaches",
    affected: "Missions M-204, M-216 · Zone Bravo",
    zone: "Zone Bravo",
    timestamp: "05:58 Z",
    explanation:
      "Radar shows convective cell tops at 41,000 ft crossing the Bravo recovery corridor with crosswind 34 kt gusting 41 kt (23 kt single-ship limit). Ceiling forecasts hold the launch limit past 09:00 Z; both missions exceed the 60% weather ceiling.",
    icon: Cloud,
  },
  {
    id: "AL-104",
    severity: "high",
    title: "Crew readiness dipping below holding margin",
    affected: "Crew pool · 5 crews flagged",
    zone: "Base-wide",
    timestamp: "05:50 Z",
    explanation:
      "5 of 42 crews rest below the 8-hour rest-band floor after surge continuity; projected ready count is 32 of 42 at the next handover. Rescue-standby M-211 requires 5 crews and holds its full complement; unit readiness has 4 crews of slack remaining.",
    icon: Users,
  },
  {
    id: "AL-105",
    severity: "medium",
    title: "Maintenance backlog extending service cycle",
    affected: "Maintenance line 2 · A-03 and A-11",
    zone: "Base-wide",
    timestamp: "05:12 Z",
    explanation:
      "Open work orders total 12 hrs against a 10-hr line capacity for the shift. A-11 awaits scheduled inspection (3-hr overrun past due time) and projects ready 2 hrs after the current backlog clears.",
    icon: Wrench,
  },
  {
    id: "AL-106",
    severity: "medium",
    title: "Reduced visibility in the Delta recovery corridor",
    affected: "Missions M-213 (training) · Zone Delta",
    zone: "Zone Delta",
    timestamp: "04:47 Z",
    explanation:
      "Fog bank holds visibility at 2.8 km against the 5 km training-recovery minimum with RVR trending sideways. The 07:30 Z pilot conversion sortie keeps a standby hold; ceiling impact is 44% of the degraded-weather band.",
    icon: MapPin,
  },
  {
    id: "AL-107",
    severity: "low",
    title: "Non-scheduled fiscal fuel uplift scheduled",
    affected: "Fuel farm · Off-cycle delivery",
    zone: "Base support",
    timestamp: "04:20 Z",
    explanation:
      "Second fuel shipment moved 25 minutes ahead of window; projected uplift closes a projected 6% reserve shortfall flagged in the 02:00 Z allocation review. No operational launch is affected.",
    icon: Fuel,
  },
  {
    id: "AL-108",
    severity: "low",
    title: "Routine inspection cycle entering final phase",
    affected: "Aircraft A-14 phase spot check",
    zone: "Base support",
    timestamp: "03:55 Z",
    explanation:
      "Phase inspection runs to plan: 9 of 10 checklist items signed off, projecting completion at 12:00 Z. Asset remains launch-ready for the afternoon window with no restrictions.",
    icon: CheckCircle2,
  },
];

function severityValueChip(value: number): string {
  return value > 0 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400";
}

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterSeverity>("all");
  const [search, setSearch] = useState("");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const dismissAlert = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const visibleAlerts = ALERTS.filter((alert) => {
    if (dismissed.has(alert.id)) return false;
    if (filter !== "all" && alert.severity !== filter) return false;
    if (search.length === 0) return true;
    const haystack = `${alert.id} ${alert.title} ${alert.affected} ${alert.explanation}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const activeCounts = SEVERITY_ORDER.map((severity) => ({
    severity,
    count: ALERTS.filter((a) => a.severity === severity && !dismissed.has(a.id)).length,
  }));

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Alerts &amp; Intelligence</h1>
            <p className="mt-1 text-lg text-slate-600">
              Active operational alerts for the current planning window
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">DEMO</span>
            <span className="text-[10px] text-sky-500">&middot;</span>
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">SYNTHETIC DATA</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeCounts.map(({ severity, count }) => (
            <button
              key={severity}
              onClick={() => setFilter(filter === severity ? "all" : severity)}
              className={`rounded-xl border p-5 text-left shadow-sm hover:shadow-md transition-shadow ${
                severityCard[severity]
              } ${filter === severity ? "ring-2 ring-sky-400" : ""}`}
              aria-pressed={filter === severity}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs font-semibold uppercase tracking-wider ${severityMetricText[severity]}`}>
                  {severity}
                </p>
                <span
                  className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${severityValueChip(count)}`}
                >
                  {count}
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">{count}</p>
              <p className="mt-1 text-[10px] text-slate-500">
                {filter === severity ? "Showing this severity" : "Click to filter alerts"}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                aria-hidden={true}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search alerts by title, resource, mission, or explanation…"
                aria-label="Search alerts"
                className="w-full pl-9 pr-9 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
              {search.length > 0 && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="h-3.5 w-3.5" aria-hidden={true} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilter("all")}
              disabled={filter === "all" && search.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShieldAlert className="h-4 w-4" aria-hidden={true} />
              Show All
            </button>
          </div>
          <p className="mt-3 text-[10px] text-slate-500 flex items-center gap-1.5">
            <Info className="h-3 w-3" aria-hidden={true} />
            Showing {visibleAlerts.length} of {ALERTS.length} simulated alerts
            {filter !== "all" ? ` filtered to ${filter} severity` : ""}
            {search.length > 0 ? ` matching “${search}”` : ""}
            {dismissed.size > 0 ? ` · ${dismissed.size} dismissed` : ""}
          </p>
        </div>

        <div className="space-y-3">
          {visibleAlerts.map((alert) => (
            <article
              key={alert.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${severityChip[alert.severity]}`}
                >
                  <alert.icon className={`h-5 w-5 ${severityIconColor[alert.severity]}`} aria-hidden={true} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${severityChip[alert.severity]}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.id}</span>
                  </div>
                  <h3 className="mt-1 font-semibold text-slate-900">{alert.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {alert.affected} &middot; {alert.zone}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">{alert.explanation}</p>
                  <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" aria-hidden={true} />
                    {alert.timestamp} &middot; Simulated evidence &middot; Logging &amp; intelligence data is synthetic
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden={true} />
                    Dismiss
                  </button>
                </div>
              </div>
            </article>
          ))}

          {visibleAlerts.length === 0 && (
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mx-auto">
                <AlertOctagon className="h-7 w-7 text-slate-400" aria-hidden={true} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">No alerts match your filters</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                {dismissed.size === ALERTS.length
                  ? "All simulated alerts have been dismissed. Rest the view to bring them back."
                  : "Try a different search term or clear the severity filter."}
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                  setDismissed(new Set());
                }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Bell className="h-4 w-4" aria-hidden={true} />
                Reset View
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-600 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
            <span>
              All alerts, evidence lines, and counts are <strong>simulated</strong> from synthetic demo data for
              the AIR-OPTIMUS showcase. No real flight line is connected.
            </span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
