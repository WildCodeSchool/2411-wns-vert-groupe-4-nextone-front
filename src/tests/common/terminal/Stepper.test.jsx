import { render, screen } from "@testing-library/react";
import Stepper from "../../../common/terminal/Stepper";
import { describe, it, expect } from "vitest";
import steps from "../../../utils/constants/steps";

describe("Stepper", () => {
    it("renders all steps", () => {
        render(<Stepper currentStep={1} />);
        steps.forEach(step => {
        expect(screen.getByText(step.label)).toBeInTheDocument();
        });
    });

    it("styles steps correctly (active, completed, pending)", () => {
        const currentStep = 3;
        render(<Stepper currentStep={currentStep} />);
        steps.forEach((step, i) => {
        const stepNumber = i + 1;
        const stepCircle = screen.getByTestId(`step-circle-${stepNumber}`);
        const stepLabel = screen.getByText(step.label);
        if (stepNumber < currentStep) {
            expect(stepCircle).toHaveClass("bg-primary", "text-white");
            expect(stepLabel).toHaveClass("text-primary", "font-semibold");
        } else if (stepNumber === currentStep) {
            expect(stepCircle).toHaveClass("bg-primary", "text-white");
            expect(stepLabel).toHaveClass("text-primary", "font-semibold");
        } else {
            expect(stepCircle).toHaveClass("bg-white", "text-gray-400");
            expect(stepLabel).toHaveClass("text-gray-400");
        }
        });
    });

    it("renders progress bar with correct width", () => {
        const currentStep = 2;
        render(<Stepper currentStep={currentStep} />);
        const progressBar = screen.getByRole("progressbar");
        expect(progressBar.style.width).toBe(`${(currentStep / steps.length) * 100}%`);
    });
});
