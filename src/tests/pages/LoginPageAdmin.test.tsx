import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginAdmin from "../../pages/LoginPageAdmin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

vi.mock("@apollo/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client")>();
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useLazyQuery: vi.fn((query, { onCompleted }: any) => [
      vi.fn(async () => {
        if (onCompleted) await onCompleted(); 
        console.log(query)
        return Promise.resolve({ data: { login: { token: "fake-token" } } });
      }),
    ]),
  };
});

vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("../../context/AuthContext", () => ({ useAuth: vi.fn() }));

describe("LoginAdmin", () => {
  const mockNavigate = vi.fn();
  const mockGetInfos = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useNavigate as any).mockReturnValue(mockNavigate);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useAuth as any).mockReturnValue({ getInfos: mockGetInfos });
  });
  const setup = () => render(<LoginAdmin />);

  it("displays the logo and title", () => {
    setup();
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(
      screen.getByText("Connectez-vous à votre compte")
    ).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    setup();
    expect(screen.getByLabelText(/Adresse mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
  });

  it("allows you to enter email and password", () => {
    setup();
    const emailInput = screen.getByLabelText(
      /Adresse mail/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /Mot de passe/i
    ) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("mypassword");
  });

  it("manages the 'Stay logged in' button", () => {
    setup();
    const checkboxButton = screen.getByRole("checkbox", {
      name: /Rester connecté/i,
    });
    expect(checkboxButton).toHaveAttribute("aria-checked", "false");

    fireEvent.click(checkboxButton);
    expect(checkboxButton).toHaveAttribute("aria-checked", "true");

    fireEvent.click(checkboxButton);
    expect(checkboxButton).toHaveAttribute("aria-checked", "false");
  });

  it("redirects to the dashboard after successful login", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Adresse mail/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: "secure123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Me connecter/i }));
    await waitFor(() => {
      expect(mockGetInfos).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
