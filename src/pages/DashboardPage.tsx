import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import QuickActions from "../components/dashboard/QuickActions";
import AIProcessingList from "../components/dashboard/AIProcessingList";
import RecentProjectsList from "../components/dashboard/RecentProjectsList";

export default function DashboardPage() {
  return (
    <div class="space-y-12 py-4 max-w-7xl mx-auto">
      <DashboardHeader />
      <StatsGrid />
      <QuickActions />
      <AIProcessingList />
      <RecentProjectsList />
    </div>
  );
}
