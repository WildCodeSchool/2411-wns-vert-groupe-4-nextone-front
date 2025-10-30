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
import type { RouteObject } from "react-router-dom";
import { isValidElement } from "react";
import TvPage from "../../pages/TvPage";

describe("Router", () => {
  const routes = router.routes as RouteObject[];

  const getElementType = (element: unknown) => {
    return isValidElement(element) ? element.type : null;
  };

  it("must contain the main routes", () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/terminal");
    expect(paths).toContain("/phone");
    expect(paths).toContain("/login");
    expect(paths).toContain("/dashboard");
    expect(paths).toContain("/tv");
  });

  it("must have the correct components for the main routes", () => {
    const findRoute = (path: string) => routes.find((r) => r.path === path);

    expect(getElementType(findRoute("/")?.element)).toBe(App);
    expect(getElementType(findRoute("/terminal")?.element)).toBe(Terminal);
    expect(getElementType(findRoute("/phone")?.element)).toBe(PhonePage);
    expect(getElementType(findRoute("/login")?.element)).toBe(LoginPageAdmin);
    expect(getElementType(findRoute("/dashboard")?.element)).toBe(DashboardLayout);
    expect(getElementType(findRoute("/tv")?.element)).toBe(TvPage);
  });

  it("must have the correct sub-routes for the main road dashboard", () => {
    const dashboardRoute = routes.find((r) => r.path === "/dashboard");
    expect(dashboardRoute?.children).toBeDefined();
    const children = dashboardRoute?.children as RouteObject[];

    const childPaths = children.map((c) => c.path ?? "index");
    expect(childPaths).toContain("index");
    expect(childPaths).toContain("services");
    expect(childPaths).toContain("tickets");
    expect(childPaths).toContain("tickets/:id");

    const findChild = (path: string) =>
      children.find((c) => (c.path ?? "index") === path);

    expect(getElementType(findChild("index")?.element)).toBe(HomeDashboard);
    expect(getElementType(findChild("services")?.element)).toBe(
      DashboardServicesPage
    );
    expect(getElementType(findChild("tickets")?.element)).toBe(
      TicketsDashboard
    );
    expect(getElementType(findChild("tickets/:id")?.element)).toBe(TicketPage);
  });
});
