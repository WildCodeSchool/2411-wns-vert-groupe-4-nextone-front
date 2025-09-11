import { toast } from "sonner"

export const useToast = () => {
  return {
    toastSuccess: (message: string, title = "Succès") =>
      toast.success(message, { description: title }),

    toastError: (message: string, title = "Erreur") =>
      toast.error(message, { description: title }),

    toastInfo: (message: string, title = "Info") =>
      toast(message, { description: title }),

    rawToast: toast, 
  }
}
