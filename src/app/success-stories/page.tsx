"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"

export default function SuccessStoriesPage() {
  const { t, locale } = useI18n()
  const { user } = useAuthStore()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ partnerName: "", title: "", content: "" })

  useEffect(() => {
    fetch("/api/success-stories")
      .then(r => r.json())
      .then(data => {
        if (data.success) setStories(data.stories)
        else setStories([])
      })
      .catch(() => setStories([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!user?.id || !formData.title || !formData.content) {
      toast.error(locale === "mr" ? "कृपया सर्व फील्ड भरा" : "Please fill all required fields")
      return
    }
    const res = await fetch("/api/success-stories/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId: user.id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success(locale === "mr" ? "तुमची कथा सबमिट केली! प्रशासनाद्वारे मंजूरीनंतर प्रकाशित केली जाईल." : "Story submitted! Will be published after admin approval.")
      setShowForm(false)
      setFormData({ partnerName: "", title: "", content: "" })
    } else {
      toast.error(locale === "mr" ? "कथा सबमिट करण्यात अडचण" : "Failed to submit story")
    }
  }

  return (
    <MainLayout>
      <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/80 via-[#D4AF37]/70 to-[#9B1B30]/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-label-md mb-4">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            {locale === "mr" ? "यशोगाथा" : "Success Stories"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">{t("home.successStories")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto">
            {locale === "mr"
              ? "खांदेश विवाहमुळे जुळलेली खरी प्रेम कथा. आमच्या यशस्वी जोडप्यांच्या कथा वाचा."
              : "Real love stories matched through Khandesh Vivah. Read our successful couples' stories."}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span> {t("common.back")}
        </Link>

        {/* Share Your Story */}
        {user?.id && (
          <div className="mb-10 text-center">
            {showForm ? (
              <Card className="bg-surface-container-low border-0 shadow-sm max-w-lg mx-auto">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-royal-ink">
                    {locale === "mr" ? "तुमची कथा शेअर करा" : "Share Your Story"}
                  </h3>
                  <input type="text" value={formData.partnerName} onChange={e => setFormData(p => ({ ...p, partnerName: e.target.value }))}
                    placeholder={locale === "mr" ? "जोडीदाराचे नाव" : "Partner's name"}
                    className="w-full bg-background-cream border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder={locale === "mr" ? "शीर्षक (उदा. आमची प्रेमकथा)" : "Title (e.g. Our Love Story)"}
                    className="w-full bg-background-cream border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                    placeholder={locale === "mr" ? "तुमची कथा..." : "Your story..."}
                    className="w-full bg-background-cream border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none h-32" />
                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} className="flex-1">
                      {locale === "mr" ? "कथा सबमिट करा" : "Submit Story"}
                    </Button>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      {t("common.cancel")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button variant="outline" onClick={() => setShowForm(true)} className="gap-2">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                {locale === "mr" ? "तुमची कथा शेअर करा" : "Share Your Story"}
              </Button>
            )}
          </div>
        )}

        {/* Stories Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1,2,3,4].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="h-32 bg-surface-container-low" />
                <CardContent className="pt-10">
                  <div className="h-5 bg-surface-container-low rounded w-2/3 mb-3" />
                  <div className="h-3 bg-surface-container-low rounded w-1/3 mb-3" />
                  <div className="h-3 bg-surface-container-low rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-outline mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <h3 className="font-headline-md text-headline-md text-on-surface-variant">
              {locale === "mr" ? "अजून कोणत्याही कथा नाहीत" : "No stories yet"}
            </h3>
            <p className="text-on-surface-variant mt-2">
              {locale === "mr" ? "पहिली कथा शेअर करणारे तुम्ही व्हा!" : "Be the first to share your story!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {stories.map((story, i) => (
              <motion.div key={story.id || i} initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-surface-container-low border-0 shadow-sm overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-r from-[#9B1B30]/10 via-[#D4AF37]/5 to-[#D4AF37]/10">
                    <div className="absolute -bottom-8 left-6 flex">
                      <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                        <AvatarImage src={`https://i.pravatar.cc/200?img=${(i * 2 + 1) % 50}`} />
                        <AvatarFallback>{story.title?.[0] || "K"}</AvatarFallback>
                      </Avatar>
                      <Avatar className="-ml-4 h-16 w-16 border-4 border-white shadow-md">
                        <AvatarImage src={`https://i.pravatar.cc/200?img=${(i * 2 + 2) % 50}`} />
                        <AvatarFallback>{story.partnerName?.[0] || "V"}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="material-symbols-outlined absolute right-4 top-4 text-3xl text-[#D4AF37]/20">format_quote</span>
                  </div>
                  <CardContent className="pt-10">
                    <h3 className="text-lg font-bold text-royal-ink">
                      {story.title || (locale === "mr" ? "आमची प्रेमकथा" : "Our Love Story")}
                    </h3>
                    <div className="mb-3 flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px]">favorite</span>
                      {story.partnerName && `${story.partnerName} | `}
                      {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : ""}
                    </div>
                    <p className="text-sm leading-relaxed text-on-surface-variant">&ldquo;{story.content}&rdquo;</p>
                    {story.approved && (
                      <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {t("common.verified")} {t("home.successCouples")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
