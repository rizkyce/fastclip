import { A } from "@solidjs/router";
import { Play, Clock, Film, HardDrive, Sparkles, Scissors, Download, Trash2 } from "lucide-solid";
import type { MOCK_PROJECTS } from "../../mock/data";

interface ProjectHeaderProps {
  project: (typeof MOCK_PROJECTS)[0];
  highlightCount: number;
}

export default function ProjectHeader(props: ProjectHeaderProps) {
  return (
    <div class="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Thumbnail */}
      <div class="lg:w-96 shrink-0">
        <div class="aspect-video rounded-3xl overflow-hidden relative group bg-black border border-white/5">
          <img src={props.project.video.thumbnail} alt={props.project.name} class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700" />
          <div class="absolute inset-0 flex items-center justify-center">
            <A href={`/editor/${props.project.id}`} class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/50 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100">
              <Play size={28} class="fill-current ml-1" />
            </A>
          </div>
        </div>
      </div>

      {/* Info */}
      <div class="flex-1 space-y-6">
        <div>
          <span class="label-micro-primary mb-2 block">Project</span>
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight">{props.project.name}</h1>
        </div>

        {/* Metadata */}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="stat-card !p-4">
            <Clock size={16} class="text-slate-500" />
            <div>
              <span class="text-sm font-black text-white">{props.project.video.duration}</span>
              <span class="label-micro block mt-0.5">Duration</span>
            </div>
          </div>
          <div class="stat-card !p-4">
            <Film size={16} class="text-slate-500" />
            <div>
              <span class="text-sm font-black text-white">{props.project.video.resolution ?? "1080p"}</span>
              <span class="label-micro block mt-0.5">Resolution</span>
            </div>
          </div>
          <div class="stat-card !p-4">
            <HardDrive size={16} class="text-slate-500" />
            <div>
              <span class="text-sm font-black text-white">{props.project.video.size}</span>
              <span class="label-micro block mt-0.5">File Size</span>
            </div>
          </div>
          <div class="stat-card !p-4">
            <Sparkles size={16} class="text-primary" />
            <div>
              <span class="text-sm font-black text-white">{props.highlightCount}</span>
              <span class="label-micro block mt-0.5">Highlights</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div class="flex flex-wrap gap-3">
          <A href={`/editor/${props.project.id}`} class="btn-primary">
            <Scissors size={14} /> Open in Editor
          </A>
          <button class="btn-glass">
            <Download size={14} /> Export All Clips
          </button>
          <button class="btn-danger">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
