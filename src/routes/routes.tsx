import { createBrowserRouter } from "react-router-dom";
import Terminal from "../pages/Terminal";
import App from "../App";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import HomeDashboard from "../components/dashboard/HomeDashboard";
import LoginPageAdmin from "../pages/LoginPageAdmin";
import PhonePage from "@/pages/PhonePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <div>Route test About</div>,
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
    ],
  },
  {
    path: "/login",
    element: <LoginPageAdmin />,
  },
]);
