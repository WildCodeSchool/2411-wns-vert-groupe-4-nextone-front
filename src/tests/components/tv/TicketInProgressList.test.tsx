import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TicketInProgressList from "@/components/tv/TicketInProgressList";

const makeTickets = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
        id: `t${i + 1}`,
        code: `T${i + 1}`,
        service: { name: `Service ${i + 1}` },
    }));

describe("TicketInProgressList", () => {
    it("renders the header", () => {
        render(<TicketInProgressList tickets={makeTickets(1)} />);
        expect(screen.getByText("Tickets en cours")).toBeInTheDocument();
    });

    it("renders tickets from index 1 to 5", () => {
        const tickets = makeTickets(6);
        render(<TicketInProgressList tickets={tickets} />);
        expect(screen.queryByText("T1")).not.toBeInTheDocument(); //car c'est le currentTicket
        for (let i = 2; i <= 6; i++) {
            expect(screen.getByText(`T${i}`)).toBeInTheDocument();
            expect(screen.getByText(`Service Service ${i}`)).toBeInTheDocument();
        }
    });

    it("renders nothing if there are no tickets after slicing", () => {
        const tickets = makeTickets(1);
        render(<TicketInProgressList tickets={tickets} />);
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
});
