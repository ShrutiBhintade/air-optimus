"use client";

import { CheckCircle2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <div className="flex-1 lg:max-w-2xl">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Operational Overview</h1>
          <p className="text-sm text-slate-500">AI-powered decision support for dynamic resource planning</p>
        </div>

        <div className="flex items-center gap-4">
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
    </header>
  );
}