import { AlertCircle, BarChart3, BatteryCharging, Brain, Briefcase, Building2, Calendar, DollarSign, FileText, Home, Package, Plus, Users, Wrench, Zap } from "lucide-react";

export const mainMenu= [
  { label: "Tổng quan", icon: BarChart3, path: "/staff/dashboard" },
  { label: "Phiên sạc", icon: BatteryCharging, path: "/staff/sessions", badge: 9 },
  { label: "Điểm sạc", icon: Zap, path: "/staff/chargingPoint" },
  { label: "Lịch sử", icon: Calendar, path: "/staff/history" },
];

// Bỏ path vì dùng modal
export const quickActions = [
  { label: "Tạo phiên sạc", icon: Plus },
  { label: "Thu tiền mặt", icon: DollarSign },
  { label: "Báo cáo sự cố", icon: AlertCircle },
];


export const menuAdmin = [
    {
      title: "TỔNG QUAN",
      items: [
        { label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
        { label: "Phân tích AI", icon: Brain, path: "/admin/ai-analytics" },
      ],
    },
    {
      title: "QUẢN LÝ HỆ THỐNG",
      items: [
        { label: "Trạm sạc", icon: Building2, path: "/admin/stations" },
       { label: "Điểm sạc", icon: BatteryCharging, path: "/admin/points" },
        { label: "Người dùng", icon: Users, path: "/admin/users" },
        { label: "Nhân viên", icon: Briefcase, path: "/admin/staff" },
      ],
    },
    {
      title: "DỊCH VỤ",
      items: [
        { label: "Gói dịch vụ", icon: Package, path: "/admin/packages" },
        { label: "Doanh thu", icon: DollarSign, path: "/admin/revenue" },
      ],
    },
    {
      title: "HỖ TRỢ",
      items: [
        { label: "Sự cố", icon: Wrench, path: "/admin/issues", badge: 3 },
        { label: "Báo cáo", icon: FileText, path: "/admin/reports" },
      ],
    },
  ];