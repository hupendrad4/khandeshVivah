"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { GlassCard } from "@/components/ui/glass-card"
import { PremiumCard } from "@/components/ui/premium-card"
import { FeatureCard } from "@/components/ui/feature-card"
import { ReusableCarousel } from "@/components/ui/reusable-carousel"
import {
  Heart, Search, Shield, Users, Star, ChevronRight, Sparkles,
  Quote, CheckCircle, MessageCircle, ArrowRight,
} from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

function HeroSection() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FF21A5]/5 via-[#F5C6E4] to-[#002366]/5 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-container px-4 md:px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp}>
              <Badge variant="premium" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" /> {t("common.verified")} {t("home.verifiedProfiles")}
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl font-extrabold leading-tight text-[#1b1c1c] md:text-5xl lg:text-6xl font-heading">
              {t("home.heroTitle")}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-[#554336] md:text-xl">
              {t("home.heroSubtitle")}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="xl" className="group">
                  {t("home.joinNow")}
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="xl">
                  {t("nav.search")}
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar key={i} className="border-2 border-white h-10 w-10">
                    <AvatarImage src={`https://i.pravatar.cc/100?img=${i}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1b1c1c]">10,000+ {t("home.activeUsers")}</p>
                <p className="text-xs text-[#887364]">{t("home.latestMembers")}</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <GlassCard gradient="pink" hoverEffect="glow" className="mx-auto max-w-sm">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="premium">{t("profile.premium")}</Badge>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                </div>
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <Avatar className="h-28 w-28 ring-4 ring-[#FF21A5]/20">
                      <AvatarImage src="https://i.pravatar.cc/200?img=5" />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-[#50C878] border-2 border-white" />
                  </div>
                </div>
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-[#1b1c1c]">प्रिया पाटील</h3>
                  <p className="text-sm text-[#554336]">25 yrs, 5'4", Jalgaon</p>
                  <p className="text-xs text-[#887364]">B.E. Computer Science | Leva Patil</p>
                </div>
                <div className="mb-4 flex justify-center gap-2">
                  <Button size="sm" variant="default"><Heart className="mr-1 h-4 w-4" />Interest</Button>
                  <Button size="sm" variant="outline"><MessageCircle className="mr-1 h-4 w-4" />Chat</Button>
                </div>
                <div className="rounded-xl bg-[#F5C6E4] p-3">
                  <div className="flex items-center justify-between text-xs text-[#554336]">
                    <span>Compatibility <strong className="text-[#50C878]">92%</strong></span>
                    <span className="flex items-center"><Shield className="mr-1 h-3 w-3 text-[#50C878]" />{t("common.verified")}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const { t } = useI18n()
  const stats = [
    { label: t("home.activeUsers"), value: "10K+", icon: Users },
    { label: t("home.successCouples"), value: "500+", icon: Heart },
    { label: t("home.registeredMembers"), value: "25K+", icon: Users },
    { label: t("home.villagesCovered"), value: "200+", icon: Search },
  ]
  return (
    <section className="relative -mt-10 px-4 md:px-6 lg:px-10">
      <div className="mx-auto max-w-container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <PremiumCard
              key={stat.label}
              variant={i === 0 ? "pink" : i === 3 ? "gold" : "royal"}
              floating={false}
            >
              <div className="text-center">
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-[#FF21A5]" />
                <p className="text-2xl font-extrabold text-[#002366]">{stat.value}</p>
                <p className="text-xs text-[#887364]">{stat.label}</p>
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const { t } = useI18n()
  const steps = [
    { title: t("home.step1Title"), desc: t("home.step1Desc"), icon: "1" },
    { title: t("home.step2Title"), desc: t("home.step2Desc"), icon: "2" },
    { title: t("home.step3Title"), desc: t("home.step3Desc"), icon: "3" },
  ]
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-container px-4 md:px-6 lg:px-10 text-center">
        <motion.div initial="initial" whileInView="animate" variants={stagger} viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} className="mb-4 text-3xl font-bold text-[#1b1c1c] md:text-4xl">{t("home.howItWorks")}</motion.h2>
          <motion.p variants={fadeUp} className="mx-auto mb-12 max-w-2xl text-[#554336]">{t("home.heroSubtitle")}</motion.p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <GlassCard gradient={i === 0 ? "pink" : i === 1 ? "royal" : "gold"} hoverEffect={i === 1 ? "lift" : "glow"}>
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF21A5] text-2xl font-bold text-white shadow-lg">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[#1b1c1c]">{step.title}</h3>
                  <p className="text-sm text-[#554336]">{step.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhyChooseUs() {
  const { t } = useI18n()
  const features = [
    {
      title: t("home.verifiedProfiles"),
      desc: t("home.verifiedProfilesDesc"),
      icon: Shield,
      imageUrl: "https://images.unsplash.com/photo-1559526324-4bc350d246b6?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Verified profiles",
    },
    {
      title: t("home.privacyFirst"),
      desc: t("home.privacyFirstDesc"),
      icon: Heart,
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Privacy first",
    },
    {
      title: t("home.communityFocus"),
      desc: t("home.communityFocusDesc"),
      icon: Users,
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&auto=format",
      imageAlt: "Khandesh community",
    },
  ]
  return (
    <section className="bg-[#F5C6E4] py-16 md:py-24">
      <div className="mx-auto max-w-container px-4 md:px-6 lg:px-10">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-[#1b1c1c] md:text-4xl">{t("home.whyChooseUs")}</h2>
            <p className="mx-auto max-w-2xl text-[#554336]">{t("app.tagline")}</p>
          </motion.div>
        </div>
         <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              iconColor={i === 0 ? "text-[#FF21A5]" : i === 1 ? "text-[#002366]" : "text-[#D4AF37]"}
              iconBg={i === 0 ? "bg-[#FF21A5]/10" : i === 1 ? "bg-[#002366]/10" : "bg-[#D4AF37]/10"}
              imageUrl={f.imageUrl}
              imageAlt={f.imageAlt}
              delay={i}
            >
              <h3 className="mb-2 text-lg font-bold text-[#1b1c1c]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#554336]">{f.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#FF21A5] transition-all group-hover:gap-2">
                {t("home.learnMore")} <ArrowRight className="h-3 w-3" />
              </div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  )
}
function SuccessStoriesPreview() {
  const { t } = useI18n()
  const stories = [
    { name: "राजेश & प्रिया", village: "Chopda, Jalgaon", photo1: "https://i.pravatar.cc/200?img=11", photo2: "https://i.pravatar.cc/200?img=5" },
    { name: "अमित & स्नेहा", village: "Dhule", photo1: "https://i.pravatar.cc/200?img=12", photo2: "https://i.pravatar.cc/200?img=6" },
    { name: "निलेश & रुपाली", village: "Nandurbar", photo1: "https://i.pravatar.cc/200?img=13", photo2: "https://i.pravatar.cc/200?img=7" },
    { name: "संतोष & वैशाली", village: "Baglan, Nashik", photo1: "https://i.pravatar.cc/200?img=14", photo2: "https://i.pravatar.cc/200?img=8" },
    { name: "दीपक & अर्चना", village: "Shirpur, Dhule", photo1: "https://i.pravatar.cc/200?img=15", photo2: "https://i.pravatar.cc/200?img=9" },
  ]
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-container px-4 md:px-6 lg:px-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1b1c1c] md:text-4xl">{t("home.successStories")}</h2>
            <p className="mt-2 text-[#554336]">{t("home.heroSubtitle")}</p>
          </div>
          <Link href="/success-stories">
            <Button variant="ghost" className="gap-1">{t("home.viewAll")}<ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <ReusableCarousel
          autoPlay={true}
          autoPlayInterval={5000}
          slidesToShow={1}
          className="max-w-4xl mx-auto"
        >
          {stories.map((story, i) => (
            <GlassCard key={i} gradient={i % 3 === 0 ? "pink" : i % 3 === 1 ? "royal" : "gold"} hoverEffect="lift">
              <div className="flex flex-col items-center p-8 text-center md:flex-row md:gap-8 md:text-left">
                <div className="mb-4 flex shrink-0 md:mb-0">
                  <div className="flex -space-x-3">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={story.photo1} />
                      <AvatarFallback>{story.name[0]}</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={story.photo2} />
                      <AvatarFallback>{story.name.split("&")[1]?.trim()[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="flex-1">
                  <Quote className="mb-2 h-8 w-8 text-[#FF21A5]/20" />
                  <p className="mb-3 text-lg leading-relaxed italic text-[#554336]">
                    &ldquo;खांदेश विवाहमुळे आम्हाला आमचा जोडीदार मिळाला. खूप आभारी आहोत!&rdquo;
                  </p>
                  <h4 className="text-lg font-bold text-[#1b1c1c]">{story.name}</h4>
                  <p className="text-sm text-[#887364]">{story.village}</p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[#50C878] md:justify-start">
                    <CheckCircle className="h-3 w-3" /> {t("common.verified")} {t("home.successCouples")}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </ReusableCarousel>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { t } = useI18n()
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <WhyChooseUs />
      <SuccessStoriesPreview />

      <section className="bg-gradient-to-r from-[#FF21A5] to-[#FF2E96] py-16 text-center text-white">
        <div className="mx-auto max-w-container px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("home.heroTitle")}</h2>
            <p className="mb-8 text-lg opacity-90">{t("app.tagline")}</p>
            <Link href="/register">
              <Button size="xl" variant="secondary" className="bg-white text-[#FF21A5] hover:bg-white/90">
                {t("home.getStarted")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 lg:px-10">
        <div className="mx-auto max-w-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-8 text-2xl font-bold text-[#1b1c1c]">{t("home.faq")}</h2>
            <div className="space-y-4 text-left">
                {[
                  { q: "खांदेश विवाह म्हणजे काय?", a: "खांदेश विवाह हा खांदेश समाजासाठी समर्पित विवाह मंच आहे, जिथे आपण आपल्या समाजातील पडताळणी केलेल्या वर-वधूंशी संपर्क साधू शकता." },
                  { q: "नोंदणी कशी करावी?", a: "मोबाइल नंबर किंवा ईमेलद्वारे सहज नोंदणी करा. ओटीपी पडताळणीनंतर आपले प्रोफाइल तयार करा." },
                  { q: "प्रीमियम सदस्यत्वाचे फायदे काय आहेत?", a: "अमर्यादित आवडी, संदेश, संपर्क तपशील, प्राधान्य यादी, एआय शिफारसी आणि बरेच काही." },
                ].map((faq, i) => (
                  <PremiumCard key={i} variant={i === 0 ? "pink" : i === 1 ? "royal" : "gold"} floating={false}>
                    <h3 className="font-semibold text-[#1b1c1c]">{faq.q}</h3>
                    <p className="mt-2 text-sm text-[#554336]">{faq.a}</p>
                  </PremiumCard>
                ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
