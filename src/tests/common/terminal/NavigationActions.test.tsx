import { render, screen, fireEvent } from "@testing-library/react";
import NavigationActions from "../../../common/terminal/NavigationActions";
import { describe, it, expect, vi } from "vitest";

describe("NavigationActions", () => {
  const renderComponent = (props = {}) => {
    render(<NavigationActions {...props} />);
  };

  it("renders all buttons correctly", () => {
    renderComponent({ onBack: () => {}, onNext: () => {}, onCancel: () => {} });
    expect(screen.getByText(/Retour/i)).toBeInTheDocument();
    expect(screen.getByText(/Continuer/i)).toBeInTheDocument();
    expect(screen.getByText(/Annuler/i)).toBeInTheDocument();
  });

  it("does not render cancel button if onCancel is not provided", () => {
    renderComponent({ onBack: () => {}, onNext: () => {} });
    expect(screen.queryByText(/Annuler/i)).toBeNull();
  });

  it("does nothing if callbacks are not provided", () => {
    renderComponent();
    const retourBtn = screen.getByText(/Retour/i);
    const continuerBtn = screen.getByText(/Continuer/i);
    expect(() => fireEvent.click(retourBtn)).not.toThrow();
    expect(() => fireEvent.click(continuerBtn)).not.toThrow();
  });
});
