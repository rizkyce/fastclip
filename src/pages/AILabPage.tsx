import { For, Show, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import {
  Brain, Loader2, CheckCircle2, AlertTriangle,
  Pause, Cpu, MemoryStick, Clock, Zap
} from "lucide-solid";
import { MOCK_AI_JOBS } from "../mock/data";
import ProgressRing from "../components/ProgressRing";
import EmptyState from "../components/EmptyState";
import { cn } from "../lib/utils";

export default function AILabPage() {
  const [jobs] = createSignal(MOCK_AI_JOBS);

  const activeJobs = () => jobs().filter(j => j.status !== "done" && j.status !== "error" && j.status !== "idle");
  const completedJobs = () => jobs().filter(j => j.status === "done");

  return (
    <div class="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-10 animate-fade-in">
        <div class="space-y-1">
          <span class="label-micro-primary">Neural Engine</span>
          <h3 class="heading-page">AI Lab</h3>
        </div>
        <div class="flex items-center gap-4">
          <Show when={activeJobs().length > 0}>
            <div class="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Loader2 size={14} class="text-primary animate-spin" />
              <span class="label-badge text-primary">{activeJobs().length} Active</span>
            </div>
          </Show>
          <A href="/library" class="btn-glass text-xs">
            <Zap size={14} /> New Analysis
          </A>
        </div>
      </div>

      {/* Active Jobs */}
      <Show when={activeJobs().length > 0}>
        <div class="space-y-6 animate-fade-in stagger-1" style="opacity:0">
          <h4 class="heading-section text-lg flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Processing
          </h4>

          <For each={activeJobs()}>
            {(job) => (
              <div class="glass-card-flat !p-0 overflow-hidden">
                {/* Header */}
                <div class="p-6 pb-0 flex items-start justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <ProgressRing progress={job.progress} size={56} strokeWidth={5} />
                    <div>
                      <h4 class="font-bold text-white text-lg">{job.videoName}</h4>
                      <p class="text-xs text-primary font-bold mt-0.5">{job.currentStep}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button class="btn-ghost" title="Pause"><Pause size={16} /></button>
                    <button class="btn-ghost text-rose-500" title="Cancel">
                      <AlertTriangle size={16} />
                    </button>
                  </div>
                </div>

                {/* Steps Progress */}
                <div class="p-6 space-y-3">
                  <For each={job.steps}>
                    {(step) => (
                      <div class="flex items-center gap-4">
                        <div class="w-6 flex justify-center shrink-0">
                          {step.status === "done" ? (
                            <CheckCircle2 size={16} class="text-emerald-500" />
                          ) : step.status === "active" ? (
                            <Loader2 size={16} class="text-primary animate-spin" />
                          ) : step.status === "error" ? (
                            <AlertTriangle size={16} class="text-rose-500" />
                          ) : (
                            <div class="w-4 h-4 rounded-full border-2 border-white/10" />
                          )}
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center justify-between mb-1">
                            <span class={cn(
                              "text-sm font-medium",
                              step.status === "done" ? "text-slate-400" :
                              step.status === "active" ? "text-white" :
                              "text-slate-600"
                            )}>{step.name}</span>
                            <Show when={step.status === "active" || step.status === "done"}>
                              <span class="text-xs font-mono text-slate-500">{step.progress}%</span>
                            </Show>
                          </div>
                          <div class="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              class={cn(
                                "h-full rounded-full transition-all duration-500",
                                step.status === "done" ? "bg-emerald-500" :
                                step.status === "active" ? "bg-gradient-to-r from-primary to-indigo-400" :
                                "bg-transparent"
                              )}
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>

                {/* Performance Metrics */}
                <div class="px-6 pb-6 flex items-center gap-6 border-t border-white/5 pt-4">
                  <div class="flex items-center gap-2">
                    <Cpu size={14} class="text-slate-500" />
                    <span class="text-xs font-bold text-slate-400">CPU: {job.cpuUsage ?? 0}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <MemoryStick size={14} class="text-slate-500" />
                    <span class="text-xs font-bold text-slate-400">RAM: {job.memoryUsage ?? 0}%</span>
                  </div>
                  <Show when={job.estimatedTimeLeft}>
                    <div class="flex items-center gap-2">
                      <Clock size={14} class="text-slate-500" />
                      <span class="text-xs font-bold text-primary">ETA: {job.estimatedTimeLeft}</span>
                    </div>
                  </Show>
                  <div class="ml-auto">
                    <span class="tag">{job.modelUsed}</span>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Completed Jobs */}
      <div class="space-y-6 animate-fade-in stagger-3" style="opacity:0">
        <h4 class="heading-section text-lg">Completed</h4>

        <Show when={completedJobs().length > 0} fallback={
          <EmptyState
            icon={<Brain size={40} />}
            title="No Completed Jobs"
            description="Process a video to see AI analysis results here."
          />
        }>
          <div class="space-y-3">
            <For each={completedJobs()}>
              {(job) => (
                <div class="glass-card-flat !p-5 flex items-center gap-5">
                  <CheckCircle2 size={20} class="text-emerald-500 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-white text-sm truncate">{job.videoName}</h4>
                    <span class="text-xs text-slate-500">{job.modelUsed}</span>
                  </div>
                  <span class="badge badge-success">Complete</span>
                  <A href={`/project/${job.projectId}`} class="btn-ghost text-primary">
                    View Results
                  </A>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
