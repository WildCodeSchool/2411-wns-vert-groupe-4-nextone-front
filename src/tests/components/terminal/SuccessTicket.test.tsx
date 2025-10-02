import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import SuccessTicketPage from "../../../components/terminal/SuccessTicket";
import type { Mock } from "vitest";
import { useTicket } from "../../../context/useContextTicket";
import { ticket } from "../../fixtures/ticket"

vi.mock("../../../context/useContextTicket", () => ({
  useTicket: vi.fn(),
}));

vi.mock("react-qr-code", () => ({
  default: vi.fn(() => <div data-testid="qr-code" />),
}));

vi.mock("../../../common/terminal/CompanyIllustration", () => ({
  default: () => <div data-testid="company-illustration" />,
}));

const renderPage = (isScanned: boolean, onTimeout = vi.fn()) => {
  render(<SuccessTicketPage isScanned={isScanned} onTimeout={onTimeout} />);
  return onTimeout;
};

describe("SuccessTicketPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (useTicket as Mock).mockReturnValue({ ticket: ticket });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Display ticket", () => {
    it("renders ticket code and company illustration", () => {
      renderPage(true);
      expect(screen.getByText(ticket.code!)).toBeInTheDocument();
      expect(screen.getByTestId("company-illustration")).toBeInTheDocument();
    });

    it("shows main success text", () => {
      renderPage(true);
      expect(screen.getByText(/C’est fait !/i)).toBeInTheDocument();
      expect(screen.getByText(/Vous êtes dans la file./i)).toBeInTheDocument();
      expect(screen.getByText(/Votre numéro de ticket/i)).toBeInTheDocument();
    });
  });

  describe("QR Code", () => {
    it("does NOT show QR code when isScanned is true", () => {
      renderPage(true);
      expect(screen.queryByTestId("qr-code")).toBeNull();
    });

    it("shows QR code when isScanned is false", () => {
      renderPage(false);
      expect(screen.getByTestId("qr-code")).toBeInTheDocument();
    });
  });

  describe("Timeout", () => {
    it("calls onTimeout after 10 seconds if isScanned is true", () => {
      const onTimeout = renderPage(true);
      vi.advanceTimersByTime(10000);
      expect(onTimeout).toHaveBeenCalledTimes(1);
    });

    it("does not call onTimeout if isScanned is false", () => {
      const onTimeout = renderPage(false);
      vi.advanceTimersByTime(10000);
      expect(onTimeout).not.toHaveBeenCalled();
    });
  });
});
