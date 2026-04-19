import { MOCK_STATS, MOCK_EXPORTS } from "../mock/data";
import { Film, Sparkles, Clock, Download, BarChart3, PieChart, TrendingUp } from "lucide-solid";

export default function AnalyticsPage() {
  const totalExports = MOCK_EXPORTS.length;
  const completedExports = MOCK_EXPORTS.filter(e => e.status === "completed").length;
  const formatCounts = MOCK_EXPORTS.reduce((acc, e) => {
    acc[e.format] = (acc[e.format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div class="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Header */}
      <div class="border-b border-white/5 pb-10 animate-fade-in">
        <span class="label-micro-primary">Insights</span>
        <h3 class="heading-page">Analytics</h3>
      </div>

      {/* Overview Stats Grid */}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in stagger-1" style="opacity:0">
        <div class="stat-card" style={{ "--stat-glow": "rgba(79, 70, 229, 0.4)" }}>
          <div class="flex items-start justify-between">
            <div class="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
              <Film size={20} class="text-primary" />
            </div>
          </div>
          <div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Processed</span>
            <span class="text-3xl font-black text-white">{MOCK_STATS.totalProjects}</span>
          </div>
        </div>

        <div class="stat-card" style={{ "--stat-glow": "rgba(16, 185, 129, 0.3)" }}>
          <div class="flex items-start justify-between">
            <div class="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Sparkles size={20} class="text-emerald-500" />
            </div>
          </div>
          <div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Generated Clips</span>
            <span class="text-3xl font-black text-white">{MOCK_STATS.totalClipsGenerated}</span>
          </div>
        </div>

        <div class="stat-card" style={{ "--stat-glow": "rgba(245, 158, 11, 0.3)" }}>
          <div class="flex items-start justify-between">
            <div class="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Clock size={20} class="text-amber-500" />
            </div>
          </div>
          <div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Efficiency Gain</span>
            <span class="text-3xl font-black text-white">{MOCK_STATS.totalExportTimeSaved}</span>
          </div>
        </div>

        <div class="stat-card" style={{ "--stat-glow": "rgba(6, 182, 212, 0.3)" }}>
          <div class="flex items-start justify-between">
            <div class="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Download size={20} class="text-cyan-500" />
            </div>
          </div>
          <div>
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Export Velocity</span>
            <span class="text-3xl font-black text-white">{completedExports}/{totalExports}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in stagger-2" style="opacity:0">
        {/* Export Format Distribution */}
        <div class="glass-card-flat">
          <div class="flex items-center gap-3 mb-6">
            <PieChart size={18} class="text-primary" />
            <h4 class="heading-card text-base">Export Formats</h4>
          </div>
          <div class="space-y-4">
            {Object.entries(formatCounts).map(([format, count]) => {
              const percentage = Math.round((count / totalExports) * 100);
              const colors: Record<string, string> = {
                "9:16": "from-primary to-indigo-400",
                "1:1": "from-emerald-500 to-cyan-500",
                "16:9": "from-amber-500 to-orange-500",
                "4:5": "from-rose-500 to-pink-500",
              };
              return (
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-white">{format}</span>
                    <span class="text-xs font-mono text-slate-400">{percentage}% ({count})</span>
                  </div>
                  <div class="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      class={`h-full bg-gradient-to-r ${colors[format] ?? "from-slate-500 to-slate-400"} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Activity */}
        <div class="glass-card-flat">
          <div class="flex items-center gap-3 mb-6">
            <BarChart3 size={18} class="text-emerald-500" />
            <h4 class="heading-card text-base">Project Activity</h4>
          </div>
          <div class="flex items-end gap-2 h-40 px-4">
            {[35, 52, 20, 80, 45, 65, 90, 30, 70, 55, 85, 40].map((h, i) => (
              <div class="flex-1 flex flex-col items-center gap-2">
                <div
                  class="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg transition-all duration-500 hover:from-primary/40"
                  style={{ height: `${h}%` }}
                />
                <span class="text-[7px] font-bold text-slate-600">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avg Highlights */}
      <div class="glass-card-flat animate-fade-in stagger-3" style="opacity:0">
        <div class="flex items-center gap-3 mb-6">
          <TrendingUp size={18} class="text-amber-500" />
          <h4 class="heading-card text-base">Performance Summary</h4>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div class="text-center p-6 bg-white/5 rounded-xl">
            <span class="text-4xl font-black text-white block mb-2">
              {Math.round(MOCK_STATS.totalClipsGenerated / Math.max(MOCK_STATS.totalProjects, 1))}
            </span>
            <span class="label-micro">Avg Clips / Video</span>
          </div>
          <div class="text-center p-6 bg-white/5 rounded-xl">
            <span class="text-4xl font-black text-white block mb-2">92%</span>
            <span class="label-micro">Avg AI Confidence</span>
          </div>
          <div class="text-center p-6 bg-white/5 rounded-xl">
            <span class="text-4xl font-black text-white block mb-2">0:45</span>
            <span class="label-micro">Avg Clip Duration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
