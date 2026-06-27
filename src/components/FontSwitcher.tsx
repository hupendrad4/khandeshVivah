"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const fonts = [
  { id: "default", label: "Default", preview: "Manrope + Be Vietnam Pro", heading: "Manrope", body: "Be Vietnam Pro" },
  { id: "mukta", label: "Mukta", preview: "मराठी लिपी (Ek Type)", heading: "Mukta", body: "Mukta" },
  { id: "poppins", label: "Poppins", preview: "Modern geometric", heading: "Poppins", body: "Poppins" },
  { id: "hind", label: "Hind", preview: "मराठी लिपी (Indian Type)", heading: "Hind", body: "Hind" },
  { id: "inter", label: "Inter", preview: "Clean modern sans", heading: "Inter", body: "Inter" },
]

const bodyFonts: Record<string, string> = {
  default: "'Be Vietnam Pro', 'Noto Sans Devanagari', system-ui, sans-serif",
  mukta: "'Mukta', 'Noto Sans Devanagari', sans-serif",
  poppins: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  hind: "'Hind', 'Noto Sans Devanagari', sans-serif",
  inter: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif",
}

const headingFonts: Record<string, string> = {
  default: "'Manrope', 'Noto Sans Devanagari', system-ui, sans-serif",
  mukta: "'Mukta', 'Noto Sans Devanagari', sans-serif",
  poppins: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  hind: "'Hind', 'Noto Sans Devanagari', sans-serif",
  inter: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif",
}

const romanticFonts: Record<string, string> = {
  default: "'Playfair Display', 'Noto Sans Devanagari', serif",
  mukta: "'Mukta', 'Noto Sans Devanagari', sans-serif",
  poppins: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  hind: "'Hind', 'Noto Sans Devanagari', sans-serif",
  inter: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif",
}

function applyFont(id: string) {
  const styleId = "khandesh-font-style"
  let style = document.getElementById(styleId) as HTMLStyleElement
  if (!style) {
    style = document.createElement("style")
    style.id = styleId
    document.head.appendChild(style)
  }
  style.textContent = `
    body, .font-body, input, textarea, select, button {
      font-family: ${bodyFonts[id]} !important;
    }
    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: ${headingFonts[id]} !important;
    }
    .font-marathi {
      font-family: ${bodyFonts[id]} !important;
    }
    .font-romantic {
      font-family: ${romanticFonts[id]} !important;
    }
  `
}

export function FontSwitcher() {
  const [current, setCurrent] = useState("default")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("khandesh-font") || "default"
    setCurrent(saved)
    applyFont(saved)
  }, [])

  function select(id: string) {
    setCurrent(id)
    localStorage.setItem("khandesh-font", id)
    applyFont(id)
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="mb-2 flex flex-col gap-1 rounded-2xl bg-white border border-[#F2F2F7] p-2 shadow-elevated"
          >
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => select(f.id)}
                className={`rounded-xl px-4 py-2.5 text-left text-sm transition-all ${
                  current === f.id
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "text-[#3A3A3C] hover:bg-[#F2F2F7]"
                }`}
              >
                <div className="font-semibold">{f.label}</div>
                <div className={`text-[11px] ${current === f.id ? "text-white/70" : "text-[#8E8E93]"}`}>
                  {f.heading} + {f.body}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow transition-all duration-300 hover:scale-105 active:scale-90"
        title="Switch font"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" />
        </svg>
      </button>
    </div>
  )
}
