import { createSignal, Show } from "solid-js";
import { Link2, Globe, ArrowRight, Loader2, Play } from "lucide-solid";
import { cn } from "../lib/utils";

interface URLUploadProps {
  onUpload: (url: string) => void;
  onCancel: () => void;
}

export default function URLUpload(props: URLUploadProps) {
  const [url, setUrl] = createSignal("");
  const [isValidating, setIsValidating] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const currentUrl = url();
    
    if (!currentUrl) {
      setError("Please enter a valid URL");
      return;
    }

    setIsValidating(true);
    setError("");

    // Simulate validation/fetching
    setTimeout(() => {
      setIsValidating(false);
      props.onUpload(currentUrl);
    }, 1500);
  };

  return (
    <div class="w-full max-w-2xl mx-auto animate-scale-in">
      <div class="glass-card-flat !p-10 flex flex-col items-center gap-8 text-center relative overflow-hidden group">
        {/* Decorative background glow */}
        <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-focus-within:bg-primary/40 transition-colors duration-700" />
        
        <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary shadow-inner">
          <Globe size={32} class="animate-pulse" />
        </div>

        <div class="space-y-2">
          <h3 class="text-2xl font-black text-white tracking-tight">Stream from Link</h3>
          <p class="text-slate-500 text-sm font-medium">Paste a YouTube, Vimeo, or direct video URL to analyze.</p>
        </div>

        <form onSubmit={handleSubmit} class="w-full space-y-4 relative z-10">
          <div class="relative flex items-center">
            <div class={cn(
              "absolute left-5 text-slate-500 transition-colors",
              url() ? "text-primary" : ""
            )}>
              <Link2 size={18} />
            </div>
            <input
              type="text"
              placeholder="https://youtube.com/watch?v=..."
              value={url()}
              onInput={(e) => setUrl(e.currentTarget.value)}
              class={cn(
                "w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white transition-all",
                "focus:bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
                error() ? "border-rose-500/50" : ""
              )}
            />
          </div>

          <Show when={error()}>
            <p class="text-[10px] font-black uppercase tracking-widest text-rose-500">{error()}</p>
          </Show>

          <div class="flex items-center gap-3">
            <button
              type="button"
              onClick={props.onCancel}
              class="flex-1 btn-ghost py-4 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isValidating() || !url()}
              class={cn(
                "flex-[2] btn-primary py-4 text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden",
                (isValidating() || !url()) ? "opacity-50 grayscale cursor-not-allowed" : ""
              )}
            >
              <div class="relative z-10 flex items-center justify-center gap-2">
                {isValidating() ? (
                  <>
                    <Loader2 size={16} class="animate-spin" />
                    <span>Analyzing link...</span>
                  </>
                ) : (
                  <>
                    <span>Import Video</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* Quick hint icons */}
        <div class="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <Play size={16} class="text-white" />
           <div class="w-px h-4 bg-white/10" />
           <span class="text-[10px] font-black text-white/50 tracking-widest">PRO ENGINE v2.0</span>
        </div>
      </div>
    </div>
  );
}
