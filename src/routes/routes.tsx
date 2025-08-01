import { createBrowserRouter } from "react-router-dom";
import Terminal from "../pages/Terminal";
import App from "../App";
import ChooseService from "@/components/terminal/ChooseService";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import HomeDashboard from "../components/dashboard/HomeDashboard.tsx";
import LoginPageAdmin from "../pages/LoginPageAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/about",
    element: <div>Route test About</div>,
  },
  {
    path: "/terminal",
    Component: Terminal,
  },
  {
    path: "/choose-service",
    Component: ChooseService,
  },
  {
    path: "/",
    Component: App,
  },
  {
    element: <DashboardLayout />,
    path: "/dashboard",
    children: [
      {
        index: true,
        element: <HomeDashboard />,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPageAdmin />, 
  },
]);