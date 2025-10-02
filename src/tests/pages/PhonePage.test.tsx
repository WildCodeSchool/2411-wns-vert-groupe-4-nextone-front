import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PhonePage from "../../pages/PhonePage";
import { within } from "@testing-library/react";
import { ticket } from "../fixtures/ticket";

vi.mock("../../context/useContextTicket", () => ({
  useTicket: () => ({ ticket: ticket }),
}));

const renderPhonePage = (initialEntries = ["/phone"]) =>
    render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/phone" element={<PhonePage />} />
            </Routes>
        </MemoryRouter>
    );

describe("PhonePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders ticket header with logo and code", () => {
        renderPhonePage();
        expect(screen.getByAltText("Logo")).toBeInTheDocument();
        expect(screen.getByText(ticket.code!)).toBeInTheDocument();
    });

    it("renders greeting and service info", () => {
        renderPhonePage();
        expect(screen.getByText(`Bonjour ${ticket.firstName},`)).toBeInTheDocument();
        expect(screen.getByText(`Vous êtes en attente au service ${ticket.serviceName}.`)).toBeInTheDocument();
    });

    it("toggles drawer when button is clicked", () => {
        renderPhonePage();
        const button = screen.getByText(/Voir mes informations de ticket/i);
        // Drawer initialement fermé
        expect(screen.queryByText(/Informations du ticket/i)).not.toBeInTheDocument();
        // Ouvre le drawer
        fireEvent.click(button);
        const drawer = screen.getByText(/Informations du ticket/i).parentElement;
        expect(drawer).toBeInTheDocument();
        // Vérifie tous les champs du ticket dans le drawer
        const fields = {
            "Service :": ticket.serviceName,
            "Numéro de ticket :": ticket.code,
            "Nom :": ticket.name,
            "Prénom :": ticket.firstName,
            "Email :": ticket.email,
            "Téléphone :": ticket.phone,
        };
        Object.entries(fields).forEach(([label, value]) => {
            const labelElements = within(drawer!).getAllByText(label, { exact: false });
            const matchingP = labelElements.find((el) => {
                const p = el.closest("p");
                return p && p.textContent?.includes(value!);
            })?.closest("p");
            expect(matchingP).toBeInTheDocument();
            expect(within(matchingP!).getByText(value!)).toBeInTheDocument();
        });
        // Ferme le drawer après avoir vérifié tous les champs
        fireEvent.click(screen.getByText(/Fermer/i));
        expect(screen.queryByText(/Informations du ticket/i)).not.toBeInTheDocument();
    });

    it("renders QR ticket from URL param if present", () => {
        const ticketFromUrl = { ...ticket };
        const encodedTicket = encodeURIComponent(JSON.stringify(ticketFromUrl));
        renderPhonePage([`/phone?ticket=${encodedTicket}`]);
        expect(screen.getByText(ticketFromUrl.code!)).toBeInTheDocument();
    });

    it("renders footer text", () => {
        renderPhonePage();
        expect(screen.getByText(/Powered by NextOne/i)).toBeInTheDocument();
    });
});
