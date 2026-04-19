import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { Plus, Play, TrendingUp } from "lucide-solid";
import { MOCK_PROJECTS, MOCK_EXPORTS } from "../../mock/data";

export default function QuickActions() {
  const recentProjects = MOCK_PROJECTS.slice(0, 3);
  const activeExports = MOCK_EXPORTS.filter(e => e.status === "processing");

  return (
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in stagger-2" style="opacity:0">
      <A href="/library" class="group glass-card-flat flex items-center gap-5 hover:border-primary/40 cursor-pointer !p-5">
        <div class="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
          <Plus size={28} stroke-width={3} />
        </div>
        <div>
          <h4 class="font-bold text-white text-base">Import Video</h4>
          <p class="text-xs text-slate-500 mt-0.5">Add new footage to process</p>
        </div>
      </A>

      <Show when={recentProjects.length > 0}>
        <A href={`/editor/${recentProjects[0].id}`} class="group glass-card-flat flex items-center gap-5 hover:border-emerald-500/40 cursor-pointer !p-5">
          <div class="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Play size={24} class="ml-1" />
          </div>
          <div>
            <h4 class="font-bold text-white text-base">Continue Editing</h4>
            <p class="text-xs text-slate-500 mt-0.5 truncate max-w-[160px]">{recentProjects[0].name}</p>
          </div>
        </A>
      </Show>

      <A href="/exports" class="group glass-card-flat flex items-center gap-5 hover:border-amber-500/40 cursor-pointer !p-5">
        <div class="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
          <TrendingUp size={24} />
        </div>
        <div>
          <h4 class="font-bold text-white text-base">View Exports</h4>
          <p class="text-xs text-slate-500 mt-0.5">{activeExports.length} active, {MOCK_EXPORTS.filter(e => e.status === "completed").length} completed</p>
        </div>
      </A>
    </div>
  );
}
