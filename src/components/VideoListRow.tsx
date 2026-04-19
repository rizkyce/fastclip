import { Show } from "solid-js";
import { cn, formatDuration, formatFileSize } from "../lib/utils";
import { Play, MoreVertical } from "lucide-solid";
import { convertFileSrc } from "@tauri-apps/api/core";

interface VideoListRowProps {
  video: any;
  onClick?: () => void;
}

export default function VideoListRow(props: VideoListRowProps) {
  const statusColor = () => {
    switch (props.video.status) {
      case "analyzed": return "bg-emerald-500";
      case "exported": return "bg-cyan-500";
      case "processing": return "bg-primary font-bold";
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

  return (
    <div
      class="glass-card-flat group flex items-center gap-3 sm:gap-6 !p-2 sm:!p-3 hover:border-primary/40 cursor-pointer transition-all duration-300"
      onClick={() => props.onClick?.()}
    >
      {/* Dense Thumbnail */}
      <div class="w-16 h-10 sm:w-28 sm:h-16 rounded-lg overflow-hidden bg-black shrink-0 relative shadow-lg">
        <Show when={props.video.thumbnail}>
          <img
            src={convertFileSrc(props.video.thumbnail!)}
            alt={props.video.title}
            class="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
          />
        </Show>
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20">
          <Play size={16} class="text-white fill-current" />
        </div>
        <div class="absolute bottom-1 right-1 px-1 py-0.5 bg-black/60 backdrop-blur-md rounded text-[7px] font-black text-white">
          {formatDuration(props.video.duration_ms)}
        </div>
      </div>

      {/* Main Info */}
      <div class="flex-1 min-w-0 flex items-center justify-between gap-4">
        <div class="min-w-0 flex-1">
          <h4 class="font-bold text-white text-xs sm:text-base truncate group-hover:text-primary transition-colors leading-tight">
            {props.video.title}
          </h4>
          <div class="flex items-center gap-2 mt-0.5 sm:mt-1">
            <div class="flex items-center gap-1">
              <div class={cn("w-1 h-1 rounded-full", statusColor())} />
              <span class={cn("text-[8px] sm:text-[9px] font-black uppercase tracking-widest", props.video.status === "processing" ? "text-primary animate-pulse" : "text-slate-500")}>
                {statusLabel()}
              </span>
            </div>
            <span class="text-slate-800 hidden sm:inline">•</span>
            <span class="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest hidden sm:inline">
              {props.video.resolution || "Unknown"}
            </span>
          </div>
        </div>

        {/* Technical Data - Hidden on Mobile */}
        <div class="hidden lg:flex items-center gap-12 px-8">
          <div class="flex flex-col items-end">
            <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Storage</span>
            <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">{formatFileSize(props.video.size_bytes)}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Codec</span>
            <span class="text-[10px] font-bold text-slate-400 whitespace-nowrap">{props.video.codec || "H.264"}</span>
          </div>
        </div>

        {/* Highlights & Actions */}
        <div class="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* AI Info */}
          <div class="flex flex-col items-end">
            <span class="text-[7px] font-black text-slate-600 uppercase tracking-tighter italic">Phase 3</span>
            <span class="text-[9px] font-bold text-slate-500">Live Backend</span>
          </div>

          <button class="p-2 text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
