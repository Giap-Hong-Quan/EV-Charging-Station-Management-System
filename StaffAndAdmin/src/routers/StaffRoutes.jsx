import ChargingPointStaff from "@/pages/staff/ChargingPointStaff";
import DashboardStaff from "@/pages/staff/DashboardStaff";
import IssuesStaff from "@/pages/staff/IssuesStaff";
import SessionsStaff from "@/pages/staff/SessionsStaff";

export const staffRoutes = [
  { index: true, element: <DashboardStaff /> },
  { path: "dashboard", element: <DashboardStaff /> },       
  { path: "sessions", element: <SessionsStaff /> },          
  { path: "chargingPoint", element: <ChargingPointStaff /> },          
  { path: "history", element: <IssuesStaff /> },              
];