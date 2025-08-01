import { createBrowserRouter } from "react-router-dom";
import Terminal from "../pages/Terminal";
import App from "../App";
import ChooseService from "@/components/terminal/ChooseService";

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
]);