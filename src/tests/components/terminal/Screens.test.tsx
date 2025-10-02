import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { getScreenComponent } from "../../../components/terminal/Screens";
import { TicketProvider } from "../../../context/useContextTicket";
import { Screen } from "../../../types/terminal";

const mocks:any = [];

describe("Screens", () => {
    const mockProps = {
        setCurrentScreen: vi.fn(),
        handleCancel: vi.fn(),
        isScanned: true,
    };

    const screens: { name: string; getElement: () => HTMLElement }[] = [
        { name: "chooseService", getElement: () => screen.getByText(/Service/i) },
        { name: "persoInfo", getElement: () => screen.getByLabelText("Votre nom ?") },
        { name: "contactInfo", getElement: () => screen.getByLabelText("Votre adresse mail ?") },
        { name: "successTicketPage", getElement: () => screen.getByText(/Ticket/i) },
        { name: "phone", getElement: () => screen.getByText(/Bonjour/i) },
    ];

    screens.forEach(({ name, getElement }) => {
        it(`renders component for screen "${name}"`, () => {
            render(
                <MemoryRouter>
                <MockedProvider mocks={mocks} addTypename={false}>
                    <TicketProvider>
                    {getScreenComponent(name as Screen, mockProps)}
                    </TicketProvider>
                </MockedProvider>
                </MemoryRouter>
            );
            expect(getElement()).toBeInTheDocument();
        });
    });

    it("returns null for unknown screen", () => {
        const result = getScreenComponent("unknown" as Screen, mockProps);
        expect(result).toBeNull();
    });
});
