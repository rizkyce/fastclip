import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { SlidersHorizontal } from "lucide-solid";
import { cn } from "../../lib/utils";
import { MOCK_VIDEOS } from "../../mock/data";
import VideoCard from "../VideoCard";
import VideoListRow from "../VideoListRow";
import EmptyState from "../EmptyState";

interface AssetGridProps {
  videos: typeof MOCK_VIDEOS;
  view: "grid" | "list";
}

export default function AssetGrid(props: AssetGridProps) {
  return (
    <Show when={props.videos.length > 0} fallback={
      <EmptyState
        icon={<SlidersHorizontal size={40} />}
        title="No Videos Found"
        description="Try adjusting your search or filter to find what you're looking for."
      />
    }>
      <div class={cn(
        "animate-fade-in transition-all duration-500",
        props.view === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
          : "flex flex-col gap-2 sm:gap-3"
      )}>
        <For each={props.videos}>
          {(video) => (
            <A href={`/project/p${MOCK_VIDEOS.indexOf(video) + 1}`}>
              <Show when={props.view === "grid"} fallback={<VideoListRow video={video} />}>
                <VideoCard video={video} />
              </Show>
            </A>
          )}
        </For>
      </div>
    </Show>
  );
}
