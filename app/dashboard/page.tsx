"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  Plane,
  Users,
  AlertTriangle,
  Target,
  Activity,
  Brain,
  GitMerge,
  Zap,
  FlaskConical,
  MessageSquare,
  Circle,
  Sparkles,
  TrendingUp,
  Minus,
  ArrowRight,
  Fuel,
  Wrench,
  MapPin,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

const twinNodes = [
  { id: "zone", name: "Operational Zone", status: "Active", icon: MapPin, color: "blue", statusColor: "bg-sky-500" },
  { id: "aircraft", name: "Aircraft", status: "Operational", icon: Plane, color: "sky", statusColor: "bg-emerald-500" },
  { id: "mission", name: "Mission", status: "Active", icon: Target, color: "amber", statusColor: "bg-sky-500" },
  { id: "crew", name: "Crew", status: "Ready", icon: Users, color: "emerald", statusColor: "bg-emerald-500" },
  { id: "fuel", name: "Fuel", status: "68%", icon: Fuel, color: "violet", statusColor: "bg-amber-500" },
  { id: "maintenance", name: "Maintenance", status: "Attention", icon: Wrench, color: "red", statusColor: "bg-red-500" },
];

const nodeColorMap = {
  sky: "bg-sky-100 text-sky-700 border-sky-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  red: "bg-red-100 text-red-700 border-red-200",
};

const legendItems = [
  { label: "Operational", color: "bg-emerald-500" },
  { label: "Attention", color: "bg-red-500" },
  { label: "Constraint", color: "bg-amber-500" },
];

const pipelineStages = [
  { step: "SENSE", icon: Plane, color: "sky", descriptor: "Multi-source data" },
  { step: "FUSE", icon: GitMerge, color: "blue", descriptor: "Unified state" },
  { step: "PREDICT", icon: Brain, color: "indigo", descriptor: "Readiness & conflicts" },
  { step: "OPTIMIZE", icon: Zap, color: "amber", descriptor: "Resource plans" },
  { step: "SIMULATE", icon: FlaskConical, color: "violet", descriptor: "What-if scenarios" },
  { step: "EXPLAIN", icon: MessageSquare, color: "emerald", descriptor: "AI rationale" },
];

const colorMap = {
  sky: "bg-sky-100 text-sky-700 border-sky-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function Page() {
  return (
    <AppShell>
      <div className="max-w-7xl w-full px-4 py-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                AIR-OPTIMUS · COMMAND INTELLIGENCE
              </p>
              <h2 className="mt-1 text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
                Dynamic Air Operations Intelligence
              </h2>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Real-time decision support for changing operational states.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
                {pipelineStages.map((stage, index) => (
                  <div
                    key={stage.step}
                    className="flex items-center gap-2 whitespace-nowrap relative"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${colorMap[stage.color as keyof typeof colorMap]}`}>
                      <stage.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-slate-700">{stage.step}</p>
                      <p className="text-[10px] text-slate-500">{stage.descriptor}</p>
                    </div>
                    {index < pipelineStages.length - 1 && (
                      <div className="hidden lg:block w-6 h-0.5 bg-gradient-to-r from-sky-200 to-transparent" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 bg-sky-50 rounded-xl border border-sky-100 p-4 lg:p-5 min-w-[160px]">
              <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">AI ENGINE</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 h-full w-full rounded-full bg-emerald-500 animate-pulse" />
                  <span className="absolute inset-0 h-full w-full rounded-full bg-emerald-500 opacity-30 animate-ping" />
                </span>
                <span className="text-sm font-semibold text-sky-700">READY</span>
              </div>
              <div className="mt-4 pt-4 border-t border-sky-100">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">92%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <KPICard icon={Plane} value={18} label="Total Aircraft" subtext="Fleet inventory" />
          <KPICard icon={Activity} value={15} label="Available Aircraft" subtext="Mission capable" trend={{ value: "+2", positive: true }} />
          <KPICard icon={Users} value={32} label="Crew Ready" subtext="Qualified & current" />
          <KPICard icon={Target} value="87%" label="Operational Readiness" subtext="Overall fleet health" progress={87} />
          <KPICard icon={Brain} value={6} label="Active Missions" subtext="In progress" />
          <KPICard icon={AlertTriangle} value={3} label="Active Alerts" subtext="Requires attention" trend={{ value: "+1", positive: false }} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Operational Readiness</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">Overall fleet health</h3>
                </div>
                <div className="flex-shrink-0 bg-sky-50 rounded-xl p-3">
                  <p className="text-3xl font-bold text-sky-700 tabular-nums">87%</p>
                </div>
              </div>

              <div className="mt-4 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: "87%" }} />
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-slate-500">AI Confidence</span>
                <span className="font-semibold text-slate-900">92%</span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key factors</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Aircraft availability</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      +12%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Crew readiness</span>
                    <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      +8%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Maintenance capacity</span>
                    <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <Minus className="h-3.5 w-3.5" />
                      -5%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Environmental conditions</span>
                    <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                      <Minus className="h-3.5 w-3.5" />
                      -3%
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-emerald-600 font-medium">↑ 4.2% from previous assessment</p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6 h-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Operational Intelligence
                  </p>
                </div>
                <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">Medium</span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detected change</p>
                  <p className="mt-1 text-sm text-slate-900">Aircraft A-07 availability changed</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Impact</p>
                  <p className="mt-1 text-sm text-slate-900">2 planned allocations may be affected</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-500">Confidence</span>
                  <span className="font-semibold text-slate-900">91%</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 bg-sky-50 rounded-xl p-4">
                <p className="text-sm text-slate-700">The current allocation has reduced resource flexibility.</p>
              </div>

              <Link
                href="/ai-plans"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-xl hover:bg-sky-100 transition-colors"
              >
                View AI Plans
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/ai-optimizer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-xl hover:bg-sky-100 transition-colors"
                >
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Review AI Recommendation
                </Link>
                <Link
                  href="/what-if-simulator"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-xl hover:bg-sky-100 transition-colors"
                >
                  <FlaskConical className="h-4 w-4" aria-hidden="true" />
                  Run What-if Simulation
                </Link>
              </div>

              <p className="mt-3 text-xs text-slate-500 text-center">
                AI-generated decision-support finding — not an autonomous action
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Digital Twin Preview</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">Synthetic operational state and resource relationships</h3>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-medium text-slate-900">24 entities tracked</p>
                <p className="text-xs text-slate-500">Last synchronized: 12 sec ago</p>
              </div>
            </div>

            <div className="relative" style={{ minHeight: "380px" }}>
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none -z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker id="arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                    <path d="M0,0 L0,6 L8,3 Z" fill="#7dd3fc" />
                  </marker>
                </defs>
                <path
                  d="M50,18 Q50,30 30,38"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                  markerEnd="url(#arrow)"
                />
                <path
                  d="M50,18 Q50,30 50,38"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                  markerEnd="url(#arrow)"
                />
                <path
                  d="M50,18 Q50,30 70,38"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                  markerEnd="url(#arrow)"
                />
                <path
                  d="M50,55 Q50,65 50,72"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                  markerEnd="url(#arrow)"
                />
                <path
                  d="M50,82 Q50,90 50,95"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                  markerEnd="url(#arrow)"
                />
              </svg>

              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-3 flex justify-center">
                    <TwinNode node={twinNodes[0]} />
                  </div>

                  <div className="flex justify-center">
                    <TwinNode node={twinNodes[1]} />
                  </div>
                  <div className="flex justify-center">
                    <TwinNode node={twinNodes[2]} />
                  </div>
                  <div className="flex justify-center">
                    <TwinNode node={twinNodes[3]} />
                  </div>

                  <div className="md:col-span-3 flex flex-col items-center gap-4">
                    <TwinNode node={twinNodes[4]} />
                    <TwinNode node={twinNodes[5]} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Legend</span>
              <div className="flex items-center gap-3">
                {legendItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
              <span className="ml-auto text-xs text-slate-400">Synthetic data — not live military data</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function TwinNode({ node }: { node: typeof twinNodes[0] }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border shadow-sm w-full max-w-xs">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${nodeColorMap[node.color as keyof typeof nodeColorMap]}`}>
        <node.icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="text-left min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{node.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`h-2 w-2 rounded-full ${node.statusColor}`} />
          <span className="text-xs font-medium text-slate-600">{node.status}</span>
        </div>
      </div>
    </div>
  );
}