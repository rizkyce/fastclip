import { For } from "solid-js";
import { Sparkles } from "lucide-solid";
import type { MOCK_HIGHLIGHTS } from "../../mock/data";

interface TimelineProps {
  highlights: typeof MOCK_HIGHLIGHTS;
}

export default function Timeline(props: TimelineProps) {
  return (
    <div class="glass-card-flat !p-0 h-40 md:h-52 relative overflow-hidden group">
      {/* Waveform Visualization (Mock) */}
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div class="flex items-center gap-1.5 h-32">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              class="w-2.5 bg-primary rounded-full transition-all duration-300 group-hover:bg-primary/50" 
              style={{ height: `${20 + Math.random() * 80}%` }} 
            />
          ))}
        </div>
      </div>

      {/* Markers (AI Generated) */}
      <div class="absolute inset-0 z-10">
        <For each={props.highlights}>
          {(h, i) => (
            <div 
              class="absolute top-0 bottom-0 border-x border-primary/20 flex flex-col items-center group/marker cursor-pointer"
              style={{ left: `${15 + i() * 18}%`, width: `${8 + Math.random() * 5}%` }}
            >
              <div class="absolute inset-0 bg-primary/5 group-hover/marker:bg-primary/10 transition-colors" />
              <div class="absolute top-0 px-2 py-1 bg-primary/20 backdrop-blur-md rounded-b-lg border-x border-b border-primary/30">
                <Sparkles size={8} class="text-primary animate-pulse" />
              </div>
            </div>
          )}
        </For>
      </div>
      
      {/* Playhead */}
      <div class="absolute top-0 bottom-0 left-[33%] w-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-20">
        <div class="absolute top-0 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full cursor-grab active:cursor-grabbing" />
      </div>

      {/* Grid Rulers */}
      <div class="absolute bottom-2 inset-x-4 flex justify-between text-[8px] font-mono text-slate-600 uppercase">
        <span>00:00.00</span>
        <span>05:32.14</span>
        <span>10:45.02</span>
        <span>15:10.00</span>
        <span>20:00.00</span>
      </div>
    </div>
  );
}
