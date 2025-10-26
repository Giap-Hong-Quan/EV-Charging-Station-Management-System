import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./dashboard";
import Layout from "../layout/Layout";
import Login from "../pages/Auth/Login";
import RequireAuth from "../lib/RequireAuth";

const AppRouter = createBrowserRouter([
    {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
    // <RequireAuth>
    <Layout/>
    // </RequireAuth>
    ),
    children:[
        ...dashboardRoutes,
    ]
  }
])
export default AppRouter