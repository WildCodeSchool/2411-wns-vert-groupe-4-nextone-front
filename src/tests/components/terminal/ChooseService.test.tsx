import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ChooseService from "../../../components/terminal/ChooseService";
import { useTicket } from "../../../context/useContextTicket";
import { useQuery } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { GET_SERVICES } from "../../../requests/queries/service.query";
import { Service } from "../../../types/terminal";
import { emptyTicket } from "../../../utils/constants/ticket";

vi.mock("@apollo/client", async () => {
  const actual = await vi.importActual("@apollo/client");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("../../../context/useContextTicket", async () => {
  const actual = await vi.importActual("../../../context/useContextTicket");
  return {
    ...actual,
    useTicket: vi.fn(),
  };
});

describe("ChooseService", () => {
  const setTicketMock = vi.fn();
  const onNextMock = vi.fn();
  const onBackMock = vi.fn();
  const onCancelMock = vi.fn();

  const renderComponent = () =>
    render(<ChooseService onBack={onBackMock} onNext={onNextMock} onCancel={onCancelMock} />);

    const mockUseQuery = ( data: { services: Service[] } | undefined | null = undefined, loading = false, error: Error | null = null) => {
      (useQuery as any).mockReturnValue({ data, loading, error });
    };

    const mockUseTicket = (ticket = emptyTicket) => {
      (useTicket as any).mockReturnValue({ ticket, setTicket: setTicketMock });
    };

    beforeEach(() => {
      vi.resetAllMocks();
    });

  describe("Query states", () => {
    it("renders loading spinner", () => {
      mockUseQuery(null, true);
      mockUseTicket();
      renderComponent();
      expect(screen.getByText(/Chargement des services.../i)).toBeInTheDocument();
    });

    it("renders error message", () => {
      mockUseQuery(undefined, false, new Error("fail"));
      mockUseTicket();
      renderComponent();
      expect(screen.getByText(/erreur lors du chargement/i)).toBeInTheDocument();
    });
  });

  describe("Service rendering and selection", () => {
    it("renders services as tabs and allows selection", async () => {
      const services = [
        { id: "1", name: "Service 1", isGloballyActive: true },
        { id: "2", name: "Service 2", isGloballyActive: true },
      ];
      mockUseQuery({ services });
      mockUseTicket();
      renderComponent();

      expect(screen.getByText("Service 1")).toBeInTheDocument();
      expect(screen.getByText("Service 2")).toBeInTheDocument();

      await userEvent.click(screen.getByRole("tab", { name: "Service 1" }));
      expect(setTicketMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ serviceId: "1", serviceName: "Service 1" })
      );

      await userEvent.click(screen.getByText(/continuer/i));
      expect(onNextMock).toHaveBeenCalled();
    });

    it("renders select when more than 4 services", async () => {
      const services = Array.from({ length: 5 }, (_, i) => ({
        id: String(i + 1),
        name: `Service ${i + 1}`,
        isGloballyActive: true,
      }));
      mockUseQuery({ services });
      mockUseTicket();
      renderComponent();

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();

      await userEvent.selectOptions(select, "1");
      expect(setTicketMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ serviceId: "1", serviceName: "Service 1" })
      );
    });

    it("does not render inactive services", () => {
      const services = [
        { id: "1", name: "Active Service", isGloballyActive: true },
        { id: "2", name: "Inactive Service", isGloballyActive: false },
      ];
      mockUseQuery({ services });
      mockUseTicket();
      renderComponent();

      expect(screen.getByText("Active Service")).toBeInTheDocument();
      expect(screen.queryByText("Inactive Service")).not.toBeInTheDocument();
    });

    it("shows message when no active services", () => {
      const services = [{ id: "1", name: "Inactive Service", isGloballyActive: false }];
      mockUseQuery({ services });
      mockUseTicket();
      renderComponent();

      expect(screen.getByText(/aucun service actif disponible/i)).toBeInTheDocument();
    });
  });

  describe("Validation and user interaction", () => {
    it("shows error if no service selected and Continuer clicked", async () => {
      const services = [{ id: "1", name: "Service 1", isGloballyActive: true }];
      mockUseQuery({ services });
      mockUseTicket();
      renderComponent();

      fireEvent.click(screen.getByText(/continuer/i));
      await waitFor(() => {
        expect(screen.getByText(/vous devez sélectionner un service/i)).toBeInTheDocument();
      });
      expect(onNextMock).not.toHaveBeenCalled();
    });
  });

  describe("useQuery call", () => {
    it("calls useQuery with GET_SERVICES", () => {
      const useQueryMock = vi.fn(() => ({ data: null, loading: false, error: null }));
      (useQuery as any) = useQueryMock;

      mockUseTicket();
      renderComponent();

      expect(useQueryMock).toHaveBeenCalledWith(GET_SERVICES);
    });
  });
});
