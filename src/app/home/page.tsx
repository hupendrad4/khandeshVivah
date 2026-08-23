"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/MainLayout"
import { CASTES } from "@/data/castes"

export default function HomePage() {
  const { t, locale } = useI18n()
  const [lookingFor, setLookingFor] = useState<"bride" | "groom">("bride")
  const [ageRange, setAgeRange] = useState("18-25")
  const [caste, setCaste] = useState("all")

  const searchParams = new URLSearchParams()
  if (lookingFor === "bride") searchParams.set("gender", "FEMALE")
  else searchParams.set("gender", "MALE")
  if (ageRange) searchParams.set("age", ageRange)
  if (caste && caste !== "all") searchParams.set("caste", caste)
  const searchHref = `/search?${searchParams.toString()}`

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-0">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.squarespace-cdn.com/content/57f8e2bd6a496306c8308fe0/1478702578891-QW5T6QR68GI0V5TRY29H/khandala-maharashtrian-wedding-into-candid-photography-pa-0511.jpg?format=2500w')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/70 via-[#D4AF37]/30 to-[#7A0E20]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFFAFA]" />
        </div>
        <div className="relative z-10 w-full max-w-container mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4 pb-4">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-label-md">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {locale === "mr" ? "खांदेशातील #१ वैवाहिक संस्था" : "#1 Matrimonial Platform in Khandesh"}
            </div>
            <h2 className="font-headline-2xl text-headline-2xl text-white md:leading-tight font-bold" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.15 }}>
              {locale === "mr" ? (
                <>तुमचा जीवनाचा जोडीदार आता <br /><span className="text-[#FFD700]">खांदेशातच शोधा!</span></>
              ) : (
                <>Find your life partner <br /><span className="text-[#FFD700]">right here in Khandesh!</span></>
              )}
            </h2>
            <p className="font-body-xl text-body-xl text-white/85 max-w-xl font-semibold" style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", lineHeight: 1.6 }}>
              {locale === "mr"
                ? "संस्कार, संस्कृती आणि खांदेशाची माती घेऊन आलेली स्थळं. तुमच्या कुटुंबासाठी खास."
                : "Profiles rooted in tradition, culture, and the soil of Khandesh. Made for your family."}
            </p>
          </div>
          {/* Search Widget */}
          <div className="md:col-span-5">
            <div className="bg-surface-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-primary/10">
              <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">search_check</span>
                {locale === "mr" ? "त्वरित शोध" : "Quick Search"}
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-2">
                    {locale === "mr" ? "मी शोधत आहे" : "I'm looking for"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLookingFor("bride")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${
                        lookingFor === "bride"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">female</span> {locale === "mr" ? "मुलगी" : "Bride"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLookingFor("groom")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold transition-all ${
                        lookingFor === "groom"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/50"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">male</span> {locale === "mr" ? "मुलगा" : "Groom"}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface-variant mb-2">{locale === "mr" ? "वय (Age)" : "Age"}</label>
                    <select
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="w-full bg-background-cream border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="18-25">{locale === "mr" ? "१८ ते २५" : "18 to 25"}</option>
                      <option value="26-32">{locale === "mr" ? "२६ ते ३२" : "26 to 32"}</option>
                      <option value="33+">33+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface-variant mb-2">{locale === "mr" ? "जात (Caste)" : "Caste"}</label>
                    <select
                      value={caste}
                      onChange={(e) => setCaste(e.target.value)}
                      className="w-full bg-background-cream border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="all">{locale === "mr" ? "सर्व जाती" : "All Castes"}</option>
                      {Object.keys(CASTES).map(k => (
                        <option key={k} value={k}>{locale === "mr" ? CASTES[k].mr : CASTES[k].en}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Link href={searchHref}>
                  <button type="button" className="w-full bg-primary hover:bg-on-primary-container text-white py-4 rounded-xl font-headline-md shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4">
                    {locale === "mr" ? "जोडीदार शोधा" : "Find Partner"}
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface">
        <div className="max-w-container mx-auto px-gutter">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-royal-ink mb-4">
              {locale === "mr" ? "का निवडावे?" : "Why Choose Us?"}
            </h2>
            <div className="w-24 h-1 bg-primary-container mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "verified_user",
                title: locale === "mr" ? "१००% पडताळणी" : "100% Verified",
                desc: locale === "mr" ? "प्रत्येक प्रोफाईलचे आधार आणि फोनद्वारे व्हेरिफिकेशन केले जाते." : "Every profile is verified via Aadhaar and phone for authentic matches.",
                color: "bg-primary/10 text-primary",
              },
              {
                icon: "groups",
                title: locale === "mr" ? "स्थानिक समुदाय" : "Local Community",
                desc: locale === "mr" ? "खांदेशातील जळगाव, भुसावळ, अमळनेर आणि धुळे परिसरातील हजारो स्थळे." : "Thousands of profiles from Jalgaon, Bhusawal, Amalner, and Dhule regions.",
                color: "bg-tertiary/10 text-tertiary",
              },
              {
                icon: "lock",
                title: locale === "mr" ? "सुरक्षित चॅट" : "Secure Chat",
                desc: locale === "mr" ? "तुमची गोपनीयता आमची प्राथमिकता आहे. सुरक्षित प्लॅटफॉर्मवर थेट संवाद साधा." : "Your privacy is our priority. Connect securely on our platform.",
                color: "bg-emerald-growth/10 text-emerald-growth",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-surface-white p-8 rounded-2xl border border-outline-variant/30 hover:shadow-lg transition-shadow group text-center"
              >
                <div className={`w-16 h-16 ${f.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-4">{f.title}</h3>
                <p className="text-on-surface-variant">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Bento */}
      <section className="py-20 bg-background-cream overflow-hidden">
        <div className="max-w-container mx-auto px-gutter">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-royal-ink">
                {locale === "mr" ? "खांदेशातील यशस्वी कथा" : "Success Stories from Khandesh"}
              </h2>
              <p className="text-on-surface-variant mt-2 font-body-lg">
                {locale === "mr" ? "ज्यांनी आपला जोडीदार आमच्या माध्यमातून शोधला." : "Those who found their partner through us."}
              </p>
            </div>
            <Link href="/success-stories" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              {locale === "mr" ? "सर्व कथा पहा" : "View All"} <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Main Story */}
            <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br from-[#9B1B30]/20 to-[#D4AF37]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-royal-ink/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8 text-white relative z-10">
                  <div className="flex gap-1 justify-center mb-2">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="material-symbols-outlined text-marigold-light" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <h3 className="font-headline-lg text-headline-lg">{locale === "mr" ? "महेश आणि स्नेहल (जळगाव)" : "Mahesh & Snehal (Jalgaon)"}</h3>
                  <p className="max-w-lg mt-2 font-body-md opacity-90 mx-auto">
                    &ldquo;{locale === "mr" ? "खांदेश विवाह मुळे आम्हाला आमचा परफेक्ट जोडीदार मिळाला." : "Khandesh Vivah helped us find our perfect match."}&rdquo;
                  </p>
                </div>
              </div>
            </div>
            {/* Small Story 1 */}
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br from-[#D4AF37]/20 to-[#9B1B30]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-royal-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="font-headline-md text-headline-md">{locale === "mr" ? "रोहन आणि प्रियांका" : "Rohan & Priyanka"}</h4>
                <p className="text-sm opacity-80">{locale === "mr" ? "धुळे • २०२३" : "Dhule • 2023"}</p>
              </div>
            </div>
            {/* Small Story 2 */}
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br from-[#D4AF37]/20 to-[#9B1B30]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-royal-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="font-headline-md text-headline-md">{locale === "mr" ? "अमित आणि नेहा" : "Amit & Neha"}</h4>
                <p className="text-sm opacity-80">{locale === "mr" ? "भुसावळ • २०२४" : "Bhusawal • 2024"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Couple Background + Form Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=1400&q=80"
            alt="Wedding couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-royal-ink/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-royal-ink/90 via-transparent to-royal-ink/30" />
        </div>
        <div className="relative z-10 max-w-container mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="text-white space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm border border-white/20">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>celebration</span>
              {locale === "mr" ? "तुमची कथा सुरू होते येथे" : "Your Story Begins Here"}
            </div>
            <h2 className="font-headline-xl text-headline-xl md:leading-tight">
              {locale === "mr" ? "तुमच्या स्वप्नांचा जोडीदार" : "Your Dream Partner"}
            </h2>
            <p className="text-white/80 font-body-lg text-body-lg">
              {locale === "mr"
                ? "खांदेश विवाहमध्ये आपले स्वागत आहे. प्रेम, विश्वास आणि संस्कृतीच्या बंधनातून तयार झालेले नाते. आजच तुमचा प्रवास सुरू करा."
                : "Welcome to Khandesh Vivah. A bond built on love, trust, and tradition. Start your journey today."}
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
            <h3 className="font-headline-md text-headline-md text-royal-ink mb-6 text-center">
              {locale === "mr" ? "त्वरित नोंदणी" : "Quick Registration"}
            </h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                    {locale === "mr" ? "नाव" : "Name"}
                  </label>
                  <input
                    type="text"
                    placeholder={locale === "mr" ? "तुमचे नाव" : "Your name"}
                    className="w-full bg-background-cream border border-outline-variant/40 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                    {locale === "mr" ? "लिंग" : "Gender"}
                  </label>
                  <select className="w-full bg-background-cream border border-outline-variant/40 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>{locale === "mr" ? "निवडा" : "Select"}</option>
                    <option value="MALE">{locale === "mr" ? "पुरुष" : "Male"}</option>
                    <option value="FEMALE">{locale === "mr" ? "स्त्री" : "Female"}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  {locale === "mr" ? "मोबाइल नंबर" : "Mobile Number"}
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full bg-background-cream border border-outline-variant/40 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                    {locale === "mr" ? "वय" : "Age"}
                  </label>
                  <select className="w-full bg-background-cream border border-outline-variant/40 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>18-25</option>
                    <option>26-32</option>
                    <option>33-40</option>
                    <option>40+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                    {locale === "mr" ? "जिल्हा" : "District"}
                  </label>
                  <select className="w-full bg-background-cream border border-outline-variant/40 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>{locale === "mr" ? "निवडा" : "Select"}</option>
                    <option>जळगाव</option>
                    <option>धुळे</option>
                    <option>नंदुरबार</option>
                  </select>
                </div>
              </div>
              <Link href="/register">
                <button
                  type="button"
                  className="w-full bg-primary hover:bg-on-primary-container text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
                >
                  {locale === "mr" ? "मोफत नोंदणी करा" : "Register Free"}
                </button>
              </Link>
              <p className="text-center text-[10px] text-on-surface-variant mt-2">
                {locale === "mr"
                  ? "नोंदणी करून तुम्ही आमच्या सेवाशर्ती आणि गोपनीयता धोरणाशी सहमत आहात."
                  : "By registering you agree to our Terms & Privacy Policy."}
              </p>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
