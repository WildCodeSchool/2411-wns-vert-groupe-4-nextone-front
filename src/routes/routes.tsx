import { createBrowserRouter } from "react-router-dom";
import Terminal from "../pages/Terminal";
import App from "../App";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import HomeDashboard from "../components/dashboard/HomeDashboard";
import LoginPageAdmin from "../pages/LoginPageAdmin";
import PhonePage from "@/pages/PhonePage";
import DashboardServicesPage from "@/pages/DashboardServicesPage.tsx";
import TicketsDashboard from "@/components/dashboard/tickets/TicketsDashboard.tsx";
import TicketPage from "@/components/dashboard/tickets/TicketPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/terminal",
    element: <Terminal />,
  },
  {
    path: "/phone",
    element: <PhonePage />,
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
        path: "services",
        element: <DashboardServicesPage />,
      },
      {

        path: "tickets",
        element: <TicketsDashboard />,
      },
      {
        path: "tickets/:id",
        element: <TicketPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPageAdmin />,
  },
]);
