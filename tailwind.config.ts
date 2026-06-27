import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "16px", md: "24px", lg: "40px" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF21A5",
          foreground: "#FFFFFF",
          container: "#FF21A5",
          "on-container": "#8F005C",
          fixed: "#FFD9F0",
          "fixed-dim": "#FF8FD4",
          "on-fixed": "#3A0024",
          "on-fixed-variant": "#8F005C",
        },
        secondary: {
          DEFAULT: "#002366",
          foreground: "#FFFFFF",
          container: "#9CB4FE",
          "on-container": "#2A4486",
          fixed: "#DBE1FF",
          "fixed-dim": "#B3C5FF",
          "on-fixed": "#00174A",
          "on-fixed-variant": "#2A4386",
        },
        tertiary: {
          DEFAULT: "#D4AF37",
          foreground: "#FFFFFF",
          container: "#D3AE36",
          "on-container": "#544200",
          fixed: "#FFE088",
          "fixed-dim": "#E9C349",
          "on-fixed": "#241A00",
          "on-fixed-variant": "#574500",
        },
        destructive: { DEFAULT: "#BA1A1A", foreground: "#FFFFFF" },
        success: { DEFAULT: "#50C878", foreground: "#FFFFFF" },
        surface: {
          DEFAULT: "#FCF4F8",
          dim: "#DCD9D9",
          bright: "#FCF4F8",
          "container-lowest": "#FFFFFF",
          "container-low": "#F6F3F2",
          container: "#F0EDED",
          "container-high": "#EAE7E7",
          "container-highest": "#E4E2E1",
        },
        outline: { DEFAULT: "#887364", variant: "#DBC2B0" },
        cream: "#F5C6E4",
        "royal-ink": "#001B4D",
        "pink-accent": "#FF21A5",
        "pink-light": "#FF2E96",
        "emerald-growth": "#50C878",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Manrope", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Be Vietnam Pro", "system-ui", "sans-serif"],
        marathi: ["var(--font-marathi)", "Noto Sans Devanagari", "sans-serif"],
        mukta: ["Mukta", "Noto Sans Devanagari", "sans-serif"],
        poppins: ["Poppins", "Noto Sans Devanagari", "sans-serif"],
        hind: ["Hind", "Noto Sans Devanagari", "sans-serif"],
        anek: ["Anek Devanagari", "Noto Sans Devanagari", "sans-serif"],
        noto: ["Noto Sans Devanagari", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        base: "8px",
        gutter: "24px",
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        card: "0px 4px 20px rgba(0, 35, 102, 0.05)",
        elevated: "0px 8px 32px rgba(0, 35, 102, 0.08)",
        modal: "0px 16px 48px rgba(0, 35, 102, 0.12)",
      },
      backgroundImage: {
        "gradient-pink": "linear-gradient(135deg, #FF21A5 0%, #FF2E96 50%, #D4AF37 100%)",
        "gradient-royal": "linear-gradient(135deg, #002366 0%, #0047AB 50%, #002366 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
        "gradient-warm": "linear-gradient(135deg, #FCF4F8 0%, #F5C6E4 50%, #F0ADD6 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
