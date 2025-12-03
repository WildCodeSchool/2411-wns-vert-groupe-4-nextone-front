import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import TvSelector from "@/pages/TvSelector";
import { GET_SERVICES } from "@/requests/queries/service.query";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mocks = [
    {
        request: { query: GET_SERVICES },
        result: {
            data: {
                services: [
                { id: "1", name: "Service 1" },
                { id: "2", name: "Service 2" },
                ],
            },
        },
    },
];

const emptyMocks = [
    {
        request: { query: GET_SERVICES },
        result: { data: { services: [] } },
    },
];

const renderTvSelector = (initialEntries = ["/tv"]) =>
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                <Route path="/tv" element={<TvSelector />} />
                <Route path="/tv/:serviceId" element={<div>TV Screen</div>} />
                </Routes>
            </MemoryRouter>
        </MockedProvider>
    );

const renderTvSelectorWithoutService = () =>
    render(
        <MockedProvider mocks={emptyMocks} addTypename={false}>
            <MemoryRouter>
                <TvSelector />
            </MemoryRouter>
        </MockedProvider>
    );

describe("TvSelector", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", () => {
        renderTvSelector();
        expect(screen.getByText(/Chargement des services/i)).toBeInTheDocument();
    });

    it("renders services after loading", async () => {
        renderTvSelector();
        await waitFor(() => {
            expect(screen.getByText("-- Sélectionner un service --")).toBeInTheDocument();
            expect(screen.getByText("Service 1")).toBeInTheDocument();
            expect(screen.getByText("Service 2")).toBeInTheDocument();
        });
    });

    it("displays select but keeps button disabled if no services", async () => {
        renderTvSelectorWithoutService();
        await waitFor(() => screen.getByText("-- Sélectionner un service --"));
        const select = screen.getByRole("combobox");
        const button = screen.getByRole("button", { name: /Voir l’écran TV/i });
        expect(select).toBeInTheDocument();
        expect(screen.queryByText("Service 1")).not.toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    it("updates selection and enables button", async () => {
        renderTvSelector();
        await waitFor(() => screen.getByText("Service 1"));
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        const button = screen.getByRole("button", { name: /Voir l’écran TV/i });
        expect(button).toBeDisabled();
        fireEvent.change(select, { target: { value: "1" } });
        expect(select.value).toBe("1");
        expect(button).toBeEnabled();
    });

    it("navigates to selected service on button click", async () => {
        renderTvSelector();
        await waitFor(() => screen.getByText("Service 1"));
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "1" } });
        fireEvent.click(screen.getByRole("button", { name: /Voir l’écran TV/i }));
        expect(navigateMock).toHaveBeenCalledWith("/tv/1");
    });

    it("renders Outlet when serviceId param is present", () => {
        renderTvSelector(["/tv/1"]);
        expect(screen.getByText("TV Screen")).toBeInTheDocument();
    });
});
