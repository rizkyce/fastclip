import { Zap, Grid3X3, List } from "lucide-solid";
import SearchBar from "../SearchBar";

interface LibraryHeaderProps {
  count: number;
  total: number;
  search: string;
  onSearch: (val: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export default function LibraryHeader(props: LibraryHeaderProps) {
  return (
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
      <div class="space-y-2">
        <h3 class="heading-page">Studio / Assets</h3>
        <div class="flex items-center gap-2 mt-2">
          <Zap size={14} class="text-primary animate-pulse" />
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">{props.count} of {props.total} Sequences</p>
        </div>
      </div>
      
      {/* Controls */}
      <div class="flex items-center gap-3">
        <SearchBar
          value={props.search}
          onInput={props.onSearch}
          placeholder="Search videos..."
          class="w-64"
        />

        {/* View Toggle */}
        <div class="flex items-center p-1 bg-white/5 border border-white/10 rounded-lg">
          <button
            class={`p-2 rounded-md transition-all ${props.view === "grid" ? "bg-primary text-white" : "text-slate-500 hover:text-white"}`}
            onClick={() => props.onViewChange("grid")}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            class={`p-2 rounded-md transition-all ${props.view === "list" ? "bg-primary text-white" : "text-slate-500 hover:text-white"}`}
            onClick={() => props.onViewChange("list")}
          >
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
