import { Show, createSignal } from "solid-js";
import { Plus, Link2 } from "lucide-solid";
import URLUpload from "../URLUpload";

interface ImportSectionProps {
  onURLUpload: (url: string) => void;
}

export default function ImportSection(props: ImportSectionProps) {
  const [importMode, setImportMode] = createSignal<"drop" | "url">("drop");

  const handleURLUpload = (url: string) => {
    props.onURLUpload(url);
    setImportMode("drop");
  };

  return (
    <div class="relative min-h-[400px] flex items-center justify-center">
      <Show when={importMode() === "drop"}>
        <div 
          class="w-full relative group cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-[#08080A]/50 backdrop-blur-3xl hover:border-primary/40 transition-all duration-500 animate-scale-in"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div class="relative p-12 md:p-20 flex flex-col items-center justify-center gap-8 text-center">
            <div class="relative">
              <div class="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div class="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <Plus size={40} stroke-width={3} />
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase">Create New Magic</h3>
              <p class="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Drop your Raw Footage or</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setImportMode("url"); }}
                class="btn-glass text-[10px] font-black uppercase tracking-[0.2em] mt-2 group/btn"
              >
                <Link2 size={12} class="group-hover/btn:rotate-45 transition-transform" /> Paste Link Instead
              </button>
            </div>

            <div class="flex items-center gap-6 mt-4">
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-primary" />
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supports 4K/HDR</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-accent" />
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Highlights</span>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <Show when={importMode() === "url"}>
        <URLUpload 
          onUpload={handleURLUpload}
          onCancel={() => setImportMode("drop")}
        />
      </Show>
    </div>
  );
}
