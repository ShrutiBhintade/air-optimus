"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  FileText,
  Plane,
  Users,
  Fuel,
  Wrench,
  Brain,
  AlertTriangle,
  Info,
  X,
  Target,
  Scale,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

interface OperationPlan {
  id: string;
  name: string;
  objective: string;
  readiness: number;
  aircraft: number;
  crew: number;
  fuelReserve: number;
  backlogHours: number;
  backlogDelta: number;
  risk: RiskLevel;
  riskDrivers: string[];
  tradeOffs: { gain: string; cost: string }[];
  notes: string;
}

interface PlanFleetDefaults {
  totalAircraft: number;
  totalCrew: number;
  baselineReadiness: number;
  baselineFuel: number;
  baselineBacklog: number;
}

const FLEET: PlanFleetDefaults = {
  totalAircraft: 18,
  totalCrew: 42,
  baselineReadiness: 87,
  baselineFuel: 53,
  baselineBacklog: 12,
};

const PLANS: OperationPlan[] = [
  {
    id: "PLAN-A",
    name: "Maximum Readiness Surge",
    objective: "Maximize mission-ready aircraft for the next 6-hour window",
    readiness: 94,
    aircraft: 16,
    crew: 36,
    fuelReserve: 38,
    backlogHours: 22,
    backlogDelta: 10,
    risk: "MEDIUM",
    riskDrivers: [
      "Fuel reserve falls to 38%, narrowing the contingency margin",
      "Maintenance deferral leaves 22 hrs of backlog entering the next cycle",
    ],
    tradeOffs: [
      {
        gain: "Highest projected readiness (+7 pts vs baseline)",
        cost: "Contingency fuel margin shrinks to the minimum reserve band",
      },
      {
        gain: "One additional aircraft allocated compared with baseline.",
        cost: "Four additional crews allocated compared with baseline.",
      },
    ],
    notes: "Needs a fuel uplift decision before the window closes to stay sustainable.",
  },
  {
    id: "PLAN-B",
    name: "Balanced Contingency",
    objective: "Hold high readiness while preserving fuel and maintenance margins",
    readiness: 90,
    aircraft: 14,
    crew: 32,
    fuelReserve: 55,
    backlogHours: 14,
    backlogDelta: 2,
    risk: "LOW",
    riskDrivers: [
      "One fewer aircraft allocated compared with baseline.",
    ],
    tradeOffs: [
      {
        gain: "Readiness improves +3 pts vs baseline with full reserve intact",
        cost: "One fewer aircraft available for secondary reconnaissance",
      },
      {
        gain: "All crews stay within comfortable duty-hour bands",
        cost: "Short-notice surge capacity limited to a single launch",
      },
    ],
    notes: "Recommended posture: balances capabilities with recovery options.",
  },
  {
    id: "PLAN-C",
    name: "Maintenance Reset",
    objective: "Clear the service backlog and restore fleet depth for tomorrow",
    readiness: 83,
    aircraft: 12,
    crew: 27,
    fuelReserve: 68,
    backlogHours: 2,
    backlogDelta: -10,
    risk: "MEDIUM",
    riskDrivers: [
      "Short-term readiness drops -4 pts vs baseline",
      "Only 12 aircraft cover tasking while 6 assets are not allocated to this plan",
    ],
    tradeOffs: [
      {
        gain: "Backlog collapses from 12 hrs to 2 hrs before the next cycle",
        cost: "Critical alert responsiveness is single-threaded this window",
      },
      {
        gain: "Fleet depth restored: 17/18 aircraft project ready tomorrow",
        cost: "Crew availability falls as technicians rotate to duty support",
      },
    ],
    notes: "Acceptable only if no critical alerts are expected this window.",
  },
];

const riskColors: Record<RiskLevel, string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-red-50 text-red-700 border-red-200",
};

function readinessClass(readiness: number, baseline: number): string {
  const delta = readiness - baseline;
  if (delta >= 0) return "text-emerald-600";
  return "text-red-600";
}

function SectionLabel({ title }: { title: string }) {
  return <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{title}</p>;
}

function PlanCard({ plan, onViewDetails }: { plan: OperationPlan; onViewDetails: () => void }) {
  const readinessDelta = plan.readiness - FLEET.baselineReadiness;
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 flex-shrink-0">
            <FileText className="h-5 w-5 text-sky-600" aria-hidden={true} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{plan.id}</p>
            <h3 className="text-base font-bold text-slate-900 truncate">{plan.name}</h3>
          </div>
        </div>
        <span className={`flex-shrink-0 px-2 py-1 text-[10px] font-semibold rounded-full border ${riskColors[plan.risk]}`}>
          {plan.risk} RISK
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <Target className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
        <p className="flex-1">{plan.objective}</p>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-sky-700 tabular-nums">{plan.readiness}%</p>
          <span className={`text-xs font-semibold ${readinessClass(plan.readiness, FLEET.baselineReadiness)}`}>
            {readinessDelta >= 0 ? "+" : ""}
            {readinessDelta} pts vs baseline
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-sky-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-sky-600 transition-all duration-500"
            style={{ width: `${plan.readiness}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Aircraft</p>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {plan.aircraft} of {FLEET.totalAircraft}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Crew</p>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {plan.crew} of {FLEET.totalCrew}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Fuel Reserve</p>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {plan.fuelReserve}%{" "}
            <span className={plan.fuelReserve >= FLEET.baselineFuel ? "text-emerald-600" : "text-red-600"}>
              {plan.fuelReserve >= FLEET.baselineFuel ? "+" : ""}
              {plan.fuelReserve - FLEET.baselineFuel}
            </span>
          </p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Backlog</p>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {plan.backlogHours} hrs{" "}
            <span className={plan.backlogDelta <= 0 ? "text-emerald-600" : "text-red-600"}>
              {plan.backlogDelta >= 0 ? "+" : ""}
              {plan.backlogDelta}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {plan.tradeOffs.map((trade) => (
          <div key={trade.gain} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-700 flex items-start gap-1.5">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" aria-hidden={true} />
              {trade.gain}
            </p>
            <p className="mt-1 text-xs text-slate-700 flex items-start gap-1.5">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" aria-hidden={true} />
              {trade.cost}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold text-sky-700 uppercase tracking-wider">Simulated</span>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
        >
          View Details
          <Info className="h-4 w-4" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}

function ComparisonTable() {
  const rows: {
    label: string;
    icon: LucideIcon;
    values: OperationPlan[];
    render: (plan: OperationPlan) => string;
    compare?: (plan: OperationPlan) => "best" | "worst" | null;
  }[] = [
    {
      label: "Projected Readiness",
      icon: Target,
      values: PLANS,
      render: (p) => `${p.readiness}% (${p.readiness - FLEET.baselineReadiness >= 0 ? "+" : ""}${p.readiness - FLEET.baselineReadiness})`,
      compare: (p) => (p.readiness === Math.max(...PLANS.map((x) => x.readiness)) ? "best" : p.readiness === Math.min(...PLANS.map((x) => x.readiness)) ? "worst" : null),
    },
    {
      label: "Aircraft Allocated",
      icon: Plane,
      values: PLANS,
      render: (p) => `${p.aircraft} of ${FLEET.totalAircraft}`,
      compare: (p) => (p.aircraft === Math.max(...PLANS.map((x) => x.aircraft)) ? "best" : null),
    },
    {
      label: "Crew Allocated",
      icon: Users,
      values: PLANS,
      render: (p) => `${p.crew} of ${FLEET.totalCrew}`,
      compare: (p) => (p.crew === Math.max(...PLANS.map((x) => x.crew)) ? "best" : null),
    },
    {
      label: "Fuel Reserve (end of window)",
      icon: Fuel,
      values: PLANS,
      render: (p) => `${p.fuelReserve}%`,
      compare: (p) => (p.fuelReserve === Math.max(...PLANS.map((x) => x.fuelReserve)) ? "best" : p.fuelReserve === Math.min(...PLANS.map((x) => x.fuelReserve)) ? "worst" : null),
    },
    {
      label: "Maintenance Backlog",
      icon: Wrench,
      values: PLANS,
      render: (p) => `${p.backlogHours} hrs (${p.backlogDelta >= 0 ? "+" : ""}${p.backlogDelta})`,
      compare: (p) => (p.backlogHours === Math.min(...PLANS.map((x) => x.backlogHours)) ? "best" : p.backlogHours === Math.max(...PLANS.map((x) => x.backlogHours)) ? "worst" : null),
    },
    {
      label: "Risk Level",
      icon: AlertTriangle,
      values: PLANS,
      render: (p) => p.risk,
      compare: (p) => (p.risk === "LOW" ? "best" : p.risk === "HIGH" ? "worst" : null),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <SectionLabel title="Plan Comparison" />
          <h3 className="mt-1 text-lg font-bold text-slate-900">Side-by-side plan metrics</h3>
        </div>
        <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
          Simulated
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left">
              <th className="py-2 pr-4 text-[10px] font-medium text-slate-400 uppercase tracking-wider">Metric</th>
              {PLANS.map((plan) => (
                <th key={plan.id} className="py-2 px-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  {plan.id} &middot; {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-slate-100">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <row.icon className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
                    <span className="text-xs font-medium text-slate-700">{row.label}</span>
                  </div>
                </td>
                {row.values.map((plan) => {
                  const mark = row.compare ? row.compare(plan) : null;
                  return (
                    <td key={plan.id} className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          mark === "best" ? "text-emerald-600" : mark === "worst" ? "text-red-600" : "text-slate-900"
                        }`}
                      >
                        {row.render(plan)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden={true} />
          Best among simulated plans
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden={true} />
          Weakest among simulated plans
        </span>
        <span className="flex items-center gap-1.5">
          <Scale className="h-3 w-3" aria-hidden={true} />
          Baseline: {FLEET.baselineReadiness}% readiness &middot; {FLEET.baselineFuel}% fuel &middot; {FLEET.baselineBacklog} hrs backlog
        </span>
      </div>
    </div>
  );
}

function PlanDetailsDialog({ plan, onClose }: { plan: OperationPlan; onClose: () => void }) {
  const readinessDelta = plan.readiness - FLEET.baselineReadiness;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`${plan.name} details`}>
      <button
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 cursor-default"
        aria-label="Close plan details"
        tabIndex={-1}
        type="button"
      />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{plan.id} &middot; SIMULATED PLAN</p>
            <h3 className="mt-0.5 text-xl font-bold text-slate-900">{plan.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden={true} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-sky-50 border border-sky-200 text-sm text-slate-700">
          <Target className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
          {plan.objective}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Projected Readiness</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {plan.readiness}%{" "}
              <span className={`${readinessDelta >= 0 ? "text-emerald-600" : "text-red-600"} text-sm`}>
                {readinessDelta >= 0 ? "+" : ""}
                {readinessDelta} pts
              </span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Risk Level</p>
            <span className={`mt-1 inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${riskColors[plan.risk]}`}>
              {plan.risk} RISK
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Aircraft Requirement</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {plan.aircraft} <span className="text-sm font-medium text-slate-500">of {FLEET.totalAircraft}</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Crew Requirement</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {plan.crew} <span className="text-sm font-medium text-slate-500">of {FLEET.totalCrew}</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Fuel Impact</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {plan.fuelReserve}%{" "}
              <span className={`text-sm ${plan.fuelReserve >= FLEET.baselineFuel ? "text-emerald-600" : "text-red-600"}`}>
                {plan.fuelReserve >= FLEET.baselineFuel ? "+" : ""}
                {plan.fuelReserve - FLEET.baselineFuel} vs baseline
              </span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Maintenance Impact</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {plan.backlogHours} hrs{" "}
              <span className={`text-sm ${plan.backlogDelta <= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {plan.backlogDelta >= 0 ? "+" : ""}
                {plan.backlogDelta} vs baseline
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Key Trade-offs</p>
          <div className="space-y-2">
            {plan.tradeOffs.map((trade) => (
              <div key={trade.gain} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" aria-hidden={true} />
                  {trade.gain}
                </p>
                <p className="mt-1 text-xs text-slate-700 flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" aria-hidden={true} />
                  {trade.cost}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Risk Drivers</p>
          <ul className="space-y-1.5">
            {plan.riskDrivers.map((driver) => (
              <li key={driver} className="flex items-start gap-2 text-xs text-slate-700">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
                {driver}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
          <Brain className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
          <p className="text-xs text-slate-700">{plan.notes}</p>
        </div>

        <p className="mt-4 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Clock className="h-3 w-3" aria-hidden={true} />
          All figures are deterministic simulations over synthetic demo data.
        </p>
      </div>
    </div>
  );
}

export default function AIPlansPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) ?? null;

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">AI Plans</h1>
            <p className="mt-1 text-lg text-slate-600">
              Deterministic operational plan options for the next planning cycle
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">DEMO</span>
            <span className="text-[10px] text-sky-500">&middot;</span>
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">ALL OUTPUTS SIMULATED</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onViewDetails={() => setSelectedPlanId(plan.id)} />
          ))}
        </div>

        <ComparisonTable />

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-600 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
            <span>
              AI-generated comparison across synthetic demo data &mdash; plans are labelled{" "}
              <strong>simulated</strong>. Officer/operator retains final authority over any plan selection.
            </span>
          </p>
        </div>
      </div>

      {selectedPlan && (
        <PlanDetailsDialog plan={selectedPlan} onClose={() => setSelectedPlanId(null)} />
      )}
    </AppShell>
  );
}
