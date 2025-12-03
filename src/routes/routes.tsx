import { createBrowserRouter } from "react-router-dom";
import Terminal from "../pages/Terminal";
import App from "../App";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import HomeDashboard from "../components/dashboard/HomeDashboard";
import LoginPageAdmin from "../pages/LoginPageAdmin";
import PhonePage from "../pages/PhonePage";
import DashboardServicesPage from "../pages/DashboardServicesPage.tsx";
import TicketsDashboard from "../components/dashboard/tickets/TicketsDashboard.tsx";
import TicketPage from "../components/dashboard/tickets/TicketPage.tsx";
import TvPage from "../pages/TvPage.tsx";
import SettingsPage from "@/pages/SettingsPage";
import UserInvitationPage from "@/pages/UserInvitationPage";
import UserProtectedRoute from "@/components/UserProtectedRoute.tsx";
import PublicProtectedRoute from "@/components/PublicProtectedRoute.tsx";
import TvSelector from "../pages/TvSelector.tsx";

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
    element: <TvSelector/>,
    path: "/tv",
    children: [
      {
        path: ":serviceId",
        element: <TvPage/>
      }
    ]
  },
  {
    element: <UserProtectedRoute />,
    children: [
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
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    element: <PublicProtectedRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPageAdmin />,
      },
    ],
  },
  {
    path: "/join/:invitationToken",
    element: <UserInvitationPage />,
  },
]);
