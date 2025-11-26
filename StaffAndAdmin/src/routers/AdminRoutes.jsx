import AnalyticsAdmin from "@/pages/admin/AnalyticsAdmin";
import BookingAdmin from "@/pages/admin/BookingAdmin";
import DashboardAdmin from "@/pages/admin/DashboardAdmin";
import DriverAdmin from "@/pages/admin/DriverAdmin";
import IssuesAdmin from "@/pages/admin/IssuesAdmin";
import PointAdmin from "@/pages/admin/PointAdmin";
import ReportsAdmin from "@/pages/admin/ReportsAdmin";
import RevenueAdmin from "@/pages/admin/RevenueAdmin";
import ServiceAdmin from "@/pages/admin/ServiceAdmin";
import SessionAdmin from "@/pages/admin/SessionAdmin";
import StaffAdmin from "@/pages/admin/StaffAdmin";
import StationAdmin from "@/pages/admin/StationAdmin";

export const adminRoutes = [
  { index: true, element: <DashboardAdmin /> },
  { path: "dashboard", element: <DashboardAdmin /> }, 
  { path: "ai-analytics", element: <AnalyticsAdmin /> }, 
  { path: "stations", element: <StationAdmin /> }, 
  { path: "points", element: <PointAdmin /> }, 
  { path: "driver", element: <DriverAdmin /> }, 
  { path: "staff", element: <StaffAdmin /> }, 
  { path: "booking", element: <BookingAdmin /> },
  { path: "sessions", element: <SessionAdmin /> },
  { path: "service", element: <ServiceAdmin /> }, 
  { path: "revenue", element: <RevenueAdmin /> }, 

  { path: "issues", element: <IssuesAdmin /> }, 
  { path: "reports", element: <ReportsAdmin /> },
];