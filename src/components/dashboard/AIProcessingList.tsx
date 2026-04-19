import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { ArrowRight, Loader2 } from "lucide-solid";
import { MOCK_AI_JOBS } from "../../mock/data";

export default function AIProcessingList() {
  const activeAIJobs = MOCK_AI_JOBS.filter(j => j.status !== "done" && j.status !== "error" && j.status !== "idle");

  return (
    <Show when={activeAIJobs.length > 0}>
      <div class="animate-fade-in stagger-3" style="opacity:0">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <h3 class="heading-section text-lg">AI Processing</h3>
          </div>
          <A href="/ai-lab" class="label-micro-primary hover:text-white transition-colors flex items-center gap-1">
            View All <ArrowRight size={12} />
          </A>
        </div>

        <div class="space-y-4">
          <For each={activeAIJobs}>
            {(job) => (
              <div class="glass-card-flat !p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div class="relative">
                  <div class="absolute inset-0 bg-primary blur-xl opacity-30 animate-pulse" />
                  <Loader2 size={24} class="text-primary animate-spin relative z-10" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-white text-sm truncate">{job.videoName}</h4>
                  <p class="text-xs text-slate-500 mt-0.5">{job.currentStep}</p>
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                  <div class="flex-1 sm:w-32">
                    <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full transition-all" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                  <span class="text-xs font-black text-white font-mono">{job.progress}%</span>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}
