import { For, createResource, Show } from "solid-js";
import { A } from "@solidjs/router";
import { ArrowRight, Sparkles } from "lucide-solid";
import { invoke } from "@tauri-apps/api/core";
import { convertFileSrc } from "@tauri-apps/api/core";

export default function RecentProjectsList() {
  const [projects] = createResource(async () => {
    try {
      return await invoke<any[]>("get_recent_projects", { limit: 3 });
    } catch (e) {
      console.error("Failed to fetch recent projects:", e);
      return [];
    }
  });

  return (
    <div class="animate-fade-in stagger-4" style="opacity:0">
      <div class="flex items-center justify-between mb-6">
        <h3 class="heading-section text-lg">Recent Projects</h3>
        <A href="/library" class="label-micro-primary hover:text-white transition-colors flex items-center gap-1">
          View All <ArrowRight size={12} />
        </A>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Show when={projects()?.length === 0}>
           <div class="col-span-3 h-48 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
              <span class="text-slate-500 font-black uppercase tracking-widest text-xs">No Recent Projects</span>
              <A href="/library" class="text-primary font-bold text-[10px] mt-2 uppercase tracking-tighter hover:underline">Import your first video</A>
           </div>
        </Show>
        <For each={projects()}>
          {(project) => (
            <A href={`/project/${project.id}`} class="glass-card-flat group cursor-pointer hover:border-primary/40 !p-0 overflow-hidden">
              {/* Thumbnail */}
              <div class="aspect-video relative overflow-hidden bg-black/40">
                <Show when={project.thumbnail}>
                  <img src={convertFileSrc(project.thumbnail)} alt={project.name} class="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-all duration-700" />
                </Show>
                <div class="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div class="p-5">
                <h4 class="font-bold text-white text-base group-hover:text-primary transition-colors truncate">{project.name}</h4>
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex items-center gap-1">
                    <Sparkles size={10} class="text-primary" />
                    <span class="text-[10px] font-bold text-slate-500">View Details</span>
                  </div>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
}
