import { toast } from "sonner"

export const useToast = () => {
  return {
    toastSuccess: (message: string) =>
      toast.success(message),

    toastError: (message: string) =>
      toast.error(message),

    toastInfo: (message: string) =>
      toast(message),

    rawToast: toast, 
  }
}
