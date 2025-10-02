import { render, screen } from "@testing-library/react";
import CompanyIllustration from "../../../common/terminal/CompanyIllustration";
import { vi, describe, it, expect } from "vitest";

vi.mock("../../../assets/company.png");
vi.mock("../../../assets/nextone-white.png");

describe("CompanyIllustration", () => {
  it("renders the company image", () => {
    render(<CompanyIllustration />);
    const companyImg = screen.getByAltText(/image-entreprise/i);
    expect(companyImg).toBeInTheDocument();
  });

  it("renders the NextOne logo", () => {
    render(<CompanyIllustration />);
    const logo = screen.getByAltText(/logo NextOne/i);
    expect(logo).toBeInTheDocument();
  });

  it("renders the powered by text", () => {
    render(<CompanyIllustration />);
    expect(screen.getByText(/Powered by/i)).toBeInTheDocument();
    expect(screen.getByText(/NextOne/i)).toBeInTheDocument();
  });
});
