import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#fff",
          color: "#1b1c1c",
          boxShadow: "0px 8px 32px rgba(155, 27, 48, 0.12)",
          border: "1px solid #E8B8BC",
        },
        success: {
          iconTheme: { primary: "#50C878", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#BA1A1A", secondary: "#fff" },
        },
      }}
    />
  )
}
