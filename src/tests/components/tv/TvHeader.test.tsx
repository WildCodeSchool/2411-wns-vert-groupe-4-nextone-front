import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { formattedDate } from "@/utils/formattedDate";
import { formattedTime } from "@/utils/formattedTime";

vi.mock("@/hooks/useGeolocation", () => ({
    useGeolocation: () => ({
        latitude: 48.85,
        longitude: 2.35,
        isLoading: false,
    }),
}));

vi.mock("@/utils/weatherIcons", () => ({
    getWeatherIcon: () => "☀️",
}));

describe("TvHeader component", () => {
    const mockLocation = { href: "" };

    beforeEach(() => {
        vi.resetModules();
        Object.defineProperty(window, "location", {
            value: mockLocation,
            writable: true,
        });
    });

    it("displays loading state when weather is loading", async () => {
        vi.doMock("@/hooks/useWeather", () => ({
        useWeather: () => ({
            isLoading: true,
            error: null,
        }),
        }));
        const { default: TvHeader } = await import(
            "@/components/tv/HeaderTv"
        );
        render( <TvHeader dateTime={new Date("2025-02-02T10:30:00")} tvKey="123"/> );
        expect(screen.getByText("Chargement...")).toBeInTheDocument();
    });

    it("displays fallback when weather returns an error", async () => {
        vi.doMock("@/hooks/useWeather", () => ({
            useWeather: () => ({
                isLoading: false,
                error: true,
            }),
        }));
        const { default: TvHeader } = await import(
            "@/components/tv/HeaderTv"
        );
        render( <TvHeader dateTime={new Date("2025-02-02T10:30:00")} tvKey="123"/>);
        expect(screen.getByText("☀️ --°C")).toBeInTheDocument();
    });
});
