import { Show } from "solid-js";
import { cn } from "../lib/utils";
import { CheckCircle2, Clock, Loader2, Share2, FolderOpen, RotateCcw, Trash2 } from "lucide-solid";
import type { ExportItem } from "../store/exportStore";

interface ExportCardProps {
  item: ExportItem;
  onCancel?: () => void;
  onOpenFolder?: () => void;
  onShare?: () => void;
  onReexport?: () => void;
  onDelete?: () => void;
}

export default function ExportCard(props: ExportCardProps) {
  return (
    <div class="glass-card-flat flex flex-col md:flex-row md:items-center gap-6 md:gap-10 relative group active:scale-[0.99] transition-transform">
      {/* Perimeter Progress Border */}
      <Show when={props.item.status === "processing"}>
        <svg class="absolute inset-x-[-1px] inset-y-[-1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none z-20 rounded-[2rem]" preserveAspectRatio="none">
          <rect
            x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
            rx="32" fill="none"
            stroke="url(#border-gradient)"
            stroke-width="2"
            pathLength="100"
            style={{ "stroke-dasharray": "100", "stroke-dashoffset": String(100 - props.item.progress), "transition": "stroke-dashoffset 1s ease-out" }}
          />
          <defs>
            <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="var(--color-primary)" />
              <stop offset="100%" stop-color="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
      </Show>

      {/* Thumbnail + Status Icon */}
      <div class="flex items-center gap-5">
        {/* Mini thumbnail */}
        <Show when={props.item.thumbnail}>
          <div class="w-16 h-16 rounded-lg overflow-hidden border border-white/5 shrink-0 hidden sm:block">
            <img src={props.item.thumbnail} alt="" class="w-full h-full object-cover" />
          </div>
        </Show>

        <div class="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/5 relative shadow-inner">
          {props.item.status === "processing" ? (
            <div class="relative">
              <div class="absolute inset-0 bg-primary blur-xl opacity-40 animate-pulse" />
              <Loader2 size={22} class="text-primary animate-spin relative z-10" />
            </div>
          ) : props.item.status === "completed" ? (
            <CheckCircle2 size={22} class="text-emerald-500" />
          ) : props.item.status === "failed" ? (
            <div class="text-rose-500 font-black text-lg">!</div>
          ) : (
            <Clock size={22} class="text-amber-500" />
          )}
        </div>
      </div>

      {/* Info */}
      <div class="flex-1 min-w-0 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1.5">
            <h4 class="text-lg md:text-xl font-black text-white tracking-tight truncate uppercase italic">{props.item.name}</h4>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="label-badge text-slate-500">Format: {props.item.format}</span>
              <div class="w-1 h-1 rounded-full bg-slate-700" />
              <span class="label-badge text-slate-500">{props.item.resolution}</span>
              <div class="w-1 h-1 rounded-full bg-slate-700" />
              <span class="label-badge text-slate-500">{props.item.codec}</span>
              <Show when={props.item.estimatedSize}>
                <>
                  <div class="w-1 h-1 rounded-full bg-slate-700" />
                  <span class="label-badge text-primary">{props.item.estimatedSize}</span>
                </>
              </Show>
            </div>
          </div>
          <div class={cn(
            "badge w-fit",
            props.item.status === "completed" ? "badge-success" :
            props.item.status === "processing" ? "badge-processing" :
            props.item.status === "failed" ? "badge-error" :
            "badge-warning"
          )}>
            {props.item.status}
          </div>
        </div>

        {/* Progress */}
        <Show when={props.item.status === "processing" || props.item.status === "queued"}>
          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <span class="label-badge text-slate-500">Progress</span>
              <div class="flex items-center gap-3">
                <Show when={props.item.eta}>
                  <span class="text-[9px] font-mono text-slate-500">ETA: {props.item.eta}</span>
                </Show>
                <span class="text-xs font-black text-white font-mono">{props.item.progress}%</span>
              </div>
            </div>
            <div class="h-1.5 bg-white/5 rounded-full relative overflow-hidden">
              <div
                class="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${props.item.progress}%` }}
              />
            </div>
          </div>
        </Show>
      </div>

      {/* Actions */}
      <div class="flex items-center gap-2 md:border-l md:border-white/5 md:pl-8 pt-4 md:pt-0">
        <Show when={props.item.status === "completed"}>
          <button class="btn-ghost" title="Open Folder" onClick={() => props.onOpenFolder?.()}>
            <FolderOpen size={18} />
          </button>
          <button class="btn-ghost" title="Share" onClick={() => props.onShare?.()}>
            <Share2 size={18} />
          </button>
          <button class="btn-ghost" title="Re-export" onClick={() => props.onReexport?.()}>
            <RotateCcw size={18} />
          </button>
          <button class="btn-ghost text-rose-500 hover:!text-rose-400" title="Delete" onClick={() => props.onDelete?.()}>
            <Trash2 size={18} />
          </button>
        </Show>
        <Show when={props.item.status === "processing" || props.item.status === "queued"}>
          <button class="btn-danger text-[9px] tracking-widest" onClick={() => props.onCancel?.()}>
            Cancel
          </button>
        </Show>
      </div>
    </div>
  );
}
