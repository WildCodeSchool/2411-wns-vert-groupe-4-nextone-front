import { Toaster } from "sonner";
import "./styles/toast.css"; 
;
 
export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        style: {
          borderRadius: "14px",
          padding: "16px",
          background: "#1F2511",
          color: "#FFFFFF",
          fontFamily: "Archivo, sans-serif",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        },
        className: "custom-toast",
      }}
    />
  );
}