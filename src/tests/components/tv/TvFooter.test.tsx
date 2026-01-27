import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TvFooter from "@/components/tv/TvFooter";

vi.mock("../../../assets/images/Logo_NextOne_vert-noir.png", () => ({
  default: "test-logo.png",
}));

describe("TvFooter", () => {
    it("renders the logo", () => {
        render(<TvFooter />);
        const img = screen.getByAltText("Logo");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "test-logo.png");
    });

    it("renders the message text", () => {
        render(<TvFooter />);
        expect(screen.getByText(/Veuillez patienter/i)).toBeInTheDocument();
        expect(screen.getByText(/votre ticket sera appelé prochainement./i)).toBeInTheDocument();
    });
});
