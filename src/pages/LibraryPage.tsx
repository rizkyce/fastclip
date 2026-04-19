import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { MOCK_VIDEOS } from "../mock/data";
import { actions } from "../store";
import ImportSection from "../components/library/ImportSection";
import LibraryHeader from "../components/library/LibraryHeader";
import FilterTabs, { FilterTab } from "../components/library/FilterTabs";
import AssetGrid from "../components/library/AssetGrid";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = createSignal("");
  const [filter, setFilter] = createSignal<FilterTab>("all");
  const [view, setView] = createSignal<"grid" | "list">("grid");

  const filteredVideos = () => {
    let videos = MOCK_VIDEOS;
    const q = search().toLowerCase();
    if (q) videos = videos.filter(v => v.title.toLowerCase().includes(q));
    if (filter() !== "all") videos = videos.filter(v => v.status === filter());
    return videos;
  };

  const handleURLUpload = (_url: string) => {
    actions.addNotification("info", "Connecting to source...");
    
    // Simulate high-speed ingestion and automated navigation
    setTimeout(() => {
      actions.startAIJob("p2"); // Simulate processing for mock project
      navigate("/project/p2");
    }, 800);
  };

  return (
    <div class="space-y-14 py-4">
      <ImportSection onURLUpload={handleURLUpload} />
      
      <div class="space-y-10">
        {/* Gallery Controls */}
        <LibraryHeader 
          count={filteredVideos().length}
          total={MOCK_VIDEOS.length}
          search={search()}
          onSearch={setSearch}
          view={view()}
          onViewChange={setView}
        />

        {/* Categories */}
        <FilterTabs 
          active={filter()}
          onChange={setFilter}
        />

        {/* Results Display */}
        <AssetGrid 
          videos={filteredVideos()}
          view={view()}
        />
      </div>
    </div>
  );
}
