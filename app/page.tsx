"use client";

import Link from "next/link";
import {
  Plane,
  GitMerge,
  Brain,
  Zap,
  FlaskConical,
  MessageSquare,
  TrendingUp,
  Cpu,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Activity,
  Radar,
  Database,
  Bell,
} from "lucide-react";

const workflowStages = [
  { step: "SENSE", icon: Radar, descriptor: "Multi-source operational data", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { step: "FUSE", icon: GitMerge, descriptor: "Unified operational picture", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { step: "PREDICT", icon: Brain, descriptor: "Readiness & conflict forecasts", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { step: "OPTIMIZE", icon: Zap, descriptor: "Resource allocation plans", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { step: "SIMULATE", icon: FlaskConical, descriptor: "What-if scenario testing", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { step: "EXPLAIN", icon: MessageSquare, descriptor: "AI rationale & trade-offs", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const capabilities = [
  {
    title: "AI Readiness Prediction",
    description:
      "Forecasts aircraft availability and overall mission readiness from fused operational indicators, surfacing likely shortfalls before they materialize.",
    icon: TrendingUp,
    href: "/ai-optimizer",
  },
  {
    title: "Dynamic Resource Optimization",
    description:
      "Recommends allocations of aircraft, crew, fuel and maintenance windows under current constraints and shifting priorities.",
    icon: Zap,
    href: "/ai-optimizer",
  },
  {
    title: "What-if Simulation",
    description:
      "Stress-test candidate decisions against synthetic scenarios to compare outcomes before committing to a plan of action.",
    icon: FlaskConical,
    href: "/what-if-simulator",
  },
  {
    title: "Digital Twin",
    description:
      "A live synthetic model of the operational state — aircraft, missions, crew and resources with their relationships and dependencies.",
    icon: Cpu,
    href: "/digital-twin",
  },
  {
    title: "Explainable Recommendations",
    description:
      "Every AI recommendation ships with its reasoning, confidence level and key contributing factors — no black-box decisions.",
    icon: MessageSquare,
    href: "/ai-plans",
  },
  {
    title: "Alternative Plan Comparison",
    description:
      "Side-by-side comparison of competing allocation plans so planners can evaluate trade-offs instead of accepting a single answer.",
    icon: FileText,
    href: "/ai-plans",
  },
];

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 shadow-sm">
      <Bell className="h-3.5 w-3.5" aria-hidden="true" />
      Demo environment — synthetic data
    </span>
  );
}

export default function LandingPage() {
  const scrollToCapabilities = () => {
    document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 shadow-sm">
              <Plane className="h-5 w-5 text-sky-600" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">AIR-OPTIMUS</p>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">Air Operations Intelligence</p>
            </div>
          </div>
          <div className="hidden md:block">
            <DemoBadge />
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            Launch AIR-OPTIMUS
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-sky-50 to-white" />
            <div className="absolute left-1/2 top-[-192px] h-[576px] w-[576px] -translate-x-1/2 rounded-full bg-sky-100/50 blur-3xl" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex justify-center md:hidden">
                <DemoBadge />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-sky-600 md:mt-0">
                AI-Assisted Air Operations Decision Support
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Intelligent Air Operations.{" "}
                <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  Optimized in Real Time.
                </span>
              </h1>
              <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
                AIR-OPTIMUS is an AI-assisted planning and resource optimization
                decision-support platform for air operations. It fuses operational
                data into a unified picture, predicts readiness and conflicts, and
                recommends optimized plans — always under operator control.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-sky-700 hover:shadow-xl sm:w-auto"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Launch AIR-OPTIMUS
                </Link>
                <button
                  type="button"
                  onClick={scrollToCapabilities}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 sm:w-auto"
                >
                  Explore Capabilities
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-6 text-xs text-slate-400">
                Demo environment · Synthetic data only · Decision-support, not autonomous action
              </p>
            </div>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-24 border-t border-slate-100 bg-slate-50/50">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Capabilities</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                One platform, six decision advantages
              </h2>
              <p className="mt-4 text-slate-600">
                Each capability feeds the next — from raw operational signals to
                explainable, comparable plans a human can defend.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <Link
                    key={capability.title}
                    href={capability.href}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 transition-colors group-hover:bg-sky-200">
                      <Icon className="h-5 w-5 text-sky-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{capability.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {capability.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                      Open module
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Workflow</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                From signals to decisions
              </h2>
              <p className="mt-4 text-slate-600">
                A continuous loop that keeps pace with changing operational states.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.step}
                    className="relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${stage.color}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold tracking-wide text-slate-900">
                        {index + 1}. {stage.step}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{stage.descriptor}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50/50">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Operational Value</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Better decisions, faster — with humans in command
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Air operations planning means balancing aircraft availability, crew
                  currency, fuel, maintenance and mission priorities while conditions
                  change. AIR-OPTIMUS compresses that analysis cycle from hours to
                  seconds: planners spend less time reconciling data and more time on
                  judgment and execution.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Earlier detection of readiness risks and resource conflicts",
                    "Optimization of constrained resources across competing missions",
                    "Confidence-scored recommendations with full reasoning",
                    "Every proposed change validated through simulation first",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sky-100">
                        <ShieldCheck className="h-3 w-3 text-sky-600" aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
                      <Bell className="h-5 w-5 text-amber-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-amber-700">
                        Demo environment — synthetic data
                      </p>
                      <p className="mt-1 text-sm text-amber-700/90">
                        You are viewing a demonstration environment. All entities,
                        statuses and recommendations shown in AIR-OPTIMUS are
                        synthetic — they do not represent live operations, real
                        government or military systems, or any deployed integrations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100">
                      <ShieldCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
                        Decision support — human authority
                      </p>
                      <p className="mt-1 text-sm text-sky-700/90">
                        AIR-OPTIMUS recommendations are decision support only. They do
                        not execute, alter or authorize any operational action. Final
                        operational authority remains solely with designated
                        authorized personnel.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <Activity className="h-5 w-5 text-slate-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
                        Built for transparency
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Every recommendation carries its confidence level, detected
                        change and impact assessment, so the reasoning behind each plan
                        is always inspectable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-3xl rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-8 text-center shadow-lg shadow-sky-600/5 sm:p-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 shadow-sm">
                <Plane className="h-6 w-6 text-sky-600" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Ready to see it in action?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                Open the command intelligence dashboard and explore live synthetic
                operations — readiness, optimization, digital twin and simulation.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-sky-700 hover:shadow-xl"
              >
                <Database className="h-5 w-5" aria-hidden="true" />
                Launch AIR-OPTIMUS
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
              <Plane className="h-4 w-4 text-sky-600" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight">AIR-OPTIMUS</p>
              <p className="text-xs text-slate-500">Air Operations Intelligence</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <span>Demo environment — synthetic data</span>
            <span aria-hidden="true">·</span>
            <span>Decision support not autonomous action</span>
            <span aria-hidden="true">·</span>
            <span>Authorized personnel retain final operational authority</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
