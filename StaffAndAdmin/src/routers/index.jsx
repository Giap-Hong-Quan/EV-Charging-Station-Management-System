import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login";
import RequireAuth from "../lib/RequireAuth";
import Unauthorized from "@/pages/Unauthorized";
import RoleRedirect from "@/lib/RoleRedirect";
import { staffRoutes } from "./StaffRoutes";
import { adminRoutes } from "./AdminRoutes";
import LayoutStaff from "@/layouts/LayoutStaff";
import LayoutAdmin from "@/layouts/LayoutAdmin";
import NotFound from "@/pages/NotFound";

const AppRouter = createBrowserRouter([
    {path: "/login",element: <Login />},
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "/", element: <RoleRedirect /> },
  
    {
    path: "/staff",
    element: (
      <RequireAuth allowedRoles={[2]}>
        <LayoutStaff />
      </RequireAuth>
    ),
    children: staffRoutes,
    },
    {
    path: "/admin",
    element: (
      <RequireAuth allowedRoles={[1]}>
        <LayoutAdmin />
      </RequireAuth>
    ),
    children: adminRoutes,
  },




  //  Đây là 404 Not Found
  {path: "*",element: <NotFound />},
])
export default AppRouter