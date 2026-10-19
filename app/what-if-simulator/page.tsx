"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FlaskConical, Play, RotateCcw, Plane, Users, Fuel, Cloud, Wrench, Brain, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FleetParams {
  aircraft: number;
  crew: number;
  fuel: number;
  weather: number;
  maintenance: number;
}

type WeatherLevel = "CLEAR" | "DEGRADED" | "SEVERE" | "EXTREME";
type MaintenanceLevel = "MINIMAL" | "ROUTINE" | "ELEVATED" | "CRITICAL";
type MissionPriority = "critical" | "high" | "medium" | "low";
type MissionStatus = "READY" | "DEGRADED" | "AT RISK";

interface DemoMission {
  id: string;
  name: string;
  zone: string;
  priority: MissionPriority;
  aircraftNeed: number;
  crewNeed: number;
  fuelNeed: number;
  weatherLimit: number;
  maintenanceLimit: number;
}

interface AffectedMission {
  mission: DemoMission;
  status: MissionStatus;
  reasons: string[];
}

interface Explanation {
  text: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
}

interface SimulationResult {
  params: FleetParams;
  runCount: number;
  readiness: { baseline: number; simulated: number; delta: number };
  resources: {
    label: string;
    baseline: string;
    simulated: string;
    delta: string;
    icon: LucideIcon;
  }[];
  missions: AffectedMission[];
  explanations: Explanation[];
  readyCount: number;
  degradedCount: number;
  atRiskCount: number;
}

const FLEET = { totalAircraft: 18, totalCrew: 42 };

const DEFAULT_PARAMS: FleetParams = {
  aircraft: 84,
  crew: 76,
  fuel: 68,
  weather: 25,
  maintenance: 30,
};

const DEMO_MISSIONS: DemoMission[] = [
  { id: "M-201", name: "Sector Alpha Recon", zone: "Zone Alpha", priority: "critical", aircraftNeed: 2, crewNeed: 4, fuelNeed: 62, weatherLimit: 70, maintenanceLimit: 60 },
  { id: "M-204", name: "Corridor Logistics", zone: "Zone Bravo", priority: "high", aircraftNeed: 2, crewNeed: 6, fuelNeed: 58, weatherLimit: 55, maintenanceLimit: 50 },
  { id: "M-207", name: "Coastal Patrol", zone: "Zone Charlie", priority: "high", aircraftNeed: 1, crewNeed: 3, fuelNeed: 48, weatherLimit: 65, maintenanceLimit: 40 },
  { id: "M-211", name: "Rescue Standby", zone: "Zone Alpha", priority: "critical", aircraftNeed: 1, crewNeed: 5, fuelNeed: 65, weatherLimit: 45, maintenanceLimit: 70 },
  { id: "M-213", name: "Pilot Conversion", zone: "Zone Delta", priority: "low", aircraftNeed: 1, crewNeed: 2, fuelNeed: 35, weatherLimit: 80, maintenanceLimit: 40 },
  { id: "M-216", name: "Border Sweep", zone: "Zone Bravo", priority: "medium", aircraftNeed: 2, crewNeed: 4, fuelNeed: 55, weatherLimit: 60, maintenanceLimit: 45 },
];

const PRIORITY_RANK: Record<MissionPriority, number> = { low: 0, medium: 1, high: 2, critical: 3 };

const WORSE_WITH_HIGHER: Record<keyof FleetParams, boolean> = {
  aircraft: false,
  crew: false,
  fuel: false,
  weather: true,
  maintenance: true,
};

const impactColors: Record<Explanation["impact"], string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-sky-50 text-sky-700 border-sky-200",
};

const missionStatusColors: Record<MissionStatus, string> = {
  READY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DEGRADED: "bg-amber-50 text-amber-700 border-amber-200",
  "AT RISK": "bg-red-50 text-red-700 border-red-200",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function computeReadiness(p: FleetParams): number {
  const score =
    0.3 * p.aircraft +
    0.22 * p.crew +
    0.12 * p.fuel +
    0.18 * (100 - p.weather) +
    0.18 * (100 - p.maintenance) +
    11;
  return clamp(Math.round(score), 0, 100);
}

function aircraftAvailable(p: FleetParams): number {
  return Math.round((FLEET.totalAircraft * p.aircraft) / 100);
}

function crewReady(p: FleetParams): number {
  return Math.round((FLEET.totalCrew * p.crew) / 100);
}

function fuelAfterWindow(p: FleetParams): number {
  return clamp(Math.round(p.fuel - 14 - p.weather * 0.06), 0, 100);
}

function maintenanceBacklog(p: FleetParams): number {
  return Math.round(p.maintenance * 0.4);
}

function weatherLevel(v: number): WeatherLevel {
  if (v < 25) return "CLEAR";
  if (v < 50) return "DEGRADED";
  if (v < 75) return "SEVERE";
  return "EXTREME";
}

function maintenanceLevel(v: number): MaintenanceLevel {
  if (v < 25) return "MINIMAL";
  if (v < 50) return "ROUTINE";
  if (v < 75) return "ELEVATED";
  return "CRITICAL";
}

function buildSimulation(params: FleetParams, runCount: number): SimulationResult {
  const baselineReadiness = computeReadiness(DEFAULT_PARAMS);
  const simulatedReadiness = computeReadiness(params);
  const delta = simulatedReadiness - baselineReadiness;

  const baselineAircraft = aircraftAvailable(DEFAULT_PARAMS);
  const simAircraft = aircraftAvailable(params);
  const aircraftDelta = simAircraft - baselineAircraft;

  const baselineCrew = crewReady(DEFAULT_PARAMS);
  const simCrew = crewReady(params);
  const crewDelta = simCrew - baselineCrew;

  const baselineFuelAfter = fuelAfterWindow(DEFAULT_PARAMS);
  const simFuelAfter = fuelAfterWindow(params);
  const fuelDelta = simFuelAfter - baselineFuelAfter;

  const baselineBacklog = maintenanceBacklog(DEFAULT_PARAMS);
  const simBacklog = maintenanceBacklog(params);
  const backlogDelta = simBacklog - baselineBacklog;

  let aircraftShortfall = Math.max(0, baselineAircraft - simAircraft);
  let crewShortfall = Math.max(0, baselineCrew - simCrew);

  const ordered = [...DEMO_MISSIONS].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  );

  const aircraftCuts = new Map<string, number>();
  for (const mission of ordered) {
    if (aircraftShortfall <= 0) break;
    const cut = Math.min(mission.aircraftNeed, aircraftShortfall);
    aircraftCuts.set(mission.id, cut);
    aircraftShortfall -= cut;
  }

  const crewCuts = new Map<string, number>();
  for (const mission of ordered) {
    if (crewShortfall <= 0) break;
    const cut = Math.min(mission.crewNeed - 1, crewShortfall);
    if (cut >= 1) {
      crewCuts.set(mission.id, cut);
      crewShortfall -= cut;
    }
  }

  const missions: AffectedMission[] = DEMO_MISSIONS.map((mission) => {
    const reasons: string[] = [];
    const planeCut = aircraftCuts.get(mission.id) ?? 0;
    const crewCut = crewCuts.get(mission.id) ?? 0;

    if (planeCut > 0) {
      reasons.push(`${planeCut} aircraft reassigned from ${mission.id} to cover higher-priority tasking`);
    }
    if (crewCut > 0) {
      reasons.push(`${crewCut} crew rotated off ${mission.id} to hold duty-hour margins`);
    }
    if (params.fuel < mission.fuelNeed) {
      reasons.push(`Fuel reserve ${params.fuel}% below the ${mission.fuelNeed}% launch requirement`);
    }
    if (params.weather > mission.weatherLimit) {
      reasons.push(`Weather severity ${params.weather}% exceeds the ${mission.weatherLimit}% ceiling over ${mission.zone}`);
    }
    if (params.maintenance > mission.maintenanceLimit) {
      reasons.push(`Maintenance backlog (${maintenanceLevel(params.maintenance).toLowerCase()}) delays the ${mission.id} launch window`);
    }

    let status: MissionStatus = "READY";
    if (reasons.length >= 2) {
      status = "AT RISK";
    } else if (reasons.length === 1) {
      status = mission.priority === "critical" ? "AT RISK" : "DEGRADED";
    }

    return { mission, status, reasons };
  });

  const readyCount = missions.filter((m) => m.status === "READY").length;
  const degradedCount = missions.filter((m) => m.status === "DEGRADED").length;
  const atRiskCount = missions.filter((m) => m.status === "AT RISK").length;

  const explanations: Explanation[] = [];
  explanations.push({
    text: `Projected operational readiness moves from ${baselineReadiness}% to ${simulatedReadiness}% (${
      delta >= 0 ? "+" : ""
    }${delta} pts) under this scenario posture.`,
    impact: Math.abs(delta) >= 8 ? "HIGH" : Math.abs(delta) >= 3 ? "MEDIUM" : "LOW",
  });
  if (aircraftDelta < 0) {
    explanations.push({
      text: `Cutting availability to ${params.aircraft}% removes ${aircraftDelta * -1} aircraft from the launch-ready pool; coverage of lowest-priority tasking degrades first.`,
      impact: aircraftDelta <= -3 ? "HIGH" : "MEDIUM",
    });
  } else if (aircraftDelta > 0) {
    explanations.push({
      text: `Raising availability to ${params.aircraft}% increases the launch-ready pool from ${baselineAircraft} to ${simAircraft} aircraft; this scenario assigns no additional tasking from the surplus.`,
      impact: aircraftDelta >= 3 ? "HIGH" : "LOW",
    });
  }
  if (crewDelta < 0) {
    explanations.push({
      text: `Crew readiness at ${params.crew}% leaves ${crewDelta * -1} fewer crews available; duty-hour margins must absorb remaining tasking.`,
      impact: crewDelta <= -4 ? "HIGH" : "MEDIUM",
    });
  } else if (crewDelta > 0) {
    explanations.push({
      text: `Crew readiness at ${params.crew}% adds ${crewDelta} ready crews, improving posture handover flexibility.`,
      impact: "LOW",
    });
  }
  if (params.weather > DEFAULT_PARAMS.weather) {
    const weatherAffected = missions.filter((m) => params.weather > m.mission.weatherLimit);
    const weatherHit = weatherAffected.length;
    if (weatherHit > 0) {
      const tightestCeiling = Math.min(...weatherAffected.map((m) => m.mission.weatherLimit));
      explanations.push({
        text: `Weather severity ${params.weather}% (${weatherLevel(params.weather)}) pushes ${weatherHit} mission${weatherHit === 1 ? "" : "s"} past operational ceilings over the affected zones (tightest limit ${tightestCeiling}%).`,
        impact: weatherHit >= 2 ? "HIGH" : "MEDIUM",
      });
    } else {
      const tightestCeiling = Math.min(...DEMO_MISSIONS.map((m) => m.weatherLimit));
      explanations.push({
        text: `Weather severity rises to ${params.weather}% (${weatherLevel(params.weather)}) but stays below the tightest launch ceiling (${tightestCeiling}%); no missions are weather-affected and no operational limits change.`,
        impact: "LOW",
      });
    }
  } else if (params.weather < DEFAULT_PARAMS.weather) {
    explanations.push({
      text: `Weather improves from ${DEFAULT_PARAMS.weather}% to ${params.weather}% (${weatherLevel(params.weather)}); no launch ceilings were exceeded before or after, so no weather restrictions are lifted.`,
      impact: "LOW",
    });
  }
  if (simFuelAfter < baselineFuelAfter) {
    explanations.push({
      text: `End-of-window fuel reserve falls ${baselineFuelAfter}% → ${simFuelAfter}% after weather-adjusted consumption; ${simFuelAfter < 20 ? "reserve margin is critical" : "reserve margin narrows"}.`,
      impact: simFuelAfter < 20 ? "HIGH" : "MEDIUM",
    });
  } else if (simFuelAfter > baselineFuelAfter) {
    explanations.push({
      text: `End-of-window fuel reserve rises to ${simFuelAfter}%, widening the contingency margin by ${simFuelAfter - baselineFuelAfter} pts.`,
      impact: "LOW",
    });
  }
  if (params.maintenance > DEFAULT_PARAMS.maintenance) {
    explanations.push({
      text: `Maintenance impact ${params.maintenance}% (${maintenanceLevel(params.maintenance)}) inflates backlog to ${simBacklog} hrs (+${backlogDelta} hrs), delaying lower-priority ground returns.`,
      impact: backlogDelta >= 15 ? "HIGH" : "MEDIUM",
    });
  } else if (params.maintenance < DEFAULT_PARAMS.maintenance) {
    explanations.push({
      text: `Maintenance impact reduced to ${params.maintenance}% clears ${baselineBacklog - simBacklog} hrs of backlog, returning assets to the pool faster.`,
      impact: "LOW",
    });
  }

  return {
    params,
    runCount,
    readiness: { baseline: baselineReadiness, simulated: simulatedReadiness, delta },
    resources: [
      {
        label: "Aircraft Available",
        baseline: `${baselineAircraft} of ${FLEET.totalAircraft}`,
        simulated: `${simAircraft} of ${FLEET.totalAircraft}`,
        delta: `${aircraftDelta >= 0 ? "+" : ""}${aircraftDelta}`,
        icon: Plane,
      },
      {
        label: "Crew Ready",
        baseline: `${baselineCrew} of ${FLEET.totalCrew}`,
        simulated: `${simCrew} of ${FLEET.totalCrew}`,
        delta: `${crewDelta >= 0 ? "+" : ""}${crewDelta}`,
        icon: Users,
      },
      {
        label: "Fuel Reserve (end of window)",
        baseline: `${baselineFuelAfter}%`,
        simulated: `${simFuelAfter}%`,
        delta: `${fuelDelta >= 0 ? "+" : ""}${fuelDelta} pts`,
        icon: Fuel,
      },
      {
        label: "Maintenance Backlog",
        baseline: `${baselineBacklog} hrs`,
        simulated: `${simBacklog} hrs`,
        delta: `${backlogDelta >= 0 ? "+" : ""}${backlogDelta} hrs`,
        icon: Wrench,
      },
    ],
    missions,
    explanations,
    readyCount,
    degradedCount,
    atRiskCount,
  };
}

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{title}</p>
  );
}

function valueChipColor(value: number): string {
  if (value >= 75) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (value >= 45) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

const weatherChipColor: Record<WeatherLevel, string> = {
  CLEAR: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DEGRADED: "bg-amber-50 text-amber-700 border-amber-200",
  SEVERE: "bg-amber-50 text-amber-700 border-amber-200",
  EXTREME: "bg-red-50 text-red-700 border-red-200",
};

const maintenanceChipColor: Record<MaintenanceLevel, string> = {
  MINIMAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ROUTINE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ELEVATED: "bg-amber-50 text-amber-700 border-amber-200",
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
};

interface SliderControlProps {
  label: string;
  icon: LucideIcon;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  hint: string;
  chip: string;
  chipClass: string;
  ariaLabel: string;
  onChange: (value: number) => void;
}

function SliderControl({ label, icon: Icon, value, min = 0, max = 100, step = 1, hint, chip, chipClass, ariaLabel, onChange }: SliderControlProps) {
  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 flex-shrink-0">
            <Icon className="h-4.5 w-4.5 text-sky-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{label}</p>
            <p className="text-xs text-slate-500 truncate">{hint}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full border ${chipClass}`} aria-live="polite">
          {chip}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 accent-sky-600 cursor-pointer"
        aria-label={ariaLabel}
      />
      <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-400">
        <span>{value}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}

export default function WhatIfSimulatorPage() {
  const [params, setParams] = useState<FleetParams>(DEFAULT_PARAMS);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setResult(buildSimulation(params, runCount + 1));
      setRunCount((c) => c + 1);
      setRunning(false);
    }, 900);
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    setResult(null);
    setRunning(false);
  };

  const setParam = (key: keyof FleetParams) => (value: number) =>
    setParams((prev) => ({ ...prev, [key]: value }));

  return (
    <AppShell>
      <div className="max-w-7xl w-full space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">What-If Simulator</h1>
            <p className="mt-1 text-lg text-slate-600">
              Stress-test fleet posture before committing resources
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200">
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">DEMO</span>
            <span className="text-[10px] text-sky-500">&middot;</span>
            <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">ALL OUTPUTS SIMULATED</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="mb-5">
                <SectionLabel title="Scenario Controls" />
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Adjust fleet posture parameters and run the scenario
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SliderControl
                  label="Aircraft Availability"
                  icon={Plane}
                  value={params.aircraft}
                  hint="Share of fleet ready to launch"
                  chip={`${params.aircraft}%`}
                  chipClass={valueChipColor(params.aircraft)}
                  ariaLabel="Aircraft availability percentage"
                  onChange={setParam("aircraft")}
                />
                <SliderControl
                  label="Crew Readiness"
                  icon={Users}
                  value={params.crew}
                  hint="Crews within duty-hour limits"
                  chip={`${params.crew}%`}
                  chipClass={valueChipColor(params.crew)}
                  ariaLabel="Crew readiness percentage"
                  onChange={setParam("crew")}
                />
                <SliderControl
                  label="Fuel Level"
                  icon={Fuel}
                  value={params.fuel}
                  hint="Reserve at start of planning window"
                  chip={`${params.fuel}%`}
                  chipClass={valueChipColor(params.fuel)}
                  ariaLabel="Fuel level percentage"
                  onChange={setParam("fuel")}
                />
                <SliderControl
                  label="Weather Severity"
                  icon={Cloud}
                  value={params.weather}
                  hint="Operational weather degradation"
                  chip={weatherLevel(params.weather)}
                  chipClass={weatherChipColor[weatherLevel(params.weather)]}
                  ariaLabel="Weather severity percentage"
                  onChange={setParam("weather")}
                />
                <div className="sm:col-span-2">
                  <SliderControl
                    label="Maintenance Impact"
                    icon={Wrench}
                    value={params.maintenance}
                    hint="Grounding effect of service backlog"
                    chip={`${params.maintenance}% · ${maintenanceLevel(params.maintenance)}`}
                    chipClass={maintenanceChipColor[maintenanceLevel(params.maintenance)]}
                    ariaLabel="Maintenance impact percentage"
                    onChange={setParam("maintenance")}
                  />
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Play className={`h-5 w-5 ${running ? "animate-pulse" : ""}`} aria-hidden={true} />
                  {running ? "Running Simulation…" : "Run Simulation"}
                </button>
                <button
                  onClick={handleReset}
                  disabled={running}
                  className="flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden={true} />
                  Reset Scenario
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" aria-hidden={true} />
                Simulation runs instantly against the synthetic fleet snapshot. Baseline readiness is locked
                to the current posture ({computeReadiness(DEFAULT_PARAMS)}%).
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <SectionLabel title="Scenario Summary" />
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {result ? `Scenario #${result.runCount} snapshot` : "No scenario run yet"}
                  </h3>
                </div>
                {result && (
                  <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
                    Simulated
                  </span>
                )}
              </div>
              {result ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: "Aircraft Availability", key: "aircraft" as const },
                    { label: "Crew Readiness", key: "crew" as const },
                    { label: "Fuel Level", key: "fuel" as const },
                    { label: "Weather Severity", key: "weather" as const },
                    { label: "Maintenance Impact", key: "maintenance" as const },
                  ].map((row) => {
                    const baseline = DEFAULT_PARAMS[row.key];
                    const simulated = result.params[row.key];
                    const worsened = WORSE_WITH_HIGHER[row.key]
                      ? simulated > baseline
                      : simulated < baseline;
                    const improved = simulated !== baseline && !worsened;
                    return (
                      <div key={row.key} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{row.label}</p>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <p className="text-sm font-bold text-slate-900">{simulated}%</p>
                          <span
                            className={`text-[10px] font-semibold ${
                              simulated === baseline
                                ? "text-slate-400"
                                : improved
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {simulated === baseline
                              ? "unchanged"
                              : improved
                              ? `up from ${baseline}%`
                              : `down from ${baseline}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <FlaskConical className="h-8 w-8 text-slate-300 mx-auto" aria-hidden={true} />
                  <p className="mt-2 text-sm text-slate-500">
                    Run a simulation to capture the scenario summary for officer briefing.
                  </p>
                </div>
              )}
              {result && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" aria-hidden={true} />
                  <p className="text-xs text-slate-600">
                    All figures are simulated for demonstration. Officer/operator retains final authority.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <SectionLabel title="Results · Baseline vs Simulated" />
                  <h3 className="mt-1 text-lg font-bold text-slate-900">Projected Operational Readiness</h3>
                </div>
                <span className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-full uppercase tracking-wider">
                  Simulated
                </span>
              </div>

              {!result ? (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <FlaskConical className="h-8 w-8 text-slate-300 mx-auto" aria-hidden={true} />
                  <p className="mt-3 text-sm font-medium text-slate-600">No simulation results yet</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Configure the scenario controls and press Run Simulation.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                    <div className="flex items-end gap-3">
                      <p className="text-4xl font-bold text-sky-700 tabular-nums">{result.readiness.simulated}%</p>
                      <span
                        className={`mb-1.5 px-2 py-0.5 text-xs font-semibold rounded-full border ${
                          result.readiness.delta >= 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {result.readiness.delta >= 0 ? "+" : ""}
                        {result.readiness.delta} pts
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div>
                        <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                          <span>BASELINE (CURRENT POSTURE)</span>
                          <span className="tabular-nums">{result.readiness.baseline}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-sky-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-slate-400 transition-all duration-500"
                            style={{ width: `${result.readiness.baseline}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-medium text-sky-700 mb-1">
                          <span>SIMULATED SCENARIO</span>
                          <span className="tabular-nums">{result.readiness.simulated}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-sky-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-600 transition-all duration-500"
                            style={{ width: `${result.readiness.simulated}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Resource Impact</p>
                    <div className="grid grid-cols-2 gap-3">
                      {result.resources.map((row) => (
                        <div key={row.label} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2">
                            <row.icon className="h-4 w-4 text-sky-600 flex-shrink-0" aria-hidden={true} />
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider leading-tight">{row.label}</p>
                          </div>
                          <p className="mt-1.5 text-sm font-bold text-slate-900">{row.simulated}</p>
                          <p className="text-[11px] text-slate-500">
                            Baseline {row.baseline} &middot; <span className={row.delta.startsWith("-") ? "text-red-600 font-medium" : "text-emerald-600 font-medium"}>{row.delta}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Affected Missions</p>
                      <span className="text-[11px] text-slate-500">
                        {result.readyCount} ready &middot; {result.degradedCount} degraded &middot; {result.atRiskCount} at risk
                      </span>
                    </div>
                    <div className="space-y-2">
                      {result.missions.map((m) => (
                        <div key={m.mission.id} className="p-3 rounded-lg bg-white border border-slate-200">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900">
                                {m.mission.id} &middot; {m.mission.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {m.mission.zone} &middot; {m.mission.priority.toUpperCase()} priority
                              </p>
                            </div>
                            <span className={`flex-shrink-0 px-2 py-1 text-[10px] font-semibold rounded-full border ${missionStatusColors[m.status]}`}>
                              {m.status}
                            </span>
                          </div>
                          {m.reasons.length > 0 && (
                            <ul className="mt-2 space-y-1 border-t border-slate-100 pt-2">
                              {m.reasons.map((reason) => (
                                <li key={reason} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0" aria-hidden={true} />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">AI Explanations</p>
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-700 uppercase tracking-wider">
                        <Brain className="h-3.5 w-3.5" aria-hidden={true} />
                        AI-Generated &middot; Simulated
                      </span>
                    </div>
                    <div className="space-y-2">
                      {result.explanations.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-xs flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="flex-1 text-xs text-slate-700">{item.text}</p>
                          <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${impactColors[item.impact]}`}>
                            {item.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" aria-hidden={true} />
                    <p className="text-xs text-emerald-800">
                      Deterministic simulation complete &mdash; identical inputs always reproduce these results.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-600 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden={true} />
                <span>
                  This simulator uses synthetic demo data and simplified deterministic models. Results are
                  labelled <strong>simulated</strong> throughout and must not be used for real operational
                  planning.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
