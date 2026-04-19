import { Show, createSignal } from "solid-js";
import { Play, SkipBack, SkipForward, Volume2, VolumeX, Maximize } from "lucide-solid";

interface VideoPreviewProps {
  thumbnail?: string;
  projectName?: string;
}

export default function VideoPreview(props: VideoPreviewProps) {
  const [isMuted, setIsMuted] = createSignal(false);

  return (
    <div class="min-h-[350px] md:min-h-[450px] aspect-video md:aspect-auto bg-black rounded-[2rem] md:rounded-studio overflow-hidden relative border border-white/5 shadow-2xl group shrink-0">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      {/* Video Feed / Thumbnail */}
      <div class="absolute inset-0 flex items-center justify-center bg-[#050505]">
        <Show when={props.thumbnail} fallback={
          <div class="relative">
            <div class="absolute inset-0 bg-primary blur-[100px] opacity-20" />
            <Play size={80} class="text-white/10 relative z-10" />
          </div>
        }>
          <img src={props.thumbnail} alt="" class="w-full h-full object-cover opacity-40 absolute inset-0" />
          <div class="relative z-10">
            <div class="absolute inset-0 bg-primary blur-[100px] opacity-20" />
            <Play size={80} class="text-white/20 relative z-10" />
          </div>
        </Show>
      </div>

      {/* Premium Overlay Controls */}
      <div class="absolute bottom-4 md:bottom-8 inset-x-4 md:inset-x-8">
        <div class="glass p-4 md:p-6 rounded-xl md:rounded-2xl flex items-center gap-4 md:gap-6 border-white/10 shadow-2xl">
          <div class="flex items-center gap-2 md:gap-4">
            <button class="p-2 text-slate-400 hover:text-white transition-colors"><SkipBack size={18} /></button>
            <button class="w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10">
              <Play size={18} class="fill-current ml-1" />
            </button>
            <button class="p-2 text-slate-400 hover:text-white transition-colors"><SkipForward size={18} /></button>
          </div>
          
          <div class="flex-1 flex flex-col gap-1.5 md:gap-2">
            <div class="flex justify-between items-center px-1">
              <span class="text-[8px] md:text-[9px] font-black text-white uppercase tracking-widest truncate">
                {props.projectName ?? "Master Feed"} / Sync Pulse
              </span>
              <span class="text-[8px] md:text-[9px] font-mono text-primary font-black">12:45.02</span>
            </div>
            <div class="h-1 md:h-1.5 bg-white/5 rounded-full relative overflow-hidden cursor-pointer group/progress">
              <div class="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-primary to-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.8)] rounded-full" />
              {/* Scrub handle */}
              <div class="absolute top-1/2 -translate-y-1/2 left-[33%] w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div class="hidden sm:flex items-center gap-3 border-l border-white/10 pl-6">
            <button
              class="p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsMuted(!isMuted())}
            >
              <Show when={isMuted()} fallback={<Volume2 size={16} />}>
                <VolumeX size={16} />
              </Show>
            </button>
            <button class="p-2 text-slate-400 hover:text-primary transition-colors"><Maximize size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
