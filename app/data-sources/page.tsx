"use client";

import { AppShell } from "@/components/layout/AppShell";
import {
  Plane,
  Users,
  Cloud,
  Fuel,
  Wrench,
  Database,
  RefreshCw,
  CheckCircle2,
  Info,
  Clock,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SourceStatus = "connected" | "degraded" | "syncing";

interface DataSource {
  id: string;
  name: string;
  status: SourceStatus;
  lastUpdate: string;
  quality: number;
  confidence: number;
  description: string;
  icon: LucideIcon;
}

interface SyncEvent {
  time: string;
  source: string;
  detail: string;
  status: SourceStatus;
}

const SOURCE_STATUS_CHIP: Record<SourceStatus, string> = {
  connected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  degraded: "bg-amber-50 text-amber-700 border-amber-200",
  syncing: "bg-sky-50 text-sky-700 border-sky-200",
};

const SYNC_STATUS_CHIP: Record<SourceStatus, string> = {
  connected: "text-emerald-600",
  degraded: "text-amber-600",
  syncing: "text-sky-600",
};

const DATA_SOURCES: DataSource[] = [
  {
    id: "DS-01",
    name: "Aircraft & Fleet",
    status: "connected",
    lastUpdate: "07:32 Z",
    quality: 98,
    confidence: 96,
    description:
      "Tail registrations, airframe hours, configuration state and per-asset readiness readings feeding the fleet inventory snapshot.",
    icon: Plane,
  },
  {
    id: "DS-02",
    name: "Crew Availability",
    status: "connected",
    lastUpdate: "07:28 Z",
    quality: 95,
    confidence: 94,
    description:
      "Roster entries, qualification tiers, rest-band state and duty-hour accumulations rolled up per ready-crew count.",
    icon: Users,
  },
  {
    id: "DS-03",
    name: "Weather & Airspace",
    status: "syncing",
    lastUpdate: "07:35 Z",
    quality: 91,
    confidence: 88,
    description:
      "Surface winds, ceiling and visibility reports plus corridor restriction flags used by launch-ceiling checks.",
    icon: Cloud,
  },
  {
    id: "DS-04",
    name: "Fuel & Logistics",
    status: "degraded",
    lastUpdate: "06:50 Z",
    quality: 87,
    confidence: 84,
    description:
      "Farm reserve levels, uplift schedules and consumption logs; updates running 42 minutes late during the off-cycle delivery.",
    icon: Fuel,
  },
  {
    id: "DS-05",
    name: "Maintenance Records",
    status: "connected",
    lastUpdate: "07:15 Z",
    quality: 96,
    confidence: 92,
    description:
      "Work orders, inspection phases and backlog hours reconciled against the grounded-asset list every cycle.",
    icon: Wrench,
  },
];

const SYNC_LOG: SyncEvent[] = [
  {
    time: "07:35 Z",
    source: "Weather & Airspace",
    detail: "Corridor restriction refresh · 3 zones revalidated",
    status: "syncing",
  },
  {
    time: "07:32 Z",
    source: "Aircraft & Fleet",
    detail: "Readiness snapshot recomputed · 18 assets",
    status: "connected",
  },
  {
    time: "07:28 Z",
    source: "Crew Availability",
    detail: "Duty-hour rollup completed · 42 crews",
    status: "connected",
  },
  {
    time: "07:15 Z",
    source: "Maintenance Records",
    detail: "Backlog reconciliation · 12 hrs open work",
    status: "connected",
  },
  {
    time: "06:50 Z",
    source: "Fuel & Logistics",
    detail: "Uplift manifest partial · awaiting shipment close",
    status: "degraded",
  },
];

function statusLabel(status: SourceStatus): string {
  if (status === "connected") return "CONNECTED";
  if (status === "syncing") return "SYNCING";
  return "DEGRADED";
}

function qualityClass(value: number): string {
  if (value >= 95) return "text-emerald-600";
  if (value >= 90) return "text-sky-600";
  return "text-amber-600";
}

function qualityBarClass(value: number): string {
  if (value >= 95) return "bg-emerald-500";
  if (value >= 90) return "bg-sky-500";
  return "bg-amber-500";
}

export default function DataSourcesPage() {
  const connectedCount = DATA_SOURCES.filter((s) => s.status === "connected").length;

  const avgQuality = Math.round(
    DATA_SOURCES.reduce((sum, s) => sum + s.quality, 0) / DATA_SOURCES.length
  );

  const newestUpdate = DATA_SOURCES.reduce(
    (latest, s) => (s.lastUpdate > latest ? s.lastUpdate : latest),
    "00:00 Z"
  );

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Data Sources</h1>
            <p className="mt-1 text-lg text-slate-600">
              Simulated feeds powering the planning window snapshot
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">DEMO</span>
            <span className="text-[10px] text-sky-500">&middot;</span>
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">SYNTHETIC DATA</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Data Sources</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <Database className="h-5 w-5 text-sky-600" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{DATA_SOURCES.length}</p>
            <p className="mt-1 text-xs text-slate-500">All simulated demo feeds</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Connected</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{connectedCount} of {DATA_SOURCES.length}</p>
            <p className="mt-1 text-xs text-slate-500">1 syncing &middot; 1 degraded</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Data Quality</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <Activity className="h-5 w-5 text-sky-600" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{avgQuality}%</p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${qualityBarClass(avgQuality)}`}
                style={{ width: `${avgQuality}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">Average across {DATA_SOURCES.length} feeds</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Sync</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Clock className="h-5 w-5 text-slate-500" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{newestUpdate}</p>
            <p className="mt-1 text-xs text-slate-500">Weather &amp; Airspace refresh</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Source Registry</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Five simulated operational feeds</h3>
            </div>
            <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
              Simulated
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {DATA_SOURCES.map((source) => (
              <div key={source.id} className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 flex-shrink-0">
                      <source.icon className="h-5 w-5 text-sky-600" aria-hidden={true} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{source.id}</p>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{source.name}</h4>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold rounded-full border ${SOURCE_STATUS_CHIP[source.status]}`}
                  >
                    {source.status === "syncing" ? (
                      <RefreshCw className="h-3 w-3 animate-pulse-subtle" aria-hidden={true} />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" aria-hidden={true} />
                    )}
                    {statusLabel(source.status)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600">{source.description}</p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Last Update</p>
                    <p className="text-xs font-bold text-slate-900 tabular-nums">{source.lastUpdate}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Quality</p>
                    <p className={`text-xs font-bold tabular-nums ${qualityClass(source.quality)}`}>
                      {source.quality}%
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">Confidence</p>
                    <p className="text-xs font-bold tabular-nums text-sky-600">{source.confidence}%</p>
                  </div>
                </div>

                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${qualityBarClass(source.quality)}`}
                    style={{ width: `${source.quality}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Recent Synchronization</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Activity log for the current window</h3>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
              <RefreshCw className="h-3 w-3" aria-hidden={true} />
              Simulated
            </span>
          </div>

          <div className="space-y-2">
            {SYNC_LOG.map((event) => (
              <div
                key={`${event.time}-${event.source}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span className="flex-shrink-0 text-[10px] font-mono text-slate-400 tabular-nums w-12">
                  {event.time}
                </span>
                <span className="flex-shrink-0 h-2 w-2 rounded-full bg-sky-500" aria-hidden={true} />
                <p className="text-xs font-medium text-slate-900 min-w-0 flex-shrink-0">{event.source}</p>
                <p className={`text-xs ml-auto text-right ${SYNC_STATUS_CHIP[event.status]}`}>{event.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] text-slate-400 flex items-center gap-1.5">
            <Info className="h-3 w-3" aria-hidden={true} />
            Entries are generated for the demo window only and do not reflect any live feed.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-600 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
            <span>
              Every source card, status chip, percentage and log entry on this page is <strong>synthetic demo
              data</strong>. AIR-OPTIMUS is a showcase build — no real aircraft, crew, weather, fuel or
              maintenance system is connected.
            </span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
