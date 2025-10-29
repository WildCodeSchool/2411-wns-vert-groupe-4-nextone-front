import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import InputWithLabel from "../../components/dashboard/InputWithLabel";

describe("InputWithLabel", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    });

    const renderInput = (props = {}) =>
        render(<InputWithLabel label="Default label" name="default" {...props} />);

    it("renders label and input field", () => {
        renderInput({ label: "Email", name: "email" });
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    it("uses `name` as id if no `id` is provided", () => {
        renderInput({ label: "Username", name: "username" });
        const input = screen.getByLabelText(/Username/i);
        expect(input).toHaveAttribute("id", "username");
    });

    it("prioritizes `id` over `name` when both are provided", () => {
        renderInput({ label: "Username", name: "username", id: "custom-id" });
        const input = screen.getByLabelText(/Username/i);
        expect(input).toHaveAttribute("id", "custom-id");
    });

    it("shows * when the field is required", () => {
        renderInput({ label: "Password", name: "password", required: true });
        expect(screen.getByText(/Password \*/i)).toBeInTheDocument();
    });

    it("applies error styles and shows an error message", () => {
        renderInput({ label: "Email", name: "email", error: "Invalid email", required: true });
        const input = screen.getByLabelText(/Email/i);
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("forwards extra props to the input (e.g. placeholder)", () => {
        renderInput({ label: "Search", name: "search", placeholder: "Type a keyword" });
        expect(screen.getByPlaceholderText("Type a keyword")).toBeInTheDocument();
    });

    it("accepts user input", async () => {
        renderInput({ label: "Username", name: "username" });
        const input = screen.getByLabelText(/Username/i);
        await user.type(input, "OcéaneDev");
        expect(input).toHaveValue("OcéaneDev");
    });
});
