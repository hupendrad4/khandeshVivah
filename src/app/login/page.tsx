"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/glass-card"
import { Heart, Shield, Sparkles, ArrowRight, Star, Mail, Phone, Loader2, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function LoginPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [step, setStep] = useState<"phone" | "otp" | "email">("phone")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const handleSendOtp = async () => {
    if (phone.length < 10) return
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")
      setOtpSent(true)
      setStep("otp")
      toast.success(t("auth.otpSent"))
      setResendTimer(30)
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || (locale === "mr" ? "OTP पाठवता आला नाही" : "Failed to send OTP"))
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("")
    if (otpValue.length < 6) return
    setVerifyingOtp(true)
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: phone, otp: otpValue }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid OTP")
      toast.success(t("auth.loginSuccess"))
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.message || (locale === "mr" ? "OTP चुकला आहे. पुन्हा प्रयत्न करा" : "Invalid OTP"))
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error(locale === "mr" ? "ईमेल आणि पासवर्ड टाका" : "Email and password required")
      return
    }
    setLoggingIn(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid credentials")
      toast.success(t("auth.loginSuccess"))
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.message || t("auth.loginFailed"))
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF21A5]/10 via-[#F5C6E4] to-[#002366]/10 p-12 lg:flex">
          <div className="absolute inset-0 bg-mandala-ornamental opacity-30" />
          <div className="relative z-10 max-w-md text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF21A5] to-[#FF2E96] shadow-lg shadow-[#FF21A5]/30">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h2 className="mb-3 text-3xl font-bold font-heading text-[#1b1c1c]">{t("app.name")}</h2>
              <p className="mb-8 text-lg text-[#554336]">{t("app.tagline")}</p>
            </motion.div>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "100% Verified Profiles" },
                { icon: Star, text: "AI Matchmaking" },
                { icon: Heart, text: "Privacy First" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm px-5 py-3 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF21A5]/10">
                    <item.icon className="h-5 w-5 text-[#FF21A5]" />
                  </div>
                  <span className="text-sm font-medium text-[#1b1c1c]">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-xs text-[#887364]"
            >
              Join 10,000+ Khandesh families already connected
            </motion.p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
          <div className="w-full max-w-sm">
            <motion.div {...fadeUp} className="mb-8 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF21A5] to-[#FF2E96] shadow-lg shadow-[#FF21A5]/30">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#1b1c1c]">{t("app.name")}</h1>
              <p className="text-xs text-[#887364]">{t("app.tagline")}</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <GlassCard gradient="pink" hoverEffect="none">
                <div className="p-8">
                  <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-[#1b1c1c]">
                      {step === "phone" ? t("nav.login") : t("login.verifyOtp")}
                    </h2>
                    <p className="mt-1 text-sm text-[#554336]">
                      {step === "phone" ? t("login.enterPhone") : t("login.enterOtp")}
                    </p>
                  </div>

                  {step === "phone" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#554336]">{t("common.mobile")}</label>
                        <div className="flex items-center gap-3 rounded-xl border-2 border-[#E4E2E1] bg-[#F5C6E4] px-4 py-3 transition-all focus-within:border-[#FF21A5] focus-within:shadow-sm focus-within:shadow-[#FF21A5]/10">
                          <Phone className="h-4 w-4 text-[#887364]" />
                          <span className="text-sm font-medium text-[#887364]">+91</span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder={t("login.phonePlaceholder")}
                            className="flex-1 bg-transparent outline-none text-sm text-[#1b1c1c] placeholder:text-[#887364]"
                            maxLength={10}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSendOtp}
                        disabled={phone.length < 10 || sendingOtp}
                        className="w-full"
                        size="lg"
                      >
                        {sendingOtp ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        {t("login.sendOtp")}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#E4E2E1]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white/90 px-2 text-[#887364]">{t("common.or")}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full gap-3" size="lg">
                        <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        {t("login.googleLogin")}
                      </Button>

                      <Button
                        variant="glass"
                        className="w-full gap-2"
                        size="lg"
                        onClick={() => setStep("email")}
                      >
                        <Mail className="h-4 w-4" />
                        {t("auth.loginWithEmail")}
                      </Button>
                    </div>
                  ) : step === "otp" ? (
                    <div className="space-y-5">
                      <div className="text-center text-sm text-[#554336]">
                        {t("auth.enterOtp", { identifier: `+91 ${phone}` })}
                      </div>
                      <div className="flex justify-center gap-3">
                        {otp.map((digit, i) => (
                          <input
                            key={i}
                            type="tel"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "")
                              const newOtp = [...otp]
                              newOtp[i] = val
                              setOtp(newOtp)
                              if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
                            }}
                            id={`otp-${i}`}
                            className="h-14 w-12 rounded-xl border-2 border-[#E4E2E1] bg-[#F5C6E4] text-center text-xl font-bold text-[#1b1c1c] outline-none transition-all focus:border-[#FF21A5] focus:bg-white focus:shadow-md focus:shadow-[#FF21A5]/10"
                          />
                        ))}
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleVerifyOtp}
                        disabled={otp.join("").length < 6 || verifyingOtp}
                      >
                        {verifyingOtp ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        {t("login.verifyOtp")}
                      </Button>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => { setStep("phone"); setOtp(["","","","","",""]); setOtpSent(false) }}
                          className="text-sm font-medium text-[#FF21A5] transition-colors hover:text-[#E61E94]"
                        >
                          {t("login.changeNumber")}
                        </button>
                        {resendTimer > 0 ? (
                          <span className="text-sm text-[#887364]">
                            {resendTimer}{locale === "mr" ? " सेकंद" : "s"}
                          </span>
                        ) : (
                          <button
                            onClick={handleSendOtp}
                            disabled={sendingOtp}
                            className="text-sm font-medium text-[#FF21A5] transition-colors hover:text-[#E61E94]"
                          >
                            {locale === "mr" ? "पुन्हा पाठवा" : "Resend OTP"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-[#554336]">{t("auth.emailAddress")}</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full rounded-xl border-2 border-[#E4E2E1] bg-[#F5C6E4] px-4 py-3 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-[#554336]">{t("auth.password")}</Label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full rounded-xl border-2 border-[#E4E2E1] bg-[#F5C6E4] px-4 py-3 text-sm"
                        />
                      </div>
                      <Button
                        onClick={handleEmailLogin}
                        disabled={!email || !password || loggingIn}
                        className="w-full"
                        size="lg"
                      >
                        {loggingIn ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        {t("auth.login")}
                      </Button>
                      <button
                        onClick={() => setStep("phone")}
                        className="w-full text-center text-sm font-medium text-[#FF21A5] transition-colors hover:text-[#E61E94]"
                      >
                        {t("auth.loginWithMobile")}
                      </button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 flex items-center justify-center gap-4 text-xs text-[#887364]"
            >
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> {t("login.secure")}</span>
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> {t("login.private")}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-sm text-[#887364]"
            >
              {t("login.noAccount")}{" "}
              <Link href="/register" className="font-semibold text-[#FF21A5] transition-colors hover:text-[#E61E94]">
                {t("nav.register")} <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </motion.p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
