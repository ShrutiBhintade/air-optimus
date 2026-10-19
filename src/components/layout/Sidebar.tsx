"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Radar,
  Cpu,
  Zap,
  FlaskConical,
  FileText,
  Bell,
  Database,
  Activity,
  Plane,
} from "lucide-react";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/live-operations", label: "Live Operations", icon: Radar },
  { href: "/digital-twin", label: "Digital Twin", icon: Cpu },
  { href: "/ai-optimizer", label: "AI Optimizer", icon: Zap },
  { href: "/what-if-simulator", label: "What-If Simulator", icon: FlaskConical },
  { href: "/ai-plans", label: "AI Plans", icon: FileText },
  { href: "/alerts", label: "Alerts & Intelligence", icon: Bell },
  { href: "/data-sources", label: "Data Sources", icon: Database },
  { href: "/system-health", label: "System Health", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-200">
          <Link href="/dashboard" className="flex items-center gap-3" aria-label="AIR-OPTIMUS Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
              <Plane className="h-5 w-5 text-sky-600" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight">AIR-OPTIMUS</h1>
              <p className="text-xs text-slate-500 font-medium">Air Operations Intelligence</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-sky-600" : "text-slate-400"
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100">
              <Activity className="h-4 w-4 text-sky-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">DEMO ENVIRONMENT</p>
              <p className="text-[10px] text-slate-500 truncate">Synthetic data only</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}