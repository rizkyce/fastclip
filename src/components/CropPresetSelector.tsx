import { For } from "solid-js";
import { cn } from "../lib/utils";
import type { AspectRatio } from "../store/exportStore";

interface CropPresetSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const presets: { ratio: AspectRatio; label: string; platform: string; w: number; h: number }[] = [
  { ratio: "9:16", label: "9:16", platform: "TikTok / Reels", w: 9, h: 16 },
  { ratio: "1:1", label: "1:1", platform: "Instagram Post", w: 1, h: 1 },
  { ratio: "4:5", label: "4:5", platform: "Instagram Feed", w: 4, h: 5 },
  { ratio: "16:9", label: "16:9", platform: "YouTube", w: 16, h: 9 },
];

export default function CropPresetSelector(props: CropPresetSelectorProps) {
  return (
    <div class="grid grid-cols-4 gap-3">
      <For each={presets}>
        {(preset) => {
          const isActive = () => props.value === preset.ratio;
          const maxDim = 48;
          const scale = maxDim / Math.max(preset.w, preset.h);
          const w = Math.round(preset.w * scale);
          const h = Math.round(preset.h * scale);

          return (
            <button
              class={cn(
                "flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-300",
                isActive()
                  ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/10"
                  : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
              )}
              onClick={() => props.onChange(preset.ratio)}
            >
              {/* Visual aspect ratio preview */}
              <div class="flex items-center justify-center h-14">
                <div
                  class={cn(
                    "rounded-md border-2 transition-colors",
                    isActive() ? "border-primary bg-primary/20" : "border-white/20 bg-white/5"
                  )}
                  style={{ width: `${w}px`, height: `${h}px` }}
                />
              </div>
              <div class="text-center">
                <div class={cn("text-xs font-black", isActive() ? "text-white" : "text-slate-400")}>
                  {preset.label}
                </div>
                <div class="text-[8px] font-bold text-slate-500 mt-0.5">{preset.platform}</div>
              </div>
            </button>
          );
        }}
      </For>
    </div>
  );
}
