"use client";

import { useState } from "react";
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
  Cloud,
  MapPin,
  Clock,
  Zap,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const severityConfig = {
  high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: AlertTriangle, dot: "bg-red-500" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: HelpCircle, dot: "bg-amber-500" },
  low: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", icon: CheckCircle2, dot: "bg-sky-500" },
};

const changeEvents = [
  {
    id: "evt-1",
    title: "Aircraft A-07 availability changed",
    severity: "medium" as const,
    time: "12 sec ago",
    impact: "2 planned allocations may be affected",
    icon: Plane,
  },
  {
    id: "evt-2",
    title: "Crew Unit C-12 duty window updated",
    severity: "low" as const,
    time: "48 sec ago",
    impact: "1 mission assignment requires review",
    icon: Users,
  },
  {
    id: "evt-3",
    title: "Weather condition changed in Zone Alpha",
    severity: "high" as const,
    time: "2 min ago",
    impact: "Mission M-204 risk increased",
    icon: Cloud,
  },
  {
    id: "evt-4",
    title: "Maintenance capacity reduced",
    severity: "medium" as const,
    time: "4 min ago",
    impact: "3 aircraft may require schedule adjustment",
    icon: Wrench,
  },
];

const resources = [
  { label: "Aircraft", current: 18, total: 24, unit: "%", icon: Plane, color: "sky" },
  { label: "Crew", current: 31, total: 33, unit: "%", icon: Users, color: "emerald" },
  { label: "Fuel", current: 68, total: 100, unit: "%", icon: Fuel, color: "amber" },
  { label: "Maintenance", current: 82, total: 100, unit: "%", icon: Wrench, color: "violet" },
];

const constraints = [
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

const impactColors = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-sky-50 text-sky-700 border-sky-200",
};

const aiAssessmentSteps = [
  {
    label: "DETECTED CHANGE",
    content: "Aircraft A-07 became unavailable",
    icon: Plane,
    color: "sky",
  },
  {
    label: "AFFECTED RESOURCES",
    content: "2 mission allocations • 1 crew assignment",
    icon: Target,
    color: "amber",
  },
  {
    label: "PREDICTED IMPACT",
    content: "Mission M-204 readiness decreases by 11%",
    icon: Zap,
    color: "red",
  },
  {
    label: "AI RECOMMENDATION",
    content: "Reassign Aircraft A-12 to M-204",
    icon: ArrowRight,
    color: "emerald",
    confidence: 91,
  },
];

function ChangeEventCard({ event, onAnalyze }: { event: typeof changeEvents[0]; onAnalyze: () => void }) {
  const config = severityConfig[event.severity];
  const Icon = config.icon;
  const EventIcon = event.icon;

  return (
    <div className={`bg-white rounded-xl border ${config.border} p-4 transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
          <EventIcon className="h-5 w-5" style={{ color: config.dot.replace("bg-", "") }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{event.title}</h4>
            <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
              {event.severity.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{event.impact}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time}
            </span>
          </div>
        </div>
        <button
          onClick={onAnalyze}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-lg hover:bg-sky-100 transition-colors whitespace-nowrap"
        >
          Analyze Impact
        </button>
      </div>
    </div>
  );
}

function ResourceProgressBar({ label, current, total, unit, icon: Icon, color }: typeof resources[0]) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const colorMap = {
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${color}-100`}>
            <Icon className={`h-4 w-4 text-${color}-600`} />
          </div>
          <span className="text-sm font-medium text-slate-900">{label}</span>
        </div>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{current} / {total}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorMap[color as keyof typeof colorMap]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{percentage}%</span>
        <span className="text-slate-500">Available capacity</span>
      </div>
    </div>
  );
}

function ConstraintItem({ title, detail, impact, icon: Icon, color }: typeof constraints[0]) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${color}-100 flex-shrink-0`}>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <p className="mt-0.5 text-sm text-slate-600">{detail}</p>
      </div>
      <span className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${impactColors[impact as keyof typeof impactColors]}`}>
        {impact}
      </span>
    </div>
  );
}

function AIAssessmentCard() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Change → Impact → Response</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">AI Impact Assessment</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 h-full w-full rounded-full bg-emerald-500 animate-pulse" />
            <span className="absolute inset-0 h-full w-full rounded-full bg-emerald-500 opacity-30 animate-ping" />
          </span>
          <span className="font-medium text-emerald-700">LIVE</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 bg-gradient-to-b from-transparent via-sky-200 to-transparent" aria-hidden="true" />
        
        <div className="relative z-10 space-y-8">
          {aiAssessmentSteps.map((step, index) => (
            <div key={step.label} className="relative">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 flex-shrink-0 relative z-10 bg-white ${step.color === "sky" ? "border-sky-200" : step.color === "amber" ? "border-amber-200" : step.color === "red" ? "border-red-200" : "border-emerald-200"}`}>
                  <step.icon className={`h-5 w-5 ${step.color === "sky" ? "text-sky-600" : step.color === "amber" ? "text-amber-600" : step.color === "red" ? "text-red-600" : "text-emerald-600"}`} />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{step.label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{step.content}</p>
                  {step.confidence && (
                    <p className="mt-2 text-sm text-emerald-600 font-medium">Confidence: {step.confidence}%</p>
                  )}
                </div>
              </div>
              {index < aiAssessmentSteps.length - 1 && (
                <div className="absolute left-[35px] top-12 bottom-[-8px] w-0.5 bg-sky-200" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            View Recommendation
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-xl hover:bg-sky-100 transition-colors">
            <Zap className="h-4 w-4" />
            Simulate Alternative
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500 text-center">
          AI-generated decision support — officer/operator retains final authority
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{title}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">{subtitle}</h3>
    </div>
  );
}

export default function LiveOperationsPage() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Live Operations</h1>
            <p className="mt-1 text-lg text-slate-600">Real-time operational state, changes and resource impact</p>
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

        <SectionHeader title="Operational Status" subtitle="Current fleet and personnel readiness" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={Activity}
            value="18 / 24"
            label="Aircraft Available"
            subtext="+2 vs previous assessment"
            trend={{ value: "+2", positive: true }}
          />
          <KPICard
            icon={Users}
            value={31}
            label="Crew Ready"
            subtext="94% qualified & current"
            trend={{ value: "+3", positive: true }}
          />
          <KPICard
            icon={Target}
            value={6}
            label="Active Missions"
            subtext="2 high priority"
            trend={{ value: "-1", positive: false }}
          />
          <KPICard
            icon={Plane}
            value="87%"
            label="Operational Readiness"
            subtext="+4.2% from previous assessment"
            progress={87}
            trend={{ value: "+4.2%", positive: true }}
          />
        </div>

        <SectionHeader title="Live Operational Changes" subtitle="Detected changes affecting the current operational state" />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="space-y-3">
            {changeEvents.map((event) => (
              <ChangeEventCard
                key={event.id}
                event={event}
                onAnalyze={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              />
            ))}
          </div>
        </div>

        <SectionHeader title="Current Operational State" subtitle="Resource availability and operational constraints" />

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Resource Availability</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">Current capacity levels</h3>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-lg hover:bg-sky-100 transition-colors">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Refresh
              </button>
            </div>
            <div className="space-y-6">
              {resources.map((resource) => (
                <ResourceProgressBar key={resource.label} {...resource} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Operational Constraints</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">Active limitations affecting operations</h3>
            </div>
            <div className="mt-4 space-y-3">
              {constraints.map((constraint) => (
                <ConstraintItem key={constraint.title} {...constraint} />
              ))}
            </div>
          </div>
        </div>

        <SectionHeader title="Change → Impact → Response" subtitle="AI-driven assessment of detected changes" />

        <AIAssessmentCard />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">Last synchronized: 12 sec ago</p>
          <p className="text-xs text-slate-400">Synthetic data — not live military data</p>
        </div>
      </div>
    </AppShell>
  );
}