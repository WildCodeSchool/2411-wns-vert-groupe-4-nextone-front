import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PersonnalInformation from "../../../components/terminal/PersonnalInformation";
import * as TicketContext from "../../../context/useContextTicket";
import userEvent from "@testing-library/user-event";
import { emptyTicket } from "../../../utils/constants/ticket";

const setTicketMock = vi.fn();
const onNextMock = vi.fn();

const mockUseTicket = (ticket = emptyTicket) => {
  vi.spyOn(TicketContext, "useTicket").mockImplementation(() => ({
    ticket,
    setTicket: setTicketMock,
  }));
};

const renderComponent = (ticket = emptyTicket) => {
  mockUseTicket(ticket);
  return render(
    <PersonnalInformation onBack={() => {}} onNext={onNextMock} onCancel={() => {}} />
  );
};

const getInputs = () => ({
  name: screen.getByLabelText(/Votre nom \?/i),
  firstName: screen.getByLabelText(/Votre prénom \?/i),
});

const fillInputs = async (values: { name?: string; firstName?: string }) => {
  const inputs = getInputs();
  if (values.name !== undefined) {
    await userEvent.clear(inputs.name);
    await userEvent.type(inputs.name, values.name);
  }
  if (values.firstName !== undefined) {
    await userEvent.clear(inputs.firstName);
    await userEvent.type(inputs.firstName, values.firstName);
  }
};

describe("PersonnalInformation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders inputs with default values", () => {
    renderComponent({ ...emptyTicket, name: "Doe", firstName: "John" });
    const inputs = getInputs();
    expect(inputs.name).toHaveValue("Doe");
    expect(inputs.firstName).toHaveValue("John");
  });

  it("shows validation errors when fields are empty", async () => {
    renderComponent({ ...emptyTicket, name: "", firstName: "" });
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => {
      expect(screen.getByText(/Le nom est obligatoire/i)).toBeInTheDocument();
      expect(screen.getByText(/Le prénom est obligatoire/i)).toBeInTheDocument();
    });
    expect(setTicketMock).not.toHaveBeenCalled();
    expect(onNextMock).not.toHaveBeenCalled();
  });

  it("submits valid data correctly", async () => {
    renderComponent();
    await fillInputs({ name: "Doe", firstName: "John" });
    fireEvent.submit(screen.getByTestId("form"));
    await waitFor(() => {
      expect(setTicketMock).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Doe", firstName: "John" })
      );
      expect(onNextMock).toHaveBeenCalled();
    });
  });
});
