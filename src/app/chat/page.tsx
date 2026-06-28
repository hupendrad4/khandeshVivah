"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"

 const messages = [
  { id: 1, from: "them", text: "नमस्ते, कसे आहात तुम्ही? प्रोफाईल आवडले तुमचे.", time: "१०:३० AM" },
  { id: 2, from: "me", text: "नमस्कार! मी ठीक आहे, धन्यवाद. तुमचे पण प्रोफाईल खूप छान आहे. तुम्ही जळगावमध्ये कुठे राहता?", time: "१०:३२ AM" },
  { id: 3, from: "them", text: "मी जळगाव शहरात पिंप्राळा भागात राहते. आपण कुटुंबाबद्दल बोलू शकतो का?", time: "१०:३५ AM" },
  { id: 4, from: "me", text: "हो नक्कीच, मला आनंद होईल. माझे वडील निवृत्त शिक्षक आहेत.", time: "१०:३७ AM" },
]

export default function ChatPage() {
  const { t, locale } = useI18n()
  const [messageText, setMessageText] = useState("")
  const [showTyping, setShowTyping] = useState(false)

  return (
    <>
      <div className="relative pt-16 pb-24 overflow-hidden min-h-screen bg-background-cream">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#D4AF37 0.5px, transparent 0.5px), radial-gradient(#D4AF37 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
          opacity: 0.15,
        }} />

        {/* Chat messages */}
        <div className="relative h-[calc(100vh-180px)] overflow-y-auto px-4 py-6 flex flex-col gap-4">
          <div className="flex justify-center my-2">
            <span className="px-4 py-1 bg-surface-container text-on-surface-variant text-caption rounded-full shadow-sm">
              {locale === "mr" ? "आज" : "Today"}
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} max-w-[85%] md:max-w-[70%] ${msg.from === "me" ? "ml-auto" : ""}`}>
              {msg.from === "them" ? (
                <div className="bg-surface-white border border-outline-variant/20 rounded-2xl rounded-tl-none p-4 shadow-sm relative">
                  <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-surface-white border-l-[10px] border-l-transparent" />
                  <p className="text-body-md text-on-surface-variant leading-relaxed">{msg.text}</p>
                  <div className="mt-1 flex justify-end">
                    <span className="text-[10px] text-outline font-medium">{msg.time}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-primary text-on-primary rounded-2xl rounded-tr-none p-4 shadow-md relative">
                  <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] border-t-primary border-r-[10px] border-r-transparent" />
                  <p className="text-body-md leading-relaxed">{msg.text}</p>
                  <div className="mt-1 flex justify-end gap-1 items-center">
                    <span className="text-[10px] text-white/80 font-medium">{msg.time}</span>
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {showTyping && (
            <div className="flex justify-start">
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-full px-4 py-2 flex gap-1">
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="fixed bottom-0 w-full z-50 bg-surface/80 backdrop-blur-md border-t border-outline-variant/20 py-3 px-4">
          <div className="max-w-container mx-auto flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="material-symbols-outlined p-2 text-primary hover:bg-primary-container/20 rounded-full transition-all">add_circle</button>
              <button className="material-symbols-outlined p-2 text-primary hover:bg-primary-container/20 rounded-full transition-all">sentiment_satisfied</button>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value)
                  if (e.target.value.length > 0) {
                    setShowTyping(true)
                    setTimeout(() => setShowTyping(false), 2000)
                  }
                }}
                placeholder={locale === "mr" ? "येथे संदेश लिहा..." : "Type a message..."}
                className="w-full bg-surface-container-low border-none rounded-full py-3 px-5 text-body-md focus:ring-2 focus:ring-primary-container/50 placeholder:text-outline/60 outline-none"
              />
            </div>
            <button
              onClick={() => { setMessageText(""); setShowTyping(false) }}
              className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {messageText.trim() ? "send" : "mic"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
