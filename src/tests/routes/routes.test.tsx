import { describe, it, expect } from "vitest";
import { router } from "../../routes/routes";
import App from "../../App";
import Terminal from "../../pages/Terminal";
import LoginPageAdmin from "../../pages/LoginPageAdmin";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import HomeDashboard from "../../components/dashboard/HomeDashboard";
import DashboardServicesPage from "../../pages/DashboardServicesPage";
import TicketsDashboard from "../../components/dashboard/tickets/TicketsDashboard";
import TicketPage from "../../components/dashboard/tickets/TicketPage";
import PhonePage from "../../pages/PhonePage";
import TvPage from "../../pages/TvPage";
import TvSelector from "@/pages/TvSelector";
import UserInvitationPage from "@/pages/UserInvitationPage";
import SettingsPage from "@/pages/SettingsPage";
import type { ReactElement, ReactNode } from "react";
import { isValidElement } from "react";
import type { RouteObject } from "react-router-dom";

const getElementType = (element: unknown): any => {
  if (!isValidElement(element)) return null;
  let el = element as ReactElement<{ children?: ReactNode }>;
  while (
    isValidElement(el) &&
    el.props?.children &&
    isValidElement(el.props.children)
  ) {
    el = el.props.children as ReactElement<{ children?: ReactNode }>;
  }
  return el.type;
};

const findRouteByPath = ( routes: (RouteObject & { children?: RouteObject[] })[], path: string ): (RouteObject & { children?: RouteObject[] }) | undefined => {
  for (const route of routes) {
    if (route.path === path) return route;
    if (route.children) {
      const child = findRouteByPath(route.children, path);
      if (child) return child;
    }
  }
  return undefined;
};

describe("Router", () => {
  const routes = router.routes as (RouteObject & { children?: RouteObject[] })[];

  it("must contain the main routes", () => {
    const mainPaths = [
      "/",
      "/terminal",
      "/phone",
      "/login",
      "/dashboard",
      "/tv/:key",
      "/join/:invitationToken",
    ];

    mainPaths.forEach((path) => {
      const route = findRouteByPath(routes, path);
      expect(route).toBeDefined();
    });
  });

  it("must have the correct components for main routes", () => {
    const routeAndComponent: [string, any][] = [
      ["/", App],
      ["/terminal", Terminal],
      ["/phone", PhonePage],
      ["/login", LoginPageAdmin],
      ["/dashboard", DashboardLayout],
      ["/tv/:key", TvSelector],
      ["/join/:invitationToken", UserInvitationPage],
    ];

    routeAndComponent.forEach(([path, comp]) => {
      const route = findRouteByPath(routes, path);
      expect(route).toBeDefined();
      expect(getElementType(route!.element)).toBe(comp);
    });
  });

  it("must have the correct sub-routes for the dashboard", () => {
    const dashboardRoute = findRouteByPath(routes, "/dashboard");
    expect(dashboardRoute).toBeDefined();

    const dashboardChildren = dashboardRoute!.children!;
    expect(dashboardChildren).toBeDefined();

    const childPaths = dashboardChildren.map((c) => c.path ?? "index");
    ["index", "services", "tickets", "tickets/:id", "settings"].forEach((p) =>
      expect(childPaths).toContain(p)
    );

    const findChild = (path: string) =>
      dashboardChildren.find((c) => (c.path ?? "index") === path);

    expect(getElementType(findChild("index")?.element)).toBe(HomeDashboard);
    expect(getElementType(findChild("services")?.element)).toBe(
      DashboardServicesPage
    );
    expect(getElementType(findChild("tickets")?.element)).toBe(TicketsDashboard);
    expect(getElementType(findChild("tickets/:id")?.element)).toBe(TicketPage);
    expect(getElementType(findChild("settings")?.element)).toBe(SettingsPage);
  });

  it("must have the correct sub-routes for the TV", () => {
    const tvRoute = findRouteByPath(routes, "/tv/:key");
    expect(tvRoute).toBeDefined();

    const tvChildren = tvRoute!.children!;
    expect(tvChildren).toBeDefined();

    const childPaths = tvChildren.map((c) => c.path ?? "index");
    expect(childPaths).toContain(":serviceId");

    const findChild = (path: string) =>
      tvChildren.find((c) => (c.path ?? "index") === path);

    expect(getElementType(findChild(":serviceId")?.element)).toBe(TvPage);
  });
});
