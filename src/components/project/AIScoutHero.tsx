import { Sparkles } from "lucide-solid";

export default function AIScoutHero() {
  return (
    <div class="flex flex-col items-center justify-center py-20 glass-card-flat relative overflow-hidden group">
      {/* Scanning Animation */}
      <div class="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent animate-shimmer" style="background-size: 100% 200%" />
      <div class="absolute top-0 left-0 right-0 h-[2px] bg-primary/50 shadow-[0_0_15px_var(--color-primary)] animate-scan" />
      
      <div class="relative z-10 flex flex-col items-center text-center max-w-md">
        <div class="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 animate-pulse">
          <Sparkles size={32} class="text-primary" />
        </div>
        <h4 class="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Analyzing Footage</h4>
        <p class="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">Scouting for viral highlights and segmenting scenes...</p>
        
        <div class="w-full space-y-3">
          <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Engine Load</span>
            <span>82%</span>
          </div>
          <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div class="h-full bg-primary rounded-full animate-progress-ind" style="width: 82%" />
          </div>
        </div>
      </div>
    </div>
  );
}
