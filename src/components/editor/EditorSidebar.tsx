import { For, Show, createSignal } from "solid-js";
import { Sparkles, MessageSquare, Crop, Scissors, CheckCircle2, ChevronRight } from "lucide-solid";
import type { MOCK_HIGHLIGHTS } from "../../mock/data";

interface EditorSidebarProps {
  highlights: typeof MOCK_HIGHLIGHTS;
}

export default function EditorSidebar(props: EditorSidebarProps) {
  const [activeTab, setActiveTab] = createSignal<"clips" | "captions" | "crop">("clips");

  return (
    <div class="h-full flex flex-col glass-card-flat !p-0 border-l border-white/5 animate-fade-in-right">
      {/* Tabs */}
      <div class="flex border-b border-white/5 p-2 gap-2">
        <button
          onClick={() => setActiveTab("clips")}
          class={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTab() === "clips" ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" : "text-slate-500 hover:text-white"}`}
        >
          <Sparkles size={16} />
          <span class="text-[9px] font-black uppercase tracking-widest">Clips</span>
        </button>
        <button
          onClick={() => setActiveTab("captions")}
          class={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTab() === "captions" ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" : "text-slate-500 hover:text-white"}`}
        >
          <MessageSquare size={16} />
          <span class="text-[9px] font-black uppercase tracking-widest">Captions</span>
        </button>
        <button
          onClick={() => setActiveTab("crop")}
          class={`flex-1 py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeTab() === "crop" ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" : "text-slate-500 hover:text-white"}`}
        >
          <Crop size={16} />
          <span class="text-[9px] font-black uppercase tracking-widest">Crop</span>
        </button>
      </div>

      {/* Content Area */}
      <div class="flex-1 overflow-y-auto p-5 no-scrollbar">
        <Show when={activeTab() === "clips"}>
          <div class="space-y-4">
            <h4 class="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-6">Detected Highlights</h4>
            <For each={props.highlights}>
              {(h) => (
                <div class="glass-card-flat !p-4 group cursor-pointer hover:border-primary/40 transition-all">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-[10px] font-black font-mono text-primary">{h.startTime} - {h.endTime}</span>
                    <Show when={h.status === "approved"}>
                      <CheckCircle2 size={12} class="text-emerald-500" />
                    </Show>
                  </div>
                  <h5 class="text-xs font-bold text-white mb-2 leading-relaxed">{h.description}</h5>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 bg-primary/20 text-primary rounded text-[9px] font-black italic uppercase">Score: {h.score}</span>
                    <button class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity btn-glass !p-1.5">
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={activeTab() === "captions"}>
          <div class="flex flex-col items-center justify-center h-full text-center py-20 px-4">
            <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-slate-600">
              <MessageSquare size={32} />
            </div>
            <h4 class="text-sm font-black text-white italic uppercase mb-2 tracking-tighter">Caption Engine</h4>
            <p class="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-widest">Voice-to-Text analysis in progress...</p>
            <button class="btn-primary mt-8 w-full py-4 text-[10px]">
              Generate Auto-Captions
            </button>
          </div>
        </Show>

        <Show when={activeTab() === "crop"}>
          <div class="space-y-8 py-4 px-2">
            <div>
              <h4 class="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-6 font-bold">Safe Zone Ratio</h4>
              <div class="grid grid-cols-2 gap-4">
                <button class="stat-card border-primary/40">
                  <div class="w-8 h-12 border-2 border-primary rounded-m opacity-60 mb-2" />
                  <span class="text-[10px] font-black uppercase tracking-widest text-white">9:16 Portrait</span>
                </button>
                <button class="stat-card opacity-50">
                  <div class="w-10 h-10 border-2 border-white rounded opacity-40 mb-2" />
                  <span class="text-[10px] font-black uppercase tracking-widest">1:1 Square</span>
                </button>
              </div>
            </div>
            
            <button class="btn-glass w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] border-primary/20 text-primary">
              <Scissors size={14} /> Auto-Face Tracking
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
