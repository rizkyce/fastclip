import { createSignal, createResource, Show } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { actions } from "../store";
import ImportSection from "../components/library/ImportSection";
import LibraryHeader from "../components/library/LibraryHeader";
import FilterTabs, { FilterTab } from "../components/library/FilterTabs";
import AssetGrid from "../components/library/AssetGrid";

export default function LibraryPage() {
  const [search, setSearch] = createSignal("");
  const [filter, setFilter] = createSignal<FilterTab>("all");
  const [view, setView] = createSignal<"grid" | "list">("grid");

  const [videos, { refetch }] = createResource(async () => {
    try {
      return await invoke<any[]>("get_all_videos");
    } catch (e) {
      console.error("Failed to fetch videos:", e);
      return [];
    }
  });

  const filteredVideos = () => {
    let items = videos() || [];
    const q = search().toLowerCase();
    if (q) items = items.filter(v => v.title.toLowerCase().includes(q));
    if (filter() !== "all") items = items.filter(v => v.status === filter());
    return items;
  };

  const handleURLUpload = (_url: string) => {
    actions.addNotification("info", "Link ingestion coming soon!");
  };

  const handleFileImport = async () => {
    try {
      actions.addNotification("info", "Selecting file...");
      const video = await invoke<any>("import_video_file");
      actions.addNotification("success", `Imported ${video.title}`);
      refetch();
    } catch (e: any) {
      if (e !== "No file selected") {
        actions.addNotification("error", `Import failed: ${e}`);
      }
    }
  };

  return (
    <div class="space-y-14 py-4">
      <ImportSection onURLUpload={handleURLUpload} onFileImport={handleFileImport} />

      <div class="space-y-10">
        <Show when={videos()} fallback={<div class="h-64 flex items-center justify-center text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Loading Library...</div>}>
          <LibraryHeader
            count={filteredVideos().length}
            total={(videos() || []).length}
            search={search()}
            onSearch={setSearch}
            view={view()}
            onViewChange={setView}
          />

          <FilterTabs
            active={filter()}
            onChange={setFilter}
          />

          <AssetGrid
            videos={filteredVideos()}
            view={view()}
          />
        </Show>
      </div>
    </div>
  );
}
