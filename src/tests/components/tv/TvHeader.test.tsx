import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TvHeader from "@/components/tv/tvHeader";
import { formattedDate } from "@/utils/formattedDate";
import { formattedTime } from "@/utils/formattedTime";

const mockLocation = { href: "" };

describe("TvHeader component", () => {
    beforeEach(() => {
        Object.defineProperty(window, "location", {
            value: mockLocation,
            writable: true,
        });
    });

    it("renders header correctly", () => {
        const date = new Date("2025-02-02T10:30:00");
        render(<TvHeader dateTime={date} />);
        const retourBtn = screen.getByText("Retour");
        expect(retourBtn).toBeInTheDocument();
        expect(screen.getByText("☀️ 27°C")).toBeInTheDocument();
        expect(screen.getByText(formattedDate(date))).toBeInTheDocument();
        expect(screen.getByText(formattedTime(date))).toBeInTheDocument();
    });

    it("redirects to /tv when clicking Retour", () => {
        const date = new Date("2025-02-02T10:30:00");
        render(<TvHeader dateTime={date} />);
        const retourBtn = screen.getByText("Retour");
        fireEvent.click(retourBtn);
        expect(window.location.href).toBe("/tv");
    });
});
