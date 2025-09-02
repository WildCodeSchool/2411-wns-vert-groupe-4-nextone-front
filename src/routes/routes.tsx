import { createBrowserRouter } from "react-router-dom";
import Terminal from "../pages/Terminal";
import App from "../App";
import ChooseService from "@/components/terminal/ChooseService";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import HomeDashboard from "../components/dashboard/HomeDashboard.tsx";
import LoginPageAdmin from "../pages/LoginPageAdmin";
import TicketsDashboard from "@/components/dashboard/tickets/TicketsDashboard.tsx";
import TicketPage from "@/components/dashboard/tickets/TicketPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
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
    element: <DashboardLayout />,
    path: "/dashboard",
    children: [
      {
        index: true,
        element: <HomeDashboard />,
      },
      {
        path: "/dashboard/tickets",
        element: <TicketsDashboard />,
      },
      {
        path: "/dashboard/tickets/:id",
        element: <TicketPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPageAdmin />,
  },
]);
