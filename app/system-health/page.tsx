"use client";

import { AppShell } from "@/components/layout/AppShell";
import {
  Activity,
  Cpu,
  Database,
  Brain,
  Zap,
  FlaskConical,
  Inbox,
  ListChecks,
  Gauge,
  CheckCircle2,
  RefreshCw,
  Clock,
  Info,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StageStatus = "healthy" | "watch" | "degraded";
type ActivityOutcome = "success" | "warning" | "processing";

interface PipelineStage {
  id: string;
  name: string;
  status: StageStatus;
  latencyMs: number;
  description: string;
  icon: LucideIcon;
}

interface PipelineEvent {
  time: string;
  stage: string;
  detail: string;
  outcome: ActivityOutcome;
}

const STAGE_STATUS_CHIP: Record<StageStatus, string> = {
  healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  watch: "bg-amber-50 text-amber-700 border-amber-200",
  degraded: "bg-red-50 text-red-700 border-red-200",
};

const OUTCOME_COLOR: Record<ActivityOutcome, string> = {
  success: "text-emerald-600",
  warning: "text-amber-600",
  processing: "text-sky-600",
};

const STAGES: PipelineStage[] = [
  {
    id: "PI-01",
    name: "Data Ingestion",
    status: "healthy",
    latencyMs: 210,
    description:
      "Collects the five simulated source feeds (fleet, crew, weather, fuel, maintenance) into the planning snapshot.",
    icon: Inbox,
  },
  {
    id: "PI-02",
    name: "Data Validation",
    status: "healthy",
    latencyMs: 340,
    description:
      "Runs range, completeness and cross-feed consistency checks; flags synthetic anomalies before they enter planning.",
    icon: ListChecks,
  },
  {
    id: "PI-03",
    name: "Readiness Prediction",
    status: "healthy",
    latencyMs: 620,
    description:
      "Produces the readiness snapshot and factor breakdown powering the overview dashboard and AI plans projections.",
    icon: Brain,
  },
  {
    id: "PI-04",
    name: "Resource Optimization",
    status: "watch",
    latencyMs: 1180,
    description:
      "Solves allocation objectives over the demo fleet; currently on watch with elevated runtime under the surge scenario set.",
    icon: Zap,
  },
  {
    id: "PI-05",
    name: "What-if Simulation",
    status: "healthy",
    latencyMs: 480,
    description:
      "Evaluates posture scenarios deterministically; identical inputs always reproduce identical readiness outputs.",
    icon: FlaskConical,
  },
];

const ACTIVITY_LOG: PipelineEvent[] = [
  {
    time: "07:35:42 Z",
    stage: "Data Ingestion",
    detail: "Window refresh complete · 5 sources reconciled",
    outcome: "success",
  },
  {
    time: "07:35:44 Z",
    stage: "Data Validation",
    detail: "0 blocking anomalies · 2 tolerable range notes",
    outcome: "warning",
  },
  {
    time: "07:35:46 Z",
    stage: "Readiness Prediction",
    detail: "Snapshot published · baseline 87% readiness",
    outcome: "success",
  },
  {
    time: "07:36:02 Z",
    stage: "Resource Optimization",
    detail: "Objective solve on watch · runtime 1.18s over 0.9s budget",
    outcome: "warning",
  },
  {
    time: "07:36:19 Z",
    stage: "What-if Simulation",
    detail: "Scenario engine idle · ready for next run",
    outcome: "processing",
  },
];

function statusLabel(status: StageStatus): string {
  if (status === "healthy") return "HEALTHY";
  if (status === "watch") return "WATCH";
  return "DEGRADED";
}

function latencyClass(status: StageStatus): string {
  return status === "healthy" ? "text-emerald-600" : status === "watch" ? "text-amber-600" : "text-red-600";
}

function latencyBarClass(status: StageStatus): string {
  return status === "healthy" ? "bg-emerald-500" : status === "watch" ? "bg-amber-500" : "bg-red-500";
}

function latencyShare(latencyMs: number, budgetMs: number): number {
  return Math.min(100, Math.round((latencyMs / budgetMs) * 100));
}

export default function SystemHealthPage() {
  const healthyCount = STAGES.filter((s) => s.status === "healthy").length;
  const watchCount = STAGES.filter((s) => s.status === "watch").length;
  const degradedCount = STAGES.filter((s) => s.status === "degraded").length;
  const overallStatus = degradedCount > 0 ? "degraded" : watchCount > 0 ? "watch" : "healthy";

  const availability = Math.round(
    (STAGES.filter((s) => s.status !== "degraded").length / STAGES.length) * 100
  );

  const dataSourceHealthy = 4;
  const dataSourceScore = Math.round((dataSourceHealthy / 5) * 100);

  const lastCycleElapsed = "11:37";

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">System Health</h1>
            <p className="mt-1 text-lg text-slate-600">
              Demo pipeline status for the simulated planning window
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
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Status</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                {(overallStatus as StageStatus) === "healthy" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden={true} />
                ) : (
                  <Activity className="h-5 w-5 text-amber-600" aria-hidden={true} />
                )}
              </div>
            </div>
            <p className={`mt-1 text-2xl font-bold ${overallStatus === "healthy" ? "text-emerald-600" : "text-amber-600"}`}>
              OPERATIONAL
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {healthyCount} healthy · {watchCount} watch · {degradedCount} degraded
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pipeline Availability</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <Workflow className="h-5 w-5 text-sky-600" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{availability}%</p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${availability}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">{STAGES.length} simulated stages</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Data-Source Health</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
                <Database className="h-5 w-5 text-sky-600" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{dataSourceHealthy} of 5</p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${dataSourceScore}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">Mirrors the Data Sources page registry</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Processing Cycle</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Clock className="h-5 w-5 text-slate-500" aria-hidden={true} />
              </div>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums">{lastCycleElapsed}</p>
            <p className="mt-1 text-xs text-slate-500">
              Started 07:35:42 Z &middot; finished cleanly
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Pipeline Stages</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Simulated processing stages</h3>
            </div>
            <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
              Simulated
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {STAGES.map((stage) => (
              <div key={stage.id} className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 flex-shrink-0">
                      <stage.icon className="h-5 w-5 text-sky-600" aria-hidden={true} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stage.id}</p>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{stage.name}</h4>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-1 text-[10px] font-semibold rounded-full border ${STAGE_STATUS_CHIP[stage.status]}`}
                  >
                    {statusLabel(stage.status)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600">{stage.description}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0">
                    <Gauge className="h-4 w-4 text-slate-400" aria-hidden={true} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Latency</p>
                      <p className={`text-xs font-bold tabular-nums ${latencyClass(stage.status)}`}>
                        {stage.latencyMs} ms
                      </p>
                    </div>
                    <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${latencyBarClass(stage.status)}`}
                        style={{ width: `${latencyShare(stage.latencyMs, 1200)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Recent Processing</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Activity log for the current cycle</h3>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
              <RefreshCw className="h-3 w-3" aria-hidden={true} />
              Simulated
            </span>
          </div>

          <div className="space-y-2">
            {ACTIVITY_LOG.map((event) => (
              <div
                key={event.time}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
              >
                <span className="flex-shrink-0 text-[10px] font-mono text-slate-400 tabular-nums sm:w-24">
                  {event.time}
                </span>
                <span className="flex-shrink-0 w-max px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white border border-slate-200 text-slate-700">
                  {event.stage}
                </span>
                <p className={`text-xs sm:ml-auto sm:text-right ${OUTCOME_COLOR[event.outcome]}`}>{event.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[10px] text-slate-400 flex items-center gap-1.5">
            <Cpu className="h-3 w-3" aria-hidden={true} />
            Timeline entries are fixed demo values; the pipeline above is not connected to any real computing system.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-600 flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
            <span>
              All statuses, latencies, availability percentages and log entries on this page are{" "}
              <strong>synthetic demo data</strong>. AIR-OPTIMUS is a showcase build — nothing here is real
              infrastructure monitoring.
            </span>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
