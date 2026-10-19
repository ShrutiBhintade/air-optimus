"use client";

import { AppShell } from "@/components/layout/AppShell";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  Plane,
  Users,
  Target,
  Activity,
  AlertTriangle,
  Fuel,
  Wrench,
  MapPin,
  CheckCircle2,
  Brain,
  Circle,
} from "lucide-react";

const graphNodes = [
  { id: "zone", name: "Operational Zone", status: "Active", icon: MapPin, color: "blue" },
  { id: "aircraft", name: "Aircraft", status: "Operational", icon: Plane, color: "sky" },
  { id: "mission", name: "Mission", status: "Active", icon: Target, color: "amber" },
  { id: "crew", name: "Crew", status: "Ready", icon: Users, color: "emerald" },
  { id: "fuel", name: "Fuel", status: "68%", icon: Fuel, color: "violet" },
  { id: "maintenance", name: "Maintenance", status: "Attention", icon: Wrench, color: "red" },
];

const entityStatusConfig = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Operational: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Ready: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Attention: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  "68%": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
};

const twinInsights = [
  {
    id: 1,
    title: "Aircraft A-07 availability changed",
    severity: "medium" as const,
    confidence: 91,
    detail: "Asset became unavailable 12 sec ago; 2 planned allocations affected",
  },
  {
    id: 2,
    title: "Mission M-204 readiness decreased by 11%",
    severity: "high" as const,
    confidence: 93,
    detail: "Loss of A-07 reduces mission readiness from 94% to 83%",
  },
  {
    id: 3,
    title: "Maintenance constraint may affect 3 aircraft",
    severity: "medium" as const,
    confidence: 88,
    detail: "Reduced capacity delays return-to-service for A-07, A-03, A-19",
  },
];

const entityStateList = [
  { name: "Aircraft A-07", status: "Attention", icon: Plane, color: "red" },
  { name: "Aircraft A-12", status: "Operational", icon: Plane, color: "sky" },
  { name: "Mission M-204", status: "Active", icon: Target, color: "amber" },
  { name: "Crew C-15", status: "Ready", icon: Users, color: "emerald" },
  { name: "Fuel", status: "68%", icon: Fuel, color: "violet" },
  { name: "Maintenance", status: "Attention", icon: Wrench, color: "red" },
];

const severityConfig = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", icon: AlertTriangle },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", icon: Brain },
};

const nodeColorMap = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  sky: "bg-sky-100 text-sky-700 border-sky-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  red: "bg-red-100 text-red-700 border-red-200",
};

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{title}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">{subtitle}</h3>
    </div>
  );
}

function GraphNode({ node }: { node: typeof graphNodes[0] }) {
  const config = entityStatusConfig[node.status as keyof typeof entityStatusConfig] || entityStatusConfig.Active;
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${nodeColorMap[node.color as keyof typeof nodeColorMap]}`}>
        <node.icon className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <div className="text-left min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{node.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          <span className="text-xs font-medium text-slate-600">{node.status}</span>
        </div>
      </div>
    </div>
  );
}

function TwinVisualization() {
  return (
    <div className="relative" style={{ minHeight: "420px" }}>
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-[80px] bottom-[280px] w-0.5 -translate-x-1/2 bg-sky-500/70" />
        <div className="absolute left-[25%] top-[160px] w-[25%] h-0.5 bg-sky-500/70" />
        <div className="absolute left-[50%] top-[160px] w-[25%] h-0.5 bg-sky-500/70" />
        <div className="absolute left-1/2 top-[240px] bottom-[140px] w-0.5 -translate-x-1/2 bg-sky-500/70" />
        <div className="absolute left-1/2 top-[320px] bottom-[60px] w-0.5 -translate-x-1/2 bg-sky-500/70" />
        <div className="absolute left-[25%] top-[80px] h-[80px] w-0.5 bg-sky-500/70" />
        <div className="absolute left-[75%] top-[80px] h-[80px] w-0.5 bg-sky-500/70" />
        <div className="absolute left-[25%] top-[160px] h-[80px] w-0.5 bg-sky-500/70" />
        <div className="absolute left-[75%] top-[160px] h-[80px] w-0.5 bg-sky-500/70" />
        <div className="absolute left-1/2 top-[240px] h-[80px] w-0.5 -translate-x-1/2 bg-sky-500/70" />
        <div className="absolute left-1/2 top-[320px] h-[60px] w-0.5 -translate-x-1/2 bg-sky-500/70" />
      </div>

      <div className="relative z-10 h-full grid grid-cols-3 grid-rows-[auto_1fr_auto_auto] gap-y-6 gap-x-4 max-w-4xl mx-auto pt-6">
        <div className="col-span-3 flex justify-center">
          <GraphNode node={graphNodes[0]} />
        </div>

        <div className="flex justify-center items-center">
          <GraphNode node={graphNodes[1]} />
        </div>
        <div className="flex justify-center items-center">
          <GraphNode node={graphNodes[2]} />
        </div>
        <div className="flex justify-center items-center">
          <GraphNode node={graphNodes[3]} />
        </div>

        <div className="col-span-3 flex justify-center">
          <GraphNode node={graphNodes[4]} />
        </div>

        <div className="col-span-3 flex justify-center">
          <GraphNode node={graphNodes[5]} />
        </div>
      </div>
    </div>
  );
}

function TwinInsightCard({ insight }: { insight: typeof twinInsights[0] }) {
  const config = severityConfig[insight.severity];
  const Icon = config.icon;
  return (
    <div className={`bg-white rounded-xl border ${config.border} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
          <Icon className="h-5 w-5" style={{ color: config.dot.replace("bg-", "") }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{insight.title}</h4>
            <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
              {insight.severity.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{insight.detail}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Confidence: {insight.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntityStateRow({ entity }: { entity: typeof entityStateList[0] }) {
  const config = entityStatusConfig[entity.status as keyof typeof entityStatusConfig] || entityStatusConfig.Active;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${entity.color}-100 flex-shrink-0`}>
        <entity.icon className={`h-4 w-4 text-${entity.color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{entity.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <span className={`text-xs font-medium ${config.text}`}>{entity.status}</span>
      </div>
    </div>
  );
}

export default function DigitalTwinPage() {
  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Digital Twin</h1>
            <p className="mt-1 text-lg text-slate-600">Live synthetic representation of aircraft, missions, crew and operational constraints</p>
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

        <SectionHeader title="Twin Status" subtitle="Current digital twin synchronization state" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={Activity} value={24} label="Entities Tracked" subtext="All domains synchronized" />
          <KPICard icon={Plane} value={24} label="Aircraft" subtext="18 operational · 6 attention" />
          <KPICard icon={Target} value={6} label="Active Missions" subtext="2 high priority" />
          <KPICard icon={Brain} value="94%" label="Twin Confidence" subtext="High fidelity model" progress={94} />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">
              <div className="mb-4">
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Operational Digital Twin</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">Synthetic operational state and resource relationships</h3>
              </div>
              <TwinVisualization />
              <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Legend</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-600">Operational / Ready</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-xs text-slate-600">Attention</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-600">Constraint / Degraded</span>
                  </div>
                </div>
                <span className="ml-auto text-xs text-slate-400">Synthetic data — not live military data</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
                  <Brain className="h-4 w-4 text-sky-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Twin Insights</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">AI-generated observations from the digital twin state</p>
              <div className="space-y-3">
                {twinInsights.map((insight) => (
                  <TwinInsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <Circle className="h-4 w-4 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Entity State</h3>
                </div>
                <span className="text-xs text-slate-500">24 entities tracked</span>
              </div>
              <div className="space-y-2">
                {entityStateList.map((entity) => (
                  <EntityStateRow key={entity.name} entity={entity} />
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500 text-center">Showing 6 of 24 entities — filtered for attention items</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">Last synchronized: 12 sec ago</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Synthetic data — not live military data</span>
            <span>Digital twin provides decision-support visibility; operator retains final authority.</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}