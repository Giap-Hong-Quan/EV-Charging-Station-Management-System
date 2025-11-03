import { AlertCircle, BarChart3, BatteryCharging, Calendar, Home, Plus, Zap } from "lucide-react";

export const mainMenu= [
  { label: "Tổng quan", icon: BarChart3, path: "/staff/dashboard" },
  { label: "Phiên sạc", icon: BatteryCharging, path: "/staff/sessions", badge: 9 },
  { label: "Điểm sạc", icon: Zap, path: "/staff/chargingPoint" },
  { label: "Lịch sử", icon: Calendar, path: "/staff/history" },
];

export const quickActions = [
  { label: "Tạo phiên sạc", icon: Plus, path: "/staff/create-session" },
  { label: "Thu tiền mặt", icon: Home, path: "/staff/cash" },
  { label: "Báo cáo sự cố", icon: AlertCircle, path: "/staff/issues" },
];