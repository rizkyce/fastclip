import { Router, Route } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";
import Layout from "./components/Layout";
import ToastContainer from "./components/Toast";

// Lazy load pages for better performance
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const EditorPage = lazy(() => import("./pages/EditorPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const ExportPage = lazy(() => import("./pages/ExportPage"));
const AILabPage = lazy(() => import("./pages/AILabPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function App() {
  return (
    <>
      <Router root={Layout}>
        <Route path="/" component={DashboardPage} />
        <Route path="/library" component={LibraryPage} />
        <Route path="/editor/:id?" component={EditorPage} />
        <Route path="/project/:id" component={ProjectDetailPage} />
        <Route path="/exports" component={ExportPage} />
        <Route path="/ai-lab" component={AILabPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route path="/settings" component={SettingsPage} />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
