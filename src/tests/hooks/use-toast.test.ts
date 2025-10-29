import { describe, it, expect, vi, beforeEach } from "vitest";
import { useToast } from "../../hooks/use-toast";
import { toast } from "sonner";

type ToastFn = ((message: string) => void) & {
  success: (message: string) => void;
  error: (message: string) => void;
};

vi.mock("sonner", () => {
  const toastFn = vi.fn() as unknown as ToastFn;
  toastFn.success = vi.fn();
  toastFn.error = vi.fn();
  return { toast: toastFn };
});

describe("useToast", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("must call toast.success with the correct message", () => {
        const { toastSuccess } = useToast();
        toastSuccess("Success message");

        expect(toast.success).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith("Success message");
    });

    it("must call toast.error with the correct message", () => {
        const { toastError } = useToast();
        toastError("Error message");

        expect(toast.error).toHaveBeenCalledTimes(1);
        expect(toast.error).toHaveBeenCalledWith("Error message");
    });

    it("must call toast with the correct message", () => {
        const { toastInfo } = useToast();
        toastInfo("Info message");

        expect(toast).toHaveBeenCalledTimes(1);
        expect(toast).toHaveBeenCalledWith("Info message");
    });

    it("must return the raw toast object", () => {
        const { rawToast } = useToast();
        expect(rawToast).toBe(toast);
    });
});
