import AnalyticsAdmin from "@/pages/admin/AnalyticsAdmin";
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import PointAdmin from "@/pages/admin/PointAdmin";
import StationAdmin from "@/pages/admin/StationAdmin";

export const adminRoutes = [
  { index: true, element: <DashboardAdmin /> },
  { path: "dashboard", element: <DashboardAdmin /> }, 
  { path: "ai-analytics", element: <AnalyticsAdmin /> }, 
  { path: "stations", element: <StationAdmin /> }, 
  { path: "points", element: <PointAdmin /> }, 
  
];