"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { useSubscription, onPremiumChange, isExternalPremium } from "@/lib/use-subscription"
import { SubscriptionModal } from "@/components/SubscriptionModal"
import { ExpiryReminderBanner } from "@/components/ExpiryReminderBanner"
import { useAuthStore } from "@/store/auth-store"
import Link from "next/link"
import toast from "react-hot-toast"
import { MainLayout } from "@/components/layout/MainLayout"

interface ChatContact {
  id: string
  name: string
  lastMsg: string
  time: string
  unread: number
  online: boolean
  avatar: string
}

const contacts: ChatContact[] = [
  { id: "1", name: "प्रिया पाटील", lastMsg: "हो, मला आवडेल. उद्या भेटूया का?", time: "१०:३० AM", unread: 2, online: true, avatar: "प्रि" },
  { id: "2", name: "स्नेहा महाजन", lastMsg: "धन्यवाद! तुमचे प्रोफाईल पाहून खूप आनंद झाला.", time: "९:१५ AM", unread: 0, online: false, avatar: "स्ने" },
  { id: "3", name: "आरती चौधरी", lastMsg: "मी धुळ्यात आहे. तुम्ही कुठे राहता?", time: "काल", unread: 1, online: true, avatar: "आर" },
]

const messages = [
  { id: 1, from: "them", text: "नमस्ते, कसे आहात तुम्ही? प्रोफाईल आवडले तुमचे.", time: "१०:३० AM" },
  { id: 2, from: "me", text: "नमस्कार! मी ठीक आहे, धन्यवाद. तुमचे पण प्रोफाईल खूप छान आहे.", time: "१०:३२ AM" },
  { id: 3, from: "them", text: "मी जळगाव शहरात पिंप्राळा भागात राहते. आपण कुटुंबाबद्दल बोलू शकतो का?", time: "१०:३५ AM" },
  { id: 4, from: "me", text: "हो नक्कीच, मला आनंद होईल. माझे वडील निवृत्त शिक्षक आहेत.", time: "१०:३७ AM" },
]

export default function ChatPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const subscription = useSubscription()
  const [activeContact, setActiveContact] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [showTyping, setShowTyping] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("gold")
  const [isPremium, setIsPremium] = useState(isExternalPremium() || !!user?.isPremium)

  useEffect(() => {
    const unsub = onPremiumChange((v) => {
      console.log("[chat] premium signal received:", v)
      setIsPremium(v)
    })
    return unsub
  }, [])

  const isExpired = user?.subscriptionEndDate
    ? new Date(user.subscriptionEndDate).getTime() < Date.now()
    : false

  useEffect(() => {
    if (isExpired) {
      router.push("/premium")
    }
  }, [isExpired, router])

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    setMessageText("")
  }

  return (
    <MainLayout>
      {isPremium ? (
        <>
          <ExpiryReminderBanner />
          <div className="relative min-h-[calc(100vh-64px)] bg-background-cream">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "radial-gradient(#D4AF37 0.5px, transparent 0.5px), radial-gradient(#D4AF37 0.5px, transparent 0.5px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
              opacity: 0.12,
            }} />

            <div className="relative h-[calc(100vh-64px)] flex">
              <aside className={`w-full md:w-80 bg-surface-container-low border-r border-outline-variant/20 flex flex-col ${activeContact ? "hidden md:flex" : "flex"}`}>
                <div className="p-4 border-b border-outline-variant/20">
                  <h2 className="font-headline-md text-headline-md text-royal-ink flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    {locale === "mr" ? "संदेश" : "Messages"}
                  </h2>
                  <div className="relative mt-3">
                    <input
                      type="text"
                      placeholder={locale === "mr" ? "संपर्क शोधा..." : "Search contacts..."}
                      className="w-full bg-background-cream border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveContact(c.id)}
                      className={`w-full p-4 flex items-center gap-3 transition-colors hover:bg-primary-container/10 text-left ${
                        activeContact === c.id ? "bg-primary-container/20 border-l-4 border-primary" : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{c.avatar}</span>
                        {c.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-growth border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-on-surface truncate">{c.name}</h3>
                          <span className="text-[10px] text-on-surface-variant shrink-0">{c.time}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant truncate">{c.lastMsg}</p>
                      </div>
                      {c.unread > 0 && (
                        <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </aside>

              <main className={`flex-1 flex flex-col ${!activeContact ? "hidden md:flex" : "flex"}`}>
                {activeContact ? (
                  <>
                    <div className="p-4 border-b border-outline-variant/20 bg-surface-white flex items-center gap-3">
                      <button onClick={() => setActiveContact(null)} className="md:hidden p-1">
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{contacts.find(c => c.id === activeContact)?.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface">{contacts.find(c => c.id === activeContact)?.name}</h3>
                        <p className="text-xs text-emerald-growth">{locale === "mr" ? "ऑनलाइन" : "Online"}</p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">call</span>
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="flex justify-center my-2">
                        <span className="px-4 py-1 bg-surface-container text-on-surface-variant text-caption rounded-full">
                          {locale === "mr" ? "आज" : "Today"}
                        </span>
                      </div>
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] md:max-w-[70%] p-3 rounded-2xl ${
                            msg.from === "me"
                              ? "bg-primary text-on-primary rounded-tr-none"
                              : "bg-surface-white border border-outline-variant/20 rounded-tl-none"
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className={`mt-1 flex justify-end items-center gap-1 ${
                              msg.from === "me" ? "text-white/70" : "text-outline"
                            }`}>
                              <span className="text-[10px]">{msg.time}</span>
                              {msg.from === "me" && (
                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {showTyping && (
                        <div className="flex justify-start">
                          <div className="bg-surface-container border border-outline-variant/20 rounded-full px-4 py-2 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-surface-white border-t border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <button className="material-symbols-outlined p-2 text-primary hover:bg-primary-container/20 rounded-full">add_circle</button>
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
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={locale === "mr" ? "येथे संदेश लिहा..." : "Type a message..."}
                            className="w-full bg-background-cream border-none rounded-full py-2.5 px-5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                          />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          className="bg-primary text-on-primary w-11 h-11 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {messageText.trim() ? "send" : "mic"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <span className="material-symbols-outlined text-6xl text-outline mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface-variant">
                        {locale === "mr" ? "तुमचा संदेश पाठवा" : "Send a message"}
                      </h3>
                      <p className="text-on-surface-variant mt-2">
                        {locale === "mr" ? "डावीकडील यादीतून एखादा संपर्क निवडा." : "Select a contact from the left."}
                      </p>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-[calc(100vh-64px)] bg-background-cream flex items-center justify-center p-4">
          <div className="max-w-md text-center space-y-6">
            <span className="material-symbols-outlined text-7xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <h2 className="font-headline-lg text-headline-lg text-royal-ink">
              {locale === "mr" ? "चॅट करण्यासाठी सबस्क्रिप्शन आवश्यक" : "Subscription Required for Chat"}
            </h2>
            <p className="text-on-surface-variant">
              {locale === "mr"
                ? "प्रीमियम सबस्क्रिप्शन खरेदी करा आणि सर्व सदस्यांशी थेट संवाद साधा."
                : "Get a premium subscription and chat directly with all members."}
            </p>
            <button
              onClick={() => subscription.setShowModal(true)}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-on-primary-container transition-all"
            >
              {locale === "mr" ? "सबस्क्राईब करा" : "Subscribe Now"}
            </button>
            <div>
              <Link href="/" className="text-primary text-sm hover:underline">
                {locale === "mr" ? "मुख्यपृष्ठावर जा" : "Go to Home"}
              </Link>
            </div>
          </div>

          <SubscriptionModal
            open={subscription.showModal}
            onClose={() => subscription.setShowModal(false)}
            plans={subscription.plans}
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            onSubscribe={subscription.handleSubscribe}
            isProcessing={subscription.isProcessing}
            paymentPhase={subscription.paymentPhase}
            paymentMethod={subscription.paymentMethod}
            onPaymentMethodChange={subscription.setPaymentMethod}
            onPayNow={subscription.completePayment}
          />
        </div>
      )}
    </MainLayout>
  )
}
