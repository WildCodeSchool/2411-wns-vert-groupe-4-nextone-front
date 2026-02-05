import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CurrentTicket from "@/components/tv/CurrentTicket";
import { CurrentTicketProps } from "@/types/tv.types";

describe("CurrentTicket component", () => {
    it("renders the current ticket when tickets array is not empty", () => {
        const tickets: CurrentTicketProps["tickets"] = [
            {
                id: "t1",
                code: "T1",
                service: { name: "Odontologie 1" },
            },
        ];
        render(<CurrentTicket tickets={tickets} />);
        expect(screen.getByText("T1")).toBeInTheDocument();
        expect(screen.getByText(/Service Odontologie 1/i)).toBeInTheDocument();
    });
});
