import { describe, it, expect } from "vitest";
import { ReactNode } from "react";
import { TicketProvider, useTicket } from "../../context/useContextTicket";
import { renderHook, act } from "@testing-library/react";
import { ticket, defaultTicket } from "../fixtures/ticket"

describe("TicketContext", () => {
    it("must modify the ticket when setTicket is called", () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <TicketProvider>{children}</TicketProvider>
        );
        const { result } = renderHook(() => useTicket(), { wrapper });
        act(() => {
            result.current.setTicket(ticket);
        });
        expect(result.current.ticket).toEqual(ticket);
    });
    
    it("must provide default ticket values", () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <TicketProvider>{children}</TicketProvider>
        );
        const { result } = renderHook(() => useTicket(), { wrapper });
        expect(result.current.ticket).toEqual(defaultTicket);
    });

    it("should generate an error if useTicket is used outside of TicketProvider", () => {
        expect(() => renderHook(() => useTicket())).toThrowError(
            "useTicket must be used within TicketProvider"
        );
    });
});
