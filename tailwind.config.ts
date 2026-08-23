import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

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
          DEFAULT: "#9B1B30",
          foreground: "#ffffff",
          container: "#FDE8EA",
          "on-container": "#7A0E20",
          fixed: "#FFE0E3",
          "fixed-dim": "#FFB3BA",
          "on-fixed": "#3A0410",
          "on-fixed-variant": "#8B1228",
        },
        secondary: {
          DEFAULT: "#D4AF37",
          foreground: "#ffffff",
          container: "#FDF0D5",
          "on-container": "#8B6914",
          fixed: "#FFF8E0",
          "fixed-dim": "#F5D98C",
          "on-fixed": "#3A2A00",
          "on-fixed-variant": "#755600",
        },
        tertiary: {
          DEFAULT: "#F8E8EA",
          foreground: "#9B1B30",
          container: "#FFD9DE",
          "on-container": "#7A0E20",
          fixed: "#FFF0F1",
          "fixed-dim": "#FFD0D6",
          "on-fixed": "#3A0410",
          "on-fixed-variant": "#8B1228",
        },
        destructive: { DEFAULT: "#ba1a1a", foreground: "#ffffff" },
        success: { DEFAULT: "#50c878", foreground: "#ffffff" },
        surface: {
          DEFAULT: "#FFFAFA",
          dim: "#F5F0F0",
          bright: "#FFFFFF",
          "container-lowest": "#FFFFFF",
          "container-low": "#FFF5F5",
          container: "#FDE8EA",
          "container-high": "#F5D0D4",
          "container-highest": "#E8B8BC",
        },
        outline: { DEFAULT: "#C4A0A3", variant: "#E8D5D7" },
        "background-cream": "#FFFAFA",
        "surface-white": "#ffffff",
        "on-surface": "#1b1c1c",
        "on-surface-variant": "#5C4B4D",
        "royal-ink": "#9B1B30",
        "marigold-light": "#D4AF37",
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
        card: "0px 4px 20px rgba(155, 27, 48, 0.05)",
        elevated: "0px 8px 32px rgba(155, 27, 48, 0.08)",
        modal: "0px 16px 48px rgba(155, 27, 48, 0.12)",
      },
      backgroundImage: {
        "gradient-pink": "linear-gradient(135deg, #9B1B30 0%, #D4AF37 50%, #FFD700 100%)",
        "gradient-primary": "linear-gradient(135deg, #9B1B30 0%, #D4AF37 50%, #FFD700 100%)",
        "gradient-royal": "linear-gradient(135deg, #7A0E20 0%, #9B1B30 50%, #7A0E20 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
        "gradient-warm": "linear-gradient(135deg, #FFFAFA 0%, #FDE8EA 50%, #FFD0D6 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-in-right": "slideInRight 0.25s ease-out",
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
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate as any],
}

export default config
