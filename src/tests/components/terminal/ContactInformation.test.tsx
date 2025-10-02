import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ContactInformation from "../../../components/terminal/ContactInformation";
import * as TicketContext from "../../../context/useContextTicket";
import * as apollo from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { defaultTicket } from "../../fixtures/ticket"

const setTicketMock = vi.fn();
const onNextMock = vi.fn();

const mockUseTicket = (ticket = defaultTicket) => {
  vi.spyOn(TicketContext, "useTicket").mockImplementation(() => ({
    ticket,
    setTicket: setTicketMock,
  }));
};

const mockUseMutation = () => {
    const generateTicketMock = vi.fn().mockResolvedValue({
        data: { generateTicket: { code: "TICKET123" } },
    });
    vi.spyOn(apollo, "useMutation").mockImplementation(() => [
        generateTicketMock,
        {
        loading: false,
        called: false,
        client: {} as any,
        reset: vi.fn(),
        data: undefined,
        error: undefined,
        refetchQueries: vi.fn(),
        } as any,
    ]);
    return generateTicketMock;
};

const renderComponent = (ticket = defaultTicket) => {
  mockUseTicket(ticket);
  mockUseMutation();
  return render(
    <ContactInformation onBack={() => {}} onNext={onNextMock} onCancel={() => {}} />
  );
};

const getInputs = () => ({
  email: screen.getByLabelText(/Votre adresse mail \?/i),
  phone: screen.getByLabelText(/Votre numéro de téléphone \?/i),
  rgpd: screen.getByLabelText(/J'accepte la politique/i) as HTMLInputElement,
});

const fillInputs = async (values: { email?: string; phone?: string; rgpd?: boolean }) => {
  const inputs = getInputs();
  if (values.email !== undefined) {
    await userEvent.clear(inputs.email);
    await userEvent.type(inputs.email, values.email);
  }
  if (values.phone !== undefined) {
    await userEvent.clear(inputs.phone);
    await userEvent.type(inputs.phone, values.phone);
  }
  if (values.rgpd) {
    await userEvent.click(inputs.rgpd);
    expect(inputs.rgpd.checked).toBe(true);
  }
};

describe("ContactInformation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders inputs with default values", () => {
    renderComponent({ ...defaultTicket, email: "test@example.com", phone: "0635968545" });
    const inputs = getInputs();
    expect(inputs.email).toHaveValue("test@example.com");
    expect(inputs.phone).toHaveValue("0635968545");
    expect(inputs.rgpd.checked).toBe(false);
  });

  it("shows validation errors when fields are empty or RGPD unchecked", async () => {
    renderComponent({ ...defaultTicket, email: "", phone: "", rgpdAccepted: false });
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => {
      expect(screen.getByText(/Email requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Téléphone requis/i)).toBeInTheDocument();
      expect(screen.getByText(/Vous devez accepter la RGPD/i)).toBeInTheDocument();
    });

    expect(setTicketMock).not.toHaveBeenCalled();
    expect(onNextMock).not.toHaveBeenCalled();
  });

  it("submits valid data correctly", async () => {
    renderComponent();
    await fillInputs({ email: "user@example.com", phone: "0612345678", rgpd: true });
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => {
      expect(setTicketMock).toHaveBeenCalledWith(
        expect.objectContaining({ email: "user@example.com", phone: "0612345678", rgpdAccepted: true, code: "TICKET123" })
      );
      expect(onNextMock).toHaveBeenCalled();
    });
  });
});
