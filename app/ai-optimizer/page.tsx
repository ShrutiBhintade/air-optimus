"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Zap,
  Target,
  Shield,
  Plane,
  Users,
  Fuel,
  Wrench,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Cloud,
  MapPin,
  Clock,
} from "lucide-react";

type Objective = "readiness" | "strain" | "balance";

const objectives: { id: Objective; label: string; description: string; icon: typeof Zap | typeof Target | typeof Shield }[] = [
  { id: "readiness", label: "MAXIMIZE READINESS", description: "Prioritize mission-capable resources", icon: Target },
  { id: "strain", label: "MINIMIZE RESOURCE STRAIN", description: "Reduce crew, aircraft and maintenance pressure", icon: Zap },
  { id: "balance", label: "BALANCE OPERATIONS", description: "Balance readiness, utilization and constraints", icon: Shield },
];

const resourcePlanRows = [
  {
    resource: "Aircraft",
    current: "A-07 unavailable",
    recommended: "A-12 assigned to Mission M-201",
    reason: "Maintains mission coverage",
    icon: Plane,
    color: "sky",
  },
  {
    resource: "Crew",
    current: "C-12 duty window constrained",
    recommended: "C-15 assigned",
    reason: "Within qualification and duty limits",
    icon: Users,
    color: "emerald",
  },
  {
    resource: "Fuel",
    current: "68%",
    recommended: "72% projected after allocation",
    reason: "Maintains reserve margin",
    icon: Fuel,
    color: "amber",
  },
  {
    resource: "Maintenance",
    current: "82% capacity",
    recommended: "Prioritize A-07 service",
    reason: "Reduces downstream availability risk",
    icon: Wrench,
    color: "violet",
  },
];

const rationaleItems = [
  { factor: "Aircraft A-12 reassigned to M-201", detail: "Only available asset with required range/payload", impact: "HIGH" },
  { factor: "Crew C-15 substituted for C-12", detail: "Duty window compliant; same qualification tier", impact: "HIGH" },
  { factor: "Fuel reserve maintained at 72%", detail: "Above 70% minimum for contingency operations", impact: "MEDIUM" },
  { factor: "A-07 maintenance prioritized", detail: "Returns asset to pool in 4.2 hrs vs 8+ hrs", impact: "MEDIUM" },
];

const impactColors = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-sky-50 text-sky-700 border-sky-200",
};

const previewMetrics = {
  readiness: { current: 87, projected: 91, delta: 4 },
  strain: { current: "Medium", projected: "Medium", delta: 0 },
  conflicts: { current: 2, projected: 0, delta: -2 },
  confidence: 92,
};

const optimizationConstraints = [
  {
    title: "Weather",
    detail: "Zone Alpha — Deteriorating",
    impact: "Medium",
    icon: Cloud,
    color: "amber",
  },
  {
    title: "Airspace",
    detail: "Sector B7 — Restricted",
    impact: "High",
    icon: MapPin,
    color: "red",
  },
  {
    title: "Crew Duty",
    detail: "2 personnel approaching duty limit",
    impact: "Medium",
    icon: Clock,
    color: "amber",
  },
  {
    title: "Maintenance",
    detail: "3 aircraft awaiting service",
    impact: "Medium",
    icon: Wrench,
    color: "violet",
  },
];

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{title}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">{subtitle}</h3>
    </div>
  );
}

function ObjectiveCard({ obj, selected, onClick }: { obj: typeof objectives[0]; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 transition-all ${
        selected
          ? "bg-sky-50 border-sky-300"
          : "bg-white border-slate-200 hover:border-sky-200 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
          selected ? "bg-sky-100" : "bg-slate-100"
        }`}>
          <obj.icon className={`h-5 w-5 ${selected ? "text-sky-600" : "text-slate-500"}`} />
        </div>
        <div className="flex-1 text-left">
          <h4 className={`font-semibold ${selected ? "text-sky-700" : "text-slate-900"}`}>{obj.label}</h4>
          <p className="mt-0.5 text-sm text-slate-500">{obj.description}</p>
        </div>
        {selected && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

function OptimizationContext() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Planning Horizon</p>
          <p className="mt-1 text-base font-bold text-slate-900">Next 6 hours</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</p>
          <p className="mt-1 text-base font-bold text-slate-900">High</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Readiness</p>
          <p className="mt-1 text-2xl font-bold text-sky-600">{previewMetrics.readiness.current}%</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Constraints Detected</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">4</p>
        </div>
      </div>
    </div>
  );
}

function AIOptimizationPreview() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">AI Optimization Preview</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">Projected outcome for selected objective</h3>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
          <Brain className="h-4 w-4 text-sky-600" />
          <span className="text-sm font-semibold text-sky-700">AI CONFIDENCE: {previewMetrics.confidence}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Expected Readiness</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-emerald-700">{previewMetrics.readiness.projected}%</p>
            <span className="text-emerald-600 font-semibold">+{previewMetrics.readiness.delta}%</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600">From {previewMetrics.readiness.current}%</p>
        </div>
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
          <p className="text-xs font-medium text-sky-700 uppercase tracking-wider">Resource Strain</p>
          <p className="mt-2 text-3xl font-bold text-sky-600">{previewMetrics.strain.projected}</p>
          <p className="mt-1 text-xs text-sky-600">No change from current</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Conflicts Resolved</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-emerald-700">{previewMetrics.conflicts.projected}</p>
            <span className="text-emerald-600 font-semibold">{previewMetrics.conflicts.delta}</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600">From {previewMetrics.conflicts.current}</p>
        </div>
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
          <p className="text-xs font-medium text-sky-700 uppercase tracking-wider">AI Confidence</p>
          <p className="mt-2 text-3xl font-bold text-sky-600">{previewMetrics.confidence}%</p>
          <p className="mt-1 text-xs text-sky-600">High confidence</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg border border-slate-100 p-4">
        <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-sky-600" />
          Recommended Resource Allocation
        </h4>
        <div className="space-y-3">
          {resourcePlanRows.map((row) => (
            <div key={row.resource} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${row.color}-100 flex-shrink-0`}>
                <row.icon className={`h-4 w-4 text-${row.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{row.resource}</p>
                <p className="text-xs text-slate-500 truncate">{row.recommended}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-slate-400">{row.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIRationale() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
          <Brain className="h-4 w-4 text-sky-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">AI Rationale</h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        The optimizer selected this allocation to maximize readiness while respecting all active constraints.
      </p>
      <div className="space-y-3">
        {rationaleItems.map((item, index) => (
          <div key={item.factor} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{item.factor}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.detail}</p>
            </div>
            <span className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${impactColors[item.impact as keyof typeof impactColors]}`}>
              {item.impact}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Recommendation generated from synthetic operational data.
        </p>
      </div>
    </div>
  );
}

function RunOptimizationCTA({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-medium text-white bg-sky-600 rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      <Brain className="h-5 w-5" />
      Run AI Optimization
    </button>
  );
}

function OptimizationConstraints() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-3">Optimization Constraints</h4>
      <div className="space-y-2">
        {optimizationConstraints.map((constraint) => (
          <div key={constraint.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${constraint.color}-100 flex-shrink-0`}>
              <constraint.icon className={`h-4 w-4 text-${constraint.color}-600`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{constraint.title}</p>
              <p className="mt-0.5 text-xs text-slate-500">{constraint.detail}</p>
            </div>
            <span className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${impactColors[constraint.impact as keyof typeof impactColors]}`}>
              {constraint.impact}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
      <p className="text-xs text-slate-600">
        AI-generated decision support — officer/operator retains final authority.
      </p>
    </div>
  );
}

export default function AIOptimizerPage() {
  const [selectedObjective, setSelectedObjective] = useState<Objective>("readiness");
  const [optimizationState, setOptimizationState] = useState<"idle" | "running">("idle");

  const handleRunOptimization = () => {
    setOptimizationState("running");
    setTimeout(() => {
      setOptimizationState("idle");
    }, 1500);
  };

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">AI Optimizer</h1>
            <p className="mt-1 text-lg text-slate-600">AI-assisted resource allocation and explainable planning</p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span className="text-xs font-medium text-emerald-700">SYSTEM OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
              <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">DEMO</span>
              <span className="text-[10px] text-sky-500">·</span>
              <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">SYNTHETIC DATA</span>
            </div>
          </div>
        </div>

        <SectionHeader title="Optimization Control" subtitle="Configure objective and review AI preview before execution" />

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <SectionHeader title="Objective" subtitle="Select the optimization priority for this planning cycle" />

              <div className="grid gap-4 md:grid-cols-3">
                {objectives.map((obj) => (
                  <ObjectiveCard
                    key={obj.id}
                    obj={obj}
                    selected={selectedObjective === obj.id}
                    onClick={() => setSelectedObjective(obj.id)}
                  />
                ))}
              </div>

              <OptimizationContext />

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <RunOptimizationCTA onClick={handleRunOptimization} disabled={optimizationState === "running"} />
                <span className="text-sm text-slate-500">Estimated compute: ~1.2s</span>
              </div>

              <OptimizationConstraints />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <AIOptimizationPreview />
            <AIRationale />
            <Disclaimer />
          </div>
        </div>
      </div>
    </AppShell>
  );
}