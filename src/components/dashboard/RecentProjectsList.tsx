import { For } from "solid-js";
import { A } from "@solidjs/router";
import { ArrowRight, Sparkles } from "lucide-solid";
import { MOCK_PROJECTS } from "../../mock/data";

export default function RecentProjectsList() {
  const recentProjects = MOCK_PROJECTS.slice(0, 3);

  return (
    <div class="animate-fade-in stagger-4" style="opacity:0">
      <div class="flex items-center justify-between mb-6">
        <h3 class="heading-section text-lg">Recent Projects</h3>
        <A href="/library" class="label-micro-primary hover:text-white transition-colors flex items-center gap-1">
          View All <ArrowRight size={12} />
        </A>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <For each={recentProjects}>
          {(project) => (
            <A href={`/project/${project.id}`} class="glass-card-flat group cursor-pointer hover:border-primary/40 !p-0 overflow-hidden">
              {/* Thumbnail */}
              <div class="aspect-video relative overflow-hidden">
                <img src={project.video.thumbnail} alt={project.name} class="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-all duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                <div class="absolute bottom-3 left-4">
                  <span class="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-black text-white">{project.video.duration}</span>
                </div>
              </div>

              {/* Info */}
              <div class="p-5">
                <h4 class="font-bold text-white text-base group-hover:text-primary transition-colors truncate">{project.name}</h4>
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex items-center gap-1">
                    <Sparkles size={10} class="text-primary" />
                    <span class="text-[10px] font-bold text-slate-500">{project.highlights.length} highlights</span>
                  </div>
                  <span class="text-[10px] text-slate-600">•</span>
                  <span class="text-[10px] font-bold text-slate-500">{project.video.size}</span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
}
