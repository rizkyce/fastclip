import { For, Show, createSignal } from "solid-js";
import { MOCK_EXPORTS } from "../mock/data";
import { Download } from "lucide-solid";
import ExportCard from "../components/ExportCard";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";

type StatusFilter = "all" | "processing" | "completed" | "queued" | "failed";

export default function ExportPage() {
  const [search, setSearch] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<StatusFilter>("all");

  const filteredExports = () => {
    let exports = MOCK_EXPORTS;
    const q = search().toLowerCase();
    if (q) exports = exports.filter(e => e.name.toLowerCase().includes(q));
    if (statusFilter() !== "all") exports = exports.filter(e => e.status === statusFilter());
    return exports;
  };

  const counts = {
    all: MOCK_EXPORTS.length,
    processing: MOCK_EXPORTS.filter(e => e.status === "processing").length,
    completed: MOCK_EXPORTS.filter(e => e.status === "completed").length,
    queued: MOCK_EXPORTS.filter(e => e.status === "queued").length,
    failed: MOCK_EXPORTS.filter(e => e.status === "failed").length,
  };

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "processing", label: `Active (${counts.processing})` },
    { key: "completed", label: `Done (${counts.completed})` },
    { key: "queued", label: `Queued (${counts.queued})` },
  ];

  return (
    <div class="max-w-6xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-white/5 pb-10 animate-fade-in">
         <div class="space-y-1">
            <span class="label-micro-primary">Rendering Queue</span>
            <h3 class="heading-page">Export / Output</h3>
         </div>
         <div class="flex items-center gap-3">
           <SearchBar value={search()} onInput={setSearch} placeholder="Search exports..." class="w-56" />
           <button class="btn-danger text-[9px] tracking-widest">
             Abort All
           </button>
         </div>
      </div>

      {/* Filter Tabs */}
      <div class="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl overflow-x-auto no-scrollbar w-fit animate-fade-in stagger-1" style="opacity:0">
        <For each={filterTabs}>
          {(tab) => (
            <button
              class={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                statusFilter() === tab.key
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-500 hover:text-white"
              }`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </div>

      {/* Export List */}
      <Show when={filteredExports().length > 0} fallback={
        <EmptyState
          icon={<Download size={40} />}
          title="No Exports"
          description="Export clips from the Editor to see them here."
        />
      }>
        <div class="grid gap-6 animate-fade-in stagger-2" style="opacity:0">
          <For each={filteredExports()}>
            {(item) => (
              <ExportCard
                item={item}
                onCancel={() => {}}
                onOpenFolder={() => {}}
                onShare={() => {}}
                onReexport={() => {}}
                onDelete={() => {}}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
