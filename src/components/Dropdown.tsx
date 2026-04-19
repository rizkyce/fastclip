import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { ChevronDown, Check } from "lucide-solid";
import { cn } from "../lib/utils";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  class?: string;
  placeholder?: string;
}

export default function Dropdown(props: DropdownProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [coords, setCoords] = createSignal({ top: 0, left: 0, width: 0 });
  let containerRef: HTMLDivElement | undefined;

  const updateCoords = () => {
    if (containerRef) {
      const rect = containerRef.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleScrollAndResize = () => {
    if (isOpen()) {
        updateCoords();
    }
  };

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollAndResize, true);
    window.addEventListener("resize", handleScrollAndResize);
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("scroll", handleScrollAndResize, true);
    window.removeEventListener("resize", handleScrollAndResize);
  });

  const selectedOption = () => props.options.find(o => o.value === props.value);

  const toggle = () => {
    if (!isOpen()) updateCoords();
    setIsOpen(!isOpen());
  };

  return (
    <div ref={containerRef} class={cn("relative inline-block w-full sm:w-fit", props.class)}>
      <button
        type="button"
        onClick={toggle}
        class={cn(
          "flex items-center justify-between gap-4 px-5 py-3 bg-black/40 hover:bg-white/[0.05] border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-[0.1em] transition-all duration-300 min-w-full sm:min-w-[200px] text-left group",
          isOpen() && "border-primary/50 bg-white/[0.05] ring-4 ring-primary/10 shadow-lg shadow-primary/5"
        )}
      >
        <span class="truncate pr-2">
          {selectedOption()?.label ?? props.placeholder ?? "Select Option"}
        </span>
        <ChevronDown 
          size={14} 
          class={cn(
            "text-slate-500 transition-all duration-500", 
            isOpen() ? "rotate-180 text-primary" : "group-hover:text-slate-300"
          )} 
        />
      </button>

      <Portal>
        <Show when={isOpen()}>
          <div 
            class="absolute bg-[#0D0D0F]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 z-[9999] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] animate-scale-in origin-top ring-1 ring-white/5"
            style={{
                top: `${coords().top + 8}px`,
                left: `${coords().left}px`,
                "min-width": `${coords().width}px`
            }}
          >
            <div class="max-h-[280px] overflow-y-auto no-scrollbar py-0.5">
              <For each={props.options}>
                  {(option) => (
                  <button
                      type="button"
                      onClick={() => {
                        props.onChange(option.value);
                        setIsOpen(false);
                      }}
                      class={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 mb-0.5 last:mb-0",
                      props.value === option.value 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                  >
                      <span class="truncate pr-4">{option.label}</span>
                      <Show when={props.value === option.value}>
                        <div class="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                            <Check size={10} stroke-width={4} class="text-primary" />
                        </div>
                      </Show>
                  </button>
                  )}
              </For>
            </div>
          </div>
        </Show>
      </Portal>
    </div>
  );
}
