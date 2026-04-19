import { Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { MOCK_PROJECTS, MOCK_HIGHLIGHTS } from "../mock/data";
import EmptyState from "../components/EmptyState";
import EditorHeader from "../components/editor/EditorHeader";
import VideoPreview from "../components/editor/VideoPreview";
import Timeline from "../components/editor/Timeline";
import EditorSidebar from "../components/editor/EditorSidebar";
import { Film } from "lucide-solid";

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const project = () => MOCK_PROJECTS.find(p => p.id === params.id);
  const highlights = () => project() ? MOCK_HIGHLIGHTS.filter(h => h.videoId === project()!.video.id) : [];

  return (
    <Show when={project()} fallback={
      <EmptyState
        icon={<Film size={40} />}
        title="Project Not Found"
        description="The project you're looking for doesn't exist."
      />
    }>
      <div class="h-[calc(100vh-120px)] flex flex-col xl:flex-row gap-8 overflow-hidden">
        {/* Main Interface */}
        <div class="flex-[2] flex flex-col gap-8 min-w-0 h-full overflow-y-auto pr-2 no-scrollbar pb-10">
          <EditorHeader projectName={project()!.name} />
          
          <VideoPreview 
            thumbnail={project()?.video.thumbnail} 
            projectName={project()?.name} 
          />

          {/* Temporal Control */}
          <Timeline highlights={highlights()} />
        </div>

        {/* Sidebar Controls */}
        <div class="flex-1 w-full lg:max-w-md xl:max-w-none h-full">
          <EditorSidebar highlights={highlights()} />
        </div>
      </div>
    </Show>
  );
}
