import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { Sparkles, Scissors } from "lucide-solid";
import type { MOCK_HIGHLIGHTS } from "../../mock/data";
import ClipCard from "../ClipCard";
import EmptyState from "../EmptyState";

interface HighlightListProps {
  highlights: typeof MOCK_HIGHLIGHTS;
  projectId: string;
}

export default function HighlightList(props: HighlightListProps) {
  return (
    <Show when={props.highlights.length > 0} fallback={
      <EmptyState
        icon={<Sparkles size={40} />}
        title="No Highlights Yet"
        description="Open in Editor to run AI analysis and detect viral moments."
        action={<A href={`/editor/${props.projectId}`} class="btn-primary"><Scissors size={14} /> Open in Editor</A>}
      />
    }>
      <div class="grid gap-4">
        <For each={props.highlights}>
          {(highlight) => (
            <ClipCard
              highlight={highlight}
              onGenerateClip={() => {}}
              onApprove={() => {}}
              onReject={() => {}}
            />
          )}
        </For>
      </div>
    </Show>
  );
}
