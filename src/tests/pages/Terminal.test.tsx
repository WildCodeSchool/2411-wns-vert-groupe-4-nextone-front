import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Terminal from "../../pages/Terminal";
import { emptyTicket } from "../../utils/constants/ticket";

const setTicketMock = vi.fn();

vi.mock("../../context/useContextTicket", () => ({
  useTicket: () => ({
    setTicket: setTicketMock,
  }),
}));

vi.mock("react-qr-code", () => ({
  default: (props: any) => <div data-testid="qr-code" {...props} />,
}));

const mockGetScreenComponent = vi.fn();
vi.mock("../../components/terminal/Screens", () => ({
  getScreenComponent: (...args: any[]) => mockGetScreenComponent(...args),
}));

const renderTerminal = (initialEntries = ["/terminal"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/terminal" element={<Terminal />} />
      </Routes>
    </MemoryRouter>
  );

describe("Terminal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders home screen correctly", () => {
    renderTerminal();
    expect(screen.getByText(/Bienvenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Rejoindre la file d’attente/i)).toBeInTheDocument();
    expect(screen.getByText("OU", { selector: "span" })).toBeInTheDocument();
  });

  it("renders QR code with correct value", () => {
    renderTerminal();
    const qrCode = screen.getByTestId("qr-code");
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute(
      "value",
      `${window.location.origin}/terminal?screen=chooseService&scanned=true`
    );
  });

  it("changes screen when 'Rejoindre la file d’attente' is clicked", () => {
    renderTerminal();
    fireEvent.click(screen.getByText(/Rejoindre la file d’attente/i));
    expect(mockGetScreenComponent).toHaveBeenCalledWith("chooseService", expect.any(Object));
  });

  it("calls handleCancel and resets ticket", () => {
    const testScreen = "testScreen";
    mockGetScreenComponent.mockImplementation((screen, props) => {
      if (screen === testScreen) props.handleCancel();
      return null;
    });
    renderTerminal([`/terminal?screen=${testScreen}`]);
    expect(setTicketMock).toHaveBeenCalledWith(emptyTicket);
  });

  describe("successTicketPage behavior", () => {
    it("auto-resets after 20s if not scanned", () => {
      vi.useFakeTimers();
      renderTerminal(["/terminal?screen=successTicketPage"]);
      act(() => vi.advanceTimersByTime(20000));
      expect(setTicketMock).toHaveBeenCalledWith(emptyTicket);
    });

    it("does not reset if scanned", () => {
      vi.useFakeTimers();
      renderTerminal(["/terminal?screen=successTicketPage&scanned=true"]);
      act(() => vi.advanceTimersByTime(20000));
      expect(setTicketMock).not.toHaveBeenCalled();
    });
  });

  it("initializes currentScreen from URL param", () => {
    renderTerminal(["/terminal?screen=chooseService"]);
    expect(mockGetScreenComponent).toHaveBeenCalledWith(
      "chooseService",
      expect.objectContaining({
        setCurrentScreen: expect.any(Function),
        handleCancel: expect.any(Function),
        isScanned: false,
      })
    );
  });
});
