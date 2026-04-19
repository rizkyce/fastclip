import { Film, Sparkles, Clock, HardDrive } from "lucide-solid";
import { createResource, Show } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

export default function StatsGrid() {
  const [stats] = createResource(async () => {
    try {
      return await invoke<any>("get_dashboard_stats");
    } catch (e) {
      console.error("Failed to fetch dashboard stats:", e);
      return {
        total_videos: 0,
        total_projects: 0,
        total_clips: 0,
        time_saved_mins: 0,
        storage_used_gb: 0.0,
      };
    }
  });

  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in stagger-1" style="opacity:0">
      <Show when={stats()} fallback={<div class="col-span-4 h-32 flex items-center justify-center font-black text-slate-500 uppercase tracking-widest animate-pulse">Calculating Stats...</div>}>
        {(data) => (
          <>
            {/* Total Projects */}
            <div class="stat-card" style={{ "--stat-glow": "rgba(79, 70, 229, 0.4)" }}>
              <div class="flex items-start justify-between">
                <div class="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <Film size={20} class="text-primary" />
                </div>
                <svg class="w-16 h-8 opacity-40" viewBox="0 0 100 40">
                  <path d="M0,35 Q10,10 20,25 T40,15 T60,30 T80,10 T100,20" fill="none" stroke="currentColor" stroke-width="2" class="text-primary" />
                </svg>
              </div>
              <div>
                <span class="text-sm font-black text-slate-500 uppercase tracking-widest block mb-1">Projects</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-black text-white">{data().total_projects}</span>
                  <span class="text-[10px] font-bold text-emerald-500">+Auto</span>
                </div>
              </div>
            </div>

            {/* Clips Generated */}
            <div class="stat-card" style={{ "--stat-glow": "rgba(16, 185, 129, 0.3)" }}>
              <div class="flex items-start justify-between">
                <div class="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Sparkles size={20} class="text-emerald-500" />
                </div>
                <svg class="w-16 h-8 opacity-40" viewBox="0 0 100 40">
                  <path d="M0,30 Q25,35 50,15 T100,5" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-500" />
                </svg>
              </div>
              <div>
                <span class="text-sm font-black text-slate-500 uppercase tracking-widest block mb-1">Clips</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-black text-white">{data().total_clips}</span>
                  <span class="text-[10px] font-bold text-emerald-500">↑ High</span>
                </div>
              </div>
            </div>

            {/* Time Saved */}
            <div class="stat-card" style={{ "--stat-glow": "rgba(245, 158, 11, 0.3)" }}>
              <div class="flex items-start justify-between">
                <div class="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <Clock size={20} class="text-amber-500" />
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-[10px] font-black text-amber-500 uppercase tracking-tighter italic">AI Optimized</span>
                </div>
              </div>
              <div>
                <span class="text-sm font-black text-slate-500 uppercase tracking-widest block mb-1">Efficiency</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-black text-white">{data().time_saved_mins}m</span>
                  <span class="text-[10px] font-bold text-slate-500">SAVED</span>
                </div>
              </div>
            </div>

            {/* Storage */}
            <div class="stat-card" style={{ "--stat-glow": "rgba(6, 182, 212, 0.3)" }}>
              <div class="flex items-start justify-between">
                <div class="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <HardDrive size={20} class="text-cyan-500" />
                </div>
                <span class="text-[10px] font-bold text-slate-500">Local DB</span>
              </div>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-black text-slate-500 uppercase tracking-widest block mb-1">Library</span>
                  <span class="text-3xl font-black text-white">{data().storage_used_gb.toFixed(1)} GB</span>
                </div>
                <div class="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div class="h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" style={`width: ${Math.min((data().storage_used_gb / 50) * 100, 100)}%`} />
                </div>
              </div>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
