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

    it("renders Outlet when serviceId param is present", () => {
        renderTvSelector(["/tv/1"]);
        expect(screen.getByText("TV Screen")).toBeInTheDocument();
    });
});
