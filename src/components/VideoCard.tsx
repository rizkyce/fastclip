import { Show } from "solid-js";
import { cn, formatDuration, formatFileSize } from "../lib/utils";
import { Play, MoreVertical, Loader2 } from "lucide-solid";
import { convertFileSrc } from "@tauri-apps/api/core";

interface VideoCardProps {
  video: any; // Using any for now or define a common type
  onClick?: () => void;
  onContextMenu?: (e: MouseEvent) => void;
}

export default function VideoCard(props: VideoCardProps) {
  const statusColor = () => {
    switch (props.video.status) {
      case "analyzed": return "bg-emerald-500";
      case "exported": return "bg-cyan-500";
      case "processing": return "bg-primary";
      case "raw": return "bg-slate-600";
      default: return "bg-slate-600";
    }
  };

  const statusLabel = () => {
    switch (props.video.status) {
      case "analyzed": return "AI Ready";
      case "exported": return "Exported";
      case "processing": return "Processing";
      case "raw": return "Raw";
      default: return "Unknown";
    }
  };

  // Format date
  const formattedDate = () => {
    try {
      return new Date(props.video.created_at).toLocaleDateString();
    } catch {
      return "Unknown Date";
    }
  };

  return (
    <div
      class="glass-card group flex flex-col hover:border-primary/50 cursor-pointer"
      onClick={() => props.onClick?.()}
      onContextMenu={(e) => props.onContextMenu?.(e)}
    >
      {/* Thumbnail */}
      <div class="aspect-video relative overflow-hidden rounded-xl bg-black shadow-inner">
        <Show when={props.video.thumbnail}>
          <img
            src={convertFileSrc(props.video.thumbnail!)}
            alt={props.video.title}
            class="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700"
            loading="lazy"
          />
        </Show>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />

        {/* Duration Badge */}
        <div class="absolute top-4 left-4">
          <div class="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg">
            <span class="text-[9px] font-black text-white uppercase tracking-tight">
              {formatDuration(props.video.duration_ms)}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div class="absolute top-4 right-4">
          <div class={cn("flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg")}>
            <Show when={props.video.status === "processing"}>
              <Loader2 size={10} class="text-primary animate-spin" />
            </Show>
            <Show when={props.video.status !== "processing"}>
              <div class={cn("w-1.5 h-1.5 rounded-full", statusColor())} />
            </Show>
            <span class="text-[8px] font-black text-white uppercase tracking-wider">{statusLabel()}</span>
          </div>
        </div>

        {/* Play Overlay */}
        <div class="absolute inset-0 flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500">
          <div class="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/50 hover:scale-110 active:scale-95 transition-all">
            <Play size={24} class="fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div class="pt-6 flex-1 flex flex-col">
        <div class="flex items-start justify-between gap-4 mb-4">
          <h4 class="font-bold text-white text-lg tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">{props.video.title}</h4>
          <button
            class="btn-ghost shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); props.onContextMenu?.(e as any); }}
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Metadata Tags */}
        <div class="flex flex-wrap gap-2 mb-4">
          <Show when={props.video.resolution}>
            <span class="tag">{props.video.resolution}</span>
          </Show>
          <Show when={props.video.codec}>
            <span class="tag">{props.video.codec}</span>
          </Show>
          <span class="tag">{formatFileSize(props.video.size_bytes)}</span>
        </div>

        {/* Footer */}
        <div class="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{formattedDate()}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-wider italic">FastClip Raw</span>
          </div>
        </div>
      </div>
    </div>
  );
}
