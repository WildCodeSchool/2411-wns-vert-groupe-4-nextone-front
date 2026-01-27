import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import TvPage from "@/pages/TvPage";
import { TICKETS_FOR_TV_DISPLAY } from "@/requests/queries/ticket.query";

vi.mock("@/components/tv/TvHeader", () => ({ default: () => <div>Header</div> }));
vi.mock("@/components/tv/TvFooter", () => ({ default: () => <div>Footer</div> }));
vi.mock("@/components/tv/CurrentTicket", () => ({ default: () => <div>CurrentTicket</div> }));
vi.mock("@/components/tv/TicketInProgressList", () => ({ default: () => <div>InProgressList</div> }));

const mocks = [
  {
    request: { query: TICKETS_FOR_TV_DISPLAY, variables: { serviceId: "1" } },
    result: {
      data: {
        ticketsForTVDisplay: [
          {
            id: "t1",
            number: 1,
            code: "T1",
            service: { name: "Service 1" },
          },
          {
            id: "t2",
            number: 2,
            code: "T2",
            service: { name: "Service 2" },
          },
        ],
      },
    },
  },
];

const renderTvPage = (initialEntries = ["/tv/1"]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/tv/:serviceId" element={<TvPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

describe("TvPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", () => {
        renderTvPage();
        expect(screen.getByText(/Chargement des tickets/i)).toBeInTheDocument();
    });
});
