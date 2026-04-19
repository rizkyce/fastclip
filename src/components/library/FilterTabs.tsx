import { For } from "solid-js";

export type FilterTab = "all" | "analyzed" | "raw" | "exported";

interface FilterTabsProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

export default function FilterTabs(props: FilterTabsProps) {
  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All Files" },
    { key: "analyzed", label: "AI Ready" },
    { key: "raw", label: "Raw" },
    { key: "exported", label: "Exported" },
  ];

  return (
    <div class="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl overflow-x-auto no-scrollbar w-fit">
      <For each={tabs}>
        {(tab) => (
          <button
            class={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              props.active === tab.key
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-500 hover:text-white"
            }`}
            onClick={() => props.onChange(tab.key)}
          >
            {tab.label}
          </button>
        )}
      </For>
    </div>
  );
}
