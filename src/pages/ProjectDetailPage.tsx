import { Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { ArrowLeft, Film, CheckCircle2 } from "lucide-solid";
import { MOCK_PROJECTS, MOCK_HIGHLIGHTS } from "../mock/data";
import EmptyState from "../components/EmptyState";
import ProjectHeader from "../components/project/ProjectHeader";
import AIScoutHero from "../components/project/AIScoutHero";
import HighlightList from "../components/project/HighlightList";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const project = () => MOCK_PROJECTS.find(p => p.id === params.id);
  const highlights = () => MOCK_HIGHLIGHTS.filter(h => h.videoId === project()?.video.id);

  return (
    <Show when={project()} fallback={
      <EmptyState
        icon={<Film size={40} />}
        title="Project Not Found"
        description="The project you're looking for doesn't exist."
        action={<A href="/library" class="btn-primary">Back to Library</A>}
      />
    }>
      {(proj) => (
        <div class="space-y-10 py-4 max-w-6xl mx-auto">
          {/* Back Nav */}
          <A href="/library" class="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold">
            <ArrowLeft size={16} /> Back to Library
          </A>

          <ProjectHeader 
            project={proj()} 
            highlightCount={highlights().length} 
          />

          {/* AI Highlights Section */}
          <div class="animate-fade-in stagger-2" style="opacity:0">
            <div class="flex items-center justify-between mb-6 border-b border-white/5 pb-6">
              <div>
                <span class="label-micro-primary block mb-1">AI Analysis</span>
                <h3 class="heading-section">
                  {proj().video.status === "processing" ? "Engine Scanning..." : "Detected Highlights"}
                </h3>
              </div>
              <Show when={proj().video.status !== "processing"}>
                <div class="flex items-center gap-2">
                  <span class="badge badge-success">
                    <CheckCircle2 size={10} />
                    {highlights().filter(h => h.status === "approved").length} Approved
                  </span>
                </div>
              </Show>
            </div>

            <Show 
              when={proj().video.status !== "processing"} 
              fallback={<AIScoutHero />}
            >
              <HighlightList 
                highlights={highlights()} 
                projectId={proj().id} 
              />
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
}
