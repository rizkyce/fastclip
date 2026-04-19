import { Show } from "solid-js";
import { cn } from "../lib/utils";
import type { Highlight } from "../store/projectStore";

interface ClipCardProps {
  highlight: Highlight;
  onGenerateClip?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function ClipCard(props: ClipCardProps) {
  const confidenceColor = () => {
    const c = props.highlight.confidence;
    if (c >= 0.9) return "text-emerald-500";
    if (c >= 0.8) return "text-amber-400";
    return "text-slate-400";
  };

  const dotColor = () => {
    const c = props.highlight.confidence;
    if (c >= 0.9) return "bg-emerald-500";
    if (c >= 0.8) return "bg-amber-400";
    return "bg-slate-500";
  };

  return (
    <div class="p-5 md:p-6 bg-white/5 border border-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-500 group cursor-pointer relative overflow-hidden">
      {/* Status ribbon */}
      <Show when={props.highlight.status === "approved"}>
        <div class="absolute top-0 right-0 bg-emerald-500 text-white text-[7px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
          Approved
        </div>
      </Show>

      {/* Header */}
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor())} />
          <span class={cn("text-[9px] font-black uppercase tracking-wider", confidenceColor())}>
            {Math.round(props.highlight.confidence * 100)}% Match
          </span>
        </div>
        <span class="text-[9px] font-mono text-slate-500 font-bold">{props.highlight.start} - {props.highlight.end}</span>
      </div>

      {/* Transcript */}
      <p class="text-xs md:text-sm text-slate-300 font-medium leading-relaxed italic mb-5">
        "{props.highlight.transcript}"
      </p>

      {/* Actions */}
      <div class="flex gap-2">
        <button
          class="flex-1 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-colors"
          onClick={() => props.onGenerateClip?.()}
        >
          Generate Clip
        </button>
        <Show when={props.highlight.status !== "approved"}>
          <button
            class="px-4 py-3 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
            onClick={() => props.onApprove?.()}
          >
            ✓
          </button>
        </Show>
        <button
          class="px-4 py-3 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-colors"
          onClick={() => props.onReject?.()}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
