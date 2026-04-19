import { Show } from "solid-js";
import { Search, X } from "lucide-solid";
import { cn } from "../lib/utils";

interface SearchBarProps {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  class?: string;
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <div class={cn(
      "group relative flex items-center gap-2 transition-all duration-300",
      "bg-black/20 border border-white/10 rounded-2xl px-4 py-0",
      "focus-within:bg-black/40 focus-within:border-primary/50",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:via-transparent before:to-transparent before:opacity-0 focus-within:before:opacity-100 before:transition-opacity before:pointer-events-none",
      props.class
    )}>
      <Search size={16} class="text-slate-500 group-focus-within:text-primary transition-colors shrink-0" />
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        placeholder={props.placeholder ?? "Search videos..."}
        class="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm text-white placeholder:text-slate-600 font-medium"
      />
      <Show when={props.value.length > 0}>
        <button
          onClick={() => props.onInput("")}
          class="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all shrink-0"
        >
          <X size={14} />
        </button>
      </Show>
    </div>
  );
}
