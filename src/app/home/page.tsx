"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const { t, locale } = useI18n()

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-[#8f4e00]/10 via-[#ffdcc2] to-[#435b9f]/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFEF2]/0 to-[#FFFEF2]" />
        </div>
        <div className="relative z-10 w-full max-w-container mx-auto px-gutter grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-12">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-container/20 px-4 py-1.5 rounded-full text-on-primary-container font-label-md">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              {locale === "mr" ? "खांदेशातील #१ वैवाहिक संस्था" : "#1 Matrimonial Platform in Khandesh"}
            </div>
            <h2 className="font-headline-xl text-headline-xl text-royal-ink md:leading-tight">
              {locale === "mr" ? (
                <>तुमचा जीवनाचा जोडीदार आता <br /><span className="text-primary">खांदेशातच शोधा!</span></>
              ) : (
                <>Find your life partner <br /><span className="text-primary">right here in Khandesh!</span></>
              )}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              {locale === "mr"
                ? "लेवा पाटील, मराठा, गुजर आणि खांदेशातील सर्व समाजातील उपवर-वधूंचा विश्वासार्ह संगम. संस्कृती जपणाऱ्या मनांचे मिलन."
                : "A trusted platform for Leva Patil, Maratha, Gujar and all Khandesh communities. Where traditions meet hearts."}
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
                    <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary bg-primary/5 text-primary font-bold">
                      <span className="material-symbols-outlined text-[20px]">female</span> {locale === "mr" ? "मुलगी" : "Bride"}
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-outline-variant text-on-surface-variant hover:border-primary/50 transition-all">
                      <span className="material-symbols-outlined text-[20px]">male</span> {locale === "mr" ? "मुलगा" : "Groom"}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface-variant mb-2">{locale === "mr" ? "वय (Age)" : "Age"}</label>
                    <select className="w-full bg-background-cream border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none">
                      <option>{locale === "mr" ? "१८ ते २५" : "18 to 25"}</option>
                      <option>{locale === "mr" ? "२६ ते ३२" : "26 to 32"}</option>
                      <option>33+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface-variant mb-2">{locale === "mr" ? "जात (Caste)" : "Caste"}</label>
                    <select className="w-full bg-background-cream border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none">
                      <option>{locale === "mr" ? "सर्व जाती" : "All Castes"}</option>
                      <option>लेवा पाटील</option>
                      <option>मराठा</option>
                      <option>गुजर</option>
                    </select>
                  </div>
                </div>
                <Link href="/search">
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
            <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br from-[#8f4e00]/20 to-[#435b9f]/20">
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
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br from-[#d3ae36]/20 to-[#8f4e00]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-royal-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="font-headline-md text-headline-md">{locale === "mr" ? "रोहन आणि प्रियांका" : "Rohan & Priyanka"}</h4>
                <p className="text-sm opacity-80">{locale === "mr" ? "धुळे • २०२३" : "Dhule • 2023"}</p>
              </div>
            </div>
            {/* Small Story 2 */}
            <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer bg-gradient-to-br from-[#435b9f]/20 to-[#8f4e00]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-royal-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h4 className="font-headline-md text-headline-md">{locale === "mr" ? "अमित आणि नेहा" : "Amit & Neha"}</h4>
                <p className="text-sm opacity-80">{locale === "mr" ? "भुसावळ • २०२४" : "Bhusawal • 2024"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-container mx-auto px-gutter">
          <div className="relative bg-primary rounded-[40px] p-8 md:p-16 overflow-hidden text-center text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-marigold-light/20 rounded-full -ml-32 -mb-32 blur-3xl" />
            <h2 className="relative z-10 font-headline-xl text-headline-xl mb-6">
              {locale === "mr" ? "आजच नोंदणी करा!" : "Register Today!"}
            </h2>
            <p className="relative z-10 font-body-lg text-body-lg mb-10 max-w-2xl mx-auto opacity-90">
              {locale === "mr"
                ? "तुमच्या स्वप्नातील जोडीदार शोधण्याची पहिली पायरी आजच उचला. नोंदणी पूर्णपणे मोफत आहे."
                : "Take the first step towards finding your dream partner. Registration is completely free."}
            </p>
            <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="bg-white text-primary px-10 py-4 rounded-xl font-bold font-headline-md hover:bg-primary-container hover:text-white transition-all shadow-xl">
                  {locale === "mr" ? "मोफत नोंदणी" : "Free Registration"}
                </button>
              </Link>
              <Link href="/about">
                <button className="bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold font-headline-md hover:bg-white/10 transition-all">
                  {locale === "mr" ? "अधिक माहिती" : "Learn More"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
